import { useState } from 'react'

export interface RecentSearchEntry {
  slug: string
  headingId?: string
  title: string
  breadcrumb: string
}

const STORAGE_KEY = 'pro192-recent-searches'
const MAX_ENTRIES = 5

export function readRecentSearches(): RecentSearchEntry[] {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return []
  try {
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as RecentSearchEntry[]) : []
  } catch {
    return []
  }
}

function isSameEntry(a: RecentSearchEntry, b: RecentSearchEntry): boolean {
  return a.slug === b.slug && a.headingId === b.headingId
}

export function addRecentSearch(entry: RecentSearchEntry): RecentSearchEntry[] {
  const withoutDuplicate = readRecentSearches().filter((item) => !isSameEntry(item, entry))
  const next = [entry, ...withoutDuplicate].slice(0, MAX_ENTRIES)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  return next
}

export function useRecentSearches() {
  const [recent, setRecent] = useState<RecentSearchEntry[]>(() => readRecentSearches())

  function record(entry: RecentSearchEntry) {
    setRecent(addRecentSearch(entry))
  }

  return { recent, record }
}
