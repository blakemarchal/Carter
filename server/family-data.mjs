// A family's own data, all of it: the download a parent can make, and deleting it with the family
// (docs/legal/PRIVACY.md). `st` is the family's stores (server/index.mjs storesFor): backups,
// recordings, songs and play totals, and `dir`, the folder that is all this family's (null for the
// first family, whose files sit where they always were).
import { rm } from 'node:fs/promises'

/**
 * Writes everything Ark Pals keeps for a family, as one JSON file to download: its grown-ups and devices,
 * every progress backup, every recording and song (audio as base64), and its play totals. Written a piece
 * at a time, since recordings and songs can be big.
 */
export async function writeFamilyExport(res, families, familyId, st) {
  const write = async (chunk) => { if (!res.write(chunk)) await new Promise((r) => res.once('drain', r)) }
  const list = async (items, each) => {
    let n = 0
    for (const it of items) {
      const out = await each(it)
      if (out) await write((n++ ? ',' : '') + out)
    }
  }
  const info = families.exportFamily(familyId)
  res.writeHead(200, {
    'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store',
    'Content-Disposition': `attachment; filename="ark-pals-family-${new Date().toISOString().slice(0, 10)}.json"`,
  })
  await write(`{"exportedAt":${JSON.stringify(new Date().toISOString())},"family":${JSON.stringify(info.family)},`
    + `"members":${JSON.stringify(info.members)},"devices":${JSON.stringify(info.devices)},`
    + `"playTotals":${JSON.stringify(await st.stats.get())},"backups":[`)
  await list(await st.backups.list(), async (b) => {
    const text = await st.backups.get(b.id)
    return text && `{"id":${JSON.stringify(b.id)},"savedAt":${JSON.stringify(b.savedAt)},"label":${JSON.stringify(b.label)},"data":${text}}`
  })
  await write('],"recordings":[')
  await list(await st.recordings.list(), async (id) => {
    const r = await st.recordings.get(id)
    return r && JSON.stringify({ id, type: r.type, base64: r.body.toString('base64') })
  })
  await write('],"songs":[')
  await list(await st.songs.list(), async (song) => {
    const a = song.audio ? await st.songs.getAudio(song.id) : null
    return JSON.stringify({ ...song, audio: a ? { type: a.type, base64: a.body.toString('base64') } : null })
  })
  await write(']}')
  res.end()
}

/**
 * Deletes a family: its grown-ups, devices and invitations, and its folder with every backup, recording,
 * song and play total. (The first family can't be deleted: families.deleteFamily refuses, 409.)
 */
export async function deleteFamilyData(families, familyId, st) {
  families.deleteFamily(familyId)
  await st.stats.clear()
  if (st.dir && /^fam_[A-Za-z0-9_-]+$/.test(familyId)) await rm(st.dir, { recursive: true, force: true })
}
