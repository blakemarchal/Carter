// The placement game (docs/GAME-PLAN.md §4): the first time a player plays, a short treasure hunt with
// their Pal finds where to start reading and math. It's a game, not a test: every answer (and "not
// sure") finds a treasure and gets praise, nothing is marked right or wrong, and nothing here counts
// toward the levels' streaks, stars or the daily voyage. Only the levels it finds are saved (and, if a
// parent turned play totals on, one count of the level found per skill finished: lib/stats placed).
// Who gets it and how the next question is picked: learn/placement.ts.
import { useEffect, useState } from 'react'
import PalArt from '../components/PalArt'
import { BackButton, BigButton, Confetti, Icon } from '../components/ui'
import { VisualView } from '../components/QuestionCard'
import Pic from '../components/Pic'
import { PALS, palById, stageFor } from '../data/pals'
import { afterAnswer, placedLevel, searchDone, startSearch, type LevelSearch } from '../learn/placement'
import { getProgress, playerName, update, type Skill } from '../lib/progress'
import { makeQuestion, type Question } from '../lib/questions'
import { speak, stopSpeaking } from '../lib/speech'
import { sfx } from '../lib/sfx'
import { useAlive } from '../lib/useAlive'
import { placed } from '../lib/stats'
import './Placement.css'

const ORDER: Skill[] = ['reading', 'numbers']

// Spoken lines (fixed, or built from the Pal's and player's names, so they can be voiced ahead of time).
export const SKILL_START: Record<Skill, string> = { reading: 'First, some word puzzles!', numbers: 'Now, some number puzzles!' }
/** Said after every answer, right or not: it's the trying that finds treasure. */
export const PLACEMENT_PRAISE = ['Great thinking!', 'You found a treasure!', 'Ooh, nice one!', 'I love how you think!', "Thank you! Here's a treasure!", 'Super!']
export const NOT_SURE = "That's OK! Here's a treasure anyway. Let's try another one."
export const placementIntro = (pal: string, name: string) =>
  `${pal} wants to go on a treasure hunt with you, ${name}! Every puzzle you try finds a treasure. Tap Let's go!`
export const placementEnd = (pal: string, name: string) =>
  `What a treasure hunt! ${pal} had so much fun with you, ${name}. Let's sail!`

const TREASURE = ['💎', '🐚', '⭐', '💖', '🌟']

type Phase = 'intro' | 'play' | 'end'

/** Saves what was found (and that the game has been played, so it isn't offered again). */
function save(found: Partial<Record<Skill, number>>) {
  update((p) => {
    const streak = { ...p.streak }
    for (const s of Object.keys(found) as Skill[]) streak[s] = 0
    return { ...p, placement: 'done', skills: { ...p.skills, ...found }, streak }
  })
}

export default function Placement({ onDone }: { onDone: () => void }) {
  const alive = useAlive()
  const [{ pal, stage }] = useState(() => {
    const p = getProgress()
    const pal = palById(p.starter ?? '') ?? PALS.find((x) => x.starter)!
    return { pal, stage: stageFor(pal, p.pals[pal.id] ?? 0) }
  })
  const palName = pal.stages[stage].name
  const [phase, setPhase] = useState<Phase>('intro')
  const [skill, setSkill] = useState<Skill>('reading')
  const [search, setSearch] = useState<LevelSearch>(() => startSearch('reading'))
  const [q, setQ] = useState<Question | null>(null)
  const [asked, setAsked] = useState<Question[]>([])
  const [found, setFound] = useState<Partial<Record<Skill, number>>>({})
  const [picked, setPicked] = useState<number | 'unsure' | null>(null)
  const [gems, setGems] = useState(0)

  useEffect(() => { speak(placementIntro(palName, playerName())) }, [])
  useEffect(() => { if (q) speak(q.say) }, [q])

  const begin = async (s: Skill) => {
    setSkill(s)
    setQ(null)
    setPicked(null)
    await speak(SKILL_START[s])
    if (!alive.current) return
    const first = startSearch(s)
    setSearch(first)
    setAsked([])
    setQ(makeQuestion(s, first.level))
  }

  const answer = async (choice: number | 'unsure') => {
    if (!q || picked !== null) return
    setPicked(choice)
    setGems((n) => n + 1)
    sfx.sparkle()
    await speak(choice === 'unsure' ? NOT_SURE : PLACEMENT_PRAISE[Math.floor(Math.random() * PLACEMENT_PRAISE.length)])
    if (!alive.current) return
    const next = afterAnswer(search, choice === q.answer)
    if (!searchDone(next)) {
      const before = [...asked, q]
      setSearch(next)
      setAsked(before)
      setPicked(null)
      setQ(makeQuestion(skill, next.level, undefined, before))
      return
    }
    const level = placedLevel(next)
    placed(skill, level)
    const now = { ...found, [skill]: level }
    setFound(now)
    const after = ORDER[ORDER.indexOf(skill) + 1]
    if (after) return begin(after)
    save(now)
    setQ(null)
    setPhase('end')
    sfx.fanfare()
    speak(placementEnd(palName, playerName()))
  }

  // Leaving early keeps the levels already found (and isn't offered again; a parent can rerun it).
  const leave = () => {
    stopSpeaking()
    if (phase !== 'end') save(found)
    onDone()
  }

  return (
    <div className={`screen placement ${phase}`}>
      <header>
        <BackButton onClick={leave} />
        <h2>Treasure hunt!</h2>
        <div className="pl-bag" aria-label="Treasure found">
          {Array.from({ length: gems }).map((_, i) => <span key={i}><Pic e={TREASURE[i % TREASURE.length]} /></span>)}
        </div>
      </header>

      {phase === 'intro' && (
        <div className="pl-center">
          <PalArt pal={pal} stage={stage} size={260} className="bounce" />
          <p>{palName} wants to go on a treasure hunt with you!</p>
          <BigButton color="pink" onClick={() => { setPhase('play'); begin('reading') }}><Pic e="🗺️" /> Let's go!</BigButton>
        </div>
      )}

      {phase === 'play' && (
        <div className="pl-play">
          <div className="pl-pal">
            <PalArt key={gems} pal={pal} stage={stage} size={120} className={gems ? 'pl-hop' : ''} />
            <span className="pl-kind">{skill === 'reading' ? <><Pic e="📖" /> Word puzzles</> : <><Pic e="🔢" /> Number puzzles</>}</span>
          </div>
          {q && (
            <div className="q-card pl-card" key={`${skill}-${search.asked}`}>
              <button className="q-prompt" aria-label="Hear it again" onClick={() => speak(q.say)}><Icon kind="speaker" /></button>
              <VisualView v={q.visual} onSay={(s) => speak(s)} />
              <Choices q={q} picked={picked} onPick={answer} />
              <button className={`pl-unsure ${picked === 'unsure' ? 'picked' : ''}`} onClick={() => answer('unsure')}><Pic e="🤔" /> Not sure</button>
            </div>
          )}
        </div>
      )}

      {phase === 'end' && (
        <div className="pl-center">
          <Confetti />
          <PalArt pal={pal} stage={stage} size={260} className="bounce" />
          <p>What a treasure hunt!</p>
          <BigButton color="pink" onClick={onDone}><Pic e="⛵" /> Let's sail!</BigButton>
        </div>
      )}
    </div>
  )
}

function Choices({ q, picked, onPick }: { q: Question; picked: number | 'unsure' | null; onPick: (i: number) => void }) {
  // (Words and numbers show as text; an emoji or a drawing shows as a picture, as in QuestionCard.)
  const text = q.choices.every((c) => !c.art && !/\p{Extended_Pictographic}/u.test(c.label))
  return (
    <div className={`q-choices ${text ? 'text' : 'pics'}`}>
      {q.choices.map((c, i) => (
        <button key={i} className={`q-choice ${picked === i ? 'picked' : ''}`} onClick={() => onPick(i)}>
          {text ? c.label : <Pic e={c.label} art={c.art} />}
        </button>
      ))}
    </div>
  )
}
