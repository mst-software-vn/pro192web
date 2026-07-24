# Docs search modal — design spec

## Overview

Add a Cmd+K / Ctrl+K search modal to the `/docs/*` area, replacing the currently non-functional `SearchField` button. Typing a query surfaces matching chapters and matching headings within chapters (deep-linked), with recent-searches shown when the query is empty and a not-found message when nothing matches.

**Goals:**
- Search across all 11 chapters' titles AND their in-body H2/H3 headings, in the currently displayed language (vi or en).
- Clicking a result navigates to the exact chapter and, for a heading match, scrolls to that heading.
- Persist up to 5 recently-clicked results per browser in localStorage.
- Keyboard-first UX: `⌘K`/`Ctrl+K` to open, arrow keys to move selection, `Enter` to open, `Esc` to close — matching the reference screenshots' bottom hint bar.

**Non-goals:**
- No "Ask Assistant" / AI Q&A panel (present in the reference screenshots, not applicable — this site has no AI backend).
- No search on the Landing page (`/`) — scoped to the Docs area only, matching the request.
- No server-side or build-time search index — the index is built client-side from data already loaded (`chapters`), no new content files.
- No typo-tolerant matching beyond what Fuse.js provides out of the box — no custom scoring/stemming.

## New dependency

**Fuse.js** (user-approved) — lightweight fuzzy-search library (~12kB gzip), used only for local, in-memory matching against the client-built index. No other new dependency.

## Data model & index construction

`src/lib/search-index.ts`:

```ts
export interface SearchEntry {
  type: 'chapter' | 'heading'
  slug: string
  chapterTitle: string
  /** Only present for type: 'heading' */
  headingText?: string
  /** Only present for type: 'heading' — matches the id MarkdownContent assigns to that heading in the DOM */
  headingId?: string
}

export function buildSearchIndex(chapters: Chapter[], language: 'vi' | 'en'): SearchEntry[]
```

For each chapter with `status === 'published'` and a body in the current language:
- One `type: 'chapter'` entry (`chapterTitle` = `title`/`titleEn` per language).
- One `type: 'heading'` entry per item returned by the existing `extractHeadings(body)` (from `src/lib/markdown.ts`, already used for the "On this page" TOC) — `headingText` = the heading's text, `headingId` = its slugified id.

Draft chapters (`status: 'draft'`, no body) contribute only their `type: 'chapter'` entry (no headings to extract) — same "no content yet" reality already handled elsewhere in the app.

**Fuse.js configuration:**

```ts
new Fuse(entries, {
  keys: ['chapterTitle', 'headingText'],
  threshold: 0.35,
  ignoreLocation: true,
  minMatchCharLength: 2,
})
```

`ignoreLocation: true` because matches can be anywhere in a heading/title, not just the start. `threshold: 0.35` is a middle-ground fuzziness — permissive enough for a missing diacritic or a small typo, not so loose that unrelated results appear. This is a starting value; not a hard requirement to tune further as part of this plan.

**Vietnamese diacritics:** Fuse.js does not itself do accent folding. The index is built with an additional normalized field (`chapterTitleNormalized`, `headingTextNormalized` — diacritics stripped via `.normalize('NFD').replace(/[̀-ͯ]/g, '')`), and Fuse searches against those normalized fields instead of the raw text, while displaying the original (accented) text in results. This is how "gia tri" matches "giá trị" without an extra dependency.

**Rebuilding on language change:** the index is memoized (`useMemo`) keyed on `language` — switching the language toggle rebuilds the index against the newly-displayed language's headings, per the "search only in the currently displayed language" decision.

## Prerequisite fix: `DocsLayout` scroll-to-top vs. hash navigation

Current code (`src/layout/DocsLayout.tsx`):

```ts
useEffect(() => {
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
}, [pathname])
```

This unconditionally scrolls to the top on every pathname change, which would fight any attempt to land on a specific heading. Fix: watch the full location (including hash) instead of just `pathname`, and branch:

```ts
const location = useLocation()

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

If the hash doesn't match any element on the page (stale link, typo), it falls back to scrolling to top rather than doing nothing.

## Recent searches persistence

`src/hooks/use-recent-searches.ts`, same shape as `use-quiz-progress.ts` (Task 4 of the quiz feature — plain exported functions plus a hook wrapping them):

```ts
export interface RecentSearchEntry {
  slug: string
  headingId?: string
  title: string
  breadcrumb: string
}

export function readRecentSearches(): RecentSearchEntry[]
export function addRecentSearch(entry: RecentSearchEntry): RecentSearchEntry[]
export function useRecentSearches(): { recent: RecentSearchEntry[], record: (entry: RecentSearchEntry) => void }
```

- Storage key: `pro192-recent-searches` (single key, one JSON array — unlike the quiz's per-slug keys, since this is one global list, not per-chapter).
- Cap at 5 entries, most-recent-first. Adding an entry that duplicates an existing one (same `slug` + `headingId`) moves it to the front instead of creating a duplicate row.
- Corrupted/missing localStorage data resolves to `[]`, same defensive pattern as `use-quiz-progress`.

## Components

```
src/components/search/SearchModal.tsx   — the modal itself
src/hooks/use-search-shortcut.ts        — ⌘K / Ctrl+K global listener, scoped to wherever it's mounted
src/hooks/use-recent-searches.ts        — localStorage persistence (above)
src/lib/search-index.ts                 — index builder (above)
src/components/SearchField.tsx          — MODIFY: becomes a real trigger button (existing file, currently UI-only)
src/layout/DocsHeader.tsx               — MODIFY: renders SearchModal, owns open/close state
src/layout/DocsLayout.tsx               — MODIFY: scroll-to-hash fix (above)
```

`SearchModal` is only mounted within the Docs area (rendered from `DocsHeader`, which is only used by `DocsLayout`) — it is never rendered on the Landing page, satisfying the "Docs only" scope directly by not being reachable elsewhere, rather than needing a runtime route check.

`use-search-shortcut`'s keydown listener must call `event.preventDefault()` when it matches (`(event.metaKey || event.ctrlKey) && event.key === 'k'`) — otherwise some browsers' own `Ctrl+K`/`⌘K` behavior (e.g. focusing the address bar) fires alongside opening the modal. The modal itself uses `role="dialog"` `aria-modal="true"`; a full focus trap is out of scope (matches this project's existing custom dropdowns — `ThemeToggle`, `DocsNavDropdown` — which also don't implement one), but autofocus on the input covers the primary keyboard entry point and `Esc` reliably closes it.

## UI/UX flow

Visual language matches the existing Docs semantic tokens (`bg-canvas`, `bg-panel`, `text-ink`/`text-ink-muted`/`text-ink-faint`, `border-hairline`/`border-hairline-strong`, `bg-accent/10` for the active/highlighted row — the same tint the Sidebar uses for the active nav item) — not the reference screenshot's exact colors, which come from a different product's design system.

1. **Trigger** — clicking the existing `SearchField` button, or pressing `⌘K`/`Ctrl+K` anywhere while a Docs page is mounted, opens the modal.
2. **Modal shell** — centered overlay (`fixed inset-0` dark scrim + centered panel, `max-w-xl`, `rounded-lg border-hairline bg-canvas shadow-...`), matching the reference screenshots' layout: search input pinned at the top (icon + text input, autofocus), results list below, a thin hint bar pinned at the bottom (`↑↓ Chọn · ↵ Mở · Esc Đóng` / `↑↓ Select · ↵ Open · Esc Close`, matching the language toggle).
3. **Empty query state** — shows "Recent searches" ("Tìm kiếm gần đây") as a small uppercase label, followed by up to 5 rows from `useRecentSearches()`. If there are zero recent searches, the section and its label are omitted entirely (no empty "Recent searches" heading with nothing under it).
4. **Typing a query** — debounced ~150ms, results computed via the Fuse index, capped at 8 results shown. Each result row: a small `#` glyph (matching the reference's heading-anchor icon), the matched title in `font-medium`, and a breadcrumb line below in `text-ink-faint text-xs` reading `{chapterTitle}` for a chapter-type entry, or `{chapterTitle} › {headingText}` for a heading-type entry.
5. **No matches** — a centered message inside the panel: "Không tìm thấy kết quả cho “{query}”" / "No results found for “{query}”" — no icon needed, plain text is enough at this scale.
6. **Keyboard navigation** — `ArrowDown`/`ArrowUp` move a highlighted-row index (wrapping at the ends), `Enter` activates the highlighted row (same as clicking it), `Esc` closes the modal. The highlighted row gets the same `bg-accent/10` tint the Sidebar uses for its active link.
7. **Activating a result** — records it via `addRecentSearch`, closes the modal, and navigates: `navigate(`/docs/${slug}${headingId ? '#' + headingId : ''}`)`. `DocsLayout`'s fixed scroll effect (see above) handles landing on the right heading.

## i18n

All UI chrome text (labels, hint bar, not-found message, placeholder) follows the existing `isEn ? '...' : '...'` inline pattern used throughout `DocsPage`/`DocsHeader`, not a separate i18n file — consistent with the rest of the codebase.

## Edge cases

- **Draft chapters** (no body): contribute a chapter-level entry only, matchable by title but with no headings — consistent with them having no content yet.
- **Duplicate heading text across chapters** (e.g. two chapters both have a "Summary" heading): each is its own distinct entry with its own `slug`/breadcrumb, so they appear as separate results — no special de-duplication needed.
- **Very short queries** (`minMatchCharLength: 2`): a single-character query returns no results rather than a huge unfiltered list.
- **Opening the modal while already inside a chapter with headings visible**: no special-casing — search always searches across all chapters, not just the current one.

## Testing plan

- Unit-test `buildSearchIndex`: given a small fixture chapter list, produces the expected chapter + heading entries, diacritics-normalized fields present, draft chapters produce no heading entries.
- Unit-test the diacritics-stripping helper directly (e.g. `"giá trị"` → `"gia tri"`).
- Unit-test `use-recent-searches`' plain functions: cap at 5, de-duplicate-and-promote-to-front on repeat, corrupted JSON → `[]` (same style as the existing `use-quiz-progress.test.ts`).
- No automated test for `SearchModal` itself (no React Testing Library in this project, consistent with the quiz feature's `QuizQuestion`/`QuizSection` precedent) — manual verification required: open via click and via `⌘K`/`Ctrl+K`, type a query matching a heading, click it, confirm the page scrolls to that heading; confirm "Recent searches" shows it on next open; confirm a nonsense query shows the not-found message; confirm `Esc` closes; confirm behavior is identical in `vi` and `en`, light and dark.
- `npm run build`, `oxlint`, `tsc -b` must stay clean, matching the project's existing bar.
