# Landing Page + Landing Header Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the bare-bones Landing Page header/hero/footer with a professional, blue-accented design (mega-menu docs nav, live GitHub star button, code showcase hero, stats bar, features grid, multi-column footer) while leaving `DocsHeader.tsx` and the Docs area completely untouched.

**Architecture:** New standalone components (`GithubStarButton`, `DocsNavDropdown`, `LandingMobileNav`, `LandingHeader`) live alongside the existing `DocsHeader`/`Sidebar`/`MobileNav` — no shared header component. `LandingPage.tsx` is rewritten section-by-section to consume the new header and add new sections, reusing existing primitives (`CodeBlock`, `RevealOnScroll`, `BlurText`, `Sidebar`) wherever possible. A small refactor extracts the chapter-grouping logic already living in `Sidebar.tsx` into `content/chapters/index.ts` so `DocsNavDropdown` and `Sidebar` share one source of truth, and adds a derived `contentStats` export for the stats bar.

**Tech Stack:** React 19 + TypeScript + Tailwind CSS v4 (CSS-first `@theme`, semantic tokens in `src/index.css`), `react-router-dom` v7, `prism-react-renderer` (via existing `CodeBlock`), `motion` (via existing `RevealOnScroll`/`BlurText`). No new dependencies.

## Global Constraints

- `src/layout/DocsHeader.tsx` must not be modified. The Docs area (`DocsLayout`, `Sidebar`, `MobileNav`, `DocsFooter`) must render and behave identically before and after this work.
- No test framework is configured in this repo (`package.json` has no `vitest`/`jest`/test script). Verification per task = `npm run build` (tsc + vite build) and `npm run lint` (`oxlint`) both clean, plus a manual check via `npm run dev` in the browser for anything visual/interactive. Do not introduce a test framework as part of this work.
- Reuse existing tokens (`bg-canvas`, `text-ink`, `text-ink-secondary`, `text-ink-body`, `text-ink-muted`, `text-ink-faint`, `border-hairline`, `bg-panel`, `bg-well`, `text-accent-on-surface`, `bg-accent`, `bg-accent-emphasis`, `bg-accent-soft`) instead of hard-coded `neutral-*`/`bg-white` colors, so Landing Page follows the site's light/dark theme via the existing `.dark` class toggle (`useTheme`/`ThemeToggle`).
- GitHub repo URL: `https://github.com/mst-software-vn/pro192web`. GitHub API endpoint: `https://api.github.com/repos/mst-software-vn/pro192web` (public, unauthenticated).
- Icons are hand-written inline SVGs (`viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"`), matching the existing style in `ThemeToggle.tsx`/`DocsHeader.tsx`. Do not add an icon library.
- Follow the existing dropdown pattern used by `ThemeToggle.tsx`/`LanguageSelector.tsx`: local `open` state, a `fixed inset-0 z-40` invisible button behind the panel to close on outside-click, `aria-expanded` on the trigger. Do not add `Escape`-key handling — it is not part of the existing pattern and is out of scope.

---

### Task 1: Extract chapter grouping + add derived content stats

**Files:**
- Modify: `src/content/chapters/index.ts`
- Modify: `src/layout/Sidebar.tsx`

**Interfaces:**
- Produces: `groupChapters(): ChapterGroup[]` (exported from `src/content/chapters/index.ts`), `contentStats: { chapterCount: number; codeBlockCount: number; imageCount: number }` (exported from the same file).
- Consumes: existing `chapters: Chapter[]`, `ChapterGroup` type already in the same file.

- [ ] **Step 1: Move `groupChapters` into `content/chapters/index.ts` and add `contentStats`**

Open `src/content/chapters/index.ts`. Replace the tail of the file (from `export const chapters: Chapter[] = ...` to the end) with:

```ts
export const chapters: Chapter[] = chapterMeta.map((meta) => ({
  ...meta,
  body: bodyFor(meta.slug),
  bodyVi: bodyViFor(meta.slug),
}))

export function getChapter(slug: string): Chapter | undefined {
  return chapters.find((chapter) => chapter.slug === slug)
}

export const firstChapterSlug = chapters[0].slug

// Gom chương liền kề cùng `group` thành 1 nhóm, giữ nguyên thứ tự khai báo —
// dùng chung cho Sidebar (Docs) và DocsNavDropdown (Landing) để tránh 2 nguồn sự thật.
export function groupChapters(): ChapterGroup[] {
  const groups: ChapterGroup[] = []
  for (const chapter of chapters) {
    const current = groups[groups.length - 1]
    if (current && current.name === chapter.group) {
      current.items.push(chapter)
    } else {
      groups.push({ name: chapter.group, items: [chapter] })
    }
  }
  return groups
}

function countMatches(text: string, pattern: RegExp): number {
  return (text.match(pattern) ?? []).length
}

// Số liệu thật cho stats bar ở Landing — tính từ chính nội dung .md đã publish,
// không hard-code để không lệch khi thêm chương/ảnh mới.
export const contentStats = (() => {
  const publishedBodies = chapters
    .filter((chapter): chapter is Chapter & { body: string } => chapter.status === 'published' && !!chapter.body)
    .map((chapter) => chapter.body)

  const codeBlockCount = publishedBodies.reduce(
    (sum, body) => sum + countMatches(body, /```java/g),
    0,
  )
  const imageCount = publishedBodies.reduce((sum, body) => sum + countMatches(body, /^!\[/gm), 0)

  return {
    chapterCount: chapters.length,
    codeBlockCount,
    imageCount,
  }
})()
```

- [ ] **Step 2: Update `Sidebar.tsx` to import `groupChapters` instead of defining it locally**

In `src/layout/Sidebar.tsx`, replace the top of the file:

```ts
import { NavLink } from 'react-router-dom'
import { chapters, type ChapterGroup } from '../content/chapters'

interface SidebarProps {
  /** Gọi sau khi bấm 1 mục — dùng để đóng drawer trên mobile */
  onNavigate?: () => void
}

function groupChapters(): ChapterGroup[] {
  const groups: ChapterGroup[] = []
  for (const chapter of chapters) {
    const current = groups[groups.length - 1]
    if (current && current.name === chapter.group) {
      current.items.push(chapter)
    } else {
      groups.push({ name: chapter.group, items: [chapter] })
    }
  }
  return groups
}

export function Sidebar({ onNavigate }: SidebarProps) {
```

with:

```ts
import { NavLink } from 'react-router-dom'
import { groupChapters } from '../content/chapters'

interface SidebarProps {
  /** Gọi sau khi bấm 1 mục — dùng để đóng drawer trên mobile */
  onNavigate?: () => void
}

export function Sidebar({ onNavigate }: SidebarProps) {
```

The rest of `Sidebar.tsx` (which calls `groupChapters()` inside the component body) stays unchanged.

- [ ] **Step 3: Verify the refactor compiles and the numbers are correct**

Run:

```bash
npm run build
```

Expected: build succeeds (no TS errors about unused `chapters`/`ChapterGroup` import in `Sidebar.tsx`, no error about `groupChapters` missing).

Then confirm the numbers `contentStats` will compute by grepping the same source files directly (the registry can't be run standalone under plain Node because of Vite's `import.meta.glob`, so this is the fastest way to sanity-check the regexes match reality):

```bash
cd src/content/chapters
grep -rc '```java' *.md | grep -v '\.vi\.md' | awk -F: '{s+=$2} END{print "code blocks:", s}'
grep -rc '^!\[' *.md | grep -v '\.vi\.md' | awk -F: '{s+=$2} END{print "images:", s}'
cd -
```

Expected output at time of writing: `code blocks: 62` and `images: 122` (these will grow over time as more chapters are published — that's expected, `contentStats` recomputes automatically).

- [ ] **Step 4: Lint and commit**

```bash
npm run lint
```

Expected: exit code 0.

```bash
git add src/content/chapters/index.ts src/layout/Sidebar.tsx
git commit -m "refactor: extract groupChapters and add contentStats to chapters registry"
```

---

### Task 2: `GithubStarButton` component

**Files:**
- Create: `src/components/GithubStarButton.tsx`

**Interfaces:**
- Produces: `export function GithubStarButton(): JSX.Element` — no props. Renders an `<a>` linking to the repo; fetches star count client-side on mount.
- Consumes: nothing from other tasks.

- [ ] **Step 1: Write the component**

Create `src/components/GithubStarButton.tsx`:

```tsx
import { useEffect, useState } from 'react'

const REPO_URL = 'https://github.com/mst-software-vn/pro192web'
const API_URL = 'https://api.github.com/repos/mst-software-vn/pro192web'

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 shrink-0">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.833.09-.647.35-1.088.636-1.338-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.31.678.921.678 1.856 0 1.34-.012 2.421-.012 2.751 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
    </svg>
  )
}

// Lấy số sao thật từ GitHub REST API (public, không cần token) một lần khi mount.
// Lỗi hoặc rate-limit thì im lặng bỏ qua — nút vẫn hoạt động, chỉ ẩn số sao.
export function GithubStarButton() {
  const [stars, setStars] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false

    fetch(API_URL)
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error(String(response.status)))))
      .then((data: { stargazers_count?: number }) => {
        if (!cancelled && typeof data.stargazers_count === 'number') {
          setStars(data.stargazers_count)
        }
      })
      .catch(() => {
        // Bỏ qua — giữ nguyên UI không có số sao.
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <a
      href={REPO_URL}
      target="_blank"
      rel="noreferrer"
      className="border-hairline text-ink-secondary hover:bg-panel flex h-9 items-center gap-1.5 rounded-md border px-3 text-sm font-medium transition-colors"
    >
      <GithubIcon />
      <span className="hidden lg:inline">GitHub</span>
      {stars !== null ? (
        <span className="text-ink-faint hidden items-center gap-0.5 lg:flex">
          <span aria-hidden>★</span>
          {stars}
        </span>
      ) : null}
    </a>
  )
}
```

- [ ] **Step 2: Verify it builds and behaves correctly**

Run:

```bash
npm run build
```

Expected: succeeds (component isn't wired into any page yet, but must type-check standalone).

Temporarily render it to check visually: it will be wired into `LandingHeader` in Task 5, so full visual verification happens then. For now just confirm no TS/lint errors:

```bash
npm run lint
```

Expected: exit code 0.

- [ ] **Step 3: Commit**

```bash
git add src/components/GithubStarButton.tsx
git commit -m "feat: add GithubStarButton component with live star count"
```

---

### Task 3: `DocsNavDropdown` mega-menu component

**Files:**
- Create: `src/components/DocsNavDropdown.tsx`

**Interfaces:**
- Produces: `export function DocsNavDropdown(): JSX.Element` — no props.
- Consumes: `groupChapters` from `src/content/chapters/index.ts` (Task 1).

- [ ] **Step 1: Write the component**

Create `src/components/DocsNavDropdown.tsx`:

```tsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { groupChapters } from '../content/chapters'

function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-3.5 w-3.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
    </svg>
  )
}

// Mega-menu "Tài liệu" cho LandingHeader — liệt kê chương theo nhóm, lấy trực tiếp từ
// registry (groupChapters) để không tạo nguồn dữ liệu thứ hai so với Sidebar (Docs).
export function DocsNavDropdown() {
  const [open, setOpen] = useState(false)
  const groups = groupChapters()

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="text-ink-body hover:bg-panel hover:text-ink flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors"
      >
        Tài liệu
        <ChevronDownIcon />
      </button>

      {open ? (
        <>
          <button
            type="button"
            aria-hidden
            tabIndex={-1}
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setOpen(false)}
          />
          <div className="border-hairline bg-canvas absolute top-full left-0 z-50 mt-2 grid w-[640px] max-w-[90vw] grid-cols-3 gap-x-8 gap-y-5 rounded-lg border p-6 shadow-[0_16px_40px_rgba(0,0,0,0.12)]">
            {groups.map((group) => (
              <div key={group.name}>
                <p className="text-ink-faint mb-2 text-xs font-semibold tracking-wider uppercase">
                  {group.name}
                </p>
                <ul className="space-y-0.5">
                  {group.items.map((chapter) => (
                    <li key={chapter.slug}>
                      <Link
                        to={`/docs/${chapter.slug}`}
                        onClick={() => setOpen(false)}
                        className="text-ink-body hover:bg-panel hover:text-ink block rounded-md px-2 py-1.5 text-sm transition-colors"
                      >
                        {chapter.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </>
      ) : null}
    </div>
  )
}
```

- [ ] **Step 2: Verify**

```bash
npm run build && npm run lint
```

Expected: both succeed/exit 0. Full visual verification happens in Task 5/10 once wired into `LandingHeader`.

- [ ] **Step 3: Commit**

```bash
git add src/components/DocsNavDropdown.tsx
git commit -m "feat: add DocsNavDropdown mega-menu for landing header"
```

---

### Task 4: `LandingMobileNav` drawer component

**Files:**
- Create: `src/layout/LandingMobileNav.tsx`

**Interfaces:**
- Produces: `export function LandingMobileNav({ open, onClose }: { open: boolean; onClose: () => void }): JSX.Element`.
- Consumes: `Sidebar` from `src/layout/Sidebar.tsx` (already grouped-list UI, reused as-is), `firstChapterSlug` from `src/content/chapters/index.ts`.

- [ ] **Step 1: Write the component**

Create `src/layout/LandingMobileNav.tsx`:

```tsx
import { Link } from 'react-router-dom'
import { firstChapterSlug } from '../content/chapters'
import { Sidebar } from './Sidebar'

interface LandingMobileNavProps {
  open: boolean
  onClose: () => void
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-4 w-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}

// Drawer mobile riêng cho Landing (khác hamburger mở sidebar của Docs) — liệt kê
// chương theo nhóm bằng cách tái dùng nguyên Sidebar, không viết lại danh sách lần 2.
export function LandingMobileNav({ open, onClose }: LandingMobileNavProps) {
  return (
    <div className={`fixed inset-0 z-40 lg:hidden ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/60 transition-opacity duration-200 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <div
        className={`border-hairline bg-canvas absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col overflow-y-auto border-r px-5 py-6 transition-transform duration-200 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-6 flex items-center justify-between">
          <span className="text-ink text-[15px] font-semibold tracking-tight">PRO192</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng menu"
            className="text-ink-muted hover:bg-panel hover:text-ink flex h-8 w-8 items-center justify-center rounded-md"
          >
            <CloseIcon />
          </button>
        </div>

        <Link
          to="/syllabus-pro192-spring2021"
          onClick={onClose}
          className="text-ink-muted hover:bg-panel hover:text-ink-secondary mb-4 block rounded-md px-3 py-1.5 text-[15px] transition-colors"
        >
          Giáo trình
        </Link>

        <Sidebar onNavigate={onClose} />

        <Link
          to={`/docs/${firstChapterSlug}`}
          onClick={onClose}
          className="bg-accent hover:bg-accent-emphasis mt-6 block shrink-0 rounded-md px-4 py-2.5 text-center text-sm font-medium text-white transition-colors"
        >
          Bắt đầu học
        </Link>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify**

```bash
npm run build && npm run lint
```

Expected: both succeed/exit 0.

- [ ] **Step 3: Commit**

```bash
git add src/layout/LandingMobileNav.tsx
git commit -m "feat: add LandingMobileNav drawer for landing header"
```

---

### Task 5: `LandingHeader` component

**Files:**
- Create: `src/layout/LandingHeader.tsx`

**Interfaces:**
- Produces: `export function LandingHeader(): JSX.Element` — no props, self-contained (owns its own mobile-drawer `open` state).
- Consumes: `DocsNavDropdown` (Task 3), `GithubStarButton` (Task 2), `LandingMobileNav` (Task 4), `SearchField` and `ThemeToggle` (existing, unmodified), `firstChapterSlug` (existing).

- [ ] **Step 1: Write the component**

Create `src/layout/LandingHeader.tsx`:

```tsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { DocsNavDropdown } from '../components/DocsNavDropdown'
import { GithubStarButton } from '../components/GithubStarButton'
import { SearchField } from '../components/SearchField'
import { ThemeToggle } from '../components/ThemeToggle'
import { firstChapterSlug } from '../content/chapters'
import { LandingMobileNav } from './LandingMobileNav'

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}

// Header riêng cho Landing Page — KHÔNG dùng chung với DocsHeader (quyết định của user).
// Cấu trúc: Logo | Tài liệu (mega-menu) · Giáo trình | Search | GitHub · Theme · CTA.
export function LandingHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="border-hairline bg-canvas/95 sticky top-0 z-30 border-b backdrop-blur">
      <div className="mx-auto flex h-18 max-w-6xl items-center gap-4 px-6">
        <Link to="/" className="flex shrink-0 items-center">
          <img src="/images/logo-transparent.png" alt="PRO192 Docs" className="h-9 dark:hidden" />
          <img src="/images/logo.jpg" alt="PRO192 Docs" className="hidden h-9 dark:block" />
        </Link>

        <nav className="hidden shrink-0 items-center gap-1 lg:flex">
          <DocsNavDropdown />
          <Link
            to="/syllabus-pro192-spring2021"
            className="text-ink-body hover:bg-panel hover:text-ink rounded-md px-3 py-2 text-sm font-medium transition-colors"
          >
            Giáo trình
          </Link>
        </nav>

        <div className="hidden min-w-0 flex-1 md:block">
          <SearchField />
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <GithubStarButton />
          <ThemeToggle />
          <Link
            to={`/docs/${firstChapterSlug}`}
            className="bg-accent hover:bg-accent-emphasis hidden rounded-md px-4 py-2 text-sm font-medium text-white transition-colors active:scale-[0.98] lg:inline-block"
          >
            Bắt đầu học
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Mở menu điều hướng"
            className="text-ink-muted hover:bg-panel hover:text-ink flex h-9 w-9 shrink-0 items-center justify-center rounded-md lg:hidden"
          >
            <MenuIcon />
          </button>
        </div>
      </div>

      <LandingMobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  )
}
```

- [ ] **Step 2: Verify it builds**

```bash
npm run build && npm run lint
```

Expected: both succeed/exit 0. `LandingHeader` isn't imported by `LandingPage.tsx` yet (that happens in Task 6), so this only confirms the component compiles standalone.

- [ ] **Step 3: Commit**

```bash
git add src/layout/LandingHeader.tsx
git commit -m "feat: add LandingHeader with docs mega-menu, github button, theme toggle"
```

---

### Task 6: Rewrite Landing Page hero to use `LandingHeader` + code showcase

**Files:**
- Modify: `src/pages/LandingPage.tsx`

**Interfaces:**
- Consumes: `LandingHeader` (Task 5), existing `CodeBlock`, `BlurText`, `RevealOnScroll`, `chapters`/`firstChapterSlug`.

- [ ] **Step 1: Replace the inline header + hero with `LandingHeader` + 2-column hero**

In `src/pages/LandingPage.tsx`, replace the whole file with:

```tsx
import { Link } from 'react-router-dom'
import { BlurText } from '../components/BlurText'
import { CodeBlock } from '../components/CodeBlock'
import { RevealOnScroll } from '../components/RevealOnScroll'
import { chapters, firstChapterSlug } from '../content/chapters'
import { LandingHeader } from '../layout/LandingHeader'

const HERO_CODE = `public class Employee extends Person {
    private double salary;

    public Employee(String name, double salary) {
        super(name);
        this.salary = salary;
    }

    @Override
    public void introduce() {
        System.out.println("Tôi là " + getName() + ", lương " + salary);
    }
}`

// Landing page marketing — theo theme sáng/tối chung của site (không còn cố định sáng).
export function LandingPage() {
  return (
    <div className="bg-canvas min-h-svh">
      <LandingHeader />

      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_0%,var(--color-accent-soft),transparent_60%)] dark:bg-[radial-gradient(circle_at_30%_0%,color-mix(in_srgb,var(--color-accent)_18%,transparent),transparent_60%)]"
        />
        <div
          aria-hidden
          className="border-hairline pointer-events-none absolute inset-0 opacity-[0.4] [background-image:linear-gradient(var(--hairline)_1px,transparent_1px),linear-gradient(90deg,var(--hairline)_1px,transparent_1px)] [background-size:40px_40px] [mask-image:radial-gradient(circle_at_30%_0%,black,transparent_70%)]"
        />

        <div className="relative mx-auto grid max-w-6xl gap-12 px-6 py-24 lg:grid-cols-2 lg:items-center lg:py-32">
          <div>
            <RevealOnScroll>
              <p className="text-ink-muted mb-4 text-sm font-medium tracking-widest uppercase">
                MST Software
              </p>
            </RevealOnScroll>
            <BlurText
              text="Tài liệu học Lập trình Hướng đối tượng với Java"
              tag="h1"
              className="text-ink text-4xl font-semibold tracking-tight sm:text-5xl"
            />
            <RevealOnScroll delay={150}>
              <p className="text-ink-body mt-6 max-w-xl text-lg">
                Giáo trình PRO192 được hệ thống hoá lại: từ nền tảng Java, đóng gói, kế thừa, đa
                hình đến xử lý ngoại lệ — rõ ràng, dễ tra cứu, đúng chuẩn học thuật.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-3">
                <Link
                  to={`/docs/${firstChapterSlug}`}
                  className="bg-accent hover:bg-accent-emphasis rounded-md px-6 py-3 text-sm font-medium text-white transition-colors active:scale-[0.98]"
                >
                  Bắt đầu học
                </Link>
                <a
                  href="#noi-dung"
                  className="border-hairline text-ink-secondary hover:border-hairline-strong hover:bg-panel rounded-md border px-6 py-3 text-sm font-medium transition-colors active:scale-[0.98]"
                >
                  Xem nội dung khoá học
                </a>
              </div>
            </RevealOnScroll>
          </div>

          <RevealOnScroll delay={100} className="lg:justify-self-end">
            <div className="w-full max-w-md lg:max-w-lg">
              <CodeBlock code={HERO_CODE} language="java" />
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Stats bar, Features, chapter grid, Footer — added in later tasks */}
    </div>
  )
}
```

Note: `RevealOnScroll` already accepts a `className` prop (see `src/components/RevealOnScroll.tsx:8`), so passing `lg:justify-self-end` is valid.

- [ ] **Step 2: Run the dev server and visually verify**

```bash
npm run dev
```

Open the printed local URL (e.g. `http://localhost:5173/`) in a browser:
- Header shows logo, "Tài liệu ▾" (click it → mega-menu with 5 groups opens), "Giáo trình", search box, GitHub button (with star count once the API responds), theme toggle, "Bắt đầu học" CTA.
- Hero shows heading/description/CTAs on the left and a dark Java code block (with syntax highlighting) on the right, over a faint blue gradient + grid background.
- Toggle theme (moon icon) → background, text, borders all switch to dark tokens; code block stays dark in both modes (by design).
- Resize to ~375px width → header collapses to logo + GitHub icon + theme + hamburger; clicking hamburger opens `LandingMobileNav` from the left with "Giáo trình", grouped chapter list, and "Bắt đầu học" CTA at the bottom.

- [ ] **Step 3: Build, lint, commit**

```bash
npm run build && npm run lint
```

Expected: both succeed/exit 0.

```bash
git add src/pages/LandingPage.tsx
git commit -m "feat: rewrite landing hero with LandingHeader and code showcase"
```

---

### Task 7: Add Stats bar section

**Files:**
- Modify: `src/pages/LandingPage.tsx`

**Interfaces:**
- Consumes: `contentStats` from `src/content/chapters/index.ts` (Task 1).

- [ ] **Step 1: Add the import and the section**

In `src/pages/LandingPage.tsx`, add `contentStats` to the existing import:

```ts
import { chapters, contentStats, firstChapterSlug } from '../content/chapters'
```

Replace the placeholder comment `{/* Stats bar, Features, chapter grid, Footer — added in later tasks */}` with:

```tsx
<section className="border-hairline border-t px-6 py-10">
  <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 text-center sm:grid-cols-4">
    {[
      { label: 'chương', value: String(contentStats.chapterCount) },
      { label: 'ví dụ code Java', value: String(contentStats.codeBlockCount) },
      {
        label: 'hình minh hoạ',
        value: `${Math.floor(contentStats.imageCount / 50) * 50}+`,
      },
      { label: '', value: 'Song ngữ Việt / English' },
    ].map((stat) => (
      <div key={stat.label || stat.value}>
        <p className="text-accent-on-surface text-2xl font-semibold tracking-tight sm:text-3xl">
          {stat.value}
        </p>
        {stat.label ? <p className="text-ink-muted mt-1 text-sm">{stat.label}</p> : null}
      </div>
    ))}
  </div>
</section>

{/* Features, chapter grid, Footer — added in later tasks */}
```

- [ ] **Step 2: Verify in the browser**

```bash
npm run dev
```

Confirm the stats bar renders 4 values under the hero: chapter count, code-example count, `100+` (or current rounded image count), and "Song ngữ Việt / English" — in both light and dark mode, at desktop and mobile widths.

- [ ] **Step 3: Build, lint, commit**

```bash
npm run build && npm run lint
```

Expected: both succeed/exit 0.

```bash
git add src/pages/LandingPage.tsx
git commit -m "feat: add stats bar to landing page"
```

---

### Task 8: Add "Vì sao học tại đây" features section

**Files:**
- Modify: `src/pages/LandingPage.tsx`

**Interfaces:**
- Consumes: nothing new (static content only).

- [ ] **Step 1: Add the section**

Replace the placeholder comment `{/* Features, chapter grid, Footer — added in later tasks */}` with:

```tsx
<section className="border-hairline border-t px-6 py-20">
  <div className="mx-auto max-w-5xl">
    <RevealOnScroll>
      <h2 className="text-ink text-2xl font-semibold tracking-tight">Vì sao học tại đây?</h2>
    </RevealOnScroll>

    <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {[
        {
          title: 'Song ngữ Việt – Anh',
          description: 'Nội dung dịch sang tiếng Việt, giữ nguyên thuật ngữ lập trình chuẩn.',
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-5 w-5">
              <circle cx="12" cy="12" r="9" />
              <path strokeLinecap="round" d="M3 12h18M12 3c2.5 2.5 3.8 5.7 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.7-3.8-9s1.3-6.5 3.8-9Z" />
            </svg>
          ),
        },
        {
          title: 'Code minh hoạ thực tế',
          description: 'Mỗi khái niệm đi kèm ví dụ Java và sơ đồ minh hoạ cụ thể.',
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8 9-4 3 4 3M16 9l4 3-4 3M13 6l-2 12" />
            </svg>
          ),
        },
        {
          title: 'Miễn phí & mã nguồn mở',
          description: 'Toàn bộ nội dung công khai trên GitHub, tự do tham khảo và đóng góp.',
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v3m0 12v3m9-9h-3M6 12H3m14.5-6.5-2.1 2.1M8.6 15.4l-2.1 2.1m0-11 2.1 2.1m8.8 8.8 2.1 2.1" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          ),
        },
        {
          title: 'Bám sát syllabus PRO192',
          description: 'Cấu trúc chương bám theo syllabus chính thức của môn học.',
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 19.5V6a2 2 0 0 1 2-2h11a1 1 0 0 1 1 1v14.5M6 19.5A1.5 1.5 0 0 1 7.5 18H18M6 19.5A1.5 1.5 0 0 0 7.5 21H18v-3" />
            </svg>
          ),
        },
      ].map((feature, index) => (
        <RevealOnScroll key={feature.title} delay={index * 80}>
          <div className="border-hairline h-full rounded-lg border p-6">
            <div className="bg-accent-soft text-accent-on-surface flex h-10 w-10 items-center justify-center rounded-md dark:bg-white/5">
              {feature.icon}
            </div>
            <h3 className="text-ink mt-4 text-base font-semibold">{feature.title}</h3>
            <p className="text-ink-body mt-1.5 text-sm leading-relaxed">{feature.description}</p>
          </div>
        </RevealOnScroll>
      ))}
    </div>
  </div>
</section>

{/* Chapter grid, Footer — added in later tasks */}
```

- [ ] **Step 2: Verify in the browser**

```bash
npm run dev
```

Confirm 4 feature cards render with icons, in a 4-column grid on desktop and stacked/2-column on smaller widths, in both light and dark mode (icon chip background should be a soft blue tint in light, subtle white tint in dark).

- [ ] **Step 3: Build, lint, commit**

```bash
npm run build && npm run lint
```

Expected: both succeed/exit 0.

```bash
git add src/pages/LandingPage.tsx
git commit -m "feat: add why-learn-here features section to landing page"
```

---

### Task 9: New multi-column footer (replacing the single copyright line)

**Files:**
- Modify: `src/pages/LandingPage.tsx`

**Interfaces:**
- Consumes: `groupChapters` from `src/content/chapters/index.ts` (Task 1), existing `chapters`/`firstChapterSlug`.

- [ ] **Step 1: Update imports**

Change the content import line to:

```ts
import { chapters, contentStats, firstChapterSlug, groupChapters } from '../content/chapters'
```

- [ ] **Step 2: Restore the chapter grid section (token-ized for dark mode) and add the new footer**

Task 6's rewrite dropped the original chapter-grid section from the file (it was left as a placeholder comment). Replace `{/* Chapter grid, Footer — added in later tasks */}` with the chapter grid section below — this is the original grid from before this redesign, with every hard-coded `neutral-*`/`bg-white` class swapped for the semantic tokens so it now follows dark mode correctly — immediately followed by the new footer:

```tsx
<section id="noi-dung" className="border-hairline border-t px-6 py-24">
  <div className="mx-auto max-w-5xl">
    <RevealOnScroll>
      <h2 className="text-ink text-2xl font-semibold tracking-tight">Nội dung khoá học</h2>
      <p className="text-ink-body mt-2 max-w-2xl">
        11 chương bám sát chương trình PRO192, đi từ khái niệm nền tảng đến các chủ đề nâng
        cao của lập trình hướng đối tượng.
      </p>
    </RevealOnScroll>

    <ol className="bg-hairline border-hairline mt-10 grid gap-px overflow-hidden rounded-lg border sm:grid-cols-2">
      {chapters.map((chapter, index) => (
        <li key={chapter.slug} className="bg-canvas">
          <RevealOnScroll delay={(index % 2) * 80}>
            <Link
              to={`/docs/${chapter.slug}`}
              className="hover:bg-panel group block p-6 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="text-ink-faint font-mono text-sm">
                  {String(index + 1).padStart(2, '0')}
                </span>
                {chapter.status === 'draft' ? (
                  <span className="bg-well text-ink-faint shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase">
                    Sắp ra mắt
                  </span>
                ) : null}
              </div>
              <h3 className="text-ink group-hover:text-accent-on-surface mt-3 text-base font-semibold">
                {chapter.title}
              </h3>
              <p className="text-ink-body mt-1.5 text-sm leading-relaxed">{chapter.description}</p>
            </Link>
          </RevealOnScroll>
        </li>
      ))}
    </ol>
  </div>
</section>

<footer className="border-hairline border-t px-6 py-16">
  <div className="mx-auto grid max-w-5xl gap-10 sm:grid-cols-3">
    <div>
      <img src="/images/logo-transparent.png" alt="PRO192 Docs" className="h-8 dark:hidden" />
      <img src="/images/logo.jpg" alt="PRO192 Docs" className="hidden h-8 dark:block" />
      <p className="text-ink-muted mt-3 max-w-xs text-sm">
        Tài liệu học Lập trình Hướng đối tượng với Java, thực hiện bởi MST Software.
      </p>
    </div>

    <div>
      <p className="text-ink-faint mb-3 text-xs font-semibold tracking-wider uppercase">Tài liệu</p>
      <ul className="space-y-2 text-sm">
        {groupChapters().map((group) => (
          <li key={group.name}>
            <Link
              to={`/docs/${group.items[0].slug}`}
              className="text-ink-body hover:text-ink transition-colors"
            >
              {group.name}
            </Link>
          </li>
        ))}
        <li>
          <Link
            to="/syllabus-pro192-spring2021"
            className="text-ink-body hover:text-ink transition-colors"
          >
            Giáo trình
          </Link>
        </li>
      </ul>
    </div>

    <div>
      <p className="text-ink-faint mb-3 text-xs font-semibold tracking-wider uppercase">Dự án</p>
      <ul className="space-y-2 text-sm">
        <li>
          <a
            href="https://github.com/mst-software-vn/pro192web"
            target="_blank"
            rel="noreferrer"
            className="text-ink-body hover:text-ink transition-colors"
          >
            GitHub repository
          </a>
        </li>
      </ul>
    </div>
  </div>

  <p className="text-ink-faint mx-auto mt-12 max-w-5xl text-sm">
    © 2026 MST Software · Tài liệu học Java OOP (PRO192)
  </p>
</footer>
```

- [ ] **Step 3: Verify in the browser**

```bash
npm run dev
```

Confirm the footer shows 3 columns (logo+blurb, "Tài liệu" group links, "Dự án" GitHub link) followed by the copyright line, correctly themed in light/dark, stacked on mobile.

- [ ] **Step 4: Build, lint, commit**

```bash
npm run build && npm run lint
```

Expected: both succeed/exit 0.

```bash
git add src/pages/LandingPage.tsx
git commit -m "feat: add multi-column footer to landing page"
```

---

### Task 10: Full cross-check — Landing (light/dark, desktop/mobile) + confirm Docs untouched

**Files:** none (verification only).

- [ ] **Step 1: Full build + lint**

```bash
npm run build && npm run lint
```

Expected: both succeed/exit 0, no warnings beyond the pre-existing known `use-language.tsx` fast-refresh warning.

- [ ] **Step 2: Manual/headless check of Landing Page**

```bash
npm run dev
```

At `http://localhost:5173/` (or whichever port Vite prints):
- Desktop (~1280px), light mode: header (mega-menu, GitHub star count, search, theme toggle, CTA), hero (code block + gradient/grid bg), stats bar, features grid, chapter grid, footer all render correctly with blue accents.
- Toggle to dark mode: every section switches via tokens, no leftover hard-coded light-only backgrounds (no white boxes / unreadable text).
- Resize to ~375px: header collapses correctly, hamburger opens `LandingMobileNav`, all sections stack single-column and remain readable.

- [ ] **Step 3: Confirm Docs area is unaffected**

At `http://localhost:5173/docs/chao-mung`:
- `DocsHeader` still renders exactly as before (hamburger + logo + search + language selector + theme toggle, no mega-menu, no GitHub button, no CTA).
- Sidebar still lists chapters grouped identically to before the refactor in Task 1 (visually compare against groups: Nhập môn, Nền tảng ngôn ngữ, Lập trình hướng đối tượng, Cấu trúc dữ liệu, Nâng cao).
- Mobile hamburger still opens the existing `MobileNav` drawer (not `LandingMobileNav`).

- [ ] **Step 4: Final commit (only if any fixups were needed in this task)**

If Steps 2–3 required no code changes, there is nothing to commit for this task — it is verification-only. If a visual bug was found and fixed, commit it with a message describing the fix, e.g.:

```bash
git add -A
git commit -m "fix: <describe the specific visual bug found during cross-check>"
```
