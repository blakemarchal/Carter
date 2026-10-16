// The "Remember?" round's pictures (learn/remember.ts): a memory verse with one piece missing.
import type { LearnView } from '../types'
import './remember.css'

export const VIEWS: Record<string, LearnView> = {
  /** The verse's pieces in order, one of them a blank; tap a piece to hear it. */
  'rm-verse': ({ data, onSay }) => {
    const { chunks, missing, ref } = data as { chunks: string[]; missing: number; ref: string }
    return (
      <div className="rm-verse">
        <div className="rm-pieces">
          {chunks.map((c, i) => i === missing
            ? <span key={i} className="rm-blank" aria-label="the missing piece">?</span>
            : <button key={i} className="rm-piece" onClick={() => onSay(c)}>{c}</button>)}
        </div>
        <div className="rm-ref">{ref}</div>
      </div>
    )
  },
}
