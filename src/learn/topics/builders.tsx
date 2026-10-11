// Building with tiles (docs/GAME-PLAN.md §4): the word builder (spell a word from its picture with
// letter tiles) and the sentence builder (put word tiles in order to tell a picture).
//
// Both play the same way: tiles wait in a tray under a row of slots, and she drags each tile to its
// slot. A tile dropped on the wrong slot wiggles and floats home; after two misses the next right tile
// glows and a hand shows where it goes (so does a long quiet while). Tapping a tile, or a placed one,
// says it (a letter's sound, or a word). With every slot filled, the word is blended or the sentence
// read aloud, and the card around it praises and moves on.
import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react'
import type { Exercise, ExerciseView } from '../types'
import { CVC } from '../../data/words'
import { itemById, itemForEmoji } from '../../art/items'
import { letterSound } from '../../lib/spoken'
import { speak } from '../../lib/speech'
import { sfx } from '../../lib/sfx'
import { showDrag, useDrag, useDropTarget } from '../../lib/drag'
import { pick, shuffle } from '../../lib/util'
import { useAlive } from '../../lib/useAlive'
import './builders.css'

// ---------- words ----------

/** A word to spell and the drawing that shows it (an item id). */
interface Spell { word: string; art: string }

/** Words drawn for this builder (art/items/learn-builders.tsx), and the pot from the library. */
const EXTRA: Spell[] = [
  { word: 'pen', art: 'pen' }, { word: 'log', art: 'log' }, { word: 'mug', art: 'mug' }, { word: 'bun', art: 'bun' },
  { word: 'pan', art: 'pan' }, { word: 'fan', art: 'fan' }, { word: 'van', art: 'van' }, { word: 'pot', art: 'pot' },
]

/** Every three-letter word with a clear picture: the CVC list (data/words.ts) and the extras. */
export const SPELL_WORDS: Spell[] = [
  ...CVC.filter((w) => w.word.length === 3).flatMap((w) => {
    const it = itemForEmoji(w.emoji)
    return it ? [{ word: w.word, art: it.id }] : []
  }),
  ...EXTRA,
]
const spellOf = (word: string) => SPELL_WORDS.find((w) => w.word === word)

/** Word families where every word has a picture: change the first letter to make another. */
export const FAMILIES: string[][] = [
  ['cat', 'bat', 'hat', 'rat'], ['pan', 'fan', 'van'], ['fox', 'box'], ['dog', 'log'],
  ['hen', 'pen'], ['bug', 'mug'], ['sun', 'bun'],
]

/** Spare letters: easy-to-tell consonants, and vowels. A spare is never a letter in the word. */
const SPARES = 'bcdfghklmnprstw'
const VOWELS = 'aeiou'
/** Letters that make the same sound: a spare is never one of these for a letter in the word (no k for cat). */
const SAME_SOUND: Record<string, string> = { c: 'k', k: 'c' }
/** The letters of `set` that are not in any of `words`, nor sound like one that is. */
const sparesFrom = (set: string, ...words: string[]) => {
  const taken = words.join('')
  return [...set].filter((l) => !taken.includes(l) && !(SAME_SOUND[l] && taken.includes(SAME_SOUND[l])))
}

/** The blend read when a word is built: "f, o, x: fox!" (each letter's sound). */
export const blend = (word: string) => `${[...word].map(letterSound).join(', ')}: ${word}!`

export interface WordBuildEx extends Exercise {
  kind: 'wordbuild'
  /** The word to make, and its picture. */
  word: string
  art: string
  /** Word families: the word already built, whose first letter she changes. */
  from?: string
  /** The letter tiles in the tray (shuffled). */
  tiles: string[]
}

/**
 * Word builder. Levels 3–4: spell a three-letter word (its picture shown and said) from its letters
 * plus a spare. Level 6: word families, change the first letter to make a new word in the family.
 */
export function wordBuildEx(level: number): Exercise | null {
  if (level >= 6) {
    const [from, to] = shuffle(pick(FAMILIES))
    const spell = spellOf(to)
    if (!spell) return null
    const others = shuffle(sparesFrom(SPARES, to, from))
    const ex: WordBuildEx = {
      kind: 'wordbuild', skill: 'reading', key: `family:${from}:${to}`,
      say: `This says ${from}. Make ${to}!`,
      word: to, art: spell.art, from, tiles: shuffle([to[0], ...others.slice(0, 2)]),
    }
    return ex
  }
  const w = pick(SPELL_WORDS)
  // Level 3: one spare. Level 4: two, one of them a vowel, so she listens for the middle sound too.
  const extra = level >= 4 ? [pick(sparesFrom(SPARES, w.word)), pick(sparesFrom(VOWELS, w.word))] : [pick(sparesFrom(SPARES, w.word))]
  const ex: WordBuildEx = {
    kind: 'wordbuild', skill: 'reading', key: `spell:${w.word}`,
    say: `Spell ${w.word}!`, word: w.word, art: w.art, tiles: shuffle([...w.word, ...extra]),
  }
  return ex
}

// ---------- sentences ----------

/**
 * A sentence to build: its tiles in order (a "the" or "a" stays with its word, so there are three to
 * five tiles), and the scene that shows exactly what it says.
 */
interface Sentence { tiles: string[]; scene: string }

export const SENTENCES: Sentence[] = [
  { tiles: ['The dog', 'is', 'in', 'the box.'], scene: 'dog-box' },
  { tiles: ['The cat', 'is', 'on', 'the bed.'], scene: 'cat-bed' },
  { tiles: ['The sun', 'is', 'up.'], scene: 'sun-up' },
  { tiles: ['I', 'can', 'see', 'a fox.'], scene: 'fox' },
  { tiles: ['The hen', 'has', 'an egg.'], scene: 'hen-egg' },
  { tiles: ['The pig', 'is', 'in', 'the mud.'], scene: 'pig-mud' },
  { tiles: ['A bug', 'is', 'on', 'a leaf.'], scene: 'bug-leaf' },
  { tiles: ['The bird', 'is', 'in', 'the tree.'], scene: 'bird-tree' },
  { tiles: ['The fish', 'can', 'swim.'], scene: 'fish-swim' },
  { tiles: ['The dog', 'has', 'a ball.'], scene: 'dog-ball' },
  { tiles: ['The bee', 'is', 'on', 'the flower.'], scene: 'bee-flower' },
  { tiles: ['The frog', 'is', 'on', 'a stone.'], scene: 'frog-stone' },
  { tiles: ['The owl', 'can', 'see', 'the moon.'], scene: 'owl-moon' },
  { tiles: ['The bunny', 'has', 'a carrot.'], scene: 'bunny-carrot' },
  { tiles: ['The mouse', 'has', 'cheese.'], scene: 'mouse-cheese' },
  { tiles: ['The bear', 'has', 'honey.'], scene: 'bear-honey' },
  { tiles: ['God', 'made', 'the stars.'], scene: 'stars' },
  { tiles: ['The cat', 'and', 'the dog', 'are', 'friends.'], scene: 'cat-dog-friends' },
  { tiles: ['The duck', 'is', 'on', 'the pond.'], scene: 'duck-pond' },
]

export interface SentenceBuildEx extends Exercise {
  kind: 'sentencebuild'
  /** The tiles in the right order. */
  tiles: string[]
  scene: string
}

/** Sentence builder, level 8: drag three to five word tiles into order to tell the picture. */
export function sentenceBuildEx(): Exercise | null {
  const s = pick(SENTENCES)
  const ex: SentenceBuildEx = {
    kind: 'sentencebuild', skill: 'reading', key: `sentence:${s.tiles.join(' ')}`,
    say: 'Put the words in order to tell the picture!', tiles: s.tiles, scene: s.scene,
  }
  return ex
}

// ---------- pictures ----------

/** A drawn item placed in a scene: `s` wide, its top-left at (x, y); `flip` faces it the other way. */
function Put({ id, x, y, s, flip }: { id: string; x: number; y: number; s: number; flip?: boolean }) {
  const it = itemById(id)
  if (!it) return null
  return (
    <svg x={x} y={y} width={s} height={s} viewBox="0 0 100 100" overflow="visible">
      <g transform={flip ? 'translate(100 0) scale(-1 1)' : undefined}><it.Draw /></g>
    </svg>
  )
}

/** A day sky with grass along the bottom (a scene is 320 x 200). */
const Day = ({ children, ground = true }: { children?: ReactNode; ground?: boolean }) => (
  <>
    <rect width={320} height={200} fill="#d8f0ff" />
    {ground && <path d="M0 160 Q80 150 160 158 T320 156 L320 200 L0 200 Z" fill="#9edc7a" stroke="#7fbf5c" strokeWidth={2} />}
    {children}
  </>
)
/** A night sky with a few little stars. */
const Night = ({ children }: { children?: ReactNode }) => (
  <>
    <rect width={320} height={200} fill="#2d3166" />
    {[[30, 30], [80, 60], [130, 22], [200, 44], [250, 20], [290, 70], [60, 110], [170, 90]].map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r={i % 3 ? 1.6 : 2.4} fill="#fff6c8" opacity={0.85} />
    ))}
    {children}
  </>
)
/** A floor indoors. */
const Floor = () => <rect y={150} width={320} height={50} fill="#f3dcc0" />

/** Every scene, by name: each shows what its sentence says, and nothing that says otherwise. */
const SCENES: Record<string, () => ReactNode> = {
  'dog-box': () => (
    <Day>
      {/* an open box: the inside and back flaps, the dog sitting in it, then the front */}
      <path d="M100 96 L120 74 L210 74 L230 96 Z" fill="#a8743f" stroke="#7a522a" strokeWidth={3} strokeLinejoin="round" />
      <path d="M120 74 L104 50 L150 50 L160 74 Z" fill="#e0ad72" stroke="#9a6a3a" strokeWidth={3} strokeLinejoin="round" />
      <path d="M210 74 L226 50 L180 50 L170 74 Z" fill="#e0ad72" stroke="#9a6a3a" strokeWidth={3} strokeLinejoin="round" />
      <Put id="dog" x={115} y={30} s={100} />
      <path d="M100 96 L230 96 L230 176 L100 176 Z" fill="#d9a066" stroke="#9a6a3a" strokeWidth={3} strokeLinejoin="round" />
      <path d="M100 96 L80 126 L100 126 Z M230 96 L250 126 L230 126 Z" fill="#c78d52" stroke="#9a6a3a" strokeWidth={3} strokeLinejoin="round" />
    </Day>
  ),
  'cat-bed': () => (
    <Day ground={false}>
      <Floor />
      <Put id="bed" x={70} y={30} s={180} />
      <Put id="cat" x={126} y={46} s={80} />
    </Day>
  ),
  'sun-up': () => (
    <Day>
      <Put id="sun" x={110} y={6} s={100} />
      <Put id="tree" x={10} y={88} s={80} />
      <Put id="house" x={220} y={84} s={84} />
    </Day>
  ),
  fox: () => <Day><Put id="fox" x={95} y={40} s={130} /></Day>,
  'hen-egg': () => (
    <Day>
      <Put id="hen" x={70} y={40} s={120} />
      <Put id="egg" x={186} y={106} s={56} />
    </Day>
  ),
  'pig-mud': () => (
    <Day>
      <Put id="pig" x={98} y={56} s={124} />
      <path d="M60 172 Q70 150 110 152 Q130 140 170 150 Q220 144 250 158 Q272 170 250 180 Q160 196 80 184 Q54 180 60 172 Z" fill="#8a5a33" stroke="#5e3b1f" strokeWidth={3} strokeLinejoin="round" />
      <ellipse cx={130} cy={160} rx={14} ry={4} fill="#a8774b" />
      <circle cx={88} cy={150} r={5} fill="#8a5a33" stroke="#5e3b1f" strokeWidth={2} />
      <circle cx={246} cy={146} r={4} fill="#8a5a33" stroke="#5e3b1f" strokeWidth={2} />
    </Day>
  ),
  'bug-leaf': () => (
    <Day ground={false}>
      <Put id="leaf" x={70} y={10} s={190} />
      <Put id="caterpillar" x={120} y={46} s={84} />
    </Day>
  ),
  'bird-tree': () => (
    <Day>
      <Put id="tree" x={70} y={4} s={190} />
      <Put id="bird" x={146} y={40} s={56} />
    </Day>
  ),
  'fish-swim': () => (
    <>
      <rect width={320} height={200} fill="#7ccdf2" />
      <path d="M0 30 Q40 20 80 30 T160 30 T240 30 T320 30" fill="none" stroke="#bfe9ff" strokeWidth={4} />
      <circle cx={232} cy={70} r={6} fill="none" stroke="#e8f8ff" strokeWidth={2.5} />
      <circle cx={246} cy={52} r={4} fill="none" stroke="#e8f8ff" strokeWidth={2.5} />
      <path d="M0 184 Q60 172 120 182 T240 180 T320 182 L320 200 L0 200 Z" fill="#f3dca6" />
      <Put id="fish" x={100} y={50} s={120} />
    </>
  ),
  'dog-ball': () => (
    <Day>
      <Put id="dog" x={70} y={40} s={130} />
      <Put id="ball" x={196} y={112} s={56} />
    </Day>
  ),
  'bee-flower': () => (
    <Day>
      <Put id="flower" x={80} y={30} s={150} />
      <Put id="bee" x={124} y={6} s={64} />
    </Day>
  ),
  'frog-stone': () => (
    <Day>
      <Put id="stone" x={90} y={72} s={140} />
      <Put id="frog" x={118} y={32} s={84} />
    </Day>
  ),
  'owl-moon': () => (
    <Night>
      <Put id="moon" x={196} y={14} s={90} />
      <path d="M0 176 L320 176 L320 200 L0 200 Z" fill="#3a4a3a" />
      <path d="M30 150 L170 150" stroke="#6b4a2e" strokeWidth={10} strokeLinecap="round" />
      <Put id="owl" x={52} y={64} s={96} />
    </Night>
  ),
  'bunny-carrot': () => (
    <Day>
      <Put id="rabbit" x={70} y={40} s={130} />
      <Put id="carrot" x={180} y={96} s={70} />
    </Day>
  ),
  'mouse-cheese': () => (
    <Day ground={false}>
      <Floor />
      <Put id="mouse" x={74} y={56} s={110} />
      <Put id="cheese" x={176} y={90} s={78} />
    </Day>
  ),
  'bear-honey': () => (
    <Day>
      <Put id="bear" x={66} y={30} s={140} />
      <Put id="honey" x={190} y={100} s={70} />
    </Day>
  ),
  stars: () => (
    <Night>
      {[[40, 30, 46], [130, 60, 54], [230, 24, 50], [70, 120, 40], [200, 110, 44], [270, 140, 34]].map(([x, y, s], i) => (
        <Put key={i} id="star" x={x - s / 2} y={y - s / 2 + 10} s={s} />
      ))}
    </Night>
  ),
  'cat-dog-friends': () => (
    <Day>
      <Put id="cat" x={50} y={60} s={110} />
      <Put id="dog" x={160} y={52} s={118} flip />
      <Put id="heart" x={138} y={14} s={44} />
    </Day>
  ),
  'duck-pond': () => (
    <Day>
      <ellipse cx={160} cy={164} rx={130} ry={30} fill="#7ccdf2" stroke="#4fa8d8" strokeWidth={3} />
      <path d="M70 168 Q90 162 110 168 M200 174 Q220 168 240 174" fill="none" stroke="#c8ecff" strokeWidth={3} strokeLinecap="round" />
      <Put id="duck" x={104} y={64} s={112} />
    </Day>
  ),
}
/** The scene names, for tests. */
export const SCENE_NAMES = Object.keys(SCENES)

function Scene({ name, label }: { name: string; label: string }) {
  const clip = `tb-clip-${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  return (
    <svg className="tb-scene" viewBox="0 0 320 200" role="img" aria-label={label}>
      <defs><clipPath id={clip}><rect width={320} height={200} rx={22} /></clipPath></defs>
      <g clipPath={`url(#${clip})`}>{SCENES[name]?.()}</g>
    </svg>
  )
}

/** One drawn item on its own card (the word builder's picture). Tapping it says the word. */
function Picture({ art, word }: { art: string; word: string }) {
  const it = itemById(art)
  return (
    <button type="button" className="tb-picture" aria-label={word} onClick={() => speak(word)}>
      <svg viewBox="0 0 100 100">{it && <it.Draw />}</svg>
    </button>
  )
}

// ---------- the tile board ----------

/** How long without a move before the next right tile is shown. */
const IDLE_MS = 12000

interface BoardProps {
  /** What each slot wants. */
  want: string[]
  /** Slots already filled at the start (word families: the end of the word). Null: to fill. */
  given: (string | null)[]
  /** What an empty slot shows until it's filled (word families: the old first letter). */
  placeholder: (string | null)[]
  /** The tiles in the tray. */
  tiles: string[]
  /** Says a tile (or a slot's content). */
  say: (text: string) => void
  /** Read when every slot is filled; then `onDone`. */
  finale: string
  onDone: (firstTry: boolean) => void
  /** 'letters' (big square tiles) or 'words'. */
  look: 'letters' | 'words'
}

function Slot({ id, i, text, open, swap, glow, look, onTap }: {
  id: string; i: number; text: string | null; open: boolean; swap: boolean; glow: boolean; look: string; onTap: () => void
}) {
  const ref = useDropTarget(id, () => open, 20)
  return (
    <button
      ref={ref} data-slot={i} type="button" onClick={onTap}
      className={`tb-slot tb-${look} ${open ? 'open' : 'has'} ${swap ? 'swap' : ''} ${glow ? 'glow' : ''}`}
    >{text ?? ''}</button>
  )
}

function Tile({ text, used, wrong, glow, disabled, look, onDrop, onTap, setEl }: {
  text: string; used: boolean; wrong: boolean; glow: boolean; disabled: boolean; look: string
  onDrop: (target: string) => boolean; onTap: () => void; setEl: (el: HTMLButtonElement | null) => void
}) {
  const drag = useDrag({ data: text, disabled: used || disabled, onStart: sfx.lift, onDrop, onTap })
  return (
    <button ref={setEl} type="button" className={`tb-tile tb-${look} ${used ? 'used' : ''} ${wrong ? 'wiggle' : ''} ${glow ? 'glow' : ''}`} disabled={used} {...drag}>
      {text}
    </button>
  )
}

function TileBoard({ want, given, placeholder, tiles, say, finale, onDone, look }: BoardProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const slotId = (i: number) => `tb-${uid}-${i}`
  const alive = useAlive()
  const [filled, setFilled] = useState<(string | null)[]>(given)
  const [used, setUsed] = useState<boolean[]>(() => tiles.map(() => false))
  const [wrong, setWrong] = useState<number | null>(null)
  const [hint, setHint] = useState<{ tile: number; slot: number } | null>(null)
  const [finished, setFinished] = useState(false)
  const [poke, setPoke] = useState(0) // bumped by every move: the wait for a hint starts again
  const filledRef = useRef(filled)
  const usedRef = useRef(used)
  const misses = useRef(0) // misses since the last right move
  const helped = useRef(false) // any miss or hint: not first try
  const over = useRef(false)
  const tileEls = useRef<(HTMLButtonElement | null)[]>([])
  const root = useRef<HTMLDivElement>(null)
  const timers = useRef<number[]>([])
  useEffect(() => () => timers.current.forEach(clearTimeout), [])
  const later = (fn: () => void, ms: number) => { timers.current.push(window.setTimeout(() => alive.current && fn(), ms)) }

  /** The next right move: the first empty slot, and an unused tile that fits it. */
  const nextMove = () => {
    const slot = want.findIndex((_, i) => filledRef.current[i] === null)
    if (slot < 0) return null
    const tile = tiles.findIndex((t, k) => !usedRef.current[k] && t === want[slot])
    return tile < 0 ? null : { tile, slot }
  }
  const showNext = () => {
    if (over.current) return
    const m = nextMove()
    if (!m) return
    helped.current = true
    setHint(m)
    const from = tileEls.current[m.tile]
    const to = root.current?.querySelector(`[data-slot="${m.slot}"]`)
    if (from && to) showDrag(from, to)
  }

  // After a quiet while, show the next move (and again after another, until she makes one).
  useEffect(() => {
    if (finished) return
    const t = window.setTimeout(() => { if (alive.current) { showNext(); setPoke((n) => n + 1) } }, IDLE_MS)
    return () => clearTimeout(t)
  }, [poke, finished])

  const drop = (k: number, target: string) => {
    if (over.current || usedRef.current[k]) return false
    const i = want.findIndex((_, j) => slotId(j) === target)
    if (i < 0 || filledRef.current[i] !== null) return false
    setPoke((n) => n + 1)
    if (tiles[k] !== want[i]) {
      // The wrong spot: it floats home with a wiggle. After two, the next right move lights up.
      sfx.oops()
      helped.current = true
      misses.current++
      setWrong(k)
      later(() => setWrong((w) => (w === k ? null : w)), 600)
      if (misses.current >= 2) later(showNext, 400)
      return false
    }
    sfx.plop()
    const f = filledRef.current.slice()
    f[i] = tiles[k]
    filledRef.current = f
    setFilled(f)
    const u = usedRef.current.slice()
    u[k] = true
    usedRef.current = u
    setUsed(u)
    setHint(null)
    misses.current = 0
    if (f.every((x) => x !== null)) {
      over.current = true
      setFinished(true)
      ;(async () => {
        await speak(finale)
        if (alive.current) onDone(!helped.current)
      })()
    } else {
      say(tiles[k])
    }
    return true
  }

  const shown = (i: number) => filled[i] ?? placeholder[i]

  return (
    <div ref={root} className={`tb-board tb-${look} ${finished ? 'finished' : ''}`}>
      <div className="tb-slots">
        {want.map((_, i) => (
          <Slot
            key={i} id={slotId(i)} i={i} look={look} text={shown(i)} open={!finished && filled[i] === null}
            swap={!finished && filled[i] === null && placeholder[i] !== null} glow={hint?.slot === i}
            onTap={() => { const t = shown(i); if (t && !over.current) say(t) }}
          />
        ))}
      </div>
      <div className="tb-tray">
        {tiles.map((t, k) => (
          <Tile
            key={k} text={t} look={look} used={used[k]} wrong={wrong === k} glow={hint?.tile === k} disabled={finished}
            onDrop={(target) => drop(k, target)} onTap={() => say(t)} setEl={(el) => { tileEls.current[k] = el }}
          />
        ))}
      </div>
    </div>
  )
}

// ---------- the players ----------

const sayLetter = (l: string) => { speak(letterSound(l)) }

const WordBuild: ExerciseView<WordBuildEx> = ({ ex, onResult }) => {
  const want = [...ex.word]
  // Word families: the end of the word is already there, and the first slot shows the old letter.
  const given = ex.from ? want.map((l, i) => (i === 0 ? null : l)) : want.map(() => null)
  const placeholder = want.map((_, i) => (ex.from && i === 0 ? ex.from[0] : null))
  return (
    <div className={`tb-play tb-word ${ex.from ? 'family' : 'spell'}`}>
      <Picture art={ex.art} word={ex.word} />
      <TileBoard
        want={want} given={given} placeholder={placeholder} tiles={ex.tiles} look="letters"
        say={sayLetter} finale={blend(ex.word)} onDone={onResult}
      />
    </div>
  )
}

const SentenceBuild: ExerciseView<SentenceBuildEx> = ({ ex, onResult }) => {
  const sentence = ex.tiles.join(' ')
  // Shuffled until it's out of order, so there's always something to build.
  const tray = useMemo(() => {
    let t = shuffle(ex.tiles)
    while (t.length > 1 && t.every((x, i) => x === ex.tiles[i])) t = shuffle(ex.tiles)
    return t
  }, [ex])
  return (
    <div className="tb-play tb-sentence">
      <Scene name={ex.scene} label={sentence} />
      <TileBoard
        want={ex.tiles} given={ex.tiles.map(() => null)} placeholder={ex.tiles.map(() => null)} tiles={tray} look="words"
        say={(w) => { speak(w.replace(/\.$/, '')) }} finale={sentence} onDone={onResult}
      />
    </div>
  )
}

/** The components that play these exercises, by `kind`. */
export const EXERCISES: Record<string, ExerciseView> = {
  wordbuild: WordBuild as ExerciseView,
  sentencebuild: SentenceBuild as ExerciseView,
}
