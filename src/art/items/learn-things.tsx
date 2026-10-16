// Things first drawn for the "Think about it" questions, the big words and the science moments (ears, a trumpet,
// a sunrise, a crowd, a chariot, a bandage…), so the answers a child taps are drawings. Each draws in a 100 x 100
// box (see ./types.ts).
import type { Item } from './types'
import { darken, EYE, groundShadow, ink, lighten, Shine, useShade } from './draw'
import { Person, PEOPLE, SKIN } from '../people'

const ROUND = { strokeLinejoin: 'round', strokeLinecap: 'round' } as const

/** An ear, listening (with a little sound coming in). */
function Ear() {
  const skin = useShade('#f3c9a8', 0.3, 0.15)
  const line = ink('#f3c9a8')
  return (
    <g {...ROUND}>
      <defs>{skin.def}</defs>
      <path d="M38 22 C38 6 76 6 76 34 C76 54 60 58 58 72 C56 88 34 92 32 74 C31 64 38 60 38 54 Z" fill={skin.fill} stroke={line} strokeWidth={3} />
      <path d="M50 26 C64 24 66 42 56 48 C50 52 46 56 48 64" stroke={line} strokeWidth={2.6} fill="none" />
      <path d="M48 36 C56 34 58 44 52 46" stroke={line} strokeWidth={2.2} fill="none" />
      {[16, 24].map((r) => <path key={r} d={`M${22 - r * 0.2} ${48 - r} A${r} ${r} 0 0 0 ${22 - r * 0.2} ${48 + r}`} stroke="#7fb8ff" strokeWidth={3} fill="none" />)}
    </g>
  )
}

/** Two eyes, looking. */
function Eyes() {
  return (
    <g {...ROUND}>
      {[30, 70].map((x) => (
        <g key={x}>
          <ellipse cx={x} cy={50} rx={18} ry={22} fill="#fff" stroke={EYE} strokeWidth={3} />
          <ellipse cx={x + 3} cy={52} rx={9} ry={11} fill="#4a86c8" />
          <ellipse cx={x + 3} cy={52} rx={5} ry={6.5} fill={EYE} />
          <circle cx={x} cy={46} r={3} fill="#fff" />
          <path d={`M${x - 16} 28 Q${x} 18 ${x + 16} 28`} stroke={EYE} strokeWidth={3} fill="none" />
        </g>
      ))}
    </g>
  )
}

/** A nose, sniffing. */
function Nose() {
  const skin = useShade('#f3c9a8', 0.3, 0.15)
  const line = ink('#f3c9a8')
  return (
    <g {...ROUND}>
      <defs>{skin.def}</defs>
      <path d="M50 14 C46 30 36 48 32 62 C28 76 40 84 50 80 C60 84 72 76 68 62 C64 48 54 30 50 14 Z" fill={skin.fill} stroke={line} strokeWidth={3} />
      <ellipse cx={40} cy={74} rx={5} ry={3.5} fill={darken('#f3c9a8', 0.35)} />
      <ellipse cx={60} cy={74} rx={5} ry={3.5} fill={darken('#f3c9a8', 0.35)} />
      {[0, 1, 2].map((i) => <path key={i} d={`M${14 + i * 4} ${30 + i * 10} q6 -4 12 0`} stroke="#9fd0ff" strokeWidth={2.4} fill="none" opacity={0.9} />)}
    </g>
  )
}

/** A mouth speaking, with the sound coming out. */
function Voice() {
  const lips = useShade('#ff6f9a', 0.3, 0.2)
  return (
    <g {...ROUND}>
      <defs>{lips.def}</defs>
      <path d="M14 50 Q30 32 46 44 Q50 46 54 44 Q70 32 86 50 Q70 70 50 70 Q30 70 14 50 Z" fill={lips.fill} stroke={ink('#ff6f9a')} strokeWidth={3} transform="translate(-14 0) scale(0.78) translate(6 14)" />
      <path d="M22 52 Q38 48 54 52 Q38 62 22 52 Z" fill="#8a2d3e" transform="translate(-14 0) scale(0.78) translate(6 14)" />
      {[18, 28, 38].map((r, i) => <path key={r} d={`M62 ${50 - r} A${r} ${r} 0 0 1 62 ${50 + r}`} stroke="#7fb8ff" strokeWidth={3.2 - i * 0.4} fill="none" />)}
    </g>
  )
}

/** A hug: two friends with their arms round each other. */
function Hug() {
  const a = useShade('#7cb06a', 0.3, 0.2)
  const b = useShade('#f2b33d', 0.3, 0.2)
  const skin = useShade(SKIN.tan, 0.25, 0.12)
  return (
    <g {...ROUND}>
      <defs>{a.def}{b.def}{skin.def}</defs>
      <ellipse {...groundShadow(50, 94, 36)} />
      {/* two bodies leaning in */}
      <path d="M18 92 L24 52 Q30 42 44 44 L50 92 Z" fill={a.fill} stroke={ink('#7cb06a')} strokeWidth={3} />
      <path d="M82 92 L76 52 Q70 42 56 44 L50 92 Z" fill={b.fill} stroke={ink('#f2b33d')} strokeWidth={3} />
      {/* arms round each other */}
      <path d="M26 58 Q50 70 72 56" stroke={ink('#7cb06a')} strokeWidth={9} fill="none" />
      <path d="M26 58 Q50 70 72 56" stroke="#7cb06a" strokeWidth={5} fill="none" />
      <path d="M74 64 Q50 78 28 66" stroke={ink('#f2b33d')} strokeWidth={9} fill="none" />
      <path d="M74 64 Q50 78 28 66" stroke="#f2b33d" strokeWidth={5} fill="none" />
      {/* heads, tilted together */}
      <circle cx={34} cy={32} r={13} fill={skin.fill} stroke={ink(SKIN.tan)} strokeWidth={2.6} />
      <circle cx={66} cy={32} r={13} fill={skin.fill} stroke={ink(SKIN.tan)} strokeWidth={2.6} />
      <path d="M22 28 Q34 14 46 28" fill="#4a3020" stroke={ink('#4a3020')} strokeWidth={2} />
      <path d="M54 28 Q66 14 78 28" fill="#7a4a24" stroke={ink('#7a4a24')} strokeWidth={2} />
      {[[31, 34], [37, 34], [63, 34], [69, 34]].map(([x, y]) => <path key={x} d={`M${x - 2} ${y} Q${x} ${y + 3} ${x + 2} ${y}`} stroke={EYE} strokeWidth={2.2} fill="none" />)}
      <path d="M30 40 Q34 44 38 40 M62 40 Q66 44 70 40" stroke={EYE} strokeWidth={2} fill="none" />
      <path d="M50 14 C46 8 40 10 42 16 C44 20 50 24 50 24 C50 24 56 20 58 16 C60 10 54 8 50 14 Z" fill="#ff5c8a" stroke={ink('#ff5c8a')} strokeWidth={1.8} />
    </g>
  )
}

/** A trumpet. */
function Trumpet() {
  const brass = useShade('#ffcc4d', 0.4, 0.2)
  const line = ink('#ffcc4d')
  return (
    <g {...ROUND} transform="rotate(-20 50 50)">
      <defs>{brass.def}</defs>
      <ellipse {...groundShadow(50, 92, 36)} />
      <rect x={10} y={46} width={48} height={10} rx={5} fill={brass.fill} stroke={line} strokeWidth={2.6} />
      <path d="M56 40 Q78 38 92 24 L92 78 Q78 64 56 62 Z" fill={brass.fill} stroke={line} strokeWidth={2.8} />
      <ellipse cx={92} cy={51} rx={4} ry={27} fill={lighten('#ffcc4d', 0.3)} stroke={line} strokeWidth={2.4} />
      {[28, 38, 48].map((x) => <rect key={x} x={x} y={34} width={5} height={14} rx={2} fill={lighten('#ffcc4d', 0.15)} stroke={line} strokeWidth={2} />)}
      <rect x={24} y={58} width={34} height={6} rx={3} fill={darken('#ffcc4d', 0.1)} stroke={line} strokeWidth={2} />
      <circle cx={12} cy={51} r={6} fill={lighten('#ffcc4d', 0.2)} stroke={line} strokeWidth={2.4} />
      <Shine x={34} y={44} rx={6} ry={2} rot={-10} />
    </g>
  )
}

/** A drum with its sticks. */
function Drum() {
  const side = useShade('#e2468f', 0.3, 0.2)
  return (
    <g {...ROUND}>
      <defs>{side.def}</defs>
      <ellipse {...groundShadow(50, 93, 36)} />
      <path d="M18 44 L18 78 Q50 92 82 78 L82 44 Z" fill={side.fill} stroke={ink('#e2468f')} strokeWidth={3} />
      {[26, 42, 58, 74].map((x) => <path key={x} d={`M${x} 46 L${x + 8} 78 M${x + 8} 46 L${x} 78`} stroke="#ffd34d" strokeWidth={2.2} opacity={0.9} />)}
      <ellipse cx={50} cy={44} rx={32} ry={12} fill="#fff8f0" stroke={ink('#e2468f')} strokeWidth={3} />
      <path d="M30 20 L46 40 M70 16 L54 38" stroke="#a0703f" strokeWidth={4} />
      <circle cx={30} cy={20} r={5} fill="#f0d3a0" stroke={ink('#f0d3a0')} strokeWidth={2} />
      <circle cx={70} cy={16} r={5} fill="#f0d3a0" stroke={ink('#f0d3a0')} strokeWidth={2} />
    </g>
  )
}

/** A sunrise: the sun just up over the hills, the sky going pink and gold. */
function Sunrise() {
  const sun = useShade('#ffd34d', 0.45, 0.15)
  return (
    <g {...ROUND}>
      <defs>{sun.def}</defs>
      <rect x={6} y={12} width={88} height={56} rx={10} fill="#ffc3d8" stroke={ink('#ffc3d8')} strokeWidth={2.6} />
      <rect x={6} y={40} width={88} height={28} fill="#ffdca8" />
      {Array.from({ length: 7 }, (_, i) => <path key={i} d="M50 30 L46 44 L54 44 Z" fill="#ffb92e" transform={`rotate(${-90 + i * 30} 50 64)`} />)}
      <circle cx={50} cy={64} r={18} fill={sun.fill} stroke={ink('#ffd34d')} strokeWidth={2.8} />
      <path d="M6 70 Q28 56 50 68 Q72 56 94 70 L94 90 Q50 96 6 90 Z" fill="#7cb06a" stroke={ink('#7cb06a')} strokeWidth={2.8} />
    </g>
  )
}

/** A crowd: lots and lots of people. */
function Crowd() {
  const people = [
    [20, 70, '#7cb06a', SKIN.tan], [38, 72, '#c8643c', SKIN.medium], [56, 70, '#6f9fc0', SKIN.deep], [74, 72, '#f2b33d', SKIN.light],
    [12, 86, '#9a5a8a', SKIN.light], [30, 88, '#d9a85a', SKIN.tan], [48, 86, '#4fa39a', SKIN.medium], [66, 88, '#cc4f72', SKIN.deep], [84, 86, '#8a5bb0', SKIN.tan],
  ] as const
  return (
    <g {...ROUND}>
      {people.map(([x, y, robe, skin], i) => (
        <g key={i}>
          <path d={`M${x - 11} ${y + 6} L${x - 8} ${y - 10} Q${x} ${y - 14} ${x + 8} ${y - 10} L${x + 11} ${y + 6} Z`} fill={robe} stroke={ink(robe)} strokeWidth={2.2} />
          <circle cx={x} cy={y - 18} r={7.5} fill={skin} stroke={ink(skin)} strokeWidth={2} />
          <path d={`M${x - 7} ${y - 20} Q${x} ${y - 30} ${x + 7} ${y - 20}`} fill={i % 2 ? '#4a3020' : '#2b1f18'} />
          <circle cx={x - 2.5} cy={y - 18} r={1.1} fill={EYE} /><circle cx={x + 2.5} cy={y - 18} r={1.1} fill={EYE} />
        </g>
      ))}
    </g>
  )
}

/** A chariot: a cart on two wheels that a horse pulls. */
function Chariot() {
  const body = useShade('#d9824a', 0.3, 0.2)
  const horse = useShade('#8d5a3b', 0.3, 0.15)
  return (
    <g {...ROUND}>
      <defs>{body.def}{horse.def}</defs>
      <ellipse {...groundShadow(50, 93, 44)} />
      {/* the horse, galloping ahead */}
      <path d="M58 70 L60 50 Q62 40 72 40 L86 38 Q94 38 92 46 L90 50 L84 50 L82 60 L84 72 L78 72 L76 60 L70 60 L68 72 L62 72 Z" fill={horse.fill} stroke={ink('#8d5a3b')} strokeWidth={2.6} />
      <path d="M70 40 Q72 30 80 32" stroke="#3b2a20" strokeWidth={4} fill="none" />
      <circle cx={88} cy={43} r={1.5} fill={EYE} />
      {/* the cart */}
      <path d="M12 46 L44 46 L48 68 L14 68 Z" fill={body.fill} stroke={ink('#d9824a')} strokeWidth={2.8} />
      <path d="M12 46 Q10 30 24 30 L24 46" fill={lighten('#d9824a', 0.2)} stroke={ink('#d9824a')} strokeWidth={2.6} />
      <path d="M44 56 L60 54" stroke="#5a3a24" strokeWidth={3} />
      <circle cx={30} cy={76} r={13} fill="#5a3a24" stroke={ink('#5a3a24')} strokeWidth={2.6} />
      <circle cx={30} cy={76} r={4} fill="#ffd34d" />
      {[0, 45, 90, 135].map((a) => <path key={a} d="M30 65 L30 87" stroke="#ffd34d" strokeWidth={2} transform={`rotate(${a} 30 76)`} />)}
    </g>
  )
}

/** Two masks, one smiling and one frowning: a trick. */
function Masks() {
  const gold = useShade('#ffcc4d', 0.35, 0.2)
  const plum = useShade('#8a5bb0', 0.3, 0.2)
  const mask = (x: number, y: number, fill: string, line: string, smile: boolean) => (
    <g transform={`translate(${x} ${y}) rotate(${smile ? -10 : 10})`}>
      <path d="M-22 -26 Q0 -34 22 -26 Q26 0 14 20 Q0 30 -14 20 Q-26 0 -22 -26 Z" fill={fill} stroke={line} strokeWidth={2.8} />
      <path d="M-14 -8 Q-8 -14 -2 -8 M2 -8 Q8 -14 14 -8" stroke={EYE} strokeWidth={2.6} fill="none" />
      <path d={smile ? 'M-10 8 Q0 18 10 8' : 'M-10 14 Q0 4 10 14'} stroke={EYE} strokeWidth={3} fill="none" />
    </g>
  )
  return (
    <g {...ROUND}>
      <defs>{gold.def}{plum.def}</defs>
      <ellipse {...groundShadow(50, 93, 36)} />
      {mask(36, 48, gold.fill, ink('#ffcc4d'), true)}
      {mask(66, 54, plum.fill, ink('#8a5bb0'), false)}
    </g>
  )
}

/** A princess: a girl with a crown. */
function Princess() {
  return (
    <g>
      <ellipse {...groundShadow(50, 94, 18)} />
      <Person x={50} y={95} s={0.58} look={{ skin: SKIN.medium, hair: 'long', hairColor: '#3b2a20', robe: '#c9a8ff', sash: '#ffd34d', crown: true, build: 'child' }} pose="wave" blinkDelay={0.4} />
    </g>
  )
}

/** A robber, with a mask over his eyes and a sack of what isn't his. */
function Robber() {
  return (
    <g {...ROUND}>
      <ellipse {...groundShadow(50, 94, 22)} />
      <Person x={46} y={95} s={0.7} look={{ skin: SKIN.light, hair: 'short', hairColor: '#2b1f18', robe: '#4a4a5a', sash: '#2b2140' }} pose="hold" holding="basket" blinkDelay={0.9} />
      <rect x={30} y={30} width={32} height={9} rx={3} fill="#2b2140" opacity={0.9} />
      <circle cx={38} cy={34.5} r={2.6} fill="#fff" /><circle cx={54} cy={34.5} r={2.6} fill="#fff" />
    </g>
  )
}

/** Cousins: two children holding hands. */
function Cousins() {
  return (
    <g>
      <ellipse {...groundShadow(50, 94, 34)} />
      <Person x={34} y={95} s={0.56} look={{ skin: SKIN.tan, hair: 'pigtails', hairColor: '#7a4a24', robe: '#f2b33d', sash: '#38b0a0', build: 'child', bow: '#ff6f9a' }} pose="stand" facing="right" blinkDelay={0.3} />
      <Person x={66} y={95} s={0.56} look={{ skin: SKIN.deep, hair: 'curly', hairColor: '#2b1f18', robe: '#6f9fc0', sash: '#e0b45a', build: 'child' }} pose="stand" facing="left" blinkDelay={0.8} />
      <path d="M44 64 Q50 70 56 64" stroke={ink(SKIN.tan)} strokeWidth={5} fill="none" strokeLinecap="round" />
    </g>
  )
}

/** A desert: sand dunes, a hot sun and a cactus. */
function Desert() {
  const sand = useShade('#f2cf86', 0.3, 0.15)
  return (
    <g {...ROUND}>
      <defs>{sand.def}</defs>
      <rect x={6} y={10} width={88} height={60} rx={10} fill="#bfe3ff" stroke={ink('#bfe3ff')} strokeWidth={2.4} />
      <circle cx={74} cy={28} r={11} fill="#ffd34d" stroke={ink('#ffd34d')} strokeWidth={2.4} />
      <path d="M6 70 Q26 50 48 64 Q70 48 94 66 L94 90 Q50 96 6 90 Z" fill={sand.fill} stroke={ink('#f2cf86')} strokeWidth={2.8} />
      <path d="M24 86 L24 56 Q24 50 30 50 Q36 50 36 56 L36 86 Z M16 70 L16 60 Q16 56 20 56 Q24 56 24 60 L24 70 M36 68 L36 58 Q36 54 40 54 Q44 54 44 58 L44 68" fill="#5fc46a" stroke={ink('#5fc46a')} strokeWidth={2.4} />
    </g>
  )
}

/** A soft cushion. */
function Cushion() {
  const cloth = useShade('#c9a8ff', 0.35, 0.18)
  return (
    <g {...ROUND}>
      <defs>{cloth.def}</defs>
      <ellipse {...groundShadow(50, 92, 40)} />
      <path d="M12 30 Q50 22 88 30 Q94 55 88 80 Q50 88 12 80 Q6 55 12 30 Z" fill={cloth.fill} stroke={ink('#c9a8ff')} strokeWidth={3} />
      <path d="M18 36 Q50 30 82 36 M18 74 Q50 80 82 74" stroke={lighten('#c9a8ff', 0.4)} strokeWidth={2.4} fill="none" />
      <circle cx={50} cy={55} r={4} fill={darken('#c9a8ff', 0.25)} />
      {[[12, 30], [88, 30], [12, 80], [88, 80]].map(([x, y]) => <circle key={x + y} cx={x} cy={y} r={4} fill={lighten('#c9a8ff', 0.2)} stroke={ink('#c9a8ff')} strokeWidth={2} />)}
    </g>
  )
}

/** Neighbors: two houses side by side, with a path between. */
function Neighbors() {
  const house = (x: number, wall: string, roof: string) => (
    <g transform={`translate(${x} 0)`}>
      <path d="M-20 56 L-20 88 L20 88 L20 56 Z" fill={wall} stroke={ink(wall)} strokeWidth={2.6} />
      <path d="M-26 58 L0 34 L26 58 Z" fill={roof} stroke={ink(roof)} strokeWidth={2.6} />
      <path d="M-6 88 L-6 70 Q0 64 6 70 L6 88 Z" fill="#7a5233" stroke={ink('#7a5233')} strokeWidth={2} />
      <rect x={9} y={64} width={9} height={9} rx={2} fill="#bfe3ff" stroke={ink(wall)} strokeWidth={1.8} />
    </g>
  )
  return (
    <g {...ROUND}>
      <ellipse {...groundShadow(50, 93, 44)} />
      {house(26, '#f0d3a0', '#d9824a')}
      {house(74, '#bcd4f0', '#7a3040')}
      <path d="M26 88 Q50 80 74 88" stroke="#e8c86a" strokeWidth={5} fill="none" />
      <path d="M50 14 C46 8 40 10 42 16 C44 20 50 24 50 24 C50 24 56 20 58 16 C60 10 54 8 50 14 Z" fill="#ff5c8a" stroke={ink('#ff5c8a')} strokeWidth={1.8} />
    </g>
  )
}

/** A warm scarf. */
function Scarf() {
  const wool = useShade('#e2468f', 0.3, 0.2)
  return (
    <g {...ROUND}>
      <defs>{wool.def}</defs>
      <ellipse {...groundShadow(50, 93, 36)} />
      <path d="M16 30 Q50 14 84 30 Q86 42 84 50 Q50 62 16 50 Q14 42 16 30 Z" fill={wool.fill} stroke={ink('#e2468f')} strokeWidth={3} />
      <path d="M36 50 L30 86 L46 86 L52 52 Z" fill={wool.fill} stroke={ink('#e2468f')} strokeWidth={3} />
      <path d="M31 80 L30 86 M36 80 L36 86 M41 80 L42 86" stroke={ink('#e2468f')} strokeWidth={2.4} />
      <path d="M20 40 Q50 52 80 40" stroke={lighten('#e2468f', 0.45)} strokeWidth={3} fill="none" />
      <path d="M38 62 L48 62 M36 72 L47 72" stroke={lighten('#e2468f', 0.45)} strokeWidth={3} />
    </g>
  )
}

/** A bandage, on a scrape. */
function Bandage() {
  const tan = useShade('#f3c9a8', 0.3, 0.15)
  return (
    <g {...ROUND} transform="rotate(-30 50 50)">
      <defs>{tan.def}</defs>
      <ellipse {...groundShadow(50, 93, 36)} />
      <rect x={8} y={36} width={84} height={28} rx={14} fill={tan.fill} stroke={ink('#f3c9a8')} strokeWidth={3} />
      <rect x={34} y={40} width={32} height={20} rx={5} fill="#fff" stroke={ink('#f3c9a8')} strokeWidth={2.2} />
      {[[18, 44], [24, 50], [18, 56], [76, 44], [82, 50], [76, 56]].map(([x, y]) => <circle key={x + y} cx={x} cy={y} r={1.8} fill={darken('#f3c9a8', 0.3)} />)}
      <path d="M50 44 L50 56 M44 50 L56 50" stroke="#ff5c8a" strokeWidth={3.2} />
    </g>
  )
}

/** A shield: safe. */
function Shield() {
  const metal = useShade('#5fb7ff', 0.35, 0.2)
  return (
    <g {...ROUND}>
      <defs>{metal.def}</defs>
      <ellipse {...groundShadow(50, 93, 30)} />
      <path d="M50 10 Q74 20 86 18 Q88 60 50 90 Q12 60 14 18 Q26 20 50 10 Z" fill={metal.fill} stroke={ink('#5fb7ff')} strokeWidth={3.2} />
      <path d="M50 22 Q68 30 76 28 Q76 56 50 78 Q24 56 24 28 Q32 30 50 22 Z" fill="none" stroke={lighten('#5fb7ff', 0.5)} strokeWidth={3} />
      <path d="M50 36 L50 66 M38 50 L62 50" stroke="#ffd34d" strokeWidth={6} />
      <Shine x={36} y={30} rx={6} ry={3} rot={-30} />
    </g>
  )
}

/** A blob of paint in one color (green, orange, purple…). */
function Blob({ color }: { color: string }) {
  const paint = useShade(color, 0.3, 0.2)
  return (
    <g {...ROUND}>
      <defs>{paint.def}</defs>
      <ellipse {...groundShadow(50, 93, 32)} />
      <path d="M50 16 C66 12 84 24 84 44 C84 58 92 64 84 74 C74 86 60 82 50 86 C40 82 26 86 18 74 C10 64 18 56 16 42 C14 24 34 12 50 16 Z" fill={paint.fill} stroke={ink(color)} strokeWidth={3} />
      <Shine x={36} y={32} rx={9} ry={4.5} rot={-25} />
    </g>
  )
}

/** Rain falling from a cloud. */
function Rain() {
  const puff = useShade('#ffffff', 0.1, 0.1)
  return (
    <g {...ROUND}>
      <defs>{puff.def}</defs>
      <ellipse cx={50} cy={40} rx={34} ry={16} fill={puff.fill} stroke="#9fb4c8" strokeWidth={2.8} />
      <circle cx={34} cy={32} r={14} fill={puff.fill} stroke="#9fb4c8" strokeWidth={2.8} />
      <circle cx={58} cy={26} r={17} fill={puff.fill} stroke="#9fb4c8" strokeWidth={2.8} />
      <ellipse cx={50} cy={42} rx={33} ry={14} fill="#fff" />
      <circle cx={34} cy={33} r={13} fill="#fff" /><circle cx={58} cy={27} r={16} fill="#fff" />
      {[[22, 62], [38, 70], [54, 62], [70, 70], [30, 84], [62, 86]].map(([x, y]) => (
        <path key={x + y} d={`M${x} ${y - 8} Q${x + 5} ${y} ${x} ${y + 6} Q${x - 5} ${y} ${x} ${y - 8} Z`} fill="#8fd1ff" stroke={ink('#8fd1ff')} strokeWidth={1.8} />
      ))}
    </g>
  )
}

/** A snowflake. */
function Snowflake() {
  return (
    <g {...ROUND}>
      {[0, 60, 120].map((a) => (
        <g key={a} transform={`rotate(${a} 50 50)`}>
          <path d="M50 12 L50 88" stroke="#7fb8ff" strokeWidth={4.5} />
          <path d="M50 22 L42 14 M50 22 L58 14 M50 78 L42 86 M50 78 L58 86 M50 36 L41 30 M50 36 L59 30 M50 64 L41 70 M50 64 L59 70" stroke="#7fb8ff" strokeWidth={3.5} />
        </g>
      ))}
      <circle cx={50} cy={50} r={6} fill="#fff" stroke="#7fb8ff" strokeWidth={3} />
    </g>
  )
}

/** A checkered flag: the finish of a race. */
function Flag() {
  return (
    <g {...ROUND}>
      <ellipse {...groundShadow(50, 93, 22)} />
      <path d="M26 92 L26 12" stroke="#7a5233" strokeWidth={5} />
      <path d="M28 14 Q50 6 72 14 Q84 18 84 30 L84 52 Q72 46 50 52 Q36 56 28 52 Z" fill="#fff" stroke={EYE} strokeWidth={2.8} />
      {[[30, 16], [48, 14], [66, 16], [39, 28], [57, 26], [75, 30], [30, 40], [48, 38], [66, 40]].map(([x, y]) => <rect key={x + y} x={x} y={y} width={9} height={11} fill={EYE} />)}
      <circle cx={26} cy={10} r={4} fill="#ffd34d" stroke={ink('#ffd34d')} strokeWidth={2} />
    </g>
  )
}

/** A strong arm, flexing. */
function StrongArm() {
  const skin = useShade('#f3c9a8', 0.3, 0.15)
  return (
    <g {...ROUND}>
      <defs>{skin.def}</defs>
      <ellipse {...groundShadow(50, 93, 36)} />
      {/* the upper arm along the bottom, the forearm up, a fist on top, and the muscle bulging */}
      <path d="M14 78 L54 78 L54 36" stroke={ink('#f3c9a8')} strokeWidth={30} fill="none" />
      <path d="M14 78 L54 78 L54 36" stroke={skin.fill} strokeWidth={24} fill="none" />
      <ellipse cx={34} cy={60} rx={17} ry={14} fill={skin.fill} stroke={ink('#f3c9a8')} strokeWidth={2.6} />
      <path d="M22 56 Q34 44 46 56" stroke={lighten('#f3c9a8', 0.5)} strokeWidth={3} fill="none" />
      <circle cx={54} cy={28} r={14} fill={skin.fill} stroke={ink('#f3c9a8')} strokeWidth={2.8} />
      <path d="M44 24 L64 24 M44 31 L64 31" stroke={ink('#f3c9a8')} strokeWidth={2} opacity={0.6} />
      <path d="M74 20 L82 12 M78 30 L90 28 M68 12 L70 2" stroke="#ffd34d" strokeWidth={3.6} />
    </g>
  )
}

/** A wrapped candy. */
function Candy() {
  const sweet = useShade('#ff6f9a', 0.35, 0.2)
  return (
    <g {...ROUND} transform="rotate(-15 50 50)">
      <defs>{sweet.def}</defs>
      <ellipse {...groundShadow(50, 93, 32)} />
      <path d="M28 50 L10 36 Q16 50 10 64 Z M72 50 L90 36 Q84 50 90 64 Z" fill={lighten('#ff6f9a', 0.3)} stroke={ink('#ff6f9a')} strokeWidth={2.6} />
      <ellipse cx={50} cy={50} rx={24} ry={18} fill={sweet.fill} stroke={ink('#ff6f9a')} strokeWidth={3} />
      <path d="M36 38 Q50 50 36 62 M50 34 Q64 50 50 66 M64 38 Q72 50 64 62" stroke="#fff" strokeWidth={3} fill="none" opacity={0.85} />
      <Shine x={40} y={42} rx={5} ry={2.5} rot={-20} />
    </g>
  )
}

/** A trophy: a prize. */
function Trophy() {
  const gold = useShade('#ffcc4d', 0.4, 0.2)
  const line = ink('#ffcc4d')
  return (
    <g {...ROUND}>
      <defs>{gold.def}</defs>
      <ellipse {...groundShadow(50, 93, 26)} />
      <path d="M30 18 L70 18 L66 50 Q50 66 34 50 Z" fill={gold.fill} stroke={line} strokeWidth={3} />
      <path d="M30 24 Q12 26 18 40 Q22 48 34 46 M70 24 Q88 26 82 40 Q78 48 66 46" stroke={line} strokeWidth={3.5} fill="none" />
      <path d="M46 60 L54 60 L56 74 L44 74 Z" fill={darken('#ffcc4d', 0.1)} stroke={line} strokeWidth={2.4} />
      <rect x={32} y={74} width={36} height={12} rx={4} fill="#a0703f" stroke={ink('#a0703f')} strokeWidth={2.4} />
      <path d="M50 26 L53 33 L60 33 L54 38 L56 45 L50 41 L44 45 L46 38 L40 33 L47 33 Z" fill="#fff8d0" stroke={line} strokeWidth={1.6} />
      <Shine x={40} y={26} rx={5} ry={2.5} rot={-20} />
    </g>
  )
}

/** A robot. */
function Robot() {
  const metal = useShade('#9fb4c8', 0.35, 0.2)
  const line = ink('#9fb4c8')
  return (
    <g {...ROUND}>
      <defs>{metal.def}</defs>
      <ellipse {...groundShadow(50, 93, 30)} />
      <path d="M50 10 L50 20" stroke={line} strokeWidth={3} /><circle cx={50} cy={9} r={4} fill="#ff5c8a" stroke={line} strokeWidth={2} />
      <rect x={30} y={20} width={40} height={30} rx={8} fill={metal.fill} stroke={line} strokeWidth={3} />
      <rect x={36} y={28} width={10} height={10} rx={3} fill="#2b2140" /><rect x={54} y={28} width={10} height={10} rx={3} fill="#2b2140" />
      <circle cx={41} cy={33} r={2.2} fill="#7fffd4" /><circle cx={59} cy={33} r={2.2} fill="#7fffd4" />
      <path d="M40 44 L60 44" stroke={line} strokeWidth={2.6} />
      <rect x={26} y={52} width={48} height={32} rx={8} fill={metal.fill} stroke={line} strokeWidth={3} />
      <rect x={14} y={56} width={10} height={22} rx={5} fill={metal.fill} stroke={line} strokeWidth={2.6} />
      <rect x={76} y={56} width={10} height={22} rx={5} fill={metal.fill} stroke={line} strokeWidth={2.6} />
      <circle cx={42} cy={66} r={4} fill="#ffd34d" /><circle cx={58} cy={66} r={4} fill="#5fb7ff" /><rect x={38} y={74} width={24} height={5} rx={2} fill={darken('#9fb4c8', 0.3)} />
      <rect x={32} y={84} width={12} height={8} rx={3} fill={darken('#9fb4c8', 0.2)} stroke={line} strokeWidth={2.2} /><rect x={56} y={84} width={12} height={8} rx={3} fill={darken('#9fb4c8', 0.2)} stroke={line} strokeWidth={2.2} />
    </g>
  )
}

/** A sword (a toy one, no sharp edges). */
function Sword() {
  const blade = useShade('#dfe6ef', 0.3, 0.25)
  return (
    <g {...ROUND} transform="rotate(40 50 50)">
      <defs>{blade.def}</defs>
      <path d="M44 8 L56 8 L54 58 L46 58 Z" fill={blade.fill} stroke={ink('#dfe6ef')} strokeWidth={2.8} />
      <path d="M50 8 L50 56" stroke={lighten('#dfe6ef', 0.5)} strokeWidth={2} />
      <rect x={32} y={56} width={36} height={8} rx={4} fill="#ffcc4d" stroke={ink('#ffcc4d')} strokeWidth={2.4} />
      <rect x={45} y={64} width={10} height={22} rx={4} fill="#a0703f" stroke={ink('#a0703f')} strokeWidth={2.4} />
      <circle cx={50} cy={90} r={5} fill="#ffcc4d" stroke={ink('#ffcc4d')} strokeWidth={2.2} />
    </g>
  )
}

/** A snail, taking its time. */
function Snail() {
  const shell = useShade('#f2b33d', 0.35, 0.2)
  const body = useShade('#8fd1a0', 0.3, 0.15)
  return (
    <g {...ROUND}>
      <defs>{shell.def}{body.def}</defs>
      <ellipse {...groundShadow(50, 93, 40)} />
      <path d="M14 84 Q10 70 24 68 L74 68 Q92 68 90 80 Q86 88 70 88 L20 88 Q12 88 14 84 Z" fill={body.fill} stroke={ink('#8fd1a0')} strokeWidth={2.8} />
      <path d="M74 70 Q82 60 80 44 Q78 30 84 24" stroke={ink('#8fd1a0')} strokeWidth={2.6} fill="none" />
      <path d="M78 70 L80 54 Q82 46 86 42" fill={body.fill} stroke={ink('#8fd1a0')} strokeWidth={2.6} />
      <path d="M84 42 L80 30 M86 44 L92 34" stroke={ink('#8fd1a0')} strokeWidth={3} />
      <circle cx={80} cy={29} r={3.5} fill={EYE} /><circle cx={92} cy={33} r={3.5} fill={EYE} />
      <circle cx={46} cy={56} r={22} fill={shell.fill} stroke={ink('#f2b33d')} strokeWidth={3} />
      <path d="M46 56 m0 -14 a14 14 0 1 1 -14 14 a9 9 0 1 1 9 -9 a4 4 0 1 1 -4 4" stroke={ink('#f2b33d')} strokeWidth={2.6} fill="none" />
      <Shine x={38} y={44} rx={5} ry={2.5} rot={-25} />
    </g>
  )
}

export const LEARN_THINGS: Item[] = [
  { id: 'ear', name: 'an ear', emoji: ['👂'], Draw: Ear },
  { id: 'eyes', name: 'eyes', emoji: ['👀'], Draw: Eyes },
  { id: 'nose', name: 'a nose', emoji: ['👃'], Draw: Nose },
  { id: 'voice', name: 'a voice', emoji: ['🗣️', '🗣'], Draw: Voice },
  { id: 'hug', name: 'a hug', emoji: ['🤗'], Draw: Hug },
  { id: 'trumpet', name: 'trumpet', emoji: ['🎺'], Draw: Trumpet },
  { id: 'drum', name: 'drum', emoji: ['🥁'], Draw: Drum },
  { id: 'sunrise', name: 'sunrise', emoji: ['🌅', '🌄'], Draw: Sunrise },
  { id: 'crowd', name: 'a crowd', emoji: ['👥'], Draw: Crowd },
  { id: 'chariot', name: 'chariot', emoji: ['🐎'], Draw: Chariot },
  { id: 'masks', name: 'two masks', emoji: ['🎭'], Draw: Masks },
  { id: 'princess', name: 'princess', emoji: ['👸'], Draw: Princess },
  { id: 'robber', name: 'robber', emoji: ['🦹'], Draw: Robber },
  { id: 'cousins', name: 'cousins', emoji: ['👫'], Draw: Cousins },
  { id: 'desert', name: 'desert', emoji: ['🏜️', '🏜'], Draw: Desert },
  { id: 'cushion', name: 'cushion', emoji: ['🛋️', '🛋'], Draw: Cushion },
  { id: 'neighbors', name: 'neighbors', emoji: ['🏘️', '🏘'], Draw: Neighbors },
  { id: 'scarf', name: 'scarf', emoji: ['🧣'], Draw: Scarf },
  { id: 'bandage', name: 'bandage', emoji: ['🩹'], Draw: Bandage },
  { id: 'shield', name: 'shield', emoji: ['🛡️', '🛡'], Draw: Shield },
  { id: 'paint-green', name: 'green', emoji: ['🟢'], Draw: () => <Blob color="#5fc46a" /> },
  { id: 'paint-orange', name: 'orange', emoji: ['🟠'], Draw: () => <Blob color="#ff9a3c" /> },
  { id: 'paint-purple', name: 'purple', emoji: ['🟣'], Draw: () => <Blob color="#9a5bd0" /> },
  { id: 'rain', name: 'rain', emoji: ['🌧️', '🌧', '☔'], Draw: Rain },
  { id: 'snowflake', name: 'snowflake', emoji: ['❄️', '❄', '🧊'], Draw: Snowflake },
  { id: 'flag', name: 'the finish flag', emoji: ['🏁'], Draw: Flag },
  { id: 'strong-arm', name: 'a strong arm', emoji: ['💪'], Draw: StrongArm },
  { id: 'candy', name: 'candy', emoji: ['🍬'], Draw: Candy },
  { id: 'trophy', name: 'trophy', emoji: ['🏆'], Draw: Trophy },
  { id: 'robot', name: 'robot', emoji: ['🤖'], Draw: Robot },
  { id: 'sword', name: 'sword', emoji: ['🗡️', '🗡', '⚔️'], Draw: Sword },
  { id: 'snail', name: 'snail', emoji: ['🐌'], Draw: Snail },
]
// (PEOPLE is here for the looks above to borrow from; the princess and cousins have looks of their own)
void PEOPLE
