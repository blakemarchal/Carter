import { useEffect, useState, type ComponentType } from 'react'
import type { StoryPage } from '../data/islands'
import { thinkSay, type ThinkQ } from '../data/think'
import type { Question } from '../lib/questions'
import { speak } from '../lib/speech'
import { useTapPictures } from '../lib/useTapPictures'
import { Arrow, BigButton } from '../components/ui'
import QuestionCard from '../components/QuestionCard'
import { sfx } from '../lib/sfx'
import { BuddyContext } from '../art/scenes/buddy'
import { palById, stageFor } from '../data/pals'
import { getProgress } from '../lib/progress'

/**
 * "Think about it" (data/think.ts), after the last page: the question with its three answers read out in order,
 * then why, then on to the next activity. Doesn't change their reading level.
 */
function Think({ q, onDone }: { q: ThinkQ; onDone: () => void }) {
  const [answered, setAnswered] = useState(false)
  const [question] = useState<Question>(() => ({
    skill: 'reading', say: thinkSay(q), visual: { kind: 'emoji', items: ['🤔'] },
    choices: q.choices.map((c) => ({ label: c.emoji, art: c.art, say: c.say })), answer: q.answer,
  }))
  return (
    <div className="story-think">
      <QuestionCard q={question} onSolved={() => { setAnswered(true); speak(q.why) }} record={false} />
      {/* (the same three-part nav as the pages, so Next sits where it always does) */}
      {answered && <div className="story-nav"><span /><span className="story-page" /><BigButton color="pink" onClick={() => { sfx.whoosh(); onDone() }} aria-label="Next"><Arrow /></BigButton></div>}
    </div>
  )
}

/**
 * `art` (optional): one illustration per page (src/art/scenes); pages without one show their emoji scene.
 * `think` (optional): a question to think about after the last page.
 */
export default function StoryBook({ title, pages, art, think, onDone }: { title: string; pages: StoryPage[]; art?: ComponentType[]; think?: ThinkQ; onDone: () => void }) {
  const [i, setI] = useState(0)
  const [thinking, setThinking] = useState(false)
  const page = pages[i]
  // The first page always includes the title, so it matches a family recording of that page.
  const line = i === 0 ? `${title}. ${page.text}` : page.text
  const Art = art?.[i]
  // Pictures that show "their" Pal (the birthday party) draw the one the player plays with.
  const pp = getProgress()
  const buddyId = pp.battler ?? pp.starter ?? 'zippy'
  const buddy = { id: buddyId, stage: stageFor(palById(buddyId), pp.pals[buddyId] ?? 0) }
  useEffect(() => { speak(line) }, [i])
  // Living pictures: things to tap in the picture (lib/useTapPictures.ts).
  const tap = useTapPictures(i)
  return (
    <div className={`story ${Art ? 'illustrated' : ''}`} style={{ background: page.bg }}>
      {Art ? <div className="story-art" key={i} onClick={tap}><BuddyContext.Provider value={buddy}><Art /></BuddyContext.Provider></div> : <div className="story-scene" key={i}>{page.scene}</div>}
      {thinking && think ? <Think q={think} onDone={onDone} /> : (
        <>
          <p className="story-text" onClick={() => speak(line)}>{page.text}</p>
          <div className="story-nav">
            <BigButton color="white" disabled={i === 0} onClick={() => { sfx.whoosh(); setI(i - 1) }} aria-label="Back"><Arrow dir="left" /></BigButton>
            <span className="story-page">{i + 1} / {pages.length}</span>
            <BigButton color="pink" onClick={() => { sfx.whoosh(); if (i < pages.length - 1) setI(i + 1); else if (think) setThinking(true); else onDone() }} aria-label="Next"><Arrow /></BigButton>
          </div>
        </>
      )}
    </div>
  )
}
