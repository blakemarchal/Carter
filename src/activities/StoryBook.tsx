import { useEffect, useState } from 'react'
import type { StoryPage } from '../data/islands'
import { speak } from '../lib/speech'
import { BigButton } from '../components/ui'
import { sfx } from '../lib/sfx'

export default function StoryBook({ title, pages, onDone }: { title: string; pages: StoryPage[]; onDone: () => void }) {
  const [i, setI] = useState(0)
  const page = pages[i]
  // The first page always includes the title, so it matches a family recording of that page.
  const line = i === 0 ? `${title}. ${page.text}` : page.text
  useEffect(() => { speak(line) }, [i])
  return (
    <div className="story" style={{ background: page.bg }}>
      <div className="story-scene" key={i}>{page.scene}</div>
      <p className="story-text" onClick={() => speak(line)}>{page.text}</p>
      <div className="story-nav">
        <BigButton color="white" disabled={i === 0} onClick={() => { sfx.whoosh(); setI(i - 1) }}>⬅️</BigButton>
        <span className="story-page">{i + 1} / {pages.length}</span>
        <BigButton color="pink" onClick={() => { sfx.whoosh(); if (i < pages.length - 1) setI(i + 1); else onDone() }}>➡️</BigButton>
      </div>
    </div>
  )
}
