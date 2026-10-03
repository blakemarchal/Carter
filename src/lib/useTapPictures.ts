// Living pictures: tapping something marked <Tap> in a story picture (art/scenes/kit.tsx) makes it
// hop, plays its sound, and says its line when the narrator isn't mid-sentence. Things marked to be
// counted (<Tap count="baskets">) say the next number instead. Spread `onClick` on the picture's box,
// and change `page` when the picture changes (the counting starts again).
import { useEffect, useRef, type MouseEvent } from 'react'
import { isSpeaking, speak } from './speech'
import { numberWords } from './spoken'
import { sfx } from './sfx'

export function useTapPictures(page: unknown) {
  const counted = useRef<Record<string, Set<Element>>>({})
  useEffect(() => { counted.current = {} }, [page])
  return (e: MouseEvent) => {
    const t = (e.target as Element).closest('.tap')
    if (!t) return
    t.classList.remove('tapped')
    void (t as HTMLElement).getBoundingClientRect() // (restart the hop)
    t.classList.add('tapped')
    const name = t.getAttribute('data-sfx') ?? 'pop'
    ;(sfx as unknown as Record<string, (() => void) | undefined>)[name]?.()
    const group = t.getAttribute('data-count')
    if (group) {
      const seen = (counted.current[group] ??= new Set())
      seen.add(t)
      sfx.count(Math.min(seen.size, 10))
      speak(`${numberWords(seen.size).replace(/^./, (c) => c.toUpperCase())}!`)
      return
    }
    const say = t.getAttribute('data-say')
    if (say && !isSpeaking()) speak(say)
  }
}
