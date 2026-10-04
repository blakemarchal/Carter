// Drawn things first needed by the Boy Jesus at the Temple island (its activities and pictures). Same style and
// rules as the other item files: one 100 x 100 drawing each (see ./farm.tsx), and an emoji only when the
// drawing is what that emoji means. Every item can be used anywhere once it's here.
//
// "Jesus Grew Up": the same Jesus at four ages, each standing on the same ground in its box, so they can be put in
// order by size: baby Jesus in the manger, little Jesus, Jesus at twelve (as on the island), and Jesus grown up
// (PEOPLE.jesus). They're asked for by id (no emoji: 👶 stays a plain baby everywhere).
import type { Item } from './types'
import { groundShadow, ink, useShade } from './draw'
import { Baby, Figure, Person, PEOPLE, type Look } from '../people'

/** Jesus as a boy (as on the Boy Jesus at the Temple island): the grown-up Jesus' skin, long hair and robe, and no beard. */
const BOY: Look = { ...PEOPLE.jesus, beard: undefined, build: 'child' }
/** Jesus as a little boy, about four: the same, with his hair short. */
const LITTLE: Look = { ...BOY, hair: 'short' }

/** Baby Jesus asleep on the hay in a low wooden manger. */
function JesusBaby() {
  const wood = useShade('#a0703f', 0.28, 0.2)
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      <defs>{wood.def}</defs>
      <ellipse {...groundShadow(50, 94, 34)} />
      {/* the crossed legs */}
      <path d="M26 94 L40 76 M40 94 L26 76 M74 94 L60 76 M60 94 L74 76" stroke="#7a5233" strokeWidth={4.5} />
      <Baby x={50} y={60} s={0.76} />
      {/* the trough, with hay spilling over its edge */}
      <path d="M16 72 L84 72 L76 86 L24 86 Z" fill={wood.fill} stroke={ink('#a0703f')} strokeWidth={2.6} />
      <path d="M21 79 L79 79" stroke="#7a5233" strokeWidth={1.6} opacity={0.6} />
      <path d="M18 72 q5 -6 10 0 q5 -7 10 0 q5 -6 10 0 q5 -7 10 0 q5 -6 10 0 q5 -7 10 0 q4 -5 8 0" stroke="#e8c86a" strokeWidth={4} fill="none" />
    </g>
  )
}

function JesusLittle() {
  return (
    <g>
      <ellipse {...groundShadow(50, 94, 18)} />
      <Person x={50} y={95} s={0.56} look={LITTLE} pose="wave" blinkDelay={0.6} />
    </g>
  )
}

function JesusTwelve() {
  return (
    <g>
      <ellipse {...groundShadow(50, 94, 22)} />
      <Person x={50} y={95} s={0.72} look={BOY} holding="scroll" blinkDelay={1.1} />
    </g>
  )
}

function JesusGrown() {
  return (
    <g>
      <ellipse {...groundShadow(50, 94, 26)} />
      <Figure x={50} y={95} s={0.62} look={PEOPLE.jesus} pose="open" blinkDelay={0.3} />
    </g>
  )
}

export const ISL_BOY_JESUS: Item[] = [
  { id: 'jesus-baby', name: 'baby Jesus', emoji: [], Draw: JesusBaby },
  { id: 'jesus-little', name: 'little Jesus', emoji: [], Draw: JesusLittle },
  { id: 'jesus-twelve', name: 'Jesus at twelve', emoji: [], Draw: JesusTwelve },
  { id: 'jesus-grown', name: 'Jesus all grown up', emoji: [], Draw: JesusGrown },
]
