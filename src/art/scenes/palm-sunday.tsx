// Palm Sunday (Matthew 21:1–17, Luke 19:28–40, John 12:12–16): one picture per story page, both parts in order (see
// data/palm-sunday.ts for the words). Part one (pages 1 to 5): Jesus and His friends on the road to Jerusalem for the
// Passover; Jesus sends Peter and John to the village for a young donkey; they find it, just as He said, and its owners
// let them take it; the friends' coats on its back, and Jesus sitting on them; and the ride down the hill toward the
// city, with people running to see Him. Part two (pages 6 to 11): coats and palm branches spread on the road; the big,
// happy crowd shouting "Hosanna!"; the grumpy leaders, and the stones that would shout; the children singing in God's
// house; a gentle King on a little donkey, not a big horse; and Jesus, our King, with the child playing (usePlayer).
//
// Jesus is PEOPLE.jesus, and His friends are PEOPLE.peter, andrew, james and john (Peter and John are the two He sends,
// as they are again in Luke 22:8). The grumpy leaders are cross, never frightening: arms folded and frowns, no more. The
// overturned tables are left out. God is never drawn as a person: His presence is light (Glow, Rays, Sparkles).
//
// Shared with the island's mini-game (art/games/palm-sunday.tsx), and for other islands (they can move to kit.tsx and
// people.tsx): the looks (OWNER, OWNER_WIFE, LEADERS, CHILDREN, TOWNSFOLK, KING), the friends' coats (COATS) and
// JesusOnDonkey, people waving palm branches (HeldPalm, PalmFolk, PalmWaver, Crowd), CoatOnRoad, BranchOnRoad,
// StonePile, OliveTree, Home and Post. PalmFolk is the kit's Folk with a palm branch. The young donkey (with the friends'
// coats in place of its saddle blanket, and legs that step), Jerusalem, God's house (Temple, Colonnade, Paving) and the
// CityWall are the kit's (scenes/kit.tsx), shared with the Baby Jesus, Boy Jesus and Good Samaritan islands. The palm
// branches, the stones and the king's big horse are drawn in art/items/isl-palm-sunday.tsx.
import type { ComponentType, ReactNode } from 'react'
import { darken, ink, useShade } from '../kit'
import { Figure, Person, PEOPLE, SKIN, type JLook, type JPose, type Look, type Mood } from '../people'
import {
  Birds, CityWall, Cloud, Colonnade, Donkey, DONKEY_RIDER, Dove, Dream, Emoji, Glow, Heart, Jerusalem, MudHouse, MusicNote, Palm, Paving, Rays,
  Scene, Sparkles, Sun, Tap, Temple,
} from './kit'
import { usePlayer } from './player'
import { BigHorse, PalmFrond } from '../items/isl-palm-sunday'
import './palm-sunday.css'

type Pt = [number, number]
const f1 = (n: number) => n.toFixed(1)

// ---------- The people ----------

/** The young donkey's owner, in the village: a saffron head cloth, a short dark beard and a sage-green robe. */
export const OWNER: JLook = { skin: SKIN.tan, hair: 'covered', hairColor: '#3b2a20', wrap: '#e0a84a', beard: 'short', beardColor: '#3b2a20', robe: '#7f9a7a', sash: '#f0d38a' }
/** His wife: a coral head scarf and a plum robe. */
export const OWNER_WIFE: JLook = { skin: SKIN.tan, hair: 'covered', hairColor: '#3b2a20', wrap: '#ef8a6a', robe: '#9a6a9a', sash: '#f5f0e6' }
/** The grumpy leaders (Luke 19:39): long beards, fine head cloths, and rich robes with gold sashes. */
export const LEADERS: JLook[] = [
  { skin: SKIN.medium, hair: 'covered', hairColor: '#8a8078', wrap: '#f4efe4', beard: 'long', beardColor: '#a39a90', robe: '#4a5fa0', sash: '#e8c25a' },
  { skin: SKIN.tan, hair: 'covered', hairColor: '#2b1f18', wrap: '#e8d9b8', beard: 'long', beardColor: '#2b1f18', robe: '#6f4f8f', sash: '#f0d38a' },
  { skin: '#e3b48c', hair: 'covered', hairColor: '#ece8e0', wrap: '#fbf8f1', beard: 'long', beardColor: '#f4f1ea', robe: '#2f7a80', sash: '#e8c25a' },
]
/** Children of Jerusalem: they wave palm branches on the road, and sing "Hosanna!" in God's house (Matthew 21:15). */
export const CHILDREN: JLook[] = [
  { skin: SKIN.tan, hair: 'pigtails', hairColor: '#2b1f18', robe: '#ff9f6a', sash: '#ffffff', bow: '#ff6f91', build: 'child' },
  { skin: SKIN.deep, hair: 'curly', hairColor: '#241a16', robe: '#5fb7e8', sash: '#f2c24a', build: 'child' },
  { skin: SKIN.medium, hair: 'long', hairColor: '#4a3020', robe: '#c9a8ff', sash: '#ffffff', bow: '#ffd34d', build: 'child' },
  { skin: '#e3b48c', hair: 'short', hairColor: '#5a3a24', robe: '#7cc46a', sash: '#ffffff', build: 'child' },
  { skin: SKIN.tan, hair: 'ponytail', hairColor: '#3b2a20', robe: '#ffd34d', sash: '#ff8cc0', build: 'child' },
]
/** Grown-ups in the crowd, up close: people of Jerusalem and travelers come for the feast. */
export const TOWNSFOLK: JLook[] = [
  { skin: '#e3b48c', hair: 'covered', hairColor: '#4a3020', wrap: '#e8668a', robe: '#6f9fc0', sash: '#f5f0e6' },
  { skin: SKIN.deep, hair: 'short', hairColor: '#2b1f18', beard: 'short', beardColor: '#2b1f18', robe: '#d98b4a', sash: '#5f8fc0' },
  { skin: SKIN.medium, hair: 'covered', hairColor: '#3b2a20', wrap: '#9fd6b0', robe: '#b07a9a', sash: '#f5f0e6' },
  { skin: SKIN.tan, hair: 'covered', hairColor: '#2b1f18', wrap: '#f0e4c4', beard: 'short', beardColor: '#2b1f18', robe: '#8f9a4a', sash: '#c0504d' },
  { skin: SKIN.light, hair: 'covered', hairColor: '#5a3a24', wrap: '#ffd27a', robe: '#e07a5f', sash: '#f5f0e6' },
]
/** A king of long ago, as a child might picture one (page ten): a crown, a short beard and a royal purple robe. */
export const KING: Look = { skin: SKIN.light, hair: 'short', hairColor: '#5a3a24', beard: 'short', beardColor: '#5a3a24', robe: '#7a4aa8', sash: '#ffd34d', crown: true }

// ---------- The young donkey (the kit's Donkey) ----------
// Nobody has ridden it yet, so it has no saddle blanket: tied up in the village, it's bare (blanket={false}); for Jesus,
// the friends lay their coats over its back, for a soft seat.

/** The friends' coats laid on the donkey's back, bottom one first: [cloth, stripes] (Andrew's blue, Peter's red, John's gold). */
export const COATS: [string, string][] = [['#5b8cc8', '#f2d38a'], ['#c8643c', '#f5e6c8'], ['#e6b84a', '#8a5bb0']]

/**
 * Jesus riding the little donkey, sitting on His friends' coats: Person in `pose` ("wave": His right hand up, waving), or
 * Figure for a `mood` or a `reach` (where His hands go, in His own units: then only those hands are up). `walk`: the
 * donkey's legs step (ps-leg, in palm-sunday.css) and it bobs along with Him (ps-bob). The rest as for Donkey.
 */
export function JesusOnDonkey({ pose = 'wave', mood, reach, walk, blinkDelay = 0, ...p }: {
  x: number; y: number; s?: number; flip?: boolean; pose?: 'wave' | 'hold' | 'stand'; mood?: Mood; reach?: [Pt | null, Pt | null]
  lead?: Pt; walk?: boolean; step?: number; blinkDelay?: number
}) {
  const look = PEOPLE.jesus
  const at = DONKEY_RIDER
  const art = mood || reach
    ? <Figure x={at.x} y={at.y} s={at.s} look={look} pose={reach ? 'stand' : pose} mood={mood} reach={reach} blinkDelay={blinkDelay + 0.7} />
    : <Person x={at.x} y={at.y} s={at.s} look={look} pose={pose} blinkDelay={blinkDelay + 0.7} />
  // (the hands in His lap: both, or the one that isn't up)
  const hands = pose === 'hold' ? 2 : reach?.[0] && reach?.[1] ? 0 : 1
  const donkey = (
    <Donkey {...p} coats={COATS} rider={look} riderArt={art} hands={hands} rest={reach?.[0] ? 'right' : 'left'} walk={walk ? 'ps-leg' : undefined}
      blinkDelay={blinkDelay} />
  )
  return walk ? <g className="ps-bob">{donkey}</g> : donkey
}

// ---------- People waving palm branches ----------

/**
 * A palm branch held up in a hand at (x, y), in the units of whoever holds it: the hand grips its stalk. It waves
 * from side to side by itself (CSS; `beat` "b", "c" or "d" sets it waving at another time), or at `sway` degrees (the game).
 */
export function HeldPalm({ x, y, len = 60, sway, beat = '', flat }: { x: number; y: number; len?: number; sway?: number; beat?: string; flat?: boolean }) {
  const frond = <PalmFrond len={len} w={len * 0.22} n={len > 50 ? 9 : 6} flat={flat} />
  return (
    <g transform={`translate(${f1(x)} ${f1(y + len * 0.12)})`}>
      {sway === undefined ? <g className={`ps-wave ${beat}`}>{frond}</g> : <g transform={`rotate(${f1(sway)})`}>{frond}</g>}
    </g>
  )
}

const FOLK_SKINS = ['#d9a47a', '#c68b5e', '#f6d2b8', '#8d5a3b', '#e3b48c']
const FOLK_ROBES = ['#e6b85a', '#7cb06a', '#5f8fc0', '#c98aa8', '#b5794a', '#e07a5f', '#9a8fd0', '#6fb7b0', '#d9b56a', '#f29a9a']
const FOLK_WRAPS = ['#f5f0e6', '#c0504d', '#7cb0e0', '#e8dcc0', '#d9b56a', '#a98cff']
const FOLK_HAIRS = ['#3b2a20', '#4a3020', '#2b1f18', '#5a3a24', '#e8e4dc']

/**
 * One small person in a crowd, front view (the kit's Folk, standing), cheering for Jesus: the right hand up high, waving
 * a palm branch (`palm` false: just waving), and with `cheer` the left hand up too. `i` picks the colors, as for Folk.
 * `sway`: the branch's angle, in the game (it waves on the beat); `beat`: as for HeldPalm. `shout`: shouting "Hosanna!".
 */
export function PalmFolk({ x, y, s = 1, i = 0, palm = true, cheer, sway, beat, shout }: {
  x: number; y: number; s?: number; i?: number; palm?: boolean; cheer?: boolean; sway?: number; beat?: string; shout?: boolean
}) {
  const robe = FOLK_ROBES[i % FOLK_ROBES.length]
  const skin = FOLK_SKINS[(i * 7 + 2) % FOLK_SKINS.length]
  const kind = (i * 5) % 4 // 0, 3: head covering · 1: short hair · 2: long hair
  const hair = FOLK_HAIRS[(i * 3) % FOLK_HAIRS.length]
  const wrap = FOLK_WRAPS[(i * 11) % FOLK_WRAPS.length]
  const covered = kind === 0 || kind === 3
  const hy = -54
  const cap = `M-12 ${hy} Q-13 ${hy - 15} 0 ${hy - 15} Q13 ${hy - 15} 12 ${hy} Q6 ${hy - 8} 0 ${hy - 7} Q-6 ${hy - 8} -12 ${hy} Z`
  const back = `M-13 ${hy - 3} Q-16 ${hy + 15} -11 ${hy + 13} L11 ${hy + 13} Q16 ${hy + 15} 13 ${hy - 3} Z`
  const arm = (ax: number, ay: number, bx: number, by: number) => (
    <>
      <path d={`M${ax} ${ay} L${bx} ${by}`} stroke={ink(robe)} strokeWidth={6.5} strokeLinecap="round" />
      <path d={`M${ax} ${ay} L${bx} ${by}`} stroke={robe} strokeWidth={4.5} strokeLinecap="round" />
    </>
  )
  const hand = (cx: number, cy: number) => <circle cx={cx} cy={cy} r={3.4} fill={skin} stroke={ink(skin)} strokeWidth={1.5} />
  const R: Pt = [19, -62]
  const L: Pt = cheer ? [-19, -62] : [-17.5, -19]
  return (
    <g transform={`translate(${f1(x)} ${f1(y)}) scale(${s})`}>
      {(covered || kind === 2) && <path d={back} fill={covered ? wrap : hair} stroke={ink(covered ? wrap : hair)} strokeWidth={2} />}
      <ellipse cx={-7} cy={-2} rx={6} ry={3} fill="#7a5233" />
      <ellipse cx={7} cy={-2} rx={6} ry={3} fill="#7a5233" />
      <path d="M-12 -42 Q0 -46 12 -42 L17 -4 Q0 0 -17 -4 Z" fill={robe} stroke={ink(robe)} strokeWidth={2.5} strokeLinejoin="round" />
      {arm(cheer ? -9 : -10.5, cheer ? -37 : -39, L[0], L[1])}
      {arm(9, -37, R[0], R[1])}
      {palm && <HeldPalm x={R[0]} y={R[1]} len={48} sway={sway} beat={beat} />}
      {hand(L[0], L[1])}
      {hand(R[0], R[1])}
      <circle cx={0} cy={hy} r={11} fill={skin} stroke={ink(skin)} strokeWidth={2} />
      <circle cx={-4} cy={hy} r={1.9} fill="#2b2140" />
      <circle cx={4} cy={hy} r={1.9} fill="#2b2140" />
      <ellipse cx={-7} cy={hy + 4} rx={2.6} ry={1.6} fill="#ff7fb0" opacity={0.55} />
      <ellipse cx={7} cy={hy + 4} rx={2.6} ry={1.6} fill="#ff7fb0" opacity={0.55} />
      {shout
        ? <path d={`M-3.6 ${hy + 4} Q0 ${hy + 10.5} 3.6 ${hy + 4} Z`} fill="#8a2f45" stroke="#6b2a3a" strokeWidth={1.2} strokeLinejoin="round" />
        : <path d={`M-3 ${hy + 5} Q0 ${hy + 8.5} 3 ${hy + 5}`} stroke="#6b2a3a" strokeWidth={1.6} fill="none" strokeLinecap="round" />}
      <path d={cap} fill={covered ? wrap : hair} stroke={ink(covered ? wrap : hair)} strokeWidth={2} />
    </g>
  )
}

/**
 * Someone up close, cheering, as Figure draws them: a palm branch held up high in the right hand (`cheer`: the left hand
 * up too), waving by itself or at `sway` degrees (the game). `mood` "joy" (singing, laughing) unless said.
 */
export function PalmWaver({ x, y, s = 1, look, mood = 'joy', facing, cheer, sway, beat, len = 100, blinkDelay = 0, children }: {
  x: number; y: number; s?: number; look: JLook; mood?: Mood; facing?: 'left' | 'right'; cheer?: boolean; sway?: number; beat?: string
  len?: number; blinkDelay?: number; children?: ReactNode
}) {
  const R: Pt = [40, -126]
  return (
    <Figure x={x} y={y} s={s} look={look} mood={mood} facing={facing} blinkDelay={blinkDelay} pose="stand"
      reach={[cheer ? [-40, -126] : null, R]} item={<HeldPalm x={R[0]} y={R[1]} len={len} sway={sway} beat={beat} />}>
      {children}
    </Figure>
  )
}

type Row = [y: number, x0: number, x1: number, n: number, s: number]

/**
 * Rows of PalmFolk, the back row first, spaced a little unevenly like a real crowd (as the kit's crowds are). Most of
 * them wave palm branches; some shout. `skip`: x ranges left empty (round someone up close). `sway`: each one's branch
 * angle, by their number (the game).
 */
export function Crowd({ rows, seed = 0, skip = [], sway }: { rows: Row[]; seed?: number; skip?: [number, number][]; sway?: (i: number) => number }) {
  let k = seed
  return (
    <g>
      {rows.map(([y, x0, x1, n, s], r) => Array.from({ length: n }, (_, j) => {
        const i = k++
        const step = n > 1 ? (x1 - x0) / (n - 1) : 0
        const x = x0 + j * step + Math.sin(i * 12.9898) * step * 0.2
        if (skip.some(([a, b]) => x > a && x < b)) return null
        return (
          <PalmFolk key={`${r}-${j}`} x={x} y={y + Math.cos(i * 4.1) * 3 * s} s={s} i={i} palm={i % 4 !== 3} cheer={i % 5 === 2}
            sway={sway?.(i)} beat={['', 'b', 'c', 'd'][i % 4]} shout={i % 3 === 1} />
        )
      }))}
    </g>
  )
}

// ---------- On the road ----------

/** A coat spread flat on the road (seen from the side, so squashed flat), with its stripes and tassels. (x, y) = its middle; about 96 wide at s = 1. */
export function CoatOnRoad({ x, y, s = 1, cloth, stripe, tilt = 0 }: { x: number; y: number; s?: number; cloth: string; stripe: string; tilt?: number }) {
  return (
    <g transform={`translate(${f1(x)} ${f1(y)}) rotate(${tilt}) scale(${s})`} strokeLinejoin="round">
      <path d="M-46 -7 Q-12 -13 44 -9 L49 8 Q8 13 -45 9 Z" fill={cloth} stroke={ink(cloth)} strokeWidth={2.2} />
      <path d="M-41 -3 Q0 -8 44 -4 M-41 4.5 Q2 2.5 46 4.5" stroke={stripe} strokeWidth={2.4} fill="none" />
      {[[-47, -7], [45, -9], [50, 8], [-46, 9]].map(([tx, ty]) => <circle key={tx} cx={tx} cy={ty} r={2.2} fill={stripe} stroke={darken(stripe, 0.3)} strokeWidth={0.8} />)}
    </g>
  )
}

/** A palm branch lying flat on the road, pointing `angle` degrees (0: to the right): (x, y) = its stalk; `len` long. */
export function BranchOnRoad({ x, y, len = 70, angle = 0 }: { x: number; y: number; len?: number; angle?: number }) {
  return (
    <g transform={`translate(${f1(x)} ${f1(y)}) rotate(${angle}) scale(1 0.6)`}>
      <PalmFrond len={len} w={len * 0.27} n={9} angle={90} line={1.6} />
    </g>
  )
}

/**
 * A little heap of smooth stones by the road ("even the stones would shout!"): (x, y) = the middle of its foot. The one on
 * top at the back has a little tuft of green moss, like Rocky's.
 */
export function StonePile({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  // [x, y, rx, ry, color], back ones first
  const stones: [number, number, number, number, string][] = [
    [-16, -30, 17, 13, '#b4bcc6'], [20, -32, 15, 11, '#a7a095'], [-36, -12, 20, 14, '#a9b1ba'], [6, -14, 24, 16, '#b9b0a2'], [40, -10, 17, 12, '#9aa7b8'],
  ]
  return (
    <g transform={`translate(${f1(x)} ${f1(y)}) scale(${s})`}>
      <ellipse cx={2} cy={0} rx={62} ry={6} fill="#000" opacity={0.12} />
      {stones.map(([sx, sy, rx, ry, c], i) => (
        <g key={i}>
          <ellipse cx={sx} cy={sy} rx={rx} ry={ry} fill={c} stroke={ink(c)} strokeWidth={2.4} />
          <ellipse cx={sx - rx * 0.35} cy={sy - ry * 0.4} rx={rx * 0.34} ry={ry * 0.22} fill="#fff" opacity={0.5} transform={`rotate(-20 ${f1(sx - rx * 0.35)} ${f1(sy - ry * 0.4)})`} />
          <circle cx={sx + rx * 0.3} cy={sy + ry * 0.2} r={1.4} fill={darken(c, 0.25)} />
        </g>
      ))}
      <path d="M-29 -38 Q-30 -44 -24 -45 Q-21 -50 -15 -47 Q-10 -50 -6 -45 Q-1 -43 -3 -38 Q-16 -46 -29 -38 Z" fill="#7cb35a" stroke="#4f8a3a" strokeWidth={1.8} strokeLinejoin="round" />
      <path d="M-22 -45 q2 -2 4 0 M-12 -46 q2 -2 4 0" stroke="#a8d67e" strokeWidth={1.4} fill="none" strokeLinecap="round" />
    </g>
  )
}

/**
 * A village house up close: plastered mud brick, a flat roof with its beam ends showing under a low wall, a little
 * window with wooden shutters, and a doorway a grown-up fits through, its wooden door swung open (dark inside).
 * (x, y): the middle of its foot; `door` and `win`: where their middles are, as a part of the width from the middle.
 */
export function Home({ x, y, w = 280, h = 210, door = 0, win = -0.3, wall = '#e6c890' }: { x: number; y: number; w?: number; h?: number; door?: number; win?: number; wall?: string }) {
  const line = darken(wall, 0.3)
  const dx = x + door * w, wx = x + win * w
  const dw = 56, dh = 132
  const arch = (k: number) => `M${f1(dx - dw / 2 - k)} ${y} L${f1(dx - dw / 2 - k)} ${f1(y - dh + 20)} Q${f1(dx)} ${f1(y - dh - 8 - k * 1.6)} ${f1(dx + dw / 2 + k)} ${f1(y - dh + 20)} L${f1(dx + dw / 2 + k)} ${y} Z`
  return (
    <g strokeLinejoin="round">
      <rect x={x - w / 2} y={y - h} width={w} height={h} fill={wall} stroke={line} strokeWidth={2.6} />
      {[[-0.32, 0.26], [0.22, 0.5], [-0.12, 0.74], [0.36, 0.84], [0.3, 0.16]].map(([bx, by], i) => (
        <path key={i} d={`M${f1(x + bx * w - 10)} ${f1(y - h * by)} l20 0 M${f1(x + bx * w - 3)} ${f1(y - h * by + 7)} l17 0`} stroke={darken(wall, 0.12)} strokeWidth={1.8} strokeLinecap="round" />
      ))}
      <rect x={x - w / 2 - 6} y={y - h - 16} width={w + 12} height={18} rx={2} fill={darken(wall, 0.08)} stroke={line} strokeWidth={2.2} />
      {Array.from({ length: Math.floor(w / 26) }, (_, i) => <circle key={i} cx={x - w / 2 + 14 + i * 26} cy={y - h + 9} r={3.6} fill="#8a6040" />)}
      {/* the window, its shutters open */}
      <rect x={wx - 16} y={y - h + 34} width={32} height={30} rx={3} fill="#5a3a24" stroke={line} strokeWidth={2.2} />
      {[-1, 1].map((k) => <rect key={k} x={wx + k * 16 + (k < 0 ? -11 : 0)} y={y - h + 33} width={11} height={32} rx={2} fill="#3f8fb8" stroke="#2a6a8a" strokeWidth={1.8} />)}
      {/* the doorway: a frame, the dark inside, and the door swung open against its left side */}
      <path d={arch(6)} fill={darken(wall, 0.16)} stroke={line} strokeWidth={2.2} />
      <path d={arch(0)} fill="#4a3020" />
      <path d={`M${f1(dx - dw / 2)} ${y} L${f1(dx - dw / 2)} ${f1(y - dh + 20)} Q${f1(dx - dw / 2 + 6)} ${f1(y - dh + 4)} ${f1(dx - dw / 2 + 16)} ${f1(y - dh + 8)} L${f1(dx - dw / 2 + 16)} ${f1(y - 4)} Z`}
        fill="#9a6a3a" stroke="#5a3a1c" strokeWidth={2.2} />
      <path d={`M${f1(dx - dw / 2 + 8)} ${f1(y - dh + 14)} L${f1(dx - dw / 2 + 8)} ${f1(y - 6)}`} stroke="#7a4a24" strokeWidth={1.6} />
      <rect x={dx - dw / 2 - 10} y={y - 6} width={dw + 20} height={7} rx={2} fill={darken(wall, 0.12)} stroke={line} strokeWidth={1.8} />
    </g>
  )
}

/** A wooden post by a door, for tying up a donkey: (x, y) = its foot; about 70 tall at s = 1. */
export function Post({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${f1(x)} ${f1(y)}) scale(${s})`}>
      <ellipse cx={0} cy={0} rx={12} ry={3} fill="#000" opacity={0.12} />
      <rect x={-6} y={-66} width={12} height={66} rx={3} fill="#9a6a3a" stroke="#6b4422" strokeWidth={2.2} />
      <path d="M-2.5 -58 L-2.5 -10" stroke="#b8844e" strokeWidth={2} strokeLinecap="round" />
      <rect x={-8} y={-70} width={16} height={7} rx={2.5} fill="#8a5a2e" stroke="#6b4422" strokeWidth={2} />
    </g>
  )
}

/** An olive tree, as on the Mount of Olives: a twisty trunk and silvery green leaves. (x, y) = its foot; about 120 tall at s = 1. */
export function OliveTree({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const leaf = useShade('#8fae7a', 0.3, 0.2)
  const line = ink('#8fae7a')
  return (
    <g transform={`translate(${f1(x)} ${f1(y)}) scale(${s})`}>
      <defs>{leaf.def}</defs>
      <ellipse cx={0} cy={-1} rx={30} ry={5} fill="#000" opacity={0.1} />
      <path d="M-9 0 Q-4 -24 -14 -46 Q-6 -50 0 -40 Q6 -54 16 -50 Q6 -26 10 0 Z" fill="#9a7a5a" stroke="#6b5038" strokeWidth={2.4} strokeLinejoin="round" />
      <path d="M-2 -10 Q0 -24 -6 -36" stroke="#7d6248" strokeWidth={1.8} fill="none" strokeLinecap="round" />
      <g className="sc-sway">
        {[[-30, -62, 26], [0, -84, 32], [30, -64, 26], [-4, -56, 26]].map(([cx, cy, r], i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill={leaf.fill} stroke={line} strokeWidth={2.4} />
        ))}
        {[[-34, -66], [-14, -88], [10, -96], [24, -72], [-6, -62], [36, -58], [-26, -50]].map(([lx, ly], i) => (
          <ellipse key={i} cx={lx} cy={ly} rx={5} ry={2.2} fill="#c9dcb6" opacity={0.75} transform={`rotate(${i % 2 ? 30 : -30} ${lx} ${ly})`} />
        ))}
      </g>
    </g>
  )
}

// ---------- The land round Jerusalem ----------

/** Green hills far away (the hills round Jerusalem, in spring at the Passover). */
const FarHills = ({ y = 250 }: { y?: number }) => (
  <path d={`M0 ${y + 12} Q130 ${y - 24} 270 ${y + 2} Q420 ${y - 32} 560 ${y - 4} Q690 ${y - 28} 800 ${y - 10} L800 450 L0 450 Z`} fill="#b8d6b0" />
)

/** A sandy road from `pts` (its middle line, left to right) with a width at each point. */
function Road({ pts, color = '#ecd4a4', edge = '#d8b97e' }: { pts: [number, number, number][]; color?: string; edge?: string }) {
  const top = pts.map(([x, y, w]) => `${f1(x)} ${f1(y - w / 2)}`)
  const bottom = pts.map(([x, y, w]) => `${f1(x)} ${f1(y + w / 2)}`).reverse()
  return <path d={`M${top.join(' L')} L${bottom.join(' L')} Z`} fill={color} stroke={edge} strokeWidth={2} strokeLinejoin="round" />
}

/** Jesus, standing (Figure, for His moods and poses). */
const Jesus = (p: { x: number; y: number; s?: number; pose?: JPose; mood?: Mood; facing?: 'left' | 'right'; reach?: [Pt | null, Pt | null]; blinkDelay?: number }) => (
  <Figure {...p} look={PEOPLE.jesus} />
)
/** One of Jesus' friends, standing (Figure). */
const Friend = ({ who, ...p }: { who: 'peter' | 'andrew' | 'james' | 'john'; x: number; y: number; s?: number; pose?: JPose; mood?: Mood; facing?: 'left' | 'right'; reach?: [Pt | null, Pt | null]; blinkDelay?: number; item?: ReactNode }) => (
  <Figure {...p} look={PEOPLE[who]} />
)

/** A coat held up in front by its top corners (Figure's "present" pose: give it as the Figure's `item`). */
const HeldCoat = ({ cloth, stripe }: { cloth: string; stripe: string }) => (
  <g strokeLinejoin="round">
    <path d="M-30 -66 L30 -66 Q35 -46 33 -24 Q0 -18 -33 -24 Q-35 -46 -30 -66 Z" fill={cloth} stroke={ink(cloth)} strokeWidth={2.4} />
    <path d="M-30 -66 L30 -66 L31 -58 Q0 -54 -31 -58 Z" fill={darken(cloth, 0.12)} stroke={ink(cloth)} strokeWidth={2} />
    <path d="M-34 -32 Q0 -26 34 -32 M-34 -40 Q0 -34 34 -40" stroke={stripe} strokeWidth={3.2} fill="none" />
    {[-33, 33].map((tx) => <circle key={tx} cx={tx} cy={-22} r={2.6} fill={stripe} stroke={darken(stripe, 0.3)} strokeWidth={0.9} />)}
  </g>
)

// ---------- Pages ----------

// 1. "Jesus and His friends were walking to Jerusalem, the big city. It was almost time for a happy feast called the
//    Passover, and lots of people were on the road."
// The road through the green hills in spring, winding up to Jerusalem on its hill (God's house shining on top). Jesus
// walks in front with Peter, Andrew, James and John; further up the road, a family going to the feast too.
function Page1() {
  return (
    <Scene sky="day" ground="none" clouds={false}>
      <Sun x={96} y={78} s={0.8} />
      <Cloud x={300} y={62} s={0.7} />
      <Cloud x={510} y={44} s={0.5} slow />
      <Birds spots={[[226, 128, 0.9], [252, 116, 0.7]]} />
      <FarHills y={250} />
      <Tap say="There is Jerusalem, the big city!" sfx="sparkle"><Jerusalem x={590} y={322} s={0.58} /></Tap>
      <path d="M0 316 Q200 290 400 314 Q600 336 800 324 L800 450 L0 450 Z" fill="#a8cf8e" />
      {/* the road, from the city gate down round the hill and along the front */}
      <path d="M482 294 Q508 302 540 322 Q580 350 560 372 Q530 396 420 408 Q260 422 110 430 Q30 436 -30 440 L-30 452 L250 452 Q420 440 520 424 Q630 404 634 368 Q636 336 580 310 Q530 290 494 290 Z" fill="#ecd4a4" stroke="#d8b97e" strokeWidth={2} strokeLinejoin="round" />
      {/* (the palm on the left stands on the grass at the edge, behind James) */}
      <Palm x={14} y={432} s={1} />
      <Palm x={734} y={436} s={0.86} />
      <Tap say="Happy Passover! We're going to the feast, too!" sfx="ding">
        <Person x={498} y={298} s={0.21} look={CHILDREN[1]} blinkDelay={0.2} />
        <Person x={516} y={308} s={0.24} look={TOWNSFOLK[4]} blinkDelay={1.6} />
        <Person x={538} y={320} s={0.28} look={TOWNSFOLK[2]} blinkDelay={0.4} />
        <Person x={562} y={336} s={0.33} look={TOWNSFOLK[1]} blinkDelay={1.1} />
        <Person x={590} y={356} s={0.39} look={TOWNSFOLK[0]} blinkDelay={1.3} />
        <Person x={578} y={384} s={0.44} look={CHILDREN[4]} pose="wave" blinkDelay={0.9} />
        <Person x={608} y={388} s={0.46} look={TOWNSFOLK[3]} holding="stick" blinkDelay={0.5} />
      </Tap>
      <Friend who="james" x={70} y={436} s={0.88} blinkDelay={1.4} />
      <Friend who="john" x={154} y={440} s={0.88} blinkDelay={0.6} />
      <Tap say="Come on, friends! We're going to Jerusalem."><Jesus x={250} y={440} s={0.92} pose="wave" blinkDelay={0.2} /></Tap>
      <Tap say="Look! I can see the city!"><Friend who="peter" x={348} y={440} s={0.88} pose="point" reach={[null, [52, -122]]} blinkDelay={1.1} /></Tap>
      <Friend who="andrew" x={440} y={444} s={0.88} blinkDelay={1.8} />
    </Scene>
  )
}

// 2. "Near the city, Jesus said to two of His friends, "Go to the village over there. You will find a young donkey that
//    no one has ever ridden. Bring it to Me. If anyone asks, say, 'The Lord needs it.'""
// On the hillside near the city, among the olive trees: Jesus points to a little village on the next hill, where a young
// donkey is tied up by a house. Peter and John, the two He sends, listen; Andrew and James wait behind.
function Page2() {
  return (
    <Scene sky="day" ground="none" clouds={false}>
      <Sun x={96} y={76} s={0.8} />
      <Cloud x={330} y={60} s={0.62} slow />
      <FarHills y={246} />
      {/* the village on the next hill: little houses, and the young donkey tied up by one of them */}
      <path d="M452 316 Q540 214 664 206 Q760 208 820 236 L820 340 L452 340 Z" fill="#b9cf8e" />
      <MudHouse x={586} y={252} w={64} h={44} door={-0.2} win={0.25} />
      <MudHouse x={664} y={236} w={76} h={52} door={0.18} win={-0.24} />
      <MudHouse x={744} y={246} w={60} h={42} door={-0.1} win={null} />
      <Tap say="Hee-haw! Here I am!" sfx="wobble">
        <Post x={612} y={262} s={0.3} />
        <Donkey x={640} y={262} s={0.24} flip blanket={false} lead={[117, -84]} blinkDelay={1.2} />
      </Tap>
      <path d="M0 330 Q200 300 420 322 Q620 344 800 334 L800 450 L0 450 Z" fill="#a8cf8e" />
      <OliveTree x={612} y={352} s={0.62} />
      <OliveTree x={748} y={378} s={0.8} />
      <Friend who="james" x={50} y={430} s={0.9} blinkDelay={1.3} />
      <Friend who="andrew" x={134} y={432} s={0.9} blinkDelay={0.4} />
      <Tap say="Okay! We will go and find it."><Friend who="peter" x={240} y={440} s={0.96} blinkDelay={0.9} /></Tap>
      <Tap say="A donkey that no one has ever ridden?"><Friend who="john" x={338} y={442} s={0.96} mood="wow" blinkDelay={1.6} /></Tap>
      <Tap say="Go to the village over there. You will find a young donkey."><Jesus x={456} y={438} s={1} pose="point" reach={[null, [62, -116]]} blinkDelay={0.2} /></Tap>
    </Scene>
  )
}

// 3. "The friends found the young donkey, just as Jesus said! "Why are you untying our donkey?" asked its owners. "The
//    Lord needs it," said the friends. So the owners let them take it."
// A street in the village: the young donkey (no saddle, nobody has ridden it), tied to a post by a house. Peter unties
// its rope, and John tells its owners, at their door, "The Lord needs it." The man asks why; his wife smiles. A hen pecks.
function Page3() {
  return (
    <Scene sky="day" ground="none" clouds={false}>
      <Cloud x={420} y={60} s={0.6} />
      <path d="M0 300 Q200 280 400 296 T800 290 L800 450 L0 450 Z" fill="#c9cf8e" />
      <MudHouse x={300} y={300} w={90} h={60} door={0.15} win={null} />
      <MudHouse x={440} y={296} w={80} h={54} door={-0.2} win={0.22} />
      <path d="M0 330 Q400 312 800 326 L800 450 L0 450 Z" fill="#e8d3a0" />
      <MudHouse x={106} y={336} w={210} h={136} door={0.2} win={-0.25} />
      <Home x={664} y={406} w={284} h={212} door={-0.05} win={0.3} />
      <Post x={184} y={430} />
      <Tap say="Hee-haw! Where are we going?" sfx="wobble">
        <Donkey x={330} y={430} s={0.95} flip blanket={false} lead={[154, -70]} blinkDelay={0.7} />
      </Tap>
      <Friend who="peter" x={120} y={436} s={0.98} reach={[null, [60, -70]]} blinkDelay={0.3} />
      <Tap say="The Lord needs it."><Friend who="john" x={470} y={438} s={0.98} pose="open" blinkDelay={1.1} /></Tap>
      <Tap say="Why are you untying our donkey?"><Figure x={598} y={438} s={1} look={OWNER} facing="left" pose="open" mood="wow" blinkDelay={0.6} /></Tap>
      <Tap say="The Lord needs it? Then you may take it!"><Figure x={724} y={436} s={0.98} look={OWNER_WIFE} facing="left" holding="jar" blinkDelay={1.5} /></Tap>
      <Emoji e="🐔" x={530} y={424} size={40} />
    </Scene>
  )
}

// 4. "They brought the little donkey to Jesus. They put their coats on its back, to make a soft seat. Then Jesus sat on
//    the donkey."
// Back on the hillside: Jesus sits on the little donkey, on the friends' coats (Andrew's blue, Peter's red and John's
// gold, with stripes and tassels). Peter holds its rope; John, Andrew and James are glad.
function Page4() {
  return (
    <Scene sky="day" ground="none" clouds={false}>
      <Sun x={704} y={80} s={0.8} />
      <Cloud x={190} y={64} s={0.66} />
      <FarHills y={252} />
      <path d="M0 318 Q220 290 420 314 Q620 336 800 322 L800 450 L0 450 Z" fill="#a8cf8e" />
      <OliveTree x={196} y={326} s={0.72} />
      <OliveTree x={560} y={320} s={0.6} />
      <Road pts={[[-30, 410, 60], [200, 404, 66], [420, 410, 70], [620, 418, 66], [830, 412, 60]]} />
      <Friend who="andrew" x={70} y={434} s={0.94} mood="joy" blinkDelay={0.4} />
      <Tap say="Here, take my coat, too!">
        <Friend who="james" x={160} y={438} s={0.94} pose="present" item={<HeldCoat cloth="#efe2c0" stripe="#5f8a4f" />} blinkDelay={1.2} />
      </Tap>
      <Tap say="Hee-haw! I get to carry Jesus, on a soft seat of coats!" sfx="wobble">
        <JesusOnDonkey x={372} y={430} s={1.18} lead={[162, -52]} blinkDelay={0.3} />
      </Tap>
      <Tap say="Ready to go, Jesus!"><Friend who="peter" x={612} y={438} s={0.98} facing="left" reach={[null, [48, -70]]} blinkDelay={0.9} /></Tap>
      <Tap say="Our little donkey is ready!"><Friend who="john" x={706} y={438} s={0.96} facing="left" mood="joy" pose="open" blinkDelay={1.7} /></Tap>
    </Scene>
  )
}

// 5. "Jesus rode the little donkey down the hill, toward the city. Clip, clop, clip, clop! People saw Him coming.
//    "Look! It's Jesus!" they said, and they ran to see Him."
// Down the Mount of Olives, with Jerusalem across the valley: Jesus rides the donkey (its legs step), Peter leading it and
// John walking behind. People from the city spot Him: a woman points, a man waves, and a boy comes running.
function Page5() {
  return (
    <Scene sky="day" ground="none" clouds={false}>
      <Cloud x={130} y={62} s={0.6} />
      <Cloud x={380} y={44} s={0.48} slow />
      <path d="M0 240 Q200 226 400 252 Q600 238 800 236 L800 450 L0 450 Z" fill="#b8d6b0" />
      <Jerusalem x={612} y={300} s={0.66} />
      <path d="M0 270 Q160 268 300 300 Q500 344 800 350 L800 450 L0 450 Z" fill="#a8cf8e" />
      <OliveTree x={70} y={298} s={0.7} />
      <Road pts={[[-30, 336, 40], [150, 358, 54], [330, 400, 64], [520, 420, 64], [830, 420, 60]]} />
      <Friend who="john" x={150} y={418} s={0.9} blinkDelay={1.3} />
      <Tap say="Clip, clop, clip, clop!" sfx="wobble">
        <JesusOnDonkey x={322} y={418} s={1} walk lead={[100, -50]} blinkDelay={0.2} />
      </Tap>
      <Friend who="peter" x={466} y={426} s={0.92} reach={[[-46, -60], null]} blinkDelay={0.8} />
      <Tap say="Wait for me! I want to see Jesus!" sfx="pop"><g className="ps-hop"><Figure x={572} y={436} s={0.94} look={CHILDREN[3]} pose="arms-up" mood="joy" blinkDelay={0.4} /></g></Tap>
      <Tap say="Look! It's Jesus!"><Figure x={662} y={432} s={0.9} look={TOWNSFOLK[0]} facing="left" pose="point" mood="wow" blinkDelay={1.1} /></Tap>
      <Tap say="Hello, Jesus!"><Person x={746} y={430} s={0.88} look={TOWNSFOLK[1]} facing="left" pose="wave" blinkDelay={0.6} /></Tap>
    </Scene>
  )
}

// 6. "Remember Jesus, riding the little donkey? Lots and lots of people came! Some spread their coats on the road for
//    Him. Others cut branches from the palm trees and laid them down, too."
// The road up to the city gate: lots of people coming out to meet Jesus, and coats and palm branches spread all along the
// road. A woman holds up her coat to lay it down, a man has cut a branch from a young palm tree, a girl waves hers, and
// Jesus comes riding on the little donkey.
function Page6() {
  return (
    <Scene sky="day" ground="none" clouds={false}>
      <Cloud x={160} y={56} s={0.62} />
      <path d="M0 262 Q200 236 420 258 T800 250 L800 450 L0 450 Z" fill="#b8d6b0" />
      <CityWall x0={430} x1={820} y={316} h={92} gx={668} through={<rect x={620} y={160} width={100} height={160} fill="#efdcb2" />} />
      <path d="M0 314 Q220 296 440 316 L820 316 L820 450 L0 450 Z" fill="#a8cf8e" />
      {/* (the palm on the left stands on the grass by the road, its shadow at its foot) */}
      <ellipse cx={42} cy={393} rx={26} ry={5} fill="#000" opacity={0.1} />
      <Palm x={40} y={390} s={1.02} />
      <Palm x={330} y={318} s={0.8} />
      <Road pts={[[-30, 424, 64], [200, 412, 62], [420, 384, 52], [560, 352, 40], [668, 318, 30]]} />
      {/* lots and lots of people, coming along the road and lining its far side */}
      <Crowd rows={[[318, 390, 640, 7, 0.54], [330, 404, 626, 6, 0.58], [344, 452, 640, 4, 0.64]]} seed={11} skip={[[640, 700]]} />
      <Crowd rows={[[340, 232, 392, 4, 0.62], [356, 252, 424, 5, 0.68]]} seed={40} />
      <Tap say="A soft, colorful road for Jesus!" sfx="pop">
        <CoatOnRoad x={292} y={404} s={0.9} cloth="#7cb0e0" stripe="#fff4d6" tilt={-4} />
        <CoatOnRoad x={466} y={372} s={0.72} cloth="#e07a8f" stripe="#ffe9a8" tilt={-10} />
        <BranchOnRoad x={330} y={400} len={108} angle={-8} />
        <BranchOnRoad x={500} y={366} len={88} angle={-16} />
      </Tap>
      <Tap say="Hee-haw! Clip, clop, on the coats!" sfx="wobble"><JesusOnDonkey x={150} y={432} s={0.98} blinkDelay={0.4} /></Tap>
      <Tap say="Here is my coat, Jesus!"><Figure x={560} y={406} s={0.86} look={TOWNSFOLK[0]} facing="left" pose="present" mood="joy" item={<HeldCoat cloth="#ffd27a" stripe="#c0504d" />} blinkDelay={0.8} /></Tap>
      <Palm x={724} y={420} s={0.62} />
      <Tap say="Palm branches for Jesus!"><PalmWaver x={668} y={438} s={0.98} look={TOWNSFOLK[3]} facing="left" mood="happy" blinkDelay={1.2} /></Tap>
      <PalmWaver x={400} y={446} s={1.02} look={CHILDREN[0]} cheer blinkDelay={0.3} />
    </Scene>
  )
}

// 7. "Everyone waved palm branches and shouted, "Hosanna! Blessed is he who comes in the name of the Lord!" Hosanna is
//    a happy shout that praises God."
// At the city gate, a big, happy crowd lines the road, waving palm branches and shouting. Jesus rides through the middle
// on the little donkey, over the coats and branches. Children jump for joy at the front.
function Page7() {
  return (
    <Scene sky="day" ground="none" clouds={false}>
      <Rays x={670} y={190} r={460} n={16} opacity={0.22} />
      <Cloud x={120} y={54} s={0.6} />
      <path d="M0 250 Q200 226 420 248 T800 240 L800 450 L0 450 Z" fill="#b8d6b0" />
      <CityWall x0={480} x1={820} y={312} h={96} gx={670} through={<rect x={620} y={160} width={100} height={160} fill="#efdcb2" />} />
      <path d="M0 300 Q240 284 480 306 L820 312 L820 450 L0 450 Z" fill="#a8cf8e" />
      <Tap say="Hosanna! Hosanna!" sfx="ding">
        {/* (nobody straight behind Jesus and the donkey's head, where only an arm or a branch would show) */}
        <Crowd rows={[[318, 16, 470, 10, 0.72], [342, 30, 500, 9, 0.8]]} seed={3} skip={[[330, 486]]} />
        <Crowd rows={[[338, 560, 790, 4, 0.78]]} seed={21} skip={[[628, 712]]} />
      </Tap>
      <Road pts={[[-30, 430, 70], [200, 418, 70], [420, 392, 60], [580, 352, 44], [670, 314, 34]]} />
      <CoatOnRoad x={236} y={418} s={0.84} cloth="#5f8fc0" stripe="#fff4d6" tilt={-3} />
      <BranchOnRoad x={470} y={378} len={60} angle={-14} />
      <CoatOnRoad x={556} y={356} s={0.62} cloth="#e6b85a" stripe="#c0504d" tilt={-14} />
      <Tap say="Thank you for praising God!"><JesusOnDonkey x={380} y={420} s={1.04} blinkDelay={0.2} /></Tap>
      <Tap say="Hosanna! Blessed is he who comes in the name of the Lord!">
        <PalmWaver x={64} y={442} s={1} look={TOWNSFOLK[1]} cheer blinkDelay={0.6} />
      </Tap>
      <Tap say="Hooray for Jesus!" sfx="pop"><g className="ps-hop"><PalmWaver x={166} y={444} s={1.02} look={CHILDREN[1]} beat="b" blinkDelay={1.2} /></g></Tap>
      <g className="ps-hop b"><PalmWaver x={560} y={446} s={1.02} look={CHILDREN[2]} facing="left" cheer beat="c" blinkDelay={0.3} /></g>
      <PalmWaver x={660} y={442} s={1} look={TOWNSFOLK[2]} facing="left" beat="d" blinkDelay={1.6} />
      <PalmWaver x={752} y={440} s={0.98} look={TOWNSFOLK[4]} facing="left" mood="happy" beat="b" blinkDelay={0.9} />
      <Sparkles spots={[[290, 210, 8], [470, 180, 7], [120, 230, 6], [600, 210, 6]]} color="#fff8d0" />
    </Scene>
  )
}

// 8. "But some grumpy leaders did not like it. "Teacher, tell them to be quiet!" they said. Jesus said, "If they were
//    quiet, even the stones would shout!""
// The little donkey walks on toward the city gate, and three grumpy leaders by the road behind call after Jesus, arms
// folded (cross, not scary). Jesus turns to answer them kindly, His hand out toward them and a heap of stones by the road.
// The crowd at the gate still waves its palm branches.
function Page8() {
  return (
    <Scene sky="day" ground="none" clouds={false}>
      <Cloud x={560} y={58} s={0.6} />
      <path d="M0 250 Q200 230 420 252 T800 244 L800 450 L0 450 Z" fill="#b8d6b0" />
      <CityWall x0={-20} x1={820} y={300} h={84} gx={110} through={<rect x={60} y={160} width={100} height={150} fill="#efdcb2" />} />
      <path d="M0 296 L820 300 L820 450 L0 450 Z" fill="#a8cf8e" />
      <Tap say="Hosanna! Hosanna!" sfx="ding"><Crowd rows={[[322, 20, 440, 9, 0.72]]} seed={7} skip={[[250, 360]]} /></Tap>
      <Road pts={[[-30, 418, 70], [260, 414, 70], [520, 416, 66], [830, 410, 62]]} />
      <BranchOnRoad x={70} y={424} len={80} angle={4} />
      <Tap say="Even the stones would shout!"><JesusOnDonkey x={300} y={426} s={1.06} flip mood="happy" reach={[[-60, -104], null]} blinkDelay={0.4} /></Tap>
      <Tap say="If the people were quiet, we would shout, too!" sfx="pop"><StonePile x={474} y={446} s={1.1} /></Tap>
      <Tap say="Hmph! Teacher, tell them to be quiet!" sfx="wobble">
        <Figure x={584} y={436} s={0.98} look={LEADERS[0]} facing="left" pose="cross" mood="grumpy" blinkDelay={0.5} />
        <Figure x={670} y={432} s={0.96} look={LEADERS[1]} facing="left" pose="cross" mood="grumpy" blinkDelay={1.4} />
        <Figure x={752} y={438} s={0.98} look={LEADERS[2]} facing="left" pose="cross" mood="grumpy" blinkDelay={0.9} />
      </Tap>
    </Scene>
  )
}

// 9. "Then Jesus went into God's house, the temple. Children were singing there, "Hosanna! Hosanna!" Jesus was so glad.
//    He said God loves to hear children praise Him!"
// The courts of God's house (the temple in the middle, porches of columns either side). Children sing with palm
// branches, music notes floating up; Jesus opens His arms, glad. Doves fly over the temple.
function Page9() {
  return (
    <Scene sky="day" ground="none" clouds={false}>
      <Cloud x={120} y={50} s={0.6} />
      <Paving y={256} />
      <Colonnade x0={-10} x1={250} y={262} h={150} cols={[20, 98, 176, 236]} />
      <Colonnade x0={550} x1={810} y={262} h={150} cols={[564, 624, 702, 780]} />
      <Tap say="This is God's house, the temple." sfx="sparkle"><Temple x={400} y={252} s={0.92} shine /></Tap>
      <Tap say="Coo, coo!" sfx="pop">
        <Dove x={286} y={92} s={0.6} />
        <Dove x={516} y={76} s={0.54} facing="left" />
      </Tap>
      {[[60, 334, 0.56, 0], [520, 326, 0.54, 2], [740, 330, 0.56, 4]].map(([px, py, ps, i]) => (
        <Person key={px} x={px} y={py} s={ps} look={TOWNSFOLK[i]} pose={i === 2 ? 'arms-up' : 'stand'} blinkDelay={(px % 7) * 0.3} />
      ))}
      <Tap say="I'm so glad! God loves to hear you sing!"><Jesus x={196} y={436} s={1.06} pose="open" mood="joy" blinkDelay={0.3} /></Tap>
      <Tap say="Hosanna! Hosanna!" sfx="ding">
        <PalmWaver x={352} y={444} s={1.04} look={CHILDREN[0]} cheer blinkDelay={0.2} />
        <PalmWaver x={452} y={446} s={1.04} look={CHILDREN[3]} beat="b" blinkDelay={1.1} />
        <PalmWaver x={552} y={444} s={1.04} look={CHILDREN[4]} facing="left" cheer beat="c" blinkDelay={0.7} />
        <PalmWaver x={652} y={446} s={1.04} look={CHILDREN[1]} facing="left" beat="d" blinkDelay={1.5} />
        <PalmWaver x={746} y={444} s={1.02} look={CHILDREN[2]} facing="left" cheer blinkDelay={0.4} />
      </Tap>
      <g className="sc-float">
        <MusicNote x={404} y={238} s={1.1} color="#ff8cc0" />
        <MusicNote x={506} y={214} s={1.2} color="#ffd34d" double />
        <MusicNote x={616} y={236} s={1} color="#8fd0ff" />
        <MusicNote x={716} y={214} s={1.1} color="#c9a8ff" double />
      </g>
    </Scene>
  )
}

// 10. "Kings usually rode big, strong horses. But Jesus rode a little donkey! He is a gentle King, and He came to bring
//     peace."
// A boy pictures a king of long ago, riding a big, strong horse (in a thought bubble). But here is Jesus, the gentle King,
// smiling on His little donkey in a soft glow, with a dove, for peace, flying over Him.
function Page10() {
  return (
    <Scene sky="day" ground="none" clouds={false}>
      <Cloud x={96} y={60} s={0.56} />
      <FarHills y={256} />
      <path d="M0 312 Q220 290 420 312 Q620 334 800 320 L800 450 L0 450 Z" fill="#a8cf8e" />
      <Road pts={[[-30, 420, 64], [240, 414, 66], [520, 420, 62], [830, 412, 60]]} />
      <Glow x={262} y={300} r={200} color="#fff3c0" />
      <Tap say="Coo! Peace to you!" sfx="pop"><Dove x={250} y={106} s={0.9} /></Tap>
      <Tap say="I am a gentle King. I came to bring peace."><JesusOnDonkey x={262} y={430} s={1.16} blinkDelay={0.3} /></Tap>
      <Tap say="Kings ride big, strong horses!" sfx="ding">
        {/* (the big horse is drawn bigger than the little donkey) */}
        <Dream x={418} y={22} w={356} h={262} from={[606, 330]} sky="#fff4d8">
          <path d="M400 244 Q600 230 800 246 L800 310 L400 310 Z" fill="#c9dca0" />
          <BigHorse x={604} y={270} s={0.8} rider={KING} blinkDelay={0.8} />
        </Dream>
      </Tap>
      <Tap say="A King on a little donkey!"><Figure x={606} y={440} s={1.02} look={CHILDREN[3]} facing="left" mood="wow" blinkDelay={1} /></Tap>
      <Palm x={760} y={430} s={0.76} />
    </Scene>
  )
}

// 11. "Jesus is our King, too! He loves us so much. We can sing "Hosanna!" to Him, just like the children did."
// A golden morning on the hill: Jesus, our King, opens His arms, glad, with the children round Him waving palm branches,
// and you (the child playing) right there with them, singing "Hosanna!" Hearts and sparkles float up.
function Page11() {
  const me = usePlayer()
  return (
    <Scene sky="glory" ground="none" clouds={false}>
      <Rays x={330} y={250} r={560} n={18} color="#fff6d8" opacity={0.3} />
      <Glow x={330} y={270} r={230} color="#fff3c0" />
      <path d="M0 290 Q200 268 420 288 Q620 306 800 292 L800 450 L0 450 Z" fill="#c9dc9a" />
      <Jerusalem x={640} y={306} s={0.3} />
      <path d="M0 318 Q200 296 420 316 Q620 334 800 320 L800 450 L0 450 Z" fill="#b9d98a" />
      <path d="M0 380 Q220 358 440 380 T800 374 L800 450 L0 450 Z" fill="#9ccf6a" />
      <Palm x={46} y={346} s={0.9} />
      <Palm x={770} y={350} s={0.82} />
      <Tap say="We love You, Jesus!" sfx="good">
        <Heart x={238} y={268} s={0.8} color="#ff8fb1" shaded />
        <Heart x={420} y={250} s={0.62} color="#ffb0c8" shaded />
      </Tap>
      <g className="sc-float">
        <MusicNote x={120} y={236} s={1.1} color="#ffd34d" double />
        <MusicNote x={560} y={220} s={1.05} color="#8fd0ff" />
        <MusicNote x={742} y={186} s={1.1} color="#c9a8ff" double />
      </g>
      <Tap say="Hosanna to the King!" sfx="pop">
        <PalmWaver x={150} y={444} s={1.06} look={CHILDREN[0]} cheer blinkDelay={0.8} />
        <PalmWaver x={668} y={444} s={1.04} look={CHILDREN[4]} facing="left" cheer beat="c" blinkDelay={1.3} />
      </Tap>
      <Tap say="I love you so much!" sfx="good"><Jesus x={312} y={436} s={1.12} pose="open" mood="joy" blinkDelay={0.2} /></Tap>
      <Tap say="Hosanna! Jesus is my King!" sfx="sparkle"><PalmWaver x={486} y={448} s={1.24} look={me.look} beat="b" blinkDelay={0.5} /></Tap>
      <Sparkles spots={[[240, 150, 8], [430, 130, 9], [130, 180, 6], [560, 160, 7], [700, 130, 6]]} color="#fffbe0" />
    </Scene>
  )
}

export const PALM_SUNDAY_ART: ComponentType[] = [Page1, Page2, Page3, Page4, Page5, Page6, Page7, Page8, Page9, Page10, Page11]
