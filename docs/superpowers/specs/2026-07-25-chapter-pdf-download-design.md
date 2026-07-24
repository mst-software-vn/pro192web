# Chapter PDF Download — Design

## Problem

Students want to download all 11 PRO192 chapters as PDF files for offline reading. The site is a pure static SPA (Vite build → Cloudflare Workers static hosting, no backend/API), so PDF generation must not require a runtime server.

## Decision

Generate the PDFs at **build/authoring time**, not at request time or in the browser. A manually-run Node script drives a real headless browser against a dedicated print-only route of the actual app, so the PDFs are pixel-faithful to the site's real rendering (fonts, code blocks, images) without adding any client-side PDF library to the production bundle.

## Scope

- English content only (user's explicit choice: English is the standard language for programming reference material; the Vietnamese body is the primary site language but not what goes in the PDFs).
- All 11 chapters, including Welcome and Introduction Course.
- One CTA, on the Welcome (`chào mừng`) chapter page only.
- No automated test for the generation script itself (it drives a real browser; not worth simulating). Manual verification: run the script, open a sample of the resulting PDFs.

## Architecture

```
scripts/generate-chapter-pdfs.mjs   (new; run manually via `npm run generate:pdfs`)
  1. Start a Vite dev server in-process (vite's `createServer` JS API)
  2. Launch Puppeteer (headless Chromium)
  3. For each of the 11 chapters (in src/content/chapters order):
     - navigate to http://localhost:<port>/print/docs/<slug>
     - wait for content + images to finish loading
     - page.pdf() → tmp/<NN>-<slug>.pdf  (NN = 01..11, chapter order)
  4. Zip all 11 PDFs into public/downloads/pro192-course-pdfs.zip (archiver)
  5. Close browser, stop dev server, delete tmp dir
```

The output zip is **committed to git**, the same way `public/images/` is today. Vite copies everything under `public/` into `dist/` verbatim at build time, so once the zip exists in the repo, normal `npm run build` / deploy serves it as a static file — no new runtime code path.

### New route: `/print/docs/:slug`

A new, minimal page (`src/pages/PrintChapterPage.tsx`), registered directly in `AppRouter.tsx` (not nested under `DocsLayout`). Renders:
- A small header: site logo + "PRO192 · `<chapter.titleEn>`"
- The chapter body via the existing `MarkdownContent` component, using `chapter.body` (English) unconditionally — this route never reads `useLanguage`/localStorage, so it always renders English regardless of the visiting browser's stored preference.
- No sidebar, no TOC, no header nav, no quiz section, no search — this is print output, not the interactive docs UI.
- No `useTheme()` call anywhere in the tree reached by this route, so `document.documentElement` never gets the `.dark` class added — the page renders with the site's default light tokens, appropriate for print.
- A print-oriented print/page-break CSS treatment: avoid breaking headings and code blocks across a page (`break-inside: avoid` on code blocks/images, `break-after: avoid` on headings).

Page numbering ("Page X of Y") is added by Puppeteer's native PDF `footerTemplate` option, not rendered as part of the page content.

If `getChapter(slug)` returns nothing, render nothing meaningful (this route is only ever hit by the generation script with known-good slugs — no need for a polished not-found state).

### Script implementation notes

- New devDependencies: `puppeteer` (headless browser + PDF rendering), `archiver` (zip creation). Both build-tool-only — never imported by any file under `src/`, so they cannot leak into the production bundle.
- Plain `.mjs` (ESM, matches `"type": "module"` in `package.json`) — a standalone Node script, not part of `tsconfig.app.json`'s checked source, not linted by oxlint's app config.
- File naming inside the zip: `01-welcome.pdf`, `02-introduction-course.pdf`, ... `11-file-io.pdf` — zero-padded two-digit prefix from the chapter's position in `src/content/chapters/index.ts`, so files sort in reading order once extracted.
- `page.emulateMediaType('screen')` before `page.pdf()`, since the print route has no `@media print` overrides of its own — its Tailwind classes are the intended print styling as-is.
- Wait for all `<img>` elements in the rendered page to finish loading before calling `page.pdf()`, to avoid blank images from async load races.
- `npm run generate:pdfs` script entry added to `package.json`.

### CTA on the Welcome chapter

A small callout section rendered in `DocsPage.tsx`, immediately after the markdown body, gated to `chapter.slug === 'welcome'` only. Reads roughly "Download all course materials (PDF)" with a one-line subtext ("11 chapters · PDF"), and an `<a href="/downloads/pro192-course-pdfs.zip" download>` styled as a button. Clicking it is a plain static-file download — the browser's own Save-As dialog handles the rest; no JS needed beyond the anchor tag.

## Out of scope / explicitly not doing

- No PDF generation at request time, no new Cloudflare Worker/API route.
- No client-side PDF library (jsPDF/react-pdf) in the production bundle.
- No Vietnamese-language PDFs.
- No automatic regeneration hooked into `npm run build` — regeneration is a manual step run when chapter content changes, matching how image assets are already handled in this repo.
