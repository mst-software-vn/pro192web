import { beforeEach, describe, expect, it } from 'vitest'
import { readTocCollapsed, writeTocCollapsed } from './use-toc-collapsed'

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

describe('toc collapsed storage', () => {
  it('defaults to false (expanded) when nothing is stored yet', () => {
    expect(readTocCollapsed()).toBe(false)
  })

  it('round-trips a written value', () => {
    writeTocCollapsed(true)
    expect(readTocCollapsed()).toBe(true)
  })

  it('can be toggled back to false', () => {
    writeTocCollapsed(true)
    writeTocCollapsed(false)
    expect(readTocCollapsed()).toBe(false)
  })
})
