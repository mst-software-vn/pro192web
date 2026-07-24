import { describe, expect, it } from 'vitest'
import { bandForHour } from './use-simulated-visitor-count'

describe('bandForHour', () => {
  it('returns the peak evening band for study hours (19h-23h)', () => {
    expect(bandForHour(19)).toEqual([150, 320])
    expect(bandForHour(23)).toEqual([150, 320])
  })

  it('returns the daytime band for class/work hours (7h-18h)', () => {
    expect(bandForHour(7)).toEqual([60, 150])
    expect(bandForHour(18)).toEqual([60, 150])
  })

  it('returns the late-night band outside study and daytime hours (0h-6h)', () => {
    expect(bandForHour(0)).toEqual([20, 60])
    expect(bandForHour(6)).toEqual([20, 60])
  })

  it('always returns a band where min is less than or equal to max', () => {
    for (let hour = 0; hour < 24; hour++) {
      const [min, max] = bandForHour(hour)
      expect(min).toBeLessThanOrEqual(max)
    }
  })
})
