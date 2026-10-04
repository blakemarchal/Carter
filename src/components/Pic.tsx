// A thing's picture, wherever activities used to show an emoji: the drawn item (art/items) when there
// is one, a small copy of a story page for `story:<island>:<page>`, or else the emoji itself. A row of
// emoji ("🐟🐟") draws each one. It's sized like text (1em), so it drops in where an emoji was.
// (A story card shows once its island has loaded, which it always has when the island is playing.)
import { STORY_ART } from '../art/scenes'
import { useIsland } from '../lib/useIsland'
import { itemById, itemForEmoji, type Item } from '../art/items'

const segmenter = typeof Intl !== 'undefined' && 'Segmenter' in Intl ? new Intl.Segmenter(undefined, { granularity: 'grapheme' }) : null
/** Splits a string of emoji into single emoji (keeping ☀️ and 👨‍👩‍👧 whole). */
const graphemes = (s: string) => (segmenter ? [...segmenter.segment(s)].map((g) => g.segment) : Array.from(s).filter((c) => !/[︎️‍]/.test(c)))

function Drawn({ item, className }: { item: Item; className?: string }) {
  return (
    <svg className={`pic pa-anim ${className ?? ''}`} viewBox="0 0 100 100" role="img" aria-label={item.name}>
      <item.Draw />
    </svg>
  )
}

/** `e`: the emoji (or emoji) the content names; `art`: an item id or `story:<island>:<page>`, to use instead. */
function StoryCard({ island, page, e, className }: { island: string; page: number; e: string; className?: string }) {
  const isl = useIsland(STORY_ART[island] ? undefined : island)
  const Page = (STORY_ART[island] ?? isl?.art)?.[page - 1]
  return Page
    ? <span className={`pic-card ${className ?? ''}`} aria-hidden><Page /></span>
    : <span className={`pic-emoji ${className ?? ''}`}>{e}</span>
}

export default function Pic({ e, art, className }: { e: string; art?: string; className?: string }) {
  if (art?.startsWith('story:')) {
    const [, island, page] = art.split(':')
    return <StoryCard island={island} page={Number(page)} e={e} className={className} />
  }
  const named = art ? itemById(art) : undefined
  if (named) return <Drawn item={named} className={className} />
  const one = itemForEmoji(e)
  if (one) return <Drawn item={one} className={className} />
  const parts = graphemes(e)
  if (parts.length > 1 && parts.some((p) => itemForEmoji(p))) {
    return <span className={`pic-row ${className ?? ''}`}>{parts.map((p, i) => <Pic key={i} e={p} />)}</span>
  }
  return <span className={`pic-emoji ${className ?? ''}`}>{e}</span>
}
