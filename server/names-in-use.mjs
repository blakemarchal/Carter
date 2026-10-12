// The children's names families use, for the owner's studio (GET /voice/names): so the house narrator can
// record the names that aren't in the name library yet. Counts only, and only a name used by MIN_FAMILIES
// or more families, so no one family's child can be picked out. Read from each family's newest backup (the
// players who aren't grown-ups, and the brothers and sisters in its cast).

export const MIN_FAMILIES = 3

const parse = (s) => { try { return JSON.parse(s) } catch { return null } }
const clean = (n) => String(n ?? '').replace(/\s+/g, ' ').trim().slice(0, 16)

/** The children's names in one backup (its JSON text). */
export function familyNames(backupText) {
  const keys = parse(backupText)?.keys ?? {}
  const ns = keys['ark-pals:profiles'] ? 'ark-pals' : 'carters-ark'
  const players = (parse(keys[`${ns}:profiles`])?.list ?? []).filter((p) => !p.grownup).map((p) => clean(p.name))
  const siblings = (parse(keys[`${ns}:family`])?.siblings ?? []).map((s) => clean(s.name))
  return [...players, ...siblings].filter((n) => n && n.toLowerCase() !== 'player')
}

/** Names used by `min` or more families: [{ name, families }], most used first. Same name in any case counts once. */
export function namesInUse(perFamily, min = MIN_FAMILIES) {
  const count = new Map()
  for (const names of perFamily) {
    const seen = new Set()
    for (const n of names) {
      const k = n.toLowerCase()
      if (seen.has(k)) continue
      seen.add(k)
      const c = count.get(k) ?? { spellings: new Map(), families: 0 }
      c.families++
      c.spellings.set(n, (c.spellings.get(n) ?? 0) + 1)
      count.set(k, c)
    }
  }
  return [...count.values()]
    .filter((c) => c.families >= min)
    .map((c) => ({ name: [...c.spellings].sort((a, b) => b[1] - a[1])[0][0], families: c.families }))
    .sort((a, b) => b.families - a.families || a.name.localeCompare(b.name))
}
