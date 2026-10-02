export const shuffle = <T,>(a: readonly T[]): T[] => {
  const r = [...a]
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[r[i], r[j]] = [r[j], r[i]]
  }
  return r
}
export const pick = <T,>(a: readonly T[]): T => a[Math.floor(Math.random() * a.length)]
export const randInt = (lo: number, hi: number) => lo + Math.floor(Math.random() * (hi - lo + 1))
export const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))
