import { useEffect, useState } from 'react'
import type { StoryPage } from '../data/noah'
import { speak } from '../lib/speech'
import { BigButton } from '../components/ui'

export default function StoryBook({ title, pages, onDone }: { title: string; pages: StoryPage[]; onDone: () => void }) {
  const [i, setI] = useState(0)
  const page = pages[i]
  useEffect(() => { speak(i === 0 ? `${title}. ${page.text}` : page.text) }, [i])
  return (
    <div className="story" style={{ background: page.bg }}>
      <div className="story-scene" key={i}>{page.scene}</div>
      <p className="story-text" onClick={() => speak(page.text)}>{page.text}</p>
      <div className="story-nav">
        <BigButton color="white" disabled={i === 0} onClick={() => setI(i - 1)}>⬅️</BigButton>
        <span className="story-page">{i + 1} / {pages.length}</span>
        <BigButton color="pink" onClick={() => (i < pages.length - 1 ? setI(i + 1) : onDone())}>➡️</BigButton>
      </div>
    </div>
  )
}
