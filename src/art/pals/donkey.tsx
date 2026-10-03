// Basket → Trotter → Gentlehoof: a gentle donkey facing you, with long twitchy ears and a big soft muzzle.
// Basket carries one basket of bread; Trotter wears a fringed green saddle blanket with two baskets and a
// taller forelock; Gentlehoof's baskets have fish poking out, and he wears a crown. The baskets hang from
// straps that run up over the donkey's back (without them they seemed to float beside it).
import { type BodyProps, Anim, Crown, CuteFace, ink, Shine, useShade } from '../kit'

const FUR = '#b9accb'
const MUZZLE = '#f1e9f7'
const EAR_IN = '#ffb8d2'
const MANE = '#7e6f98'
const HOOF = '#6d5f84'
const BLANKET = '#5fd39a' // Kindness green
const WICKER = '#d9a05b'
const BREAD = '#f0bb6e'
const FISH = '#7cc6ff'
const STRAP = '#a8703a'

// Forelock between the ears, falling over the forehead in soft points: small, then taller and spikier.
const TUFT = [
  'M85 62 C82 54 86 47 92 49 C91 41 99 38 101 45 C104 39 112 42 109 49 C115 48 118 55 115 62 Q111 58 108 65 Q104 58 100 66 Q96 58 92 65 Q89 58 85 62 Z',
  'M82 64 C76 52 82 40 90 42 C90 32 100 30 102 38 C106 30 118 34 114 44 C122 46 122 58 118 64 Q113 59 110 67 Q105 59 100 68 Q95 59 90 67 Q87 59 82 64 Z',
]

interface Fills { wicker: string; bread: string; fish: string }

/** A woven basket of bread loaves (with a fish poking out for Gentlehoof). (x, y) is the middle of the rim. */
function Basket({ x, y, f, fish, flip }: { x: number; y: number; f: Fills; fish?: boolean; flip?: boolean }) {
  return (
    <g transform={`translate(${x} ${y})${flip ? ' scale(-1 1)' : ''}`}>
      {fish && (
        <g>
          <path d="M5 -8 C2 -16 4 -26 10 -30 C16 -26 18 -16 15 -8 Z" fill={f.fish} stroke={ink(FISH)} strokeWidth={2} strokeLinejoin="round" />
          <path d="M10 -29 L3 -39 Q10 -36 17 -39 Z" fill={f.fish} stroke={ink(FISH)} strokeWidth={2} strokeLinejoin="round" />
          <circle cx={10} cy={-13} r={1.6} fill="#2b2140" />
        </g>
      )}
      <ellipse cx={-8} cy={-6} rx={11} ry={8} fill={f.bread} stroke={ink(BREAD)} strokeWidth={2} transform="rotate(-14 -8 -6)" />
      {!fish && <ellipse cx={8} cy={-7} rx={10} ry={8} fill={f.bread} stroke={ink(BREAD)} strokeWidth={2} transform="rotate(14 8 -7)" />}
      <path d={`M-13 -9 L-9 -4 M-7 -11 L-3 -6${fish ? '' : ' M6 -12 L4 -7 M12 -10 L10 -5'}`} stroke={ink(BREAD)} strokeWidth={1.8} strokeLinecap="round" />
      <path d="M-21 0 H21 L17 21 Q0 27 -17 21 Z" fill={f.wicker} stroke={ink(WICKER)} strokeWidth={2.5} strokeLinejoin="round" />
      <path d="M-19 8 H19 M-17.5 15 H17.5 M-8 2 V23 M8 2 V23" stroke={ink(WICKER)} strokeWidth={1.8} strokeLinecap="round" opacity={0.7} />
      <rect x={-23} y={-5} width={46} height={8} rx={4} fill={f.wicker} stroke={ink(WICKER)} strokeWidth={2.5} />
    </g>
  )
}

export default function Donkey({ stage, mood }: BodyProps) {
  const fur = useShade(FUR, 0.4, 0.15)
  const muzzle = useShade(MUZZLE, 0.4, 0.07)
  const blanket = useShade(BLANKET, 0.35, 0.15)
  const wicker = useShade(WICKER, 0.35, 0.15)
  const bread = useShade(BREAD, 0.45, 0.12)
  const fish = useShade(FISH, 0.4, 0.12)
  const f: Fills = { wicker: wicker.fill, bread: bread.fill, fish: fish.fill }
  const line = ink(FUR)
  const L = stage >= 1 ? 52 : 44 // ear length
  return (
    <g>
      <defs>{fur.def}{muzzle.def}{blanket.def}{wicker.def}{bread.def}{fish.def}</defs>

      {/* Long ears that twitch */}
      {[-1, 1].map((side) => (
        <Anim key={side} cls="pa-ear" delay={side > 0 ? 0.5 : 0}>
          <g transform={`translate(${100 + side * 17} 62) rotate(${side * 20})`}>
            <path d={`M-10 2 C-15 -18 -11 ${-L * 0.8} 0 ${-L} C11 ${-L * 0.8} 15 -18 10 2 Z`} fill={fur.fill} stroke={line} strokeWidth={3} strokeLinejoin="round" />
            <path d={`M-5 -4 C-8 -16 -6 ${-L * 0.7} 0 ${-L + 9} C6 ${-L * 0.7} 8 -16 5 -4 Z`} fill={EAR_IN} />
          </g>
        </Anim>
      ))}

      {/* Legs and hooves */}
      {[85, 115].map((x) => (
        <g key={x}>
          <rect x={x - 7} y={148} width={14} height={28} rx={6} fill={fur.fill} stroke={line} strokeWidth={3} />
          <rect x={x - 8} y={168} width={16} height={10} rx={4} fill={HOOF} stroke={ink(HOOF)} strokeWidth={2.5} />
        </g>
      ))}

      {/* Body, tummy and (stage 1+) a green saddle blanket */}
      <g className="pa-breathe">
        <ellipse cx={100} cy={144} rx={40} ry={27} fill={fur.fill} stroke={line} strokeWidth={3} />
        <ellipse cx={100} cy={154} rx={22} ry={11} fill={MUZZLE} opacity={0.85} />
        {stage >= 1 && (
          <>
            <path d="M60 140 C60 124 80 117 100 117 C120 117 140 124 140 140 L138 152 Q120 145 100 147 Q80 145 62 152 Z" fill={blanket.fill} stroke={ink(BLANKET)} strokeWidth={2.5} strokeLinejoin="round" />
            {[70, 130].map((x) => <circle key={x} cx={x} cy={147} r={3} fill="#ffd34d" stroke="#e0a800" strokeWidth={1.2} />)}
            {/* A fringe along the hem, so it reads as a blanket rather than a shirt */}
            <path d="M82 147 V153 M88 147 V153.5 M94 147 V154 M100 147 V154 M106 147 V154 M112 147 V153.5 M118 147 V153" stroke={ink(BLANKET)} strokeWidth={2.5} strokeLinecap="round" />
          </>
        )}
      </g>

      {/* Straps up over the back that the baskets hang from (the basket rims hide their lower ends) */}
      {(stage >= 1 ? [-1, 1] : [1]).map((side) => {
        const d = stage >= 1 ? 'M130 145 Q128 130 122 118' : 'M128 144 Q125 129 119 120'
        return (
          <g key={side} transform={side < 0 ? 'translate(200 0) scale(-1 1)' : undefined} fill="none" strokeLinecap="round">
            <path d={d} stroke={ink(STRAP)} strokeWidth={7} />
            <path d={d} stroke={STRAP} strokeWidth={4} />
          </g>
        )
      })}

      {/* Bread baskets: one at first, then one each side */}
      {stage >= 1 && <Basket x={52} y={146} f={f} fish={stage >= 2} flip />}
      <Basket x={stage >= 1 ? 148 : 146} y={146} f={f} fish={stage >= 2} />

      {/* Head, forelock and big soft muzzle */}
      <ellipse cx={100} cy={82} rx={31} ry={29} fill={fur.fill} stroke={line} strokeWidth={3} />
      <Shine x={86} y={64} rx={9} ry={5} />
      <path d={TUFT[stage >= 1 ? 1 : 0]} fill={MANE} stroke={ink(MANE)} strokeWidth={2.5} strokeLinejoin="round" />
      <ellipse cx={100} cy={107} rx={25} ry={17} fill={muzzle.fill} stroke={ink(MUZZLE)} strokeWidth={2.5} />
      <ellipse cx={91} cy={104} rx={2.6} ry={3.6} fill="#8b7da3" transform="rotate(-15 91 104)" />
      <ellipse cx={109} cy={104} rx={2.6} ry={3.6} fill="#8b7da3" transform="rotate(15 109 104)" />
      <path d={mood === 'grumpy' ? 'M92 117 Q100 112 108 117' : 'M92 112 Q100 119 108 112'} stroke="#6d5f84" strokeWidth={2.4} fill="none" strokeLinecap="round" />
      <CuteFace x={100} y={80} s={0.8} gap={15} mood={mood} mouth={false} blinkDelay={1.4} />

      {stage >= 2 && <Crown x={100} y={54} />}
    </g>
  )
}
