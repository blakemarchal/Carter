// Noah's Animal Book (data/animals.ts): a card for every animal the game draws. Animals from finished islands
// are open; the rest show as shadows until the child meets them. A card has the animal's picture, where it lives,
// what it eats, its baby and its sound, and facts at the child's reading level, read aloud. Two sorting games use
// the animals the child has met: where they live, and big or small.
import { useEffect, useMemo, useRef, useState } from 'react'
import { Arrow, BackButton, BigButton, Icon } from './ui'
import Pic from './Pic'
import SortGame from '../activities/SortGame'
import { ANIMALS, EATS_NAMES, HOME_NAMES, SORTS, animalById, animalsMet, factsFor, type Animal, type SortKind } from '../data/animals'
import { loadIsland, type Island } from '../data/islands'
import { getProgress, update, useProgress } from '../lib/progress'
import { praise, speak, stopSpeaking } from '../lib/speech'
import { sfx } from '../lib/sfx'
import { shuffle } from '../lib/util'
import { useAlive } from '../lib/useAlive'

const cap = (s: string) => s[0].toUpperCase() + s.slice(1)

function Card({ animal, level, onBack, onNext, onPrev }: { animal: Animal; level: number; onBack: () => void; onNext?: () => void; onPrev?: () => void }) {
  const facts = factsFor(animal, level)
  const alive = useAlive()
  const tell = async () => {
    stopSpeaking()
    await speak(`${cap(animal.name)}!`)
    for (const f of facts) { if (!alive.current) return; await speak(f, { interrupt: false }) }
  }
  useEffect(() => { tell() }, [animal.id])
  return (
    <div className="book-card">
      <header className="home-head">
        <BackButton onClick={onBack} />
        <h2>{cap(animal.name)}</h2>
        <span />
      </header>
      <div className="book-card-body">
        <button className="book-pic" onClick={() => { sfx.pop(); speak(animal.sound === 'nothing at all' ? `A ${animal.name} makes no sound at all.` : `A ${animal.name} says ${animal.sound}!`) }} aria-label={`A ${animal.name}`}>
          <Pic e="" art={animal.id} />
        </button>
        <div className="book-facts">
          {facts.map((f, i) => <p key={i} className={i === 0 ? 'big' : ''}>{f}</p>)}
          <button className="book-hear" onClick={tell} aria-label="Hear it again"><Icon kind="speaker" /> Hear it again</button>
        </div>
      </div>
      <div className="book-chips" onClick={() => speak(`A ${animal.name} lives ${HOME_NAMES[animal.home]}. It eats ${EATS_NAMES[animal.eats]}. A baby ${animal.name} is called a ${animal.baby}.`)}>
        <span className="chip"><Pic e={animal.home === 'sea' ? '🌊' : animal.home === 'sky' ? '☁️' : '🌳'} art={animal.home === 'sea' ? 'sea' : animal.home === 'sky' ? 'cloud' : 'tree'} /> Lives {HOME_NAMES[animal.home]}</span>
        <span className="chip"><Pic e="🍃" art={animal.eats === 'plants' ? 'leaf' : animal.eats === 'animals' ? 'fish' : 'plants'} /> Eats {EATS_NAMES[animal.eats]}</span>
        <span className="chip">Baby: {animal.baby}</span>
        <span className="chip">Says: {animal.sound}</span>
      </div>
      <div className="book-nav">
        <BigButton color="white" onClick={onPrev ?? (() => {})} disabled={!onPrev} aria-label="Previous animal"><Arrow dir="left" /></BigButton>
        <BigButton color="pink" onClick={onNext ?? (() => {})} disabled={!onNext} aria-label="Next animal"><Arrow /></BigButton>
      </div>
    </div>
  )
}

export default function AnimalBook({ onClose }: { onClose: () => void }) {
  const p = useProgress()
  const alive = useAlive()
  const [islands, setIslands] = useState<Island[] | null>(null)
  const [open, setOpen] = useState<string | null>(null)
  const [sort, setSort] = useState<SortKind | null>(null)
  const met = useMemo(() => (islands ? animalsMet(p, islands) : new Set<string>()), [islands, p.islandsDone])
  const seen = new Set(p.bookSeen ?? [])
  const level = p.skills.reading
  const spoke = useRef(false)

  useEffect(() => {
    Promise.all(p.islandsDone.map((id) => loadIsland(id).catch(() => null))).then((all) => { if (alive.current) setIslands(all.filter((x): x is Island => !!x)) })
  }, [p.islandsDone.join(',')])

  useEffect(() => {
    if (!islands || spoke.current) return
    spoke.current = true
    const n = met.size
    speak(n === 0 ? 'Your animal book! Finish an island to meet its animals, and they go in your book.'
      : n < ANIMALS.length ? `Your animal book! You have met ${n} animals. Tap one to learn about it!`
        : 'Your animal book! You have met every animal. Tap one to learn about it!')
  }, [islands])

  const openCard = (id: string) => {
    sfx.pop()
    setOpen(id)
    if (!seen.has(id)) update((x) => ({ ...x, bookSeen: [...(x.bookSeen ?? []), id] }))
  }
  const metList = ANIMALS.filter((x) => met.has(x.id))
  const at = open ? metList.findIndex((x) => x.id === open) : -1

  if (sort) {
    const s = SORTS[sort]
    const pool = shuffle(metList).slice(0, 8)
    return (
      <div className="overlay animal-book">
        <div className="book-sort-back"><BackButton onClick={() => { stopSpeaking(); setSort(null) }} /></div>
        <SortGame
          title={s.title} intro={s.intro} hint={s.hint}
          groups={s.groups.map((g) => ({ ...g }))}
          items={pool.map((x) => ({ emoji: '', art: x.id, say: x.name, group: s.group(x) }))}
          onDone={() => { speak(praise()); setSort(null) }}
        />
      </div>
    )
  }
  if (open && animalById(open)) {
    return (
      <div className="overlay animal-book">
        <Card
          animal={animalById(open)!} level={level}
          onBack={() => { stopSpeaking(); setOpen(null) }}
          onPrev={at > 0 ? () => openCard(metList[at - 1].id) : undefined}
          onNext={at >= 0 && at < metList.length - 1 ? () => openCard(metList[at + 1].id) : undefined}
        />
      </div>
    )
  }
  return (
    <div className="overlay animal-book">
      <header className="home-head">
        <BackButton onClick={() => { stopSpeaking(); onClose() }} />
        <h2><Pic e="🦁" art="lion" /> My Animal Book</h2>
        <span className="book-count">{met.size} of {ANIMALS.length}</span>
      </header>
      {metList.length >= 4 && (
        <div className="book-games">
          <BigButton color="green" onClick={() => { sfx.pop(); setSort('home') }}><Pic e="🌳" art="tree" /> Where does it live?</BigButton>
          <BigButton color="yellow" onClick={() => { sfx.pop(); setSort('size') }}><Pic e="🦒" art="giraffe" /> Big or small?</BigButton>
        </div>
      )}
      <div className="book-grid">
        {ANIMALS.map((x) => {
          const have = met.has(x.id)
          return (
            <button key={x.id} className={`book-tile ${have ? '' : 'shadow'}`} disabled={!have || !islands}
              onClick={() => openCard(x.id)} aria-label={have ? cap(x.name) : 'An animal you have not met yet'}>
              <span className="book-tile-pic"><Pic e="" art={x.id} /></span>
              <span className="book-tile-name">{have ? cap(x.name) : '???'}</span>
              {have && !seen.has(x.id) && <span className="book-new">New!</span>}
            </button>
          )
        })}
      </div>
      {!islands && <p className="muted">Opening your book…</p>}
    </div>
  )
}

/** For the Ark: how many animals the player has met, once the islands are loaded (null until then). */
export function useAnimalsMet(): number | null {
  const p = useProgress()
  const [n, setN] = useState<number | null>(null)
  useEffect(() => {
    let on = true
    Promise.all(getProgress().islandsDone.map((id) => loadIsland(id).catch(() => null)))
      .then((all) => { if (on) setN(animalsMet(getProgress(), all.filter((x): x is Island => !!x)).size) })
    return () => { on = false }
  }, [p.islandsDone.join(',')])
  return n
}
