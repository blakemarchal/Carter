import { useEffect, useState, type ComponentType, type ReactNode } from 'react'
import type { StoryPage } from '../data/islands'
import { thinkSay, type ThinkQ } from '../data/think'
import { capital, cardLine, wordPattern, type BigWord } from '../data/bigwords'
import { DID_YOU_KNOW, TRY_IT, factFor, scienceSay, type Science } from '../data/science'
import Pic from '../components/Pic'
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

/** The big word (data/bigwords.ts) before the story: the word, its picture and what it means; tap to hear it again. */
function BigWordCard({ b, onDone }: { b: BigWord; onDone: () => void }) {
  useEffect(() => { speak(cardLine(b)) }, [])
  return (
    <div className="big-word-card">
      <div className="bw-body" onClick={() => speak(cardLine(b))}>
        <div className="bw-label">Big word!</div>
        <div className="bw-word">{capital(b.word)}</div>
        <div className="bw-pic"><Pic e={b.emoji} /></div>
        <p className="bw-means">{b.means}</p>
      </div>
      <div className="story-nav"><span /><span className="story-page" /><BigButton color="pink" onClick={() => { sfx.whoosh(); onDone() }} aria-label="Next"><Arrow /></BigButton></div>
    </div>
  )
}

/** "Did you know?" (data/science.ts) after the story: a fact at their reading level, and a thing to try at home. */
function ScienceCard({ sc, onDone }: { sc: Science; onDone: () => void }) {
  const level = getProgress().skills.reading
  const line = scienceSay(sc, level)
  useEffect(() => { speak(line) }, [])
  return (
    <div className="science-card">
      <div className="sc-body" onClick={() => speak(line)}>
        <div className="sc-label">{DID_YOU_KNOW}</div>
        <div className="sc-title"><Pic e={sc.emoji} /> {sc.title}</div>
        <p className="sc-fact">{factFor(sc, level)}</p>
        <p className="sc-try"><b>{TRY_IT}</b> {sc.tryIt}</p>
      </div>
      <div className="story-nav"><span /><span className="story-page" /><BigButton color="pink" onClick={() => { sfx.whoosh(); onDone() }} aria-label="Next"><Arrow /></BigButton></div>
    </div>
  )
}

/** A page's words, with the big word lit up wherever it is: tap it to hear what it means. */
function PageText({ text, big }: { text: string; big?: BigWord }) {
  if (!big) return <>{text}</>
  const out: ReactNode[] = []
  let last = 0
  for (const m of text.matchAll(wordPattern(big))) {
    out.push(text.slice(last, m.index))
    out.push(<button key={m.index} className="big-word" onClick={(e) => { e.stopPropagation(); speak(big.means) }}>{m[0]}</button>)
    last = m.index + m[0].length
  }
  out.push(text.slice(last))
  return <>{out}</>
}

/**
 * `art` (optional): one illustration per page (src/art/scenes); pages without one show their emoji scene.
 * `bigWord` (optional): a word to learn before the story, lit up in its pages.
 * `think` (optional): a question to think about after the last page.
 * `science` (optional): a "Did you know?" after that (the end of the island's story).
 */
export default function StoryBook({ title, pages, art, bigWord, think, science, onDone }: {
  title: string; pages: StoryPage[]; art?: ComponentType[]; bigWord?: BigWord; think?: ThinkQ; science?: Science; onDone: () => void
}) {
  const [i, setI] = useState(0)
  const [intro, setIntro] = useState(!!bigWord)
  const [thinking, setThinking] = useState(false)
  const [wondering, setWondering] = useState(false)
  // After the last page: the think question if there is one, then the science moment if there is one, then on.
  const after = () => (think && !thinking ? setThinking(true) : science && !wondering ? setWondering(true) : onDone())
  const page = pages[i]
  // The first page always includes the title, so it matches a family recording of that page.
  const line = i === 0 ? `${title}. ${page.text}` : page.text
  const Art = art?.[i]
  // Pictures that show "their" Pal (the birthday party) draw the one the player plays with.
  const pp = getProgress()
  const buddyId = pp.battler ?? pp.starter ?? 'zippy'
  const buddy = { id: buddyId, stage: stageFor(palById(buddyId), pp.pals[buddyId] ?? 0) }
  useEffect(() => { if (!intro) speak(line) }, [i, intro])
  // Living pictures: things to tap in the picture (lib/useTapPictures.ts).
  const tap = useTapPictures(i)
  if (intro && bigWord) {
    return <div className="story" style={{ background: page.bg }}><BigWordCard b={bigWord} onDone={() => setIntro(false)} /></div>
  }
  return (
    <div className={`story ${Art ? 'illustrated' : ''}`} style={{ background: page.bg }}>
      {Art ? <div className="story-art" key={i} onClick={tap}><BuddyContext.Provider value={buddy}><Art /></BuddyContext.Provider></div> : <div className="story-scene" key={i}>{page.scene}</div>}
      {wondering && science ? <ScienceCard sc={science} onDone={onDone} /> : thinking && think ? <Think q={think} onDone={after} /> : (
        <>
          <p className="story-text" onClick={() => speak(line)}><PageText text={page.text} big={bigWord} /></p>
          <div className="story-nav">
            <BigButton color="white" disabled={i === 0} onClick={() => { sfx.whoosh(); setI(i - 1) }} aria-label="Back"><Arrow dir="left" /></BigButton>
            <span className="story-page">{i + 1} / {pages.length}</span>
            <BigButton color="pink" onClick={() => { sfx.whoosh(); if (i < pages.length - 1) setI(i + 1); else after() }} aria-label="Next"><Arrow /></BigButton>
          </div>
        </>
      )}
    </div>
  )
}
