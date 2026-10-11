// One visit of every island: from the map, through each step of its first visit (the story, the
// activities, the mini-game), to the end of the visit and back to the map. A picture of every step.
import { ISLANDS, expect, fixture, startPlayer, test } from './app'
import { openIsland, playSteps, stepKinds } from './play'

test.describe('one visit of every island', () => {
  for (const { id } of ISLANDS) {
    test(id, async ({ app }) => {
      await startPlayer(app, fixture({ mapAt: id }))
      await openIsland(app, id)
      const kinds = await stepKinds(app, id)
      const played = await playSteps(app, kinds, 0)
      expect(played.length, 'steps played before the end of the visit').toBeGreaterThan(1)
      // The end of the visit: "To be continued…", then back to the map.
      await app.waitFor(`!!document.querySelector('.visit-pause')`, 20_000, 'the end of the visit')
      await app.tapOn('.visit-pause .big-btn') // (🗺️ Map)
      await app.waitFor(`!!document.querySelector('.sea-map')`, 15_000, 'the map again')
      const saved = await app.eval<number>(`JSON.parse(localStorage.getItem('ark-pals:v1:tester')).islandStep[${JSON.stringify(id)}]`)
      expect(saved, 'the next visit starts after the pause').toBe(kinds.indexOf('pause') + 1)
    })
  }
})
