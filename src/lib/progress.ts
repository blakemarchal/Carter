// All progress lives on the device. Nothing is sent anywhere.
import { useSyncExternalStore } from 'react'

export type Skill = 'reading' | 'numbers'

export interface Progress {
  version: 1
  starter?: string // the Pal Carter chose first
  pals: Record<string, number> // pal id -> xp (present = befriended)
  islandsDone: string[]
  skills: Record<Skill, number> // level 1..N
  streak: Record<Skill, number> // +correct in a row / -misses in a row
  stickers: string[]
  playDate: string
  playSeconds: number
  speechRate: number
}

const KEY = 'carters-ark:v1'

const fresh = (): Progress => ({
  version: 1,
  pals: {},
  islandsDone: [],
  skills: { reading: 1, numbers: 1 },
  streak: { reading: 0, numbers: 0 },
  stickers: [],
  playDate: today(),
  playSeconds: 0,
  speechRate: 0.9,
})

function today() {
  return new Date().toISOString().slice(0, 10)
}

function load(): Progress {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return { ...fresh(), ...JSON.parse(raw) }
  } catch {
    /* storage unavailable: play without saving */
  }
  return fresh()
}

let state = load()
const listeners = new Set<() => void>()

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l())
}

export function update(fn: (p: Progress) => Progress) {
  state = fn(state)
  save()
}

export function getProgress() {
  return state
}

export function useProgress() {
  return useSyncExternalStore(
    (l) => (listeners.add(l), () => listeners.delete(l)),
    () => state,
  )
}

export function resetProgress() {
  state = fresh()
  save()
}

export const MAX_LEVEL: Record<Skill, number> = { reading: 5, numbers: 5 }

/** Adaptive difficulty: 3 right in a row -> level up; 2 misses in a row -> level down. */
export function recordAnswer(skill: Skill, correct: boolean) {
  update((p) => {
    let s = p.streak[skill]
    let lvl = p.skills[skill]
    if (correct) s = s < 0 ? 1 : s + 1
    else s = s > 0 ? -1 : s - 1
    if (s >= 3 && lvl < MAX_LEVEL[skill]) (lvl++, (s = 0))
    if (s <= -2 && lvl > 1) (lvl--, (s = 0))
    return { ...p, skills: { ...p.skills, [skill]: lvl }, streak: { ...p.streak, [skill]: s } }
  })
}

export function addPalXp(id: string, xp: number) {
  update((p) => ({ ...p, pals: { ...p.pals, [id]: (p.pals[id] ?? 0) + xp } }))
}

export function chooseStarter(id: string) {
  update((p) => ({ ...p, starter: id, pals: { ...p.pals, [id]: p.pals[id] ?? 0 } }))
}

export function setSkillLevel(skill: Skill, level: number) {
  update((p) => ({ ...p, skills: { ...p.skills, [skill]: level }, streak: { ...p.streak, [skill]: 0 } }))
}

export function addSticker(id: string) {
  update((p) => (p.stickers.includes(id) ? p : { ...p, stickers: [...p.stickers, id] }))
}

export function completeIsland(id: string) {
  update((p) => (p.islandsDone.includes(id) ? p : { ...p, islandsDone: [...p.islandsDone, id] }))
}

/** Called every minute while playing; resets per day. */
export function tickPlayTime(seconds: number) {
  update((p) => {
    const d = today()
    return d === p.playDate
      ? { ...p, playSeconds: p.playSeconds + seconds }
      : { ...p, playDate: d, playSeconds: seconds }
  })
}
