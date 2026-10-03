import { useEffect, useState, type ComponentType } from 'react'
import type { StoryPage } from '../data/islands'
import { speak } from '../lib/speech'
import { useTapPictures } from '../lib/useTapPictures'
import { BigButton } from '../components/ui'
import { sfx } from '../lib/sfx'
import { BuddyContext } from '../art/scenes/buddy'
import { palById, stageFor } from '../data/pals'
import { getProgress } from '../lib/progress'

/** `art` (optional): one illustration per page (src/art/scenes); pages without one show their emoji scene. */
export default function StoryBook({ title, pages, art, onDone }: { title: string; pages: StoryPage[]; art?: ComponentType[]; onDone: () => void }) {
  const [i, setI] = useState(0)
  const page = pages[i]
  // The first page always includes the title, so it matches a family recording of that page.
  const line = i === 0 ? `${title}. ${page.text}` : page.text
  const Art = art?.[i]
  // Pictures that show "her" Pal (the birthday party) draw the one she plays with.
  const pp = getProgress()
  const buddyId = pp.battler ?? pp.starter ?? 'zippy'
  const buddy = { id: buddyId, stage: stageFor(palById(buddyId), pp.pals[buddyId] ?? 0) }
  useEffect(() => { speak(line) }, [i])
  // Living pictures: things to tap in the picture (lib/useTapPictures.ts).
  const tap = useTapPictures(i)
  return (
    <div className={`story ${Art ? 'illustrated' : ''}`} style={{ background: page.bg }}>
      {Art ? <div className="story-art" key={i} onClick={tap}><BuddyContext.Provider value={buddy}><Art /></BuddyContext.Provider></div> : <div className="story-scene" key={i}>{page.scene}</div>}
      <p className="story-text" onClick={() => speak(line)}>{page.text}</p>
      <div className="story-nav">
        <BigButton color="white" disabled={i === 0} onClick={() => { sfx.whoosh(); setI(i - 1) }}>⬅️</BigButton>
        <span className="story-page">{i + 1} / {pages.length}</span>
        <BigButton color="pink" onClick={() => { sfx.whoosh(); if (i < pages.length - 1) setI(i + 1); else onDone() }}>➡️</BigButton>
      </div>
    </div>
  )
}
