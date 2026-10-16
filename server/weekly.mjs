// The weekly parent email: on Sunday evening, each grown-up who gave an email (and hasn't turned this off) gets a
// short note on the week's play, made from the family's progress backups (server/backup.mjs: the newest one from
// each device says where every player is now; the newest from before the week says where they were): days and
// minutes played, first tries right, islands finished, levels that went up, the Remember? round, and something to
// talk about from the island they finished last: its memory verse, a "Think about it" question with its answer,
// its big words and its science "try it at home" (server/content.gen.json, made by scripts/voice-script.tsx).
// Nothing is sent for a week with no play. One email per grown-up per week (a mark in the family's folder).
//   WEEKLY_EMAIL=0 in .env turns it off; WEEKLY_HOUR (UTC, default 22) is when on Sunday it goes.
import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'

const DAY_MS = 86400_000
const pad = (n) => String(n).padStart(2, '0')
/** A day as the game writes it (YYYY-MM-DD). The game writes the device's local day, so the week's edges are soft by a few hours. */
export const dayOf = (t) => { const d = new Date(t); return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}` }
const parse = (s) => { try { return JSON.parse(s) } catch { return null } }
const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])

/** The players in a backup ({ keys }), each with their progress ("ark-pals" saves; older saves have no email anyway). */
export function playersIn(backup) {
  const keys = backup?.keys ?? {}
  const profiles = parse(keys['ark-pals:profiles'])?.list ?? []
  return profiles.map((p) => ({ id: p.id, name: String(p.name ?? '').trim().slice(0, 16) || 'Player', emoji: p.emoji, progress: parse(keys[`ark-pals:v1:${p.id}`]) ?? {} }))
}

/**
 * The week's summary for a family from its backups ({ savedAt, device, keys }, any order). Per device, the newest
 * backup says where each player is now and the newest from before the week where they were (none: no "this week"
 * firsts). A child on two devices counts once (the device with more play). `talk` is the island to talk about.
 */
export function weekSummary(backups, { now = Date.now(), days = 7, content = { islands: [] } } = {}) {
  const since = now - days * DAY_MS
  const week = new Set()
  for (let i = 0; i < days; i++) week.add(dayOf(now - i * DAY_MS))
  const byDevice = new Map()
  for (const b of backups) {
    const t = Date.parse(b.savedAt ?? '') || 0
    const d = byDevice.get(b.device) ?? { latest: null, before: null }
    if (!d.latest || t > d.latest.t) d.latest = { t, b }
    if (t <= since && (!d.before || t > d.before.t)) d.before = { t, b }
    byDevice.set(b.device, d)
  }
  const children = []
  for (const { latest, before } of byDevice.values()) {
    if (!latest) continue
    const was = new Map(before ? playersIn(before.b).map((p) => [p.id, p.progress]) : [])
    for (const p of playersIn(latest.b)) {
      const prog = p.progress
      const old = was.get(p.id)
      let secs = 0, right = 0, tries = 0, daysPlayed = 0
      for (const [day, x] of Object.entries(prog.log ?? {})) {
        if (!week.has(day)) continue
        secs += x.secs ?? 0; right += x.right ?? 0; tries += x.tries ?? 0
        if ((x.secs ?? 0) > 0) daysPlayed++
      }
      const done = prog.islandsDone ?? []
      const finished = old ? done.filter((id) => !(old.islandsDone ?? []).includes(id)) : []
      const skills = prog.skills ?? {}
      const oldSkills = old?.skills ?? {}
      const levelUps = old ? Object.entries(skills).filter(([k, v]) => (oldSkills[k] ?? 0) < v).map(([k, v]) => ({ skill: k, from: oldSkills[k] ?? 0, to: v })) : []
      const boxes = Object.values(prog.remember ?? {})
      children.push({
        name: p.name, emoji: p.emoji, minutes: Math.round(secs / 60), daysPlayed, right, tries,
        islandsDone: done.length, finished, current: prog.mapAt ?? done[done.length - 1] ?? null, skills, levelUps,
        remembered: boxes.filter((m) => (m?.box ?? 0) >= 2).length, remembering: boxes.length,
        playedRemember: !!prog.rememberDay && week.has(prog.rememberDay),
        animals: (prog.bookSeen ?? []).length, pals: Object.keys(prog.pals ?? {}).length,
      })
    }
  }
  const best = new Map()
  for (const c of children) {
    const b = best.get(c.name)
    if (!b || c.minutes > b.minutes || (c.minutes === b.minutes && c.islandsDone > b.islandsDone)) best.set(c.name, c)
  }
  const list = [...best.values()]
  const played = list.filter((c) => c.daysPlayed > 0)
  const finishedThisWeek = played.flatMap((c) => c.finished)
  const pick = finishedThisWeek[finishedThisWeek.length - 1] ?? played[0]?.current ?? list[0]?.current ?? null
  return { children: list, played: played.length > 0, talk: content.islands.find((i) => i.id === pick) ?? null }
}

const SKILL_NAMES = { reading: 'Reading', numbers: 'Numbers' }
const islandName = (content, id) => content.islands.find((i) => i.id === id)?.name ?? id
const n = (k, one, many = `${one}s`) => `${k} ${k === 1 ? one : many}`

/** A child's week in a few lines (plain text; the HTML version wraps them). */
export function childLines(c, content) {
  const out = []
  if (c.daysPlayed) {
    out.push(`Played ${n(c.daysPlayed, 'day')} this week, about ${n(c.minutes, 'minute')}${c.tries ? `, and got ${c.right} of ${n(c.tries, 'answer')} right the first time` : ''}.`)
  } else out.push('Didn’t play this week.')
  if (c.finished.length) out.push(`Finished ${c.finished.map((id) => islandName(content, id)).join(', ')}. That makes ${n(c.islandsDone, 'island')} in all.`)
  else if (c.current) out.push(`${c.islandsDone ? `${n(c.islandsDone, 'island')} finished so far; ` : ''}the boat is at ${islandName(content, c.current)}.`)
  const levels = Object.entries(c.skills).map(([k, v]) => `${SKILL_NAMES[k] ?? k} level ${v}`).join(', ')
  if (levels) out.push(`${levels}.${c.levelUps.length ? ` ${c.levelUps.map((u) => `${SKILL_NAMES[u.skill] ?? u.skill} went up from ${u.from} to ${u.to}!`).join(' ')}` : ''}`)
  if (c.remembering) out.push(`Remember? round: ${c.playedRemember ? 'played this week, ' : ''}${c.remembered} of ${n(c.remembering, 'thing')} remembered well.`)
  if (c.animals) out.push(`Animal Book: ${n(c.animals, 'card')} opened.`)
  return out
}

/** The email: subject, plain text and HTML. `stopLink` is the one-tap way to stop these. */
export function weeklyEmail({ summary, family, content, site, stopLink }) {
  const { children, talk } = summary
  const sections = children.map((c) => ({ title: `${c.emoji ? `${c.emoji} ` : ''}${c.name}`, lines: childLines(c, content) }))
  const talkLines = []
  if (talk) {
    if (talk.verse) talkLines.push(`Memory verse: “${talk.verse.text}” (${talk.verse.ref}). Say it together at bedtime.`)
    if (talk.think?.[0]) talkLines.push(`Ask at dinner: ${talk.think[0].ask} (${talk.think[0].why})`)
    if (talk.bigWords?.length) talkLines.push(`Big words: ${talk.bigWords.map((b) => `${b.word} (${b.means.replace(/\.$/, '')})`).join('; ')}.`)
    if (talk.science) talkLines.push(`Try it at home (${talk.science.title}): ${talk.science.tryIt}`)
  }
  const foot = `You get this because you added your email on Ark Pals. To stop these, open ${stopLink} or untick it in Parent Corner → Grown-ups.`
  const text = [
    `This week on Ark Pals, ${family}:`,
    ...sections.map((s) => `${s.title}\n${s.lines.map((l) => `- ${l}`).join('\n')}`),
    ...(talk ? [`Talk about ${talk.name} this week:\n${talkLines.map((l) => `- ${l}`).join('\n')}`] : []),
    `Play: ${site}`,
    foot,
  ].join('\n\n')
  const block = (title, lines) => `<div style="background:#fff;border-radius:20px;padding:18px 20px;margin:0 0 14px;text-align:left">
<div style="font-size:20px;font-weight:800;color:#6d3fd1;margin-bottom:8px">${esc(title)}</div>
${lines.map((l) => `<p style="font-size:16px;line-height:1.5;margin:0 0 8px">${esc(l)}</p>`).join('\n')}</div>`
  const html = `<!doctype html><html><body style="margin:0;padding:24px;background:#fff0f7;font-family:system-ui,-apple-system,Segoe UI,sans-serif;color:#3b2a4a">
<div style="max-width:520px;margin:0 auto">
<div style="font-size:28px;font-weight:800;color:#e2468f;margin-bottom:4px;text-align:center">🌈 Ark Pals</div>
<p style="font-size:17px;text-align:center;margin:0 0 18px">This week, <b>${esc(family)}</b></p>
${sections.map((s) => block(s.title, s.lines)).join('\n')}
${talk ? block(`Talk about ${talk.name} this week`, talkLines) : ''}
<p style="text-align:center;margin:18px 0"><a href="${esc(site)}" style="display:inline-block;padding:12px 24px;background:#ff6fae;color:#fff;font-size:18px;font-weight:700;border-radius:14px;text-decoration:none">Play Ark Pals</a></p>
<p style="font-size:13px;color:#8a7a99;line-height:1.5;margin:0;text-align:center">You get this because you added your email on Ark Pals. <a href="${esc(stopLink)}" style="color:#8a7a99">Stop these emails</a>, or untick it in Parent Corner → Grown-ups.</p>
</div></body></html>`
  return { subject: `This week on Ark Pals: ${family}`, text, html }
}

/** The token on a grown-up's "stop these" link (checked, never stored). */
export const stopToken = (secret, memberId) => createHash('sha256').update(`weekly-stop:${secret}:${memberId}`).digest('base64url').slice(0, 24)

/** Whether it's time to send: Sunday (UTC), at or after `hour`. */
export const isSendTime = (now, { day = 0, hour = 22 } = {}) => { const d = new Date(now); return d.getUTCDay() === day && d.getUTCHours() >= hour }
/** The week a sending belongs to: that Sunday's date (one email a week, however many ticks). */
export const weekOf = (now) => dayOf(now - new Date(now).getUTCDay() * DAY_MS)

/** A tiny file of who was sent which week ({ memberId: week }), in the family's folder. */
export function createMarks(file) {
  const read = async () => parse(await readFile(file, 'utf8').catch(() => '')) ?? {}
  return {
    get: async (id) => (await read())[id] ?? null,
    async set(id, week) {
      const all = await read()
      all[id] = week
      await mkdir(dirname(file), { recursive: true })
      await writeFile(file, JSON.stringify(all))
    },
  }
}

/**
 * The sender. `families.weeklyRecipients()` lists who gets one; `storesFor(familyId)` gives the family's
 * `backups` (server/backup.mjs) and `weekly` marks; `site` is the address in the email; `secret` signs the stop links.
 */
export function createWeekly({ families, storesFor, mailer, content, site, secret, hour = 22, log = (m) => console.error(m) }) {
  // (`site` can be a function: the server learns its own address from requests)
  const siteNow = () => (typeof site === 'function' ? site() : site)
  async function allBackups(backups) {
    const out = []
    for (const b of await backups.list()) {
      const text = await backups.get(b.id).catch(() => null)
      const data = text && parse(text)
      if (data) out.push({ savedAt: data.savedAt ?? b.savedAt, device: b.device, keys: data.keys ?? {} })
    }
    return out
  }
  return {
    /** The email a family would get now (for the preview page). */
    async preview(familyId, familyName, memberId) {
      const summary = weekSummary(await allBackups(storesFor(familyId).backups), { content })
      const site = siteNow()
      return { summary, email: weeklyEmail({ summary, family: familyName, content, site, stopLink: `${site}/weekly/stop?m=${memberId}&t=${stopToken(secret, memberId)}` }) }
    },
    /** Sends this week's emails if it's time and they haven't gone; returns how many were sent. */
    async tick(now = Date.now()) {
      if (!mailer || !isSendTime(now, { hour })) return 0
      const week = weekOf(now)
      const site = siteNow()
      let sent = 0
      for (const r of families.weeklyRecipients()) {
        const st = storesFor(r.familyId)
        if ((await st.weekly.get(r.memberId)) === week) continue
        await st.weekly.set(r.memberId, week) // (marked first: a failure never sends twice)
        const summary = weekSummary(await allBackups(st.backups), { now, content })
        if (!summary.played) continue
        try {
          const email = weeklyEmail({ summary, family: r.familyName, content, site, stopLink: `${site}/weekly/stop?m=${r.memberId}&t=${stopToken(secret, r.memberId)}` })
          await mailer.send({ to: r.email, ...email })
          sent++
        } catch (e) { log(`weekly email to ${r.memberId}: ${e.message}`) }
      }
      return sent
    },
  }
}
