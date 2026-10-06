// All progress lives on the device (and in the family's backups on the server).
// Each player profile has its own saved progress and settings; the family cast is shared.
// No child is written into the code: names, birthdays and looks all come from the profiles.
import { SKILLS_MIGRATION } from '../learn/levels'
import { useSyncExternalStore } from 'react'
import { isValidBirthday, type Birthday } from './birthday'
import { FAMILY_KEY, migrateStorage, PROFILES_KEY, progressKey } from './storageKeys'
import type { KidLook } from './look'

export type Skill = 'reading' | 'numbers'
export type Narrator = 'ara' | 'eve' | 'device'

export interface Progress {
  version: 1
  starter?: string // the Pal this player chose first
  pals: Record<string, number> // pal id -> xp (present = befriended)
  islandsDone: string[]
  islandStep: Record<string, number> // where each island was left off
  /** The version of each island (data/islands.ts `version`) its islandStep was saved in (see savedStep). */
  islandStepVersion?: Record<string, number>
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
  cooked: Record<string, string> // Pal Kitchen: Pal id -> the day she last cooked for it
  familyVoices: boolean // play Mom/Dad recordings instead of the narrator when there is one
  log: Record<string, { secs: number; right: number; tries: number }> // per day, for the weekly summary
  skills: Record<Skill, number> // level 1..N
  /** 2 once `skills` counts the learning backbone's ten levels (older saves had five; see loadProgress). */
  skillsVersion?: 2
  streak: Record<Skill, number> // +correct in a row / -misses in a row
  stickers: string[]
  playDate: string
  playSeconds: number
  speechRate: number
  narrator: Narrator
  music: boolean
  sfx: boolean
  /** The day the birthday party was shown (so it surprises them once, on the day), and the age they turned. */
  partyShown?: string
  partyAge?: number
  /** The days the birthday countdown and "it's ___'s birthday" were last said, so they're said once a day. */
  countdownSaid?: string
  siblingSaid?: string
  /** The daily voyage: new visits finished today (lib/voyage.ts), and how many a day (0 = no limit). */
  voyage?: { day: string; visits: number }
  dailyVisits: number
  /** Stars earned on each island (1 to 3): the best first-try score. */
  stars: Record<string, number>
  /** The island being played: first-try answers so far [right, asked] (kept across visits). */
  islandScore?: Record<string, [number, number]>
  /** Which version of each island (data/islands.ts `version`) this player finished; a newer one shows "New!". */
  islandVersion?: Record<string, number>
  /** The day she saw the voyage-complete celebration on the map (every island done) and sailed on, so it shows once. */
  voyageCelebrated?: string
}

export { DEFAULT_LOOK, type KidLook } from './look'

/**
 * Where a player left off an island (a step index), if it was saved in this version of the island.
 * A place saved in an older version points at different steps, so that island starts again.
 */
export function savedStep(p: Progress, id: string, version = 1) {
  return (p.islandStepVersion?.[id] ?? 1) === version ? p.islandStep[id] ?? 0 : 0
}

export interface Profile {
  id: string
  name: string
  emoji: string
  /** Month and day only (never a year). */
  birthday?: Birthday
  look?: KidLook
  /** A grown-up's player (a parent trying the game): never a brother or sister in the stories. */
  grownup?: boolean
}

/** The family cast: names that appear in stories (shared by every player on the device). */
export interface FamilyCast {
  /** What the children call their parents; empty = not in the stories. */
  mom: string
  dad: string
  /** Brothers and sisters who don't have a player of their own (players are siblings automatically). */
  siblings: { name: string; baby?: boolean; birthday?: Birthday }[]
  pets: { name: string; emoji: string }[]
}

const FAMILY_DEFAULT: FamilyCast = { mom: 'Mom', dad: 'Dad', siblings: [], pets: [] }

interface ProfileIndex {
  active: string
  list: Profile[]
}

const keyFor = progressKey

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
  cooked: {},
  familyVoices: true,
  log: {},
  skills: { reading: 1, numbers: 1 },
  skillsVersion: 2,
  streak: { reading: 0, numbers: 0 },
  stickers: [],
  playDate: today(),
  playSeconds: 0,
  speechRate: 0.9,
  narrator: 'ara',
  music: true,
  sfx: true,
  dailyVisits: 2,
  stars: {},
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

const loadProgress = (id: string): Progress => upgradeSkills({ ...fresh(), ...read<Partial<Progress>>(keyFor(id)) })

/** A save from before the ten-level backbone: its levels move to where the same questions are now. */
export function upgradeSkills(p: Progress): Progress {
  if (p.skillsVersion === 2) return p
  const skills = { ...p.skills }
  for (const s of Object.keys(SKILLS_MIGRATION) as Skill[]) skills[s] = SKILLS_MIGRATION[s][skills[s]] ?? skills[s]
  return { ...p, skills, skillsVersion: 2 }
}

// Saves from before the game was called Ark Pals move over first.
try {
  migrateStorage(localStorage)
} catch {
  /* storage unavailable */
}

/** Player list as saved, tidied (bad birthdays dropped). A brand-new device has no players yet. */
function loadProfiles(): ProfileIndex {
  const saved = read<ProfileIndex>(PROFILES_KEY)
  if (saved?.list?.length) {
    const list = saved.list.map((p) => (p.birthday && !isValidBirthday(p.birthday) ? { ...p, birthday: undefined } : p))
    return { active: list.some((p) => p.id === saved.active) ? saved.active : list[0].id, list }
  }
  // Progress from before there were players (moved to "player"), with no list: give it a player.
  if (read(keyFor('player'))) return { active: 'player', list: [{ id: 'player', name: 'Player', emoji: '🌈' }] }
  return { active: '', list: [] }
}

let profiles: ProfileIndex = loadProfiles()
let family: FamilyCast = { ...FAMILY_DEFAULT, ...read<Partial<FamilyCast>>(FAMILY_KEY) }
let state = loadProgress(profiles.active)
const listeners = new Set<() => void>()
const notify = () => listeners.forEach((l) => l())
const subscribe = (l: () => void) => (listeners.add(l), () => { listeners.delete(l) })

function save() {
  if (profiles.active) write(keyFor(profiles.active), state)
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

const NOBODY: Profile = { id: '', name: '', emoji: '🌈' }

/** The player now playing (a blank one on a brand-new device, until the first player is added). */
export function activeProfile(): Profile {
  return profiles.list.find((p) => p.id === profiles.active) ?? NOBODY
}

/** No players yet: a brand-new device, where the title screen asks for the first one. */
export const noPlayers = () => profiles.list.length === 0

/** The current player's name, for narration ("Way to go, ___!"). */
export const playerName = () => activeProfile().name.trim() || 'friend'

export function switchProfile(id: string) {
  if (id === profiles.active || !profiles.list.some((p) => p.id === id)) return
  state = loadProgress(id)
  saveProfiles({ ...profiles, active: id })
}

export function addProfile(name: string, emoji: string, more: Partial<Omit<Profile, 'id' | 'name' | 'emoji'>> = {}) {
  const base = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'player'
  let id = base
  // (Never reuse an id that still has progress saved under it.)
  for (let n = 2; profiles.list.some((p) => p.id === id) || read(keyFor(id)); n++) id = `${base}-${n}`
  const first = !profiles.list.length
  if (first) state = loadProgress(id)
  saveProfiles({ active: first ? id : profiles.active, list: [...profiles.list, { id, name, emoji, ...more }] })
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

// ---------- Family cast ----------

export const getFamily = () => family
export function useFamily() {
  return useSyncExternalStore(subscribe, () => family)
}
export function setFamily(next: FamilyCast) {
  family = next
  write(FAMILY_KEY, family)
  notify()
}

/** Erases the current player's progress but keeps their settings (voice, sound). */
export function resetProgress() {
  const { speechRate, narrator, music, sfx } = state
  state = { ...fresh(), speechRate, narrator, music, sfx }
  save()
}

// ---------- Learning ----------

/** Levels per skill: the learning backbone's ten (src/learn/levels.ts). */
export const MAX_LEVEL: Record<Skill, number> = { reading: 10, numbers: 10 }

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
