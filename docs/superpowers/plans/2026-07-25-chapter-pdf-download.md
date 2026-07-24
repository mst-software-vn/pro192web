# Chapter PDF Download Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let students download all 11 PRO192 chapters as English-language PDFs (bundled in one zip) from a CTA on the Welcome page.

**Architecture:** A new print-only route (`/print/docs/:slug`) renders each chapter body with no site chrome. A manually-run Node script (`scripts/generate-chapter-pdfs.mjs`) starts a Vite dev server, drives Puppeteer against that route for all 11 chapters, saves numbered PDFs, and zips them into `public/downloads/pro192-course-pdfs.zip`, which gets committed to git and served as a static asset like any other file under `public/`.

**Tech Stack:** Existing (React 19, Vite 8, react-router-dom v7, Tailwind v4). New devDependencies: `puppeteer`, `archiver`.

## Global Constraints

- English content only in the generated PDFs — the print route always renders `chapter.body`, never `chapter.bodyVi`, and never reads `useLanguage`.
- The print route never calls `useTheme()` — no `.dark` class ends up on `<html>` for this route, so PDFs render with the site's default light tokens.
- `puppeteer` and `archiver` are devDependencies only — no file under `src/` may import from either package.
- Generated PDF/zip output is committed to git (same convention as `public/images/`), not produced at request time or during `npm run build`.
- No automated test is written for the generation script — verification is manual (run it, open a few resulting PDFs).
- Follow the commit-per-task rule already in force for this repo: one commit per completed task below, lowercase conventional-commit subject, no co-author trailer.

---

### Task 1: Print-only route and `PrintChapterPage`

**Files:**
- Create: `src/pages/PrintChapterPage.tsx`
- Modify: `src/router/AppRouter.tsx`
- Modify: `src/components/MarkdownContent.tsx` (break-avoid print hints on headings/figures)
- Modify: `src/components/CodeBlock.tsx` (break-avoid print hint on the code block wrapper)

**Interfaces:**
- Consumes: `getChapter(slug: string): Chapter | undefined` and `Chapter.body`/`titleEn`/`descriptionEn` from `src/content/chapters/index.ts` (already exist, unchanged). `MarkdownContent({ markdown: string })` (already exists, unchanged props).
- Produces: a reachable route `/print/docs/:slug` that renders chapter content with no site chrome, used by Task 3's script as its navigation target.

- [ ] **Step 1: Add `break-after-avoid` to headings in `MarkdownContent.tsx`**

In `src/components/MarkdownContent.tsx`, find `makeHeading`:

```tsx
function makeHeading(depth: 2 | 3 | 4) {
  const styles = {
    2: 'mt-12 mb-4 text-2xl font-semibold text-ink tracking-tight',
    3: 'mt-10 mb-3 text-xl font-semibold text-ink tracking-tight',
    4: 'mt-8 mb-2 text-base font-semibold text-ink tracking-tight',
  }
  return function Heading({ children }: { children?: ReactNode }) {
    const text = flattenToText(children)
    const id = slugify(text)
    const Tag = `h${depth}` as 'h2' | 'h3' | 'h4'
    return (
      <Tag id={id} className={`scroll-mt-24 break-after-avoid ${styles[depth]}`}>
        {children}
      </Tag>
    )
  }
}
```

(Read the current exact file content first — the styles map and existing className expression may differ slightly from the excerpt above; the required change is only adding the `break-after-avoid` utility class to the existing className string on the `<Tag>` element, nothing else.)

- [ ] **Step 2: Add `break-inside-avoid` to the `Figure` component**

In the same file, find the `Figure` component's non-placeholder `<figure>` return (the one with the real `<img>`), and add `break-inside-avoid` to its existing `className="my-6"`, making it `className="my-6 break-inside-avoid"`.

- [ ] **Step 3: Add `break-inside-avoid` to `CodeBlock`'s root wrapper**

In `src/components/CodeBlock.tsx`, find the root `<div>` (currently `className="group/code relative my-6 overflow-hidden rounded-lg border border-neutral-800 bg-[#1e1e1e]"`) and append `break-inside-avoid`.

- [ ] **Step 4: Create `src/pages/PrintChapterPage.tsx`**

```tsx
import { useParams } from 'react-router-dom'
import { MarkdownContent } from '../components/MarkdownContent'
import { getChapter } from '../content/chapters'

// Route dùng riêng cho script tạo PDF (scripts/generate-chapter-pdfs.mjs) — không có
// sidebar/TOC/header/quiz/search, luôn render tiếng Anh bất kể localStorage ngôn ngữ,
// và không gọi useTheme() nên luôn render theo token sáng mặc định (phù hợp để in PDF).
export function PrintChapterPage() {
  const { slug } = useParams()
  const chapter = slug ? getChapter(slug) : undefined

  if (!chapter || !chapter.body) return null

  return (
    <div className="bg-canvas mx-auto max-w-[760px] px-10 py-10">
      <header className="border-hairline mb-8 border-b pb-6">
        <div className="mb-4 flex items-center gap-2">
          <img src="/images/logo-transparent.png" alt="PRO192" className="h-8" />
          <span className="text-ink-faint text-sm font-medium">PRO192 · {chapter.titleEn}</span>
        </div>
        <h1 className="text-ink text-3xl font-semibold tracking-tight">{chapter.titleEn}</h1>
        <p className="text-ink-muted mt-3 text-[15px] leading-relaxed">{chapter.descriptionEn}</p>
      </header>

      <MarkdownContent markdown={chapter.body} />
    </div>
  )
}
```

- [ ] **Step 5: Register the route in `src/router/AppRouter.tsx`**

Add the lazy import next to the others:

```tsx
const PrintChapterPage = lazy(() =>
  import('../pages/PrintChapterPage').then((m) => ({ default: m.PrintChapterPage })),
)
```

Add the route inside `<Routes>`, as a sibling of the existing top-level routes (not nested under `DocsLayout`):

```tsx
<Route path="/print/docs/:slug" element={<PrintChapterPage />} />
```

- [ ] **Step 6: Verify manually**

Run `npm run dev`, visit `http://localhost:5173/print/docs/welcome` (adjust port to whatever Vite prints). Confirm: no sidebar/header/TOC/quiz visible, English title/body rendered, light theme regardless of OS/browser dark-mode setting.

- [ ] **Step 7: Typecheck, lint, commit**

```bash
npx tsc --noEmit -p tsconfig.app.json
npx oxlint src/pages/PrintChapterPage.tsx src/router/AppRouter.tsx src/components/MarkdownContent.tsx src/components/CodeBlock.tsx
git add src/pages/PrintChapterPage.tsx src/router/AppRouter.tsx src/components/MarkdownContent.tsx src/components/CodeBlock.tsx
git commit -m "feat(pdf): add print-only chapter route for pdf generation"
```

---

### Task 2: Welcome-page download CTA

**Files:**
- Modify: `src/pages/DocsPage.tsx`

**Interfaces:**
- Consumes: `chapter.slug` (already in scope in `DocsPage.tsx`), `isEn` (already in scope).
- Produces: nothing consumed by later tasks — this is a leaf UI change. It links to `/downloads/pro192-course-pdfs.zip`, the exact path Task 3's script must write to.

- [ ] **Step 1: Add the callout after the body/placeholder block, before `QuizSection`**

In `src/pages/DocsPage.tsx`, insert this JSX right after the `{body ? (...) : (...)}` block and before `<QuizSection key={chapter.slug} slug={chapter.slug} />`:

```tsx
{chapter.slug === 'welcome' ? (
  <div className="border-hairline-strong bg-panel mt-10 flex flex-col items-start gap-4 rounded-lg border px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <p className="text-ink text-sm font-semibold">
        {isEn ? 'Download all course materials' : 'Tải toàn bộ tài liệu khoá học'}
      </p>
      <p className="text-ink-muted mt-1 text-sm">{isEn ? '11 chapters · PDF' : '11 chương · PDF'}</p>
    </div>
    <a
      href="/downloads/pro192-course-pdfs.zip"
      download
      className="bg-accent hover:bg-accent-emphasis inline-flex shrink-0 items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-white transition-colors"
    >
      {isEn ? 'Download PDF' : 'Tải PDF'}
    </a>
  </div>
) : null}
```

- [ ] **Step 2: Typecheck, lint, commit**

```bash
npx tsc --noEmit -p tsconfig.app.json
npx oxlint src/pages/DocsPage.tsx
git add src/pages/DocsPage.tsx
git commit -m "feat(pdf): add course materials download cta on welcome page"
```

(The link will 404 until Task 3/4 produce the zip file — that is expected and resolved by the end of Task 4.)

---

### Task 3: PDF generation script

**Files:**
- Create: `scripts/generate-chapter-pdfs.mjs`
- Modify: `package.json` (devDependencies + `scripts.generate:pdfs`)

**Interfaces:**
- Consumes: the route from Task 1 (`/print/docs/:slug`), and `src/content/chapters/index.ts`'s `chapters` array (via a small inline slug list — see Step 2 — since this is a plain `.mjs` Node script run outside Vite's module graph and cannot `import` a TS file that itself depends on `import.meta.glob`).
- Produces: `public/downloads/pro192-course-pdfs.zip` (written to disk; consumed by Task 2's CTA link and served statically by the deployed app).

- [ ] **Step 1: Install devDependencies**

```bash
npm install --save-dev puppeteer archiver
```

- [ ] **Step 2: Create `scripts/generate-chapter-pdfs.mjs`**

```js
import { mkdir, rm, writeFile } from 'node:fs/promises'
import { createWriteStream } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import archiver from 'archiver'
import puppeteer from 'puppeteer'
import { createServer } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const tmpDir = path.join(rootDir, 'tmp-chapter-pdfs')
const outputZip = path.join(rootDir, 'public/downloads/pro192-course-pdfs.zip')

// Thứ tự & slug phải khớp src/content/chapters/index.ts — không import trực tiếp file đó
// vì nó dùng import.meta.glob (chỉ chạy được trong pipeline build của Vite), còn script
// này chạy như một Node script độc lập ngoài Vite.
const CHAPTER_SLUGS = [
  'welcome',
  'introduction-course',
  'foundations',
  'encapsulation',
  'inheritance',
  'polymorphism',
  'array-of-objects',
  'collections',
  'dynamic-memory',
  'exception-handling',
  'file-io',
]

async function waitForImages(page) {
  await page.evaluate(async () => {
    const images = Array.from(document.querySelectorAll('img'))
    await Promise.all(
      images.map((img) =>
        img.complete
          ? Promise.resolve()
          : new Promise((resolve) => {
              img.addEventListener('load', resolve, { once: true })
              img.addEventListener('error', resolve, { once: true })
            }),
      ),
    )
  })
}

async function main() {
  await rm(tmpDir, { recursive: true, force: true })
  await mkdir(tmpDir, { recursive: true })
  await mkdir(path.dirname(outputZip), { recursive: true })

  const server = await createServer({ root: rootDir, server: { port: 0 } })
  await server.listen()
  const address = server.httpServer?.address()
  if (!address || typeof address === 'string') throw new Error('Vite dev server did not start')
  const baseUrl = `http://localhost:${address.port}`

  const browser = await puppeteer.launch({ headless: true })

  try {
    for (const [index, slug] of CHAPTER_SLUGS.entries()) {
      const page = await browser.newPage()
      await page.goto(`${baseUrl}/print/docs/${slug}`, { waitUntil: 'networkidle0' })
      await waitForImages(page)
      await page.emulateMediaType('screen')

      const fileName = `${String(index + 1).padStart(2, '0')}-${slug}.pdf`
      await page.pdf({
        path: path.join(tmpDir, fileName),
        format: 'a4',
        printBackground: true,
        margin: { top: '20mm', bottom: '20mm', left: '18mm', right: '18mm' },
        displayHeaderFooter: true,
        headerTemplate: '<span></span>',
        footerTemplate:
          '<div style="font-size:9px;width:100%;text-align:center;color:#888;">' +
          '<span class="pageNumber"></span> / <span class="totalPages"></span></div>',
      })
      await page.close()
      console.log(`generated ${fileName}`)
    }

    await new Promise((resolve, reject) => {
      const output = createWriteStream(outputZip)
      const archive = archiver('zip', { zlib: { level: 9 } })
      output.on('close', resolve)
      archive.on('error', reject)
      archive.pipe(output)
      archive.directory(tmpDir, false)
      archive.finalize()
    })

    console.log(`wrote ${outputZip}`)
  } finally {
    await browser.close()
    await server.close()
    await rm(tmpDir, { recursive: true, force: true })
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
```

- [ ] **Step 3: Add the npm script**

In `package.json`, add to `"scripts"`:

```json
"generate:pdfs": "node scripts/generate-chapter-pdfs.mjs"
```

- [ ] **Step 4: Add a `.gitignore` entry for the working temp directory**

Add `tmp-chapter-pdfs/` to `.gitignore` (the script already removes it when done, but ignoring it guards against a crashed run leaving it behind and getting committed by accident).

- [ ] **Step 5: Lint and commit (script itself is not run yet — that's Task 4)**

```bash
npx oxlint scripts/generate-chapter-pdfs.mjs
git add scripts/generate-chapter-pdfs.mjs package.json package-lock.json .gitignore
git commit -m "feat(pdf): add build-time chapter pdf generation script"
```

---

### Task 4: Generate and commit the PDFs

**Files:**
- Create (generated, not hand-written): `public/downloads/pro192-course-pdfs.zip`

**Interfaces:**
- Consumes: Task 1's `/print/docs/:slug` route, Task 3's script.
- Produces: the actual file Task 2's CTA links to.

- [ ] **Step 1: Run the generation script**

```bash
npm run generate:pdfs
```

Expected: 11 `generated NN-slug.pdf` log lines, then `wrote .../public/downloads/pro192-course-pdfs.zip`.

- [ ] **Step 2: Manually inspect a sample**

Unzip to a scratch location and open at least 2-3 of the 11 PDFs (e.g. `01-welcome.pdf`, a chapter with code blocks like `04-encapsulation.pdf`, and one with images like `05-inheritance.pdf`). Confirm: English content, readable code blocks, images present (not broken), no sidebar/header/quiz leaking in, no dark background.

- [ ] **Step 3: Commit the generated zip**

```bash
git add public/downloads/pro192-course-pdfs.zip
git commit -m "chore(pdf): generate course materials pdf bundle"
```

- [ ] **Step 4: End-to-end check**

Run `npm run dev`, open the Welcome chapter page, click the "Download PDF" button, confirm the browser downloads `pro192-course-pdfs.zip` and it's the same file just committed.

---

### Task 5: Update `.claude/CLAUDE.md`

**Files:**
- Modify: `.claude/CLAUDE.md`

- [ ] **Step 1: Add a bullet under "Kiến trúc"**

Add a new bullet describing the feature, e.g.:

```
- **Tải tài liệu PDF**: chương Welcome có nút tải `public/downloads/pro192-course-pdfs.zip` (11 file PDF, một cho mỗi chương, chỉ tiếng Anh) — file này được generate thủ công qua `npm run generate:pdfs` (`scripts/generate-chapter-pdfs.mjs`, dùng Puppeteer render route ẩn `/print/docs/<slug>` rồi nén), commit thẳng vào git giống `public/images/`, KHÔNG tự động generate lại mỗi lần `npm run build` — cần chạy tay lại script này khi nội dung chương đổi.
```

- [ ] **Step 2: Commit**

```bash
git add .claude/CLAUDE.md
git commit -m "docs: document chapter pdf download feature"
```

## Self-Review Notes

- Spec coverage: every section of the 2026-07-25 design spec maps to a task above (print route → Task 1, script → Task 3, generation+commit → Task 4, CTA → Task 2, docs → Task 5).
- The script imports the slug list as a literal array rather than importing `src/content/chapters/index.ts` directly, because that module uses `import.meta.glob`, a Vite-only construct — it cannot run under plain Node. This literal list must be kept in sync by hand if a chapter is ever added/removed/reordered; noted inline as a comment in the script.
- No task depends on network access beyond `npm install` in Task 3 Step 1 and the local Vite dev server the script itself starts — no external services.
