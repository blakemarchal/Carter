// Checks from the fresh-eyes review of the learning backbone (wave 8).
import { describe, expect, it } from 'vitest'
import { clockHourEx } from '../learn/topics/time-money'

describe('setting the clock', () => {
  it('gives each moment of the day its own hour (no breakfast and bedtime both at 8)', () => {
    const momentsAt = new Map<number, Set<string>>()
    for (let i = 0; i < 2000; i++) {
      const ex = clockHourEx()! as unknown as { hour: number; key: string }
      const moment = ex.key.split(':')[2]
      if (!moment) continue
      if (!momentsAt.has(ex.hour)) momentsAt.set(ex.hour, new Set())
      momentsAt.get(ex.hour)!.add(moment)
    }
    expect(momentsAt.size).toBeGreaterThan(5)
    for (const [hour, ids] of momentsAt) expect([...ids], `hour ${hour}`).toHaveLength(1)
  })
})
