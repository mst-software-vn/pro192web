import { beforeEach, describe, expect, it } from 'vitest'
import { addRecentSearch, readRecentSearches } from './use-recent-searches'

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

describe('recent searches storage', () => {
  it('returns an empty array when nothing is stored', () => {
    expect(readRecentSearches()).toEqual([])
  })

  it('adds an entry to the front', () => {
    addRecentSearch({ slug: 'encapsulation', title: 'Encapsulation', breadcrumb: 'Encapsulation' })
    expect(readRecentSearches()).toEqual([{ slug: 'encapsulation', title: 'Encapsulation', breadcrumb: 'Encapsulation' }])
  })

  it('caps at 5 entries, most recent first', () => {
    for (let i = 0; i < 7; i++) {
      addRecentSearch({ slug: `chapter-${i}`, title: `Chapter ${i}`, breadcrumb: `Chapter ${i}` })
    }
    const result = readRecentSearches()
    expect(result).toHaveLength(5)
    expect(result[0].slug).toBe('chapter-6')
    expect(result[4].slug).toBe('chapter-2')
  })

  it('moves a re-added entry (same slug+headingId) to the front instead of duplicating', () => {
    addRecentSearch({ slug: 'a', title: 'A', breadcrumb: 'A' })
    addRecentSearch({ slug: 'b', title: 'B', breadcrumb: 'B' })
    addRecentSearch({ slug: 'a', title: 'A', breadcrumb: 'A' })
    const result = readRecentSearches()
    expect(result).toHaveLength(2)
    expect(result[0].slug).toBe('a')
    expect(result[1].slug).toBe('b')
  })

  it('treats the same slug with a different headingId as a distinct entry', () => {
    addRecentSearch({ slug: 'a', headingId: 'section-1', title: 'A / Section 1', breadcrumb: 'A › Section 1' })
    addRecentSearch({ slug: 'a', headingId: 'section-2', title: 'A / Section 2', breadcrumb: 'A › Section 2' })
    expect(readRecentSearches()).toHaveLength(2)
  })

  it('returns an empty array when the stored value is corrupted json', () => {
    localStorage.setItem('pro192-recent-searches', '{not valid json')
    expect(readRecentSearches()).toEqual([])
  })
})
