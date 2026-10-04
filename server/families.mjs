// Families (docs/BUSINESS-PLAN.md §4): who may sign in, and whose data they see. A family has grown-ups
// (members: parents, and other grown-ups like grandparents), each signed in on one or more devices.
// Nobody types a password: a device joins with a one-time link, either an invitation a parent makes in
// the Parent Corner ("Invite a grown-up"), or "sign in another device" for yourself. New families start
// from a link the site owner makes (server/new-family-link.mjs). The first family on a server is the one
// that used to share a single family password; that password still signs its devices in, as its parents.
// Kept in SQLite (node:sqlite: no dependencies), next to the families' files.
import { createHash, randomBytes } from 'node:crypto'
import { DatabaseSync } from 'node:sqlite'

/** Parents can invite and remove people; other grown-ups (grandparents, aunts…) can't. */
export const ROLES = ['parent', 'grownup']
/** How long each kind of link works for, in days. */
const LINK_DAYS = { member: 7, device: 1, family: 30 }

const newId = (prefix) => `${prefix}_${randomBytes(9).toString('base64url')}`
const hashToken = (t) => createHash('sha256').update(t).digest('base64url')
const DAY = 24 * 3600_000

/** A person's or family's name: trimmed, 1 to 40 characters, nothing odd. */
export function cleanName(v) {
  const s = String(v ?? '').replace(/[\u0000-\u001f\u007f<>]/g, '').replace(/\s+/g, ' ').trim()
  if (!s || s.length > 40) throw Object.assign(new Error('bad name'), { status: 400 })
  return s
}

/** An avatar look ({ base, skin, hairColor, color }): kept as JSON, checked loosely, small. */
export function cleanLook(v) {
  if (v == null) return null
  const ok = typeof v === 'object' && !Array.isArray(v) && Object.values(v).every((x) => typeof x === 'string' && x.length <= 20)
  const json = ok ? JSON.stringify(v) : ''
  if (!ok || json.length > 300) throw Object.assign(new Error('bad look'), { status: 400 })
  return json
}

export function openFamilies(file, { clock = () => Date.now() } = {}) {
  const db = new DatabaseSync(file)
  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS meta (key TEXT PRIMARY KEY, value TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS families (id TEXT PRIMARY KEY, name TEXT NOT NULL, created INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS members (
      id TEXT PRIMARY KEY, family_id TEXT NOT NULL REFERENCES families(id) ON DELETE CASCADE,
      name TEXT NOT NULL, role TEXT NOT NULL, look TEXT, created INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS devices (
      id TEXT PRIMARY KEY, family_id TEXT NOT NULL REFERENCES families(id) ON DELETE CASCADE,
      member_id TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
      label TEXT NOT NULL, created INTEGER NOT NULL, seen INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS links (
      id TEXT PRIMARY KEY, token_hash TEXT NOT NULL UNIQUE, kind TEXT NOT NULL,
      family_id TEXT REFERENCES families(id) ON DELETE CASCADE, member_id TEXT REFERENCES members(id) ON DELETE CASCADE,
      name TEXT, role TEXT, made_by TEXT, created INTEGER NOT NULL, expires INTEGER NOT NULL, used INTEGER);
  `)
  const q = (sql) => db.prepare(sql)
  const meta = (key) => q('SELECT value FROM meta WHERE key = ?').get(key)?.value
  const setMeta = (key, value) => q('INSERT INTO meta (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value').run(key, value)
  const tx = (fn) => {
    db.exec('BEGIN IMMEDIATE')
    try {
      const r = fn()
      db.exec('COMMIT')
      return r
    } catch (e) {
      db.exec('ROLLBACK')
      throw e
    }
  }

  const addFamily = (name) => {
    const id = newId('fam')
    q('INSERT INTO families (id, name, created) VALUES (?, ?, ?)').run(id, cleanName(name), clock())
    return id
  }
  const addMember = (familyId, name, role, look = null) => {
    if (!ROLES.includes(role)) throw Object.assign(new Error('bad role'), { status: 400 })
    const id = newId('mem')
    q('INSERT INTO members (id, family_id, name, role, look, created) VALUES (?, ?, ?, ?, ?, ?)').run(id, familyId, cleanName(name), role, look, clock())
    return id
  }
  const addDevice = (familyId, memberId, label) => {
    const id = newId('dev')
    const t = clock()
    q('INSERT INTO devices (id, family_id, member_id, label, created, seen) VALUES (?, ?, ?, ?, ?, ?)').run(id, familyId, memberId, String(label || 'A device').slice(0, 40), t, t)
    return id
  }

  // The first family: the one that shared a single family password before families existed.
  if (!meta('first_family')) {
    tx(() => {
      const fam = addFamily('Our family')
      setMeta('first_family', fam)
      setMeta('first_member', addMember(fam, 'Grown-ups', 'parent'))
    })
  }

  const api = {
    /** The first family's id: its data stays where it always was. */
    firstFamily: () => meta('first_family'),

    /**
     * A device signing in with the old family password joins the first family, as its parents. With `key`
     * (a sign-in cookie from before families), that cookie always means the same device: it's made once,
     * and once it has been signed out the cookie doesn't work anymore (null).
     */
    passwordDevice(label, key = null) {
      const fam = meta('first_family')
      // (the parents the password was for; if they've since been removed, the family's first parent)
      const member = q('SELECT id FROM members WHERE id = ? AND family_id = ?').get(meta('first_member'), fam)?.id
        ?? q("SELECT id FROM members WHERE family_id = ? AND role = 'parent' ORDER BY created LIMIT 1").get(fam).id
      if (!key) return addDevice(fam, member, label)
      return tx(() => {
        const k = `legacy:${hashToken(key)}`
        const had = meta(k)
        if (had) return q('SELECT id FROM devices WHERE id = ?').get(had) ? had : null
        const id = addDevice(fam, member, label)
        setMeta(k, id)
        return id
      })
    },

    /** Who a device is: { device, member, family }, or null if it's unknown (or was signed out). */
    session(deviceId) {
      const r = q(`SELECT d.id AS device_id, d.label, d.seen, m.id AS member_id, m.name AS member_name, m.role, m.look,
                    f.id AS family_id, f.name AS family_name
                   FROM devices d JOIN members m ON m.id = d.member_id JOIN families f ON f.id = d.family_id WHERE d.id = ?`).get(String(deviceId))
      if (!r) return null
      return {
        device: { id: r.device_id, label: r.label, seen: r.seen },
        member: { id: r.member_id, name: r.member_name, role: r.role, look: r.look ? JSON.parse(r.look) : null },
        family: { id: r.family_id, name: r.family_name },
      }
    },

    /** Notes that a device was used (at most every ten minutes). True when it was noted. */
    seen(deviceId) {
      const t = clock()
      return q('UPDATE devices SET seen = ? WHERE id = ? AND seen < ?').run(t, deviceId, t - 10 * 60_000).changes > 0
    },

    /**
     * A one-time link. kind 'member': invites a new grown-up (name, role) into a family; 'device': signs
     * another device in as an existing member; 'family': starts a new family (made by the site owner).
     * Returns the secret token (only its hash is kept) and when it stops working.
     */
    makeLink({ kind, familyId = null, memberId = null, name = null, role = null, madeBy = null }) {
      if (!(kind in LINK_DAYS)) throw Object.assign(new Error('bad kind'), { status: 400 })
      if (kind === 'member') {
        name = cleanName(name)
        if (!ROLES.includes(role)) throw Object.assign(new Error('bad role'), { status: 400 })
      }
      const token = randomBytes(24).toString('base64url')
      const id = newId('lnk')
      const expires = clock() + LINK_DAYS[kind] * DAY
      q(`INSERT INTO links (id, token_hash, kind, family_id, member_id, name, role, made_by, created, expires)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(id, hashToken(token), kind, familyId, memberId, name, role, madeBy, clock(), expires)
      return { id, token, expires }
    },

    /** A link that still works: { kind, name, role, family, member } (for the page that opens it), or null. */
    peekLink(token) {
      const l = q('SELECT * FROM links WHERE token_hash = ?').get(hashToken(String(token)))
      if (!l || l.used || l.expires < clock()) return null
      const family = l.family_id ? q('SELECT id, name FROM families WHERE id = ?').get(l.family_id) : null
      const member = l.member_id ? q('SELECT id, name FROM members WHERE id = ?').get(l.member_id) : null
      if ((l.kind !== 'family' && !family) || (l.kind === 'device' && !member)) return null
      return { kind: l.kind, name: l.name, role: l.role, family: family ? { ...family } : null, member: member ? { ...member } : null }
    },

    /**
     * Opens a link on a device: it's used up, and the device is signed in. For a 'family' link, `familyName`
     * and `yourName` start the family. Returns the new device's id, or null if the link doesn't work.
     */
    useLink(token, { label, familyName, yourName } = {}) {
      return tx(() => {
        const l = q('SELECT * FROM links WHERE token_hash = ?').get(hashToken(String(token)))
        if (!l || l.used || l.expires < clock()) return null
        let familyId = l.family_id, memberId = l.member_id
        if (l.kind === 'family') {
          familyId = addFamily(familyName)
          memberId = addMember(familyId, yourName, 'parent')
        } else if (l.kind === 'member') {
          memberId = addMember(familyId, l.name, l.role)
        }
        q('UPDATE links SET used = ? WHERE id = ?').run(clock(), l.id)
        return addDevice(familyId, memberId, label)
      })
    },

    /** Everything the Parent Corner shows about a family. */
    view(familyId, deviceId) {
      const family = q('SELECT id, name FROM families WHERE id = ?').get(familyId)
      const members = q('SELECT id, name, role, look, created FROM members WHERE family_id = ? ORDER BY created').all(familyId)
      const devices = q(`SELECT d.id, d.label, d.seen, d.member_id FROM devices d WHERE d.family_id = ? ORDER BY d.seen DESC`).all(familyId)
      const links = q(`SELECT id, name, role, expires FROM links WHERE family_id = ? AND kind = 'member' AND used IS NULL AND expires > ? ORDER BY created`).all(familyId, clock())
      return {
        family: { ...family },
        members: members.map((m) => ({ id: m.id, name: m.name, role: m.role, look: m.look ? JSON.parse(m.look) : null })),
        devices: devices.map((d) => ({ id: d.id, label: d.label, seen: d.seen, member: d.member_id, mine: d.id === deviceId })),
        invites: links.map((l) => ({ ...l })),
      }
    },

    renameFamily(familyId, name) {
      q('UPDATE families SET name = ? WHERE id = ?').run(cleanName(name), familyId)
    },
    updateMember(familyId, memberId, { name, look } = {}) {
      if (name !== undefined) q('UPDATE members SET name = ? WHERE id = ? AND family_id = ?').run(cleanName(name), memberId, familyId)
      if (look !== undefined) q('UPDATE members SET look = ? WHERE id = ? AND family_id = ?').run(cleanLook(look), memberId, familyId)
    },
    /** Removes a grown-up and signs out all their devices. A family always keeps at least one parent. */
    removeMember(familyId, memberId) {
      return tx(() => {
        const m = q('SELECT role FROM members WHERE id = ? AND family_id = ?').get(memberId, familyId)
        if (!m) return false
        if (m.role === 'parent' && q("SELECT COUNT(*) AS n FROM members WHERE family_id = ? AND role = 'parent'").get(familyId).n <= 1) {
          throw Object.assign(new Error('last parent'), { status: 409 })
        }
        q('DELETE FROM members WHERE id = ?').run(memberId)
        return true
      })
    },
    /** A better name for a device than its browser gave (an iPad says it's a Mac). */
    relabelDevice(familyId, deviceId, label) {
      q('UPDATE devices SET label = ? WHERE id = ? AND family_id = ?').run(cleanName(label), deviceId, familyId)
    },
    /** Signs a device out (it will need a new link to come back). */
    removeDevice(familyId, deviceId) {
      return q('DELETE FROM devices WHERE id = ? AND family_id = ?').run(deviceId, familyId).changes > 0
    },
    cancelLink(familyId, linkId) {
      return q('DELETE FROM links WHERE id = ? AND family_id = ? AND used IS NULL').run(linkId, familyId).changes > 0
    },
    close: () => db.close(),
  }
  return api
}
