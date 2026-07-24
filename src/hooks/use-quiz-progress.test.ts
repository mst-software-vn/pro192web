import { beforeEach, describe, expect, it } from 'vitest'
import { readQuizProgress, writeQuizProgress } from './use-quiz-progress'

class MemoryStorage implements Storage {
  private store = new Map<string, string>()
  get length() {
    return this.store.size
  }
  clear() {
    this.store.clear()
  }
  getItem(key: string) {
    return this.store.has(key) ? this.store.get(key)! : null
  }
  key(index: number) {
    return Array.from(this.store.keys())[index] ?? null
  }
  removeItem(key: string) {
    this.store.delete(key)
  }
  setItem(key: string, value: string) {
    this.store.set(key, value)
  }
}

beforeEach(() => {
  globalThis.localStorage = new MemoryStorage()
})

describe('quiz progress storage', () => {
  it('returns null when nothing is stored yet', () => {
    expect(readQuizProgress('encapsulation')).toBeNull()
  })

  it('round-trips a written progress record', () => {
    writeQuizProgress('encapsulation', { score: 4, total: 5, completedAt: '2026-07-24T00:00:00.000Z' })
    expect(readQuizProgress('encapsulation')).toEqual({ score: 4, total: 5, completedAt: '2026-07-24T00:00:00.000Z' })
  })

  it('keeps progress separate per chapter slug', () => {
    writeQuizProgress('encapsulation', { score: 4, total: 5, completedAt: '2026-07-24T00:00:00.000Z' })
    writeQuizProgress('inheritance', { score: 2, total: 5, completedAt: '2026-07-24T00:00:00.000Z' })
    expect(readQuizProgress('encapsulation')?.score).toBe(4)
    expect(readQuizProgress('inheritance')?.score).toBe(2)
  })

  it('returns null when the stored value is corrupted JSON', () => {
    localStorage.setItem('pro192-quiz-broken', '{not valid json')
    expect(readQuizProgress('broken')).toBeNull()
  })
})
