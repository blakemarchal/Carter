// Beyond the first visits: a friendly battle (to the catch), the Pal Kitchen (a whole recipe, served),
// and a practice round of each interactive learning exercise (src/learn).
import { expect, fixture, sleep, startPlayer, test, type App } from './app'
import { mark, openIsland, playSteps, solveExercise, stepKinds } from './play'
import { readFileSync } from 'node:fs'

const version = (id: string) => {
  const src = readFileSync(new URL('../src/data/islands.ts', import.meta.url), 'utf8')
  return Number(new RegExp(`\\{ id: '${id}',.*version: (\\d+)`).exec(src)?.[1] ?? 1)
}

test('a friendly battle', async ({ app }) => {
  // Noah's Ark, opened at its battle (the third visit): find where it is in the island's steps first.
  await startPlayer(app, fixture({ mapAt: 'noah' }))
  const kinds = await stepKinds(app, 'noah')
  const at = kinds.indexOf('battle')
  expect(at).toBeGreaterThan(0)
  await startPlayer(app, fixture({ mapAt: 'noah', islandStep: { noah: at }, islandStepVersion: { noah: version('noah') } }))
  await openIsland(app, 'noah')
  const played = await playSteps(app, kinds, at, kinds[at + 1])
  expect(played).toEqual(['battle'])
})

test('the Pal Kitchen', async ({ app }) => {
  await startPlayer(app, fixture())
  await app.tapOn('.ark-btn')
  await app.waitFor(`!!document.querySelector('.pal-card')`)
  await app.shot('ark')
  await app.tapOn('.pal-card')
  await app.waitFor(`!!document.querySelector('.big-btn') && [...document.querySelectorAll('.big-btn')].some((b) => b.textContent.includes('Cook'))`)
  await app.shot('home')
  await app.tapOn('.big-btn', 'Cook')
  await app.waitFor(`!!document.querySelector('.k-card .now')`, 15_000, 'the kitchen')
  const done: string[] = []
  for (let guard = 0; guard < 10; guard++) {
    const now = await app.eval<string | null>(`document.querySelector('.k-card .now')?.textContent ?? null`)
    if (!now) break
    await app.shot(`station-${guard}`)
    const next = await mark(app, `document.querySelector('.k-card .now')`)
    await cook(app, now)
    await app.waitFor(next, 30_000, `the ${now} station to finish`)
    done.push(now)
  }
  expect(done.length, 'stations cooked').toBeGreaterThan(1)
  // Serve it: the plate to the Pal.
  await app.waitFor(`!!document.querySelector('.k-plate') && !!document.querySelector('.k-pal')`, 15_000, 'the dish to serve')
  await sleep(800)
  await app.shot('serve')
  const plate = (await app.box('.k-plate'))!
  const pal = (await app.box('.k-pal'))!
  await app.drag(plate, pal, { steps: 18 })
  await app.waitFor(`!document.querySelector('.k-plate')`, 15_000, 'the dish to be served')
  await sleep(1500)
})

/** One kitchen station (components/Kitchen.tsx), by its icon. */
async function cook(app: App, icon: string) {
  if (icon === '🥣') {
    await app.waitFor(`!!document.querySelector('.k-ask b')`)
    const need = await app.eval<number>(`+document.querySelector('.k-ask b').textContent`)
    for (let k = 0; k < need; k++) {
      await app.dragSel('.k-pile .k-thing', '.k-bowl-wrap')
      await sleep(500)
    }
    await app.waitFor(`!!document.querySelector('.k-station .big-btn:not(:disabled)')`, 10_000, 'Done')
    await app.tapOn('.k-station .big-btn', 'Done')
  } else if (icon === '🥄') {
    await sleep(800)
    const b = (await app.box('.k-stir'))!
    const cx = b.x, cy = b.y - b.h * 0.1
    const pts: [number, number][] = []
    for (let i = 0; i <= 160; i++) { const a = (i / 40) * Math.PI * 2; pts.push([cx + Math.cos(a) * 90, cy + Math.sin(a) * 40]) }
    await app.dragPath(pts, 16)
  } else if (icon === '🔥') {
    await sleep(1200)
    await app.dragSel('.k-tray', '.k-oven')
  } else if (icon === '🔁') {
    await app.waitFor(`(window.__said || []).some((l) => /comes next/i.test(l))`, 10_000).catch(() => {})
    const right = await app.eval<string>(`(() => { const shown = [...document.querySelectorAll('.k-pattern > span:not(.k-slot)')].map((e) => e.textContent); return shown[shown.length - 2] })()`)
    const from = (await app.box('.k-choice', 0, right))!
    const to = (await app.box('.k-slot'))!
    await app.drag(from, to)
  } else if (icon === '🫙') {
    await app.waitFor(`(window.__said || []).some((l) => l.startsWith('Find the jar that says'))`, 10_000, 'which jar to find')
    const word = await app.eval<string>(`(window.__said || []).filter((l) => l.startsWith('Find the jar that says')).pop().replace('Find the jar that says ', '').replace('!', '')`)
    await app.tapOn('.k-jar', word)
  } else if (icon === '🔪') {
    await app.waitFor(`(window.__said || []).some((l) => l.startsWith('Cut the'))`, 10_000, 'how to cut it')
    const said = await app.eval<string>(`(window.__said || []).filter((l) => l.startsWith('Cut the')).pop()`)
    const cut = said.includes('halves') ? 'two halves' : said.includes('triangles') ? 'two triangles' : 'four pieces'
    await app.tapOn(`.k-cut[aria-label="${cut}"]`)
  } else if (icon === '🕯️') {
    for (let k = 0; k < 12 && (await app.box('.tray-candle')); k++) {
      await app.dragSel('.tray-candle', '.party-cake')
      await sleep(600)
    }
  } else throw new Error(`no cook for the station ${icon}`)
}

// A practice round of each interactive exercise, at the level that has it (src/learn/levels.ts):
// three in a row, from the learning preview (#gallery/learn/<skill>/<level>/exercise).
const EXERCISES: [kind: string, skill: string, level: number][] = [
  ['wordbuild', 'reading', 4],
  ['wordbuild', 'reading', 6], // (word families: change the first letter)
  ['sentencebuild', 'reading', 8],
  ['numberline', 'numbers', 6],
  ['clock', 'numbers', 8],
  ['coins', 'numbers', 9],
  ['measure', 'numbers', 10],
]

test.describe('a practice round of each learning exercise', () => {
  for (const [kind, skill, level] of EXERCISES) {
    test(`${kind} (${skill} level ${level})`, async ({ app }) => {
      await startPlayer(app, fixture())
      await app.page.goto(`/?e2e=${Date.now()}#gallery/learn/${skill}/${level}/exercise`)
      for (let turn = 0; turn < 3; turn++) {
        await app.waitFor(`!!document.querySelector('.ex-card')`, 15_000, `exercise ${turn + 1}`)
        await sleep(300)
        await app.shot(`${kind}-${turn}`)
        const next = await mark(app, `document.querySelector('.ex-card')`)
        expect(await solveExercise(app)).toBe(kind)
        await app.waitFor(next, 20_000, `exercise ${turn + 1} to be solved`)
      }
    })
  }
})
