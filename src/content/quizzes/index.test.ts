import { describe, expect, it } from 'vitest'
import { getQuizPool } from './index'

describe('getQuizPool', () => {
  it('returns the question bank for a chapter that has one', () => {
    const pool = getQuizPool('dong-goi')
    expect(pool.length).toBeGreaterThan(0)
    expect(pool[0].id).toContain('dong-goi')
  })

  it('returns an empty array for a chapter with no quiz file', () => {
    expect(getQuizPool('does-not-exist')).toEqual([])
  })
})
