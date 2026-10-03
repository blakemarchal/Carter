// Shared drawing helpers for item pictures (the same look as the Pals: soft shading, ink outlines,
// glossy cute eyes). Everything draws in a 100 x 100 box.
import { pt } from '../kit'

export { CuteFace, darken, ink, lighten, Shine, useShade } from '../kit'

/** Dark ink for eyes and mouths, as on the Pals. */
export const EYE = '#2b2140'

/** A woolly or fluffy outline (sheep, clouds, manes): puffs around an ellipse, as one scalloped path. */
export function fluff(cx: number, cy: number, rx: number, ry: number, n: number, puff = 0.56) {
  const p = Array.from({ length: n }, (_, i) => {
    const a = -Math.PI / 2 + (Math.PI * 2 * (i + 0.5)) / n
    return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]
  })
  return `M${pt(p[0][0], p[0][1])}` + p.map(([x, y], i) => {
    const [nx, ny] = p[(i + 1) % n]
    const r = (Math.hypot(nx - x, ny - y) * puff).toFixed(1)
    return ` A${r} ${r} 0 0 1 ${pt(nx, ny)}`
  }).join('') + 'Z'
}

/** A soft shadow under something standing on the ground. */
export const groundShadow = (cx = 50, cy = 93, rx = 30) => ({ cx, cy, rx, ry: 4, fill: '#000', opacity: 0.12 })
