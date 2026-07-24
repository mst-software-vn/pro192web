# Docs Search Modal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `⌘K`/`Ctrl+K` search modal to the `/docs/*` area that matches chapter titles and in-body H2/H3 headings (in the current display language), shows recent-searches when the query is empty, and navigates to the exact heading on selection.

**Architecture:** A client-side search index (`buildSearchIndex`) is built at modal-open time from the already-loaded `chapters` data plus the existing `extractHeadings` utility, searched via Fuse.js against diacritics-stripped fields. A small `use-recent-searches` hook persists the last 5 clicked results to localStorage (same pattern as the quiz feature's `use-quiz-progress`). `DocsLayout`'s existing scroll-to-top effect is fixed to scroll to a URL hash's target element when present, which is what makes heading-level navigation actually land in the right place.

**Tech Stack:** React 19, TypeScript 6 (strict), Fuse.js (new devDependency — user-approved), Vitest (already present from the quiz feature), Tailwind CSS v4 utility classes reusing existing Docs semantic tokens.

## Global Constraints

- No `any` anywhere; every new file fully typed (project-wide TypeScript strict rule).
- Tailwind v4 utility classes only; reuse existing semantic tokens (`bg-canvas`, `bg-panel`, `text-ink`/`text-ink-muted`/`text-ink-faint`, `border-hairline`/`border-hairline-strong`, `bg-accent/10` for the highlighted row) — no new colors needed for this feature.
- `oxlint` and `tsc -b --noEmit` must stay clean after every task.
- One commit per task, commit message lowercase, single line, `type: subject` format, no `Co-Authored-By` trailer (enforced by `.husky/commit-msg`).
- `fuse.js` is the one new npm dependency for this feature (user-approved) — do not add any other dependency (no jsdom, no @testing-library/react) without asking first.
- Search matches only within the currently displayed language (`vi` or `en`), never mixing both.
- Search is scoped to the Docs area only — `SearchModal` must not be rendered from the Landing page.
- No "Ask Assistant" / AI panel — that part of the reference screenshots does not apply here.

---

## File Structure

```
package.json                              — modify: add fuse.js devDependency

src/lib/search-index.ts                   — create: stripDiacritics, buildSearchIndex (pure, unit-tested)
src/lib/search-index.test.ts              — create

src/hooks/use-recent-searches.ts          — create: readRecentSearches/addRecentSearch + useRecentSearches hook
src/hooks/use-recent-searches.test.ts     — create

src/hooks/use-search-shortcut.ts          — create: ⌘K/Ctrl+K global keydown hook

src/layout/DocsLayout.tsx                 — modify: scroll-to-hash-target fix

src/components/search/SearchModal.tsx     — create: the modal UI + keyboard nav + activation

src/components/SearchField.tsx            — modify: becomes a real trigger button (existing file, currently UI-only)
src/layout/DocsHeader.tsx                 — modify: owns modal open/close state, renders SearchModal, wires the shortcut
```

---

### Task 1: Add Fuse.js

**Files:**
- Modify: `package.json`

**Interfaces:**
- Produces: the `fuse.js` package available for import as `import Fuse from 'fuse.js'` in later tasks.

- [ ] **Step 1: Install Fuse.js**

Run: `npm install fuse.js`

Expected: `package.json` gains a `fuse.js` entry under `dependencies` (it is a runtime dependency, not a dev-only one — the app imports it in production code); `package-lock.json` updates.

- [ ] **Step 2: Typecheck and lint**

Run: `npx tsc -b --noEmit && npx oxlint`
Expected: no new errors (Fuse.js ships its own TypeScript types, no `@types/` package needed).

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add fuse.js for docs search"
```

---

### Task 2: Search index builder (`stripDiacritics`, `buildSearchIndex`)

**Files:**
- Create: `src/lib/search-index.ts`
- Test: `src/lib/search-index.test.ts`

**Interfaces:**
- Consumes: `Chapter` type (`src/content/types.ts`), `extractHeadings` (`src/lib/markdown.ts`, already exists — returns `{ id: string; text: string; depth: 2 | 3 }[]`).
- Produces: `SearchEntry` type, `stripDiacritics(text: string): string`, `buildSearchIndex(chapters: Chapter[], language: 'vi' | 'en'): SearchEntry[]` — `SearchModal` (Task 6) imports both `stripDiacritics` and `buildSearchIndex` from this exact path.

- [ ] **Step 1: Write the failing tests**

Create `src/lib/search-index.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import type { Chapter } from '../content/types'
import { buildSearchIndex, stripDiacritics } from './search-index'

function makeChapter(overrides: Partial<Chapter> = {}): Chapter {
  return {
    slug: 'test-chapter',
    title: 'Chương thử',
    description: 'Mô tả',
    titleEn: 'Test Chapter',
    descriptionEn: 'Description',
    group: 'Test',
    status: 'published',
    body: '## Heading One\n\nSome text.\n\n### Heading Two\n\nMore text.',
    bodyVi: '## Tiêu đề một\n\nVăn bản.\n\n### Tiêu đề hai\n\nVăn bản khác.',
    ...overrides,
  }
}

describe('stripDiacritics', () => {
  it('removes vietnamese diacritics and lowercases', () => {
    expect(stripDiacritics('Giá trị')).toBe('gia tri')
  })

  it('handles đ/Đ specially since unicode NFD does not decompose it', () => {
    expect(stripDiacritics('Đóng gói')).toBe('dong goi')
  })

  it('leaves plain ascii text unchanged apart from lowercasing', () => {
    expect(stripDiacritics('Constructor')).toBe('constructor')
  })
})

describe('buildSearchIndex', () => {
  it('produces one chapter entry and one heading entry per heading, in vietnamese', () => {
    const index = buildSearchIndex([makeChapter()], 'vi')

    expect(index).toHaveLength(3)
    expect(index[0]).toMatchObject({ type: 'chapter', slug: 'test-chapter', chapterTitle: 'Chương thử' })
    expect(index[1]).toMatchObject({ type: 'heading', slug: 'test-chapter', headingText: 'Tiêu đề một', headingId: 'tieu-de-mot' })
    expect(index[2]).toMatchObject({ type: 'heading', slug: 'test-chapter', headingText: 'Tiêu đề hai', headingId: 'tieu-de-hai' })
  })

  it('uses the english body and title when language is en', () => {
    const index = buildSearchIndex([makeChapter()], 'en')

    expect(index[0].chapterTitle).toBe('Test Chapter')
    expect(index[1].headingText).toBe('Heading One')
  })

  it('produces only a chapter entry for a chapter with no body at all', () => {
    const index = buildSearchIndex([makeChapter({ body: undefined, bodyVi: undefined })], 'vi')

    expect(index).toHaveLength(1)
    expect(index[0].type).toBe('chapter')
  })

  it('falls back to the english body when bodyVi is missing, in vi mode', () => {
    const index = buildSearchIndex([makeChapter({ bodyVi: undefined })], 'vi')

    expect(index[1].headingText).toBe('Heading One')
  })

  it('populates normalized fields with diacritics stripped', () => {
    const index = buildSearchIndex([makeChapter()], 'vi')

    expect(index[0].chapterTitleNormalized).toBe('chuong thu')
    expect(index[1].headingTextNormalized).toBe('tieu de mot')
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/lib/search-index.test.ts`
Expected: FAIL — `Cannot find module './search-index'`.

- [ ] **Step 3: Implement `src/lib/search-index.ts`**

```ts
import type { Chapter } from '../content/types'
import { extractHeadings } from './markdown'

export interface SearchEntry {
  type: 'chapter' | 'heading'
  slug: string
  chapterTitle: string
  chapterTitleNormalized: string
  headingText?: string
  headingTextNormalized?: string
  headingId?: string
}

// Bỏ dấu tiếng Việt để so khớp không phân biệt có/không gõ dấu (vd "gia tri" khớp
// "giá trị"). NFD không tách được "đ"/"Đ" (không phải chữ cái + dấu kết hợp trong
// Unicode) nên phải xử lý riêng.
export function stripDiacritics(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
}

export function buildSearchIndex(chapters: Chapter[], language: 'vi' | 'en'): SearchEntry[] {
  const entries: SearchEntry[] = []

  for (const chapter of chapters) {
    const chapterTitle = language === 'en' ? chapter.titleEn : chapter.title
    entries.push({
      type: 'chapter',
      slug: chapter.slug,
      chapterTitle,
      chapterTitleNormalized: stripDiacritics(chapterTitle),
    })

    const body = language === 'en' ? chapter.body : (chapter.bodyVi ?? chapter.body)
    if (!body) continue

    for (const heading of extractHeadings(body)) {
      entries.push({
        type: 'heading',
        slug: chapter.slug,
        chapterTitle,
        chapterTitleNormalized: stripDiacritics(chapterTitle),
        headingText: heading.text,
        headingTextNormalized: stripDiacritics(heading.text),
        headingId: heading.id,
      })
    }
  }

  return entries
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/lib/search-index.test.ts`
Expected: `8 passed`.

- [ ] **Step 5: Typecheck and lint**

Run: `npx tsc -b --noEmit && npx oxlint src/lib/search-index.ts src/lib/search-index.test.ts`
Expected: no errors, no warnings.

- [ ] **Step 6: Commit**

```bash
git add src/lib/search-index.ts src/lib/search-index.test.ts
git commit -m "feat: add search index builder for docs search"
```

---

### Task 3: Recent searches persistence

**Files:**
- Create: `src/hooks/use-recent-searches.ts`
- Test: `src/hooks/use-recent-searches.test.ts`

**Interfaces:**
- Consumes: nothing new.
- Produces: `RecentSearchEntry` type (`{ slug: string; headingId?: string; title: string; breadcrumb: string }`), `readRecentSearches(): RecentSearchEntry[]`, `addRecentSearch(entry: RecentSearchEntry): RecentSearchEntry[]`, and `useRecentSearches(): { recent: RecentSearchEntry[]; record: (entry: RecentSearchEntry) => void }` — `SearchModal` (Task 6) imports `RecentSearchEntry` and `useRecentSearches` from this exact path.

- [ ] **Step 1: Write the failing tests**

Create `src/hooks/use-recent-searches.test.ts`:

```ts
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/hooks/use-recent-searches.test.ts`
Expected: FAIL — `Cannot find module './use-recent-searches'`.

- [ ] **Step 3: Implement the hook**

Create `src/hooks/use-recent-searches.ts`:

```ts
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

// Lưu tối đa 5 kết quả tìm kiếm đã bấm gần nhất — hiện trong modal khi ô tìm kiếm
// đang trống, giống cách use-quiz-progress lưu điểm quiz lần gần nhất.
export function useRecentSearches() {
  const [recent, setRecent] = useState<RecentSearchEntry[]>(() => readRecentSearches())

  function record(entry: RecentSearchEntry) {
    setRecent(addRecentSearch(entry))
  }

  return { recent, record }
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/hooks/use-recent-searches.test.ts`
Expected: `6 passed`.

- [ ] **Step 5: Typecheck and lint**

Run: `npx tsc -b --noEmit && npx oxlint src/hooks/use-recent-searches.ts src/hooks/use-recent-searches.test.ts`
Expected: no errors, no warnings.

- [ ] **Step 6: Commit**

```bash
git add src/hooks/use-recent-searches.ts src/hooks/use-recent-searches.test.ts
git commit -m "feat: add recent searches persistence for docs search"
```

---

### Task 4: Fix `DocsLayout` to scroll to a URL hash's target instead of always scrolling to top

**Files:**
- Modify: `src/layout/DocsLayout.tsx`

**Interfaces:**
- Consumes: nothing new (uses `useLocation` from `react-router-dom`, already imported in this file).
- Produces: no new exports — this is a behavior fix that `SearchModal` (Task 6/7) relies on implicitly (navigating to `/docs/<slug>#<headingId>` only lands on the right heading once this fix is in place).

No automated test for this task (it's a DOM-scroll side effect, not practical to unit test without a browser — verified manually in Task 7's end-to-end check alongside the modal). Typecheck/lint are this task's verification.

- [ ] **Step 1: Locate the current effect**

In `src/layout/DocsLayout.tsx`, the current code reads:

```tsx
export function DocsLayout() {
  const { slug } = useParams()
  const { pathname } = useLocation()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  // Chuyển trang (sang chương khác hoặc syllabus) thì cuộn lên đầu ngay lập tức —
  // React Router không tự reset scroll khi điều hướng phía client như trình duyệt vẫn làm.
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])
```

- [ ] **Step 2: Replace it with the hash-aware version**

Change it to:

```tsx
export function DocsLayout() {
  const { slug } = useParams()
  const location = useLocation()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  // Chuyển trang thì cuộn lên đầu ngay lập tức (React Router không tự reset scroll
  // như trình duyệt vẫn làm) — TRỪ khi URL có #hash (vd từ search modal nhảy tới 1
  // heading cụ thể), lúc đó cuộn tới đúng heading thay vì lên đầu trang.
  useEffect(() => {
    if (location.hash) {
      const target = document.getElementById(location.hash.slice(1))
      if (target) {
        target.scrollIntoView({ behavior: 'instant', block: 'start' })
        return
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [location.pathname, location.hash])
```

No other line in this file references the old `pathname` variable, so this is a self-contained rename-and-branch change.

- [ ] **Step 3: Typecheck and lint**

Run: `npx tsc -b --noEmit && npx oxlint src/layout/DocsLayout.tsx`
Expected: no errors, no warnings.

- [ ] **Step 4: Run the existing test suite**

Run: `npx vitest run`
Expected: all existing tests still pass (this file has no dedicated tests; this confirms nothing else broke).

- [ ] **Step 5: Commit**

```bash
git add src/layout/DocsLayout.tsx
git commit -m "fix: scroll to url hash target instead of page top when present"
```

---

### Task 5: `⌘K`/`Ctrl+K` global shortcut hook

**Files:**
- Create: `src/hooks/use-search-shortcut.ts`

**Interfaces:**
- Consumes: nothing new.
- Produces: `useSearchShortcut(onTrigger: () => void): void` — `DocsHeader` (Task 7) calls this with a callback that opens the search modal.

No automated test for this task (a `window`-level keydown listener has no meaningful behavior to assert without a browser/jsdom, consistent with this project's precedent of skipping tests for thin DOM-effect hooks). Typecheck/lint are this task's verification.

- [ ] **Step 1: Implement the hook**

Create `src/hooks/use-search-shortcut.ts`:

```ts
import { useEffect } from 'react'

// Lắng nghe ⌘K (macOS) / Ctrl+K (Windows/Linux) trong toàn bộ cửa sổ — dùng
// preventDefault() vì một số trình duyệt tự có hành vi riêng cho tổ hợp phím này
// (vd focus vào address bar), nếu không sẽ xung đột với việc mở modal tìm kiếm.
export function useSearchShortcut(onTrigger: () => void): void {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const isShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k'
      if (!isShortcut) return
      event.preventDefault()
      onTrigger()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onTrigger])
}
```

- [ ] **Step 2: Typecheck and lint**

Run: `npx tsc -b --noEmit && npx oxlint src/hooks/use-search-shortcut.ts`
Expected: no errors, no warnings.

- [ ] **Step 3: Commit**

```bash
git add src/hooks/use-search-shortcut.ts
git commit -m "feat: add keyboard shortcut hook for docs search"
```

---

### Task 6: `SearchModal` component

**Files:**
- Create: `src/components/search/SearchModal.tsx`

**Interfaces:**
- Consumes: `chapters` (`src/content/chapters/index.ts`), `useLanguage` (`src/hooks/use-language.tsx`), `useRecentSearches`/`RecentSearchEntry` (`src/hooks/use-recent-searches.ts`, Task 3), `buildSearchIndex`/`stripDiacritics`/`SearchEntry` (`src/lib/search-index.ts`, Task 2), `useNavigate` (`react-router-dom`), `Fuse` (`fuse.js`, Task 1).
- Produces: `SearchModal` component with props `{ open: boolean; onClose: () => void }` — `DocsHeader` (Task 7) renders this and owns the `open` state.

No automated test for this task (rendering/interaction component, no React Testing Library in this project — same precedent as the quiz feature's `QuizQuestion`/`QuizSection`). Verified manually in Task 7, once wired into a real page.

- [ ] **Step 1: Implement the component**

Create `src/components/search/SearchModal.tsx`:

```tsx
import Fuse from 'fuse.js'
import { useEffect, useMemo, useState, type KeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { chapters } from '../../content/chapters'
import { useLanguage } from '../../hooks/use-language'
import { useRecentSearches, type RecentSearchEntry } from '../../hooks/use-recent-searches'
import { buildSearchIndex, stripDiacritics, type SearchEntry } from '../../lib/search-index'

interface SearchModalProps {
  open: boolean
  onClose: () => void
}

const MAX_RESULTS = 8

function toResultRow(entry: SearchEntry): RecentSearchEntry {
  if (entry.type === 'heading') {
    return {
      slug: entry.slug,
      headingId: entry.headingId,
      title: entry.headingText ?? entry.chapterTitle,
      breadcrumb: `${entry.chapterTitle} › ${entry.headingText}`,
    }
  }
  return { slug: entry.slug, title: entry.chapterTitle, breadcrumb: entry.chapterTitle }
}

export function SearchModal({ open, onClose }: SearchModalProps) {
  const { language } = useLanguage()
  const isEn = language === 'en'
  const navigate = useNavigate()
  const { recent, record } = useRecentSearches()

  const [query, setQuery] = useState('')
  const [highlighted, setHighlighted] = useState(0)

  const fuse = useMemo(() => {
    const index = buildSearchIndex(chapters, language)
    return new Fuse(index, {
      keys: ['chapterTitleNormalized', 'headingTextNormalized'],
      threshold: 0.35,
      ignoreLocation: true,
      minMatchCharLength: 2,
    })
  }, [language])

  const trimmedQuery = query.trim()
  const isSearching = trimmedQuery.length >= 2

  const rows = useMemo<RecentSearchEntry[]>(() => {
    if (!isSearching) return recent
    const normalizedQuery = stripDiacritics(trimmedQuery)
    return fuse
      .search(normalizedQuery)
      .slice(0, MAX_RESULTS)
      .map((result) => toResultRow(result.item))
  }, [fuse, isSearching, trimmedQuery, recent])

  useEffect(() => {
    setHighlighted(0)
  }, [query])

  useEffect(() => {
    if (!open) setQuery('')
  }, [open])

  function activate(row: RecentSearchEntry) {
    record(row)
    onClose()
    navigate(`/docs/${row.slug}${row.headingId ? `#${row.headingId}` : ''}`)
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      onClose()
    } else if (event.key === 'ArrowDown') {
      event.preventDefault()
      setHighlighted((value) => (rows.length === 0 ? 0 : (value + 1) % rows.length))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setHighlighted((value) => (rows.length === 0 ? 0 : (value - 1 + rows.length) % rows.length))
    } else if (event.key === 'Enter') {
      const current = rows[highlighted]
      if (current) activate(current)
    }
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 px-4 pt-24"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
        onKeyDown={handleKeyDown}
        className="border-hairline bg-canvas w-full max-w-xl overflow-hidden rounded-lg border shadow-[0_24px_60px_-24px_rgba(0,0,0,0.35)]"
      >
        <div className="border-hairline flex items-center gap-2.5 border-b px-4 py-3.5">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            className="text-ink-faint h-4.5 w-4.5 shrink-0"
          >
            <circle cx="11" cy="11" r="7" />
            <path strokeLinecap="round" d="m20 20-3.5-3.5" />
          </svg>
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={isEn ? 'Search documentation...' : 'Tìm kiếm tài liệu...'}
            className="text-ink placeholder:text-ink-faint flex-1 bg-transparent text-sm outline-none"
          />
        </div>

        <div className="max-h-96 overflow-y-auto py-2">
          {isSearching && rows.length === 0 ? (
            <p className="text-ink-muted px-4 py-8 text-center text-sm">
              {isEn ? `No results found for "${trimmedQuery}"` : `Không tìm thấy kết quả cho "${trimmedQuery}"`}
            </p>
          ) : null}

          {!isSearching && rows.length > 0 ? (
            <p className="text-ink-faint px-4 pt-1 pb-2 text-xs font-semibold tracking-wider uppercase">
              {isEn ? 'Recent searches' : 'Tìm kiếm gần đây'}
            </p>
          ) : null}

          {rows.map((row, rowIndex) => (
            <button
              key={`${row.slug}-${row.headingId ?? 'chapter'}`}
              type="button"
              onMouseEnter={() => setHighlighted(rowIndex)}
              onClick={() => activate(row)}
              className={`flex w-full items-start gap-2.5 px-4 py-2.5 text-left transition-colors ${
                highlighted === rowIndex ? 'bg-accent/10' : 'hover:bg-panel'
              }`}
            >
              <span className="text-ink-faint mt-0.5 font-mono text-sm">#</span>
              <span className="min-w-0 flex-1">
                <span className="text-ink block truncate text-sm font-medium">{row.title}</span>
                <span className="text-ink-faint block truncate text-xs">{row.breadcrumb}</span>
              </span>
            </button>
          ))}
        </div>

        <div className="border-hairline text-ink-faint flex items-center justify-between border-t px-4 py-2.5 text-xs">
          <span>{isEn ? '↑↓ Select · ↵ Open' : '↑↓ Chọn · ↵ Mở'}</span>
          <span>{isEn ? 'Esc Close' : 'Esc Đóng'}</span>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Typecheck and lint**

Run: `npx tsc -b --noEmit && npx oxlint src/components/search/SearchModal.tsx`
Expected: no errors, no warnings.

- [ ] **Step 3: Commit**

```bash
git add src/components/search/SearchModal.tsx
git commit -m "feat: add search modal component"
```

---

### Task 7: Wire the modal into `SearchField` and `DocsHeader`

**Files:**
- Modify: `src/components/SearchField.tsx`
- Modify: `src/layout/DocsHeader.tsx`

**Interfaces:**
- Consumes: `SearchModal` (Task 6), `useSearchShortcut` (Task 5).
- Produces: nothing new — this is the final integration point.

- [ ] **Step 1: Make `SearchField` a real trigger**

The current `src/components/SearchField.tsx` reads:

```tsx
import { useLanguage } from '../hooks/use-language'

// Thanh tìm kiếm kiểu Laravel Docs — hiện tại chỉ là UI, chưa gắn logic tìm kiếm thật.
export function SearchField() {
  const { language } = useLanguage()

  return (
    <button
      type="button"
      className="max-w-xl border-hairline bg-panel/60 text-ink-faint hover:border-hairline-strong flex w-full items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-4 w-4 shrink-0">
        <circle cx="11" cy="11" r="7" />
        <path strokeLinecap="round" d="m20 20-3.5-3.5" />
      </svg>
      <span className="flex-1 text-left">{language === 'en' ? 'Search documentation...' : 'Tìm kiếm tài liệu...'}</span>
      <kbd className="border-hairline text-ink-faint hidden shrink-0 rounded border px-1.5 py-0.5 font-mono text-[11px] sm:inline-block">
        ⌘K
      </kbd>
    </button>
  )
}
```

Replace it with:

```tsx
import { useLanguage } from '../hooks/use-language'

interface SearchFieldProps {
  onClick: () => void
}

// Thanh tìm kiếm — bấm vào (hoặc ⌘K/Ctrl+K) sẽ mở SearchModal, xem DocsHeader.tsx.
export function SearchField({ onClick }: SearchFieldProps) {
  const { language } = useLanguage()

  return (
    <button
      type="button"
      onClick={onClick}
      className="max-w-xl border-hairline bg-panel/60 text-ink-faint hover:border-hairline-strong flex w-full items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-4 w-4 shrink-0">
        <circle cx="11" cy="11" r="7" />
        <path strokeLinecap="round" d="m20 20-3.5-3.5" />
      </svg>
      <span className="flex-1 text-left">{language === 'en' ? 'Search documentation...' : 'Tìm kiếm tài liệu...'}</span>
      <kbd className="border-hairline text-ink-faint hidden shrink-0 rounded border px-1.5 py-0.5 font-mono text-[11px] sm:inline-block">
        ⌘K
      </kbd>
    </button>
  )
}
```

- [ ] **Step 2: Wire it into `DocsHeader`**

The current `src/layout/DocsHeader.tsx` reads:

```tsx
import { Link } from 'react-router-dom'
import { LanguageSelector } from '../components/LanguageSelector'
import { SearchField } from '../components/SearchField'
import { ThemeToggle } from '../components/ThemeToggle'
import { useLanguage } from '../hooks/use-language'

interface DocsHeaderProps {
  onOpenMenu: () => void
}

export function DocsHeader({ onOpenMenu }: DocsHeaderProps) {
  const { language } = useLanguage()

  return (
    <header className="border-hairline bg-canvas/95 sticky top-0 z-30 border-b backdrop-blur">
      <div className="mx-auto flex h-20 w-full max-w-360 items-center gap-10 px-4 lg:px-12">
        <div className="flex shrink-0 items-center gap-3 lg:w-64">
          <button
            type="button"
            onClick={onOpenMenu}
            aria-label={language === 'en' ? 'Open navigation menu' : 'Mở menu điều hướng'}
            className="text-ink-muted hover:bg-panel hover:text-ink -ml-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-md lg:hidden"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Logo */}
          <Link to="/" className="flex shrink-0 items-center">
            <img src="/images/logo-transparent.png" alt="PRO192 Docs" className="h-9 dark:hidden" />
            <img src="/images/logo.jpg" alt="PRO192 Docs" className="hidden h-9 dark:block" />
          </Link>
        </div>

        <div className="hidden min-w-0 flex-1 md:block lg:px-3">
          <SearchField />
        </div>

        <div className="flex shrink-0 items-center justify-end gap-2 xl:w-56">
          <LanguageSelector />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
```

Replace it with:

```tsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { LanguageSelector } from '../components/LanguageSelector'
import { SearchField } from '../components/SearchField'
import { SearchModal } from '../components/search/SearchModal'
import { ThemeToggle } from '../components/ThemeToggle'
import { useLanguage } from '../hooks/use-language'
import { useSearchShortcut } from '../hooks/use-search-shortcut'

interface DocsHeaderProps {
  onOpenMenu: () => void
}

export function DocsHeader({ onOpenMenu }: DocsHeaderProps) {
  const { language } = useLanguage()
  const [searchOpen, setSearchOpen] = useState(false)

  useSearchShortcut(() => setSearchOpen(true))

  return (
    <header className="border-hairline bg-canvas/95 sticky top-0 z-30 border-b backdrop-blur">
      <div className="mx-auto flex h-20 w-full max-w-360 items-center gap-10 px-4 lg:px-12">
        <div className="flex shrink-0 items-center gap-3 lg:w-64">
          <button
            type="button"
            onClick={onOpenMenu}
            aria-label={language === 'en' ? 'Open navigation menu' : 'Mở menu điều hướng'}
            className="text-ink-muted hover:bg-panel hover:text-ink -ml-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-md lg:hidden"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Logo */}
          <Link to="/" className="flex shrink-0 items-center">
            <img src="/images/logo-transparent.png" alt="PRO192 Docs" className="h-9 dark:hidden" />
            <img src="/images/logo.jpg" alt="PRO192 Docs" className="hidden h-9 dark:block" />
          </Link>
        </div>

        <div className="hidden min-w-0 flex-1 md:block lg:px-3">
          <SearchField onClick={() => setSearchOpen(true)} />
        </div>

        <div className="flex shrink-0 items-center justify-end gap-2 xl:w-56">
          <LanguageSelector />
          <ThemeToggle />
        </div>
      </div>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  )
}
```

- [ ] **Step 3: Typecheck and lint**

Run: `npx tsc -b --noEmit && npx oxlint src/components/SearchField.tsx src/layout/DocsHeader.tsx`
Expected: no errors, no warnings.

- [ ] **Step 4: Run the full test suite**

Run: `npx vitest run`
Expected: all tests from Tasks 2–3 (plus the quiz feature's existing tests) still pass.

- [ ] **Step 5: Manual verification in the dev server**

Run: `npm run dev`, open `/docs/encapsulation`.

Check, in both light/dark and `vi`/`en`:
- Clicking the search bar opens the modal; pressing `⌘K` (Mac) or `Ctrl+K` (Windows/Linux) also opens it from anywhere on a Docs page.
- With an empty query and no prior searches, no "Recent searches" section appears (nothing to show yet).
- Typing "constructor" (or a Vietnamese heading term without diacritics, e.g. "gia tri" for "giá trị" if that heading exists) shows matching chapter/heading results with the `#` icon and breadcrumb.
- Clicking a heading-type result navigates to `/docs/<slug>#<headingId>` and the page scrolls to that heading, not to the top.
- Reopening the modal now shows that result under "Recent searches".
- Typing a nonsense query (e.g. "zzzxxxqqq") shows the not-found message.
- `ArrowDown`/`ArrowUp` move the highlighted row, `Enter` activates it, `Esc` closes the modal.
- Visiting a URL with a stale/nonexistent hash (e.g. `/docs/encapsulation#does-not-exist`) does not throw — falls back to scrolling to top.

- [ ] **Step 6: Production build check**

Run: `npm run build`
Expected: builds cleanly, no TypeScript errors.

- [ ] **Step 7: Commit**

```bash
git add src/components/SearchField.tsx src/layout/DocsHeader.tsx
git commit -m "feat: wire search modal into docs header"
```

---

### Task 8: Update `.claude/CLAUDE.md`

**Files:**
- Modify: `.claude/CLAUDE.md`

Per this project's standing rule (confirm before changes drift the documented project overview, then update the doc to match), add a short note about the new search feature.

- [ ] **Step 1: Add an architecture bullet**

In `.claude/CLAUDE.md`'s "Kiến trúc" section, add a new bullet after the quiz bullet:

```markdown
- **Search trong Docs** (`⌘K`/`Ctrl+K`): `SearchModal` (`src/components/search/`) mở từ `DocsHeader.tsx`, tìm trên index dựng runtime từ `chapters` + `extractHeadings()` (`src/lib/search-index.ts`, có unit test), so khớp mờ qua Fuse.js, bỏ dấu tiếng Việt khi so khớp (`stripDiacritics`). Chỉ tìm trong ngôn ngữ đang hiển thị, chỉ áp dụng cho khu vực Docs (không có ở Landing). Kết quả trỏ tới `/docs/<slug>#<headingId>` — `DocsLayout.tsx` đã sửa để cuộn tới đúng heading thay vì luôn cuộn lên đầu khi URL có `#hash`. 5 kết quả đã bấm gần nhất lưu localStorage (`pro192-recent-searches`).
```

- [ ] **Step 2: Update the tech stack line**

Append `· Fuse.js (fuzzy search cho Docs)` to the end of the existing "Tech stack (đã khoá...)" line.

- [ ] **Step 3: Commit**

```bash
git add .claude/CLAUDE.md
git commit -m "docs: document docs search feature in claude instructions"
```

---

## Self-Review Notes

- **Spec coverage:** index construction (chapter + heading entries, per-language, diacritics-normalized) ✓ (Task 2, tested), scroll-to-hash fix ✓ (Task 4), recent searches (cap 5, dedupe-and-promote) ✓ (Task 3, tested), keyboard shortcut with `preventDefault` ✓ (Task 5), modal UI (empty/recent/results/not-found states, keyboard nav, activation + recording) ✓ (Task 6), wiring + Docs-only scope (mounted only from `DocsHeader`) ✓ (Task 7), i18n via inline `isEn ? ... : ...` ✓ (Task 6).
- **Type consistency checked:** `SearchEntry` (Task 2) and `RecentSearchEntry` (Task 3) are the two shapes `SearchModal` (Task 6) juggles — `toResultRow` converts one to the other so the component's `rows` list is a single unified `RecentSearchEntry[]` type throughout, avoiding a union-type/cast mess. `buildSearchIndex`'s signature (`chapters, language`) matches its only call site in Task 6. `useSearchShortcut(onTrigger)` matches its call site in Task 7 (`useSearchShortcut(() => setSearchOpen(true))`).
- **No placeholders:** every step above has complete, runnable code — no TBD/TODO.
