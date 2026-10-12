// The house voices: the owner's family recorded once, for every family. Clips by voice and fingerprint, the
// child's voice private to the owner's family unless the owner shares a clip, promoting the owner family's
// own recordings, and only the owner changing any of it. And /tts never makes a new line by itself.
import { EventEmitter } from 'node:events'
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it, vi } from 'vitest'
import { createHouse, handleHouse } from './house.mjs'
import { createTtsCache } from './tts.mjs'

const folder = () => mkdtempSync(join(tmpdir(), 'arkpals-house-'))
const id = (n) => n.toString(16).padStart(16, '0')
let t = Date.UTC(2026, 9, 12)
const house = (dir = folder()) => createHouse(dir, { clock: () => (t += 1000) })

function fakeReq({ method = 'GET', body = Buffer.alloc(0), headers = {} } = {}) {
  return { method, headers, async *[Symbol.asyncIterator]() { if (body.length) yield body } }
}
function fakeRes() {
  const res = new EventEmitter()
  res.body = Buffer.alloc(0)
  res.writeHead = (status, headers) => { res.status = status; res.headers = headers }
  res.end = (c) => { if (c) res.body = Buffer.concat([res.body, Buffer.from(c)]); res.emit('finish') }
  return res
}
const call = async (h, method, path, who, body) => {
  const res = fakeRes()
  await handleHouse(fakeReq({ method, body: body ? Buffer.from(body) : undefined, headers: { 'content-type': 'audio/mp4' } }), res, new URL(`http://x${path}`), h, who)
  return res
}
const OWNER = { own: true, owner: true, familyRecordingsDir: '' }
const OWNERS_FAMILY = { own: true, owner: false } // (a grandparent in the owner's family)
const OTHER = { own: false, owner: false }

describe('the house voices', () => {
  it('keeps clips by voice and fingerprint, with what they are, their trim and loudness', async () => {
    const h = house()
    const c = await h.put('mom', id(1), 'audio/mp4', Buffer.alloc(500, 1), { key: 'Great job!', ref: 'praise:0', start: '120', end: '980', gain: '1.4' })
    expect(c).toMatchObject({ ext: 'm4a', key: 'Great job!', ref: 'praise:0', start: 120, end: 980, gain: 1.4, bytes: 500 })
    expect((await h.get('mom', id(1))).body.length).toBe(500)
    const m = await h.manifest()
    expect(m.clips.mom[id(1)]).toEqual([c.at.toString(36), 120, 980, 1.4])
    expect(m.voices).toMatchObject({ mom: { label: 'Mom' }, dad: { label: 'Dad' } })
    // (re-recorded: a new version, so devices fetch it again)
    const again = await h.put('mom', id(1), 'audio/webm', Buffer.alloc(300, 2), {})
    expect(again.at).toBeGreaterThan(c.at)
    expect(again).toMatchObject({ ext: 'webm', key: 'Great job!', ref: 'praise:0' })
    await h.remove('mom', id(1))
    expect(await h.get('mom', id(1))).toBeNull()
    await expect(h.put('mom', 'nope', 'audio/mp4', Buffer.alloc(1))).rejects.toMatchObject({ status: 400 })
    await expect(h.put('Mom!', id(2), 'audio/mp4', Buffer.alloc(1))).rejects.toMatchObject({ status: 400 })
    await expect(h.put('mom', id(2), 'text/html', Buffer.alloc(1))).rejects.toMatchObject({ status: 415 })
  })

  it('survives a restart (index.json)', async () => {
    const dir = folder()
    await house(dir).put('dad', id(7), 'audio/mp4', Buffer.alloc(10), { key: 'Grr!' })
    const m = await house(dir).manifest()
    expect(Object.keys(m.clips.dad)).toEqual([id(7)])
  })

  it('the child’s voice is for the owner’s family only, until the owner shares a clip', async () => {
    const h = house()
    await h.put('child', id(1), 'audio/mp4', Buffer.alloc(10), { key: 'Yes, please!' })
    await h.put('child', id(2), 'audio/mp4', Buffer.alloc(10), { key: 'Hee hee! That tickles!' })
    expect((await h.manifest()).clips.child).toBeUndefined()
    expect(Object.keys((await h.manifest({ own: true })).clips.child)).toHaveLength(2)
    expect((await call(h, 'GET', `/voice/house/child/${id(1)}?v=1`, OTHER)).status).toBe(404)
    expect((await call(h, 'GET', `/voice/house/child/${id(1)}?v=1`, OWNERS_FAMILY)).status).toBe(200)
    await h.setShared('child', id(1), true)
    expect(Object.keys((await h.manifest()).clips.child)).toEqual([id(1)])
    expect((await call(h, 'GET', `/voice/house/child/${id(1)}?v=1`, OTHER)).status).toBe(200)
    expect((await call(h, 'GET', `/voice/house/child/${id(2)}?v=1`, OTHER)).status).toBe(404)
    // (sharing is the owner's alone)
    expect((await call(h, 'POST', '/voice/house/share', OWNERS_FAMILY, JSON.stringify({ voice: 'child', id: id(2), shared: true }))).status).toBe(403)
    expect((await call(h, 'POST', '/voice/house/share', OWNER, JSON.stringify({ voice: 'child', id: id(2), shared: true }))).status).toBe(204)
    expect(Object.keys((await h.manifest()).clips.child)).toHaveLength(2)
  })

  it('promotes the owner family’s own recordings into a house voice, under the same fingerprints', async () => {
    const h = house()
    const fam = folder()
    writeFileSync(join(fam, `${id(1)}.m4a`), Buffer.alloc(20))
    writeFileSync(join(fam, `${id(2)}.webm`), Buffer.alloc(30))
    writeFileSync(join(fam, 'notes.txt'), 'not a recording')
    await h.put('mom', id(2), 'audio/mp4', Buffer.alloc(99), { key: 'kept' })
    const res = await call(h, 'POST', '/voice/house/promote', { ...OWNER, familyRecordingsDir: fam }, JSON.stringify({ voice: 'mom' }))
    expect(JSON.parse(res.body.toString())).toEqual({ copied: 1, had: 1 })
    expect((await h.get('mom', id(1))).body.length).toBe(20)
    expect((await h.get('mom', id(2))).body.length).toBe(99) // (what the voice had stays)
    expect((await call(h, 'POST', '/voice/house/promote', OWNERS_FAMILY, '{}')).status).toBe(403)
  })

  it('every family may listen; only the owner records, deletes, names voices or reads the index', async () => {
    const h = house()
    expect((await call(h, 'PUT', `/voice/house/mom/${id(1)}?key=Hi`, OTHER, 'x')).status).toBe(403)
    expect((await call(h, 'PUT', `/voice/house/mom/${id(1)}?key=Hi&start=50`, OWNER, 'xyz')).status).toBe(200)
    expect((await call(h, 'DELETE', `/voice/house/mom/${id(1)}`, OTHER)).status).toBe(403)
    expect((await call(h, 'GET', '/voice/house/index', OTHER)).status).toBe(403)
    const ix = JSON.parse((await call(h, 'GET', '/voice/house/index', OWNER)).body.toString())
    expect(ix.clips.mom[id(1)]).toMatchObject({ key: 'Hi', start: 50 })
    const list = await call(h, 'GET', '/voice/house', OTHER)
    expect(JSON.parse(list.body.toString()).clips.mom[id(1)]).toBeTruthy()
    const audio = await call(h, 'GET', `/voice/house/mom/${id(1)}?v=abc`, OTHER)
    expect(audio.headers['Cache-Control']).toMatch(/immutable/)
    expect((await call(h, 'POST', '/voice/house/voice', OWNER, JSON.stringify({ voice: 'dad', label: 'Papa' }))).status).toBe(204)
    expect((await h.manifest()).voices.dad.label).toBe('Papa')
  })
})

describe('/tts in the public game', () => {
  it('plays only clips made ahead of time: never asks xAI for a new line', async () => {
    const dir = folder()
    mkdirSync(dir, { recursive: true })
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(Buffer.from('mp3'), { status: 200 }))
    const tts = createTtsCache({ apiKey: 'not-a-key', dir, dailyChars: 1000 })
    expect(await tts.cached('Way to go, Olivia!', 'ara', '1')).toBeNull()
    expect(fetchSpy).not.toHaveBeenCalled()
    await tts('Great job!', 'ara', '1') // (warming, on the server: made once)
    expect(fetchSpy).toHaveBeenCalledTimes(1)
    expect((await tts.cached('Great job!', 'ara', '1')).toString()).toBe('mp3')
    fetchSpy.mockRestore()
  })
})
