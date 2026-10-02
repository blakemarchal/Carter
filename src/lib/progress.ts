// All progress lives on the device. Nothing is sent anywhere.
// Each player profile has its own saved progress and settings.
import { useSyncExternalStore } from 'react'

export type Skill = 'reading' | 'numbers'
export type Narrator = 'ara' | 'eve' | 'device'

export interface Progress {
  version: 1
  starter?: string // the Pal this player chose first
  pals: Record<string, number> // pal id -> xp (present = befriended)
  islandsDone: string[]
  islandStep: Record<string, number> // where each island was left off
  mapAt: string // the island her boat is parked at on the map
  battlesWon: number
  battler?: string // the Pal she picked for her last battle
  movesSeen: string[] // moves she's been shown, so new ones get a "NEW" badge
  openAll: boolean // Parent Corner: open every built island
  outfits: Record<string, string> // Pal id -> accessory it's wearing
  fed: { day: string; counts: Record<string, number> } // berries per Pal today
  egg: { warmth: number; day: string } // the mystery egg: one warmth per day she plays
  colors: Record<string, Record<number, string>> // coloring pages: "palId:stage" -> shape index -> color
  stickerSpots: { s: string; x: number; y: number }[] // sticker book: where she put each sticker (% of the scene)
  log: Record<string, { secs: number; right: number; tries: number }> // per day, for the weekly summary
  skills: Record<Skill, number> // level 1..N
  streak: Record<Skill, number> // +correct in a row / -misses in a row
  stickers: string[]
  playDate: string
  playSeconds: number
  speechRate: number
  narrator: Narrator
  music: boolean
  sfx: boolean
}

export interface Profile {
  id: string
  name: string
  emoji: string
}

interface ProfileIndex {
  active: string
  list: Profile[]
}

const PROFILES_KEY = 'carters-ark:profiles'
// Carter's progress keeps the original key, so anything saved before profiles existed is still hers.
const keyFor = (id: string) => (id === 'carter' ? 'carters-ark:v1' : `carters-ark:v1:${id}`)

const DEFAULT_PROFILES: ProfileIndex = {
  active: 'carter',
  list: [
    { id: 'carter', name: 'Carter', emoji: '🌈' },
    { id: 'dad', name: 'Dad', emoji: '🧪' },
  ],
}

const fresh = (): Progress => ({
  version: 1,
  pals: {},
  islandsDone: [],
  islandStep: {},
  mapAt: 'noah',
  battlesWon: 0,
  movesSeen: [],
  openAll: false,
  outfits: {},
  fed: { day: '', counts: {} },
  egg: { warmth: 0, day: '' },
  colors: {},
  stickerSpots: [],
  log: {},
  skills: { reading: 1, numbers: 1 },
  streak: { reading: 0, numbers: 0 },
  stickers: [],
  playDate: today(),
  playSeconds: 0,
  speechRate: 0.9,
  narrator: 'ara',
  music: true,
  sfx: true,
})

/** Today's date on the device (local time, so the daily play time resets at midnight, not 7 PM). */
export function today() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function read<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null // storage unavailable: play without saving
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* ignore */
  }
}

const loadProgress = (id: string): Progress => ({ ...fresh(), ...read<Partial<Progress>>(keyFor(id)) })

let profiles: ProfileIndex = read<ProfileIndex>(PROFILES_KEY) ?? DEFAULT_PROFILES
if (!profiles.list.some((p) => p.id === profiles.active)) profiles = { ...profiles, active: profiles.list[0].id }
let state = loadProgress(profiles.active)
const listeners = new Set<() => void>()
const notify = () => listeners.forEach((l) => l())
const subscribe = (l: () => void) => (listeners.add(l), () => { listeners.delete(l) })

function save() {
  write(keyFor(profiles.active), state)
  notify()
}

function saveProfiles(next: ProfileIndex) {
  profiles = next
  write(PROFILES_KEY, profiles)
  notify()
}

export function update(fn: (p: Progress) => Progress) {
  state = fn(state)
  save()
}

export function getProgress() {
  return state
}

export function useProgress() {
  return useSyncExternalStore(subscribe, () => state)
}

// ---------- Profiles ----------

export function useProfiles() {
  return useSyncExternalStore(subscribe, () => profiles)
}

export function activeProfile(): Profile {
  return profiles.list.find((p) => p.id === profiles.active)!
}

/** The current player's name, for narration ("Way to go, Carter!"). */
export const playerName = () => activeProfile().name.trim() || 'friend'

export function switchProfile(id: string) {
  if (id === profiles.active || !profiles.list.some((p) => p.id === id)) return
  state = loadProgress(id)
  saveProfiles({ ...profiles, active: id })
}

export function addProfile(name: string, emoji: string) {
  const base = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'player'
  let id = base
  for (let n = 2; profiles.list.some((p) => p.id === id) || id === 'carter'; n++) id = `${base}-${n}`
  saveProfiles({ ...profiles, list: [...profiles.list, { id, name, emoji }] })
  return id
}

export function editProfile(id: string, changes: Partial<Omit<Profile, 'id'>>) {
  saveProfiles({ ...profiles, list: profiles.list.map((p) => (p.id === id ? { ...p, ...changes } : p)) })
}

/** Deletes a profile and its progress. The last remaining profile can't be deleted. */
export function deleteProfile(id: string) {
  const list = profiles.list.filter((p) => p.id !== id)
  if (!list.length) return
  try {
    localStorage.removeItem(keyFor(id))
  } catch {
    /* ignore */
  }
  if (id === profiles.active) state = loadProgress(list[0].id)
  saveProfiles({ active: id === profiles.active ? list[0].id : profiles.active, list })
}

/** Erases the current player's progress but keeps their settings (voice, sound). */
export function resetProgress() {
  const { speechRate, narrator, music, sfx } = state
  state = { ...fresh(), speechRate, narrator, music, sfx }
  save()
}

// ---------- Learning ----------

export const MAX_LEVEL: Record<Skill, number> = { reading: 5, numbers: 5 }

/** Adds to today's entry in the daily log (kept for two weeks), for the Parent Corner summary. */
function logged(p: Progress, add: { secs?: number; right?: number; tries?: number }): Progress['log'] {
  const d = today()
  const day = p.log[d] ?? { secs: 0, right: 0, tries: 0 }
  const log = { ...p.log, [d]: { secs: day.secs + (add.secs ?? 0), right: day.right + (add.right ?? 0), tries: day.tries + (add.tries ?? 0) } }
  for (const k of Object.keys(log).sort().slice(0, -14)) delete log[k]
  return log
}

/** Adaptive difficulty: 3 right in a row -> level up; 2 misses in a row -> level down. */
export function recordAnswer(skill: Skill, correct: boolean) {
  update((p) => {
    let s = p.streak[skill]
    let lvl = p.skills[skill]
    if (correct) s = s < 0 ? 1 : s + 1
    else s = s > 0 ? -1 : s - 1
    if (s >= 3 && lvl < MAX_LEVEL[skill]) (lvl++, (s = 0))
    if (s <= -2 && lvl > 1) (lvl--, (s = 0))
    return { ...p, skills: { ...p.skills, [skill]: lvl }, streak: { ...p.streak, [skill]: s }, log: logged(p, { tries: 1, right: correct ? 1 : 0 }) }
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

/** Called every few seconds while playing; resets per day. */
export function tickPlayTime(seconds: number) {
  update((p) => {
    const d = today()
    const log = logged(p, { secs: seconds })
    return d === p.playDate
      ? { ...p, playSeconds: p.playSeconds + seconds, log }
      : { ...p, playDate: d, playSeconds: seconds, log }
  })
}
