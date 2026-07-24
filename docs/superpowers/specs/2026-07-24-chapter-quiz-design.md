# Chapter quiz — design spec

## Overview

Add an optional multiple-choice quiz at the end of each chapter's Docs page (`/docs/<slug>`), so students can self-check understanding right after reading. Questions are hardcoded in source per chapter; on every visit/reload, 5 questions are drawn at random from that chapter's question pool.

**Goals:**
- Give students a quick, low-friction self-check after reading a chapter.
- Keep the quiz pool easy to grow over time (just add questions to a file) without touching UI code.
- Match the existing Docs visual language exactly — no new design system, only what's genuinely new (correct/incorrect state colors).

**Non-goals (explicitly out of scope for this spec):**
- No backend, no accounts, no cross-device sync, no analytics dashboard.
- No authoring UI / CMS — questions are edited by hand in source and shipped via a normal build+deploy.
- No partial credit, no timed quizzes, no question difficulty levels.

## Data model

Added to `src/content/types.ts`:

```ts
export interface QuizOption {
  id: string // 'a' | 'b' | 'c' | 'd' ...
  text: string // Vietnamese — primary, required
  textEn?: string // English — optional
}

export interface QuizQuestion {
  id: string
  question: string // Vietnamese — primary, required
  questionEn?: string // English — optional
  options: QuizOption[]
  correctOptionIds: string[] // 1 item = single-choice (radio), >1 = multi-choice (checkbox)
  explanation: string // Vietnamese — primary, required
  explanationEn?: string // English — optional
}
```

**Language direction is intentionally reversed from `Chapter`.** `Chapter.body` (English) is required and `bodyVi` is the optional/catching-up translation, because chapter bodies originated as scraped English course notes later translated to Vietnamese. Quiz content has no such legacy source — the user is authoring it fresh, in Vietnamese, so Vietnamese is the required primary field and English is the optional extra. When viewing in English mode and an `*En` field is missing, silently fall back to the Vietnamese text for that field — no per-question "translation pending" notice (unlike `DocsPage`'s one banner for the whole chapter body, repeating that notice per quiz question would be noisy).

## File organization

One file per chapter, mirroring the existing `.md`/`.vi.md` per-chapter convention:

```
src/content/quizzes/
├── chao-mung.ts
├── introduction-course.ts
├── nen-tang.ts
├── dong-goi.ts
├── ke-thua.ts
├── da-hinh.ts
├── mang-doi-tuong.ts
├── bo-suu-tap.ts
├── bo-nho-dong.ts
├── xu-ly-ngoai-le.ts
├── nhap-xuat-tep.ts
└── index.ts
```

Each `<slug>.ts` exports `export const questions: QuizQuestion[] = [...]`.

`index.ts` loads all of them at build time (same technique as `src/content/chapters/index.ts`):

```ts
const modules = import.meta.glob('./*.ts', { eager: true }) as Record<string, { questions: QuizQuestion[] }>

export function getQuizPool(slug: string): QuizQuestion[] {
  return modules[`./${slug}.ts`]?.questions ?? []
}
```

A chapter with no quiz file yet (or an empty `questions` array) simply has no quiz section rendered — see "Rendering gate" below. This is the only condition that hides the quiz; it is not tied to `Chapter.status` directly, so a chapter can be `published` (has body content) before its quiz file is ready.

## Selection algorithm

Fixed count: **5 questions**, always, regardless of pool size.

```
shuffled = fisherYatesShuffle(pool)   // unbiased random permutation, in-place on a copy
selected = shuffled.slice(0, min(5, pool.length))
```

If the pool has 5 or fewer questions, all of them are shown (shuffled order only). There is no minimum pool-size enforcement in code — a content-authoring guideline (recommend ≥15 questions per chapter for real variety) belongs in a comment/README note, not a runtime check.

Recomputed via `useMemo(() => pickQuestions(getQuizPool(slug)), [slug])` inside `QuizSection` — re-runs on every mount (page load, reload, revisit), and again on demand when the student clicks "Làm lại" (via a manual re-roll, not a remount).

## Scoring

- **Single-choice** (`correctOptionIds.length === 1`): correct iff the one selected option's id equals the single correct id.
- **Multi-choice** (`correctOptionIds.length > 1`): correct iff the selected set is exactly equal to `correctOptionIds` (all correct ids selected, no incorrect ids selected). No partial credit.
- Both question types require pressing a **"Kiểm tra"** button to grade (disabled until at least one option is selected) — there is no instant-grade-on-select for either type, for consistency between the two.

## Components

```
src/components/quiz/
├── QuizSection.tsx    — orchestrator: picks questions, tracks current index + score, renders idle/in-progress/result states
└── QuizQuestion.tsx   — renders one question: option list, Kiểm tra button, post-check feedback + explanation

src/hooks/
└── use-quiz-progress.ts — reads/writes localStorage key `pro192-quiz-<slug>` = { score, total, completedAt }
```

`QuizSection` is mounted from `src/pages/DocsPage.tsx`, after the `MarkdownContent` block, passing the current chapter's `slug` and `status`.

**Rendering gate:** `QuizSection` returns `null` immediately if `getQuizPool(slug)` is empty. `DocsPage` doesn't need its own conditional beyond always rendering `<QuizSection slug={chapter.slug} />` — the "nothing to show" case is handled inside the component, keeping `DocsPage` simple.

## UI/UX flow

Reuses existing Docs semantic tokens throughout (`bg-canvas`, `bg-panel`, `text-ink` / `text-ink-body` / `text-ink-muted` / `text-ink-faint`, `border-hairline` / `border-hairline-strong`, `bg-accent` / `hover:bg-accent-emphasis`, `bg-well`) — no Landing-style tokens, no new fonts, no shadows/gradients, staying inside the `minimalist-ui` skill's existing constraints for the Docs area. Matches the visual weight of the surrounding chapter content instead of looking like an injected widget.

1. **Section header** — same H2 treatment `MarkdownContent` already uses for in-body headings (`text-ink text-2xl font-semibold tracking-tight`), titled "Kiểm tra kiến thức", separated from the chapter body by a `border-hairline border-t` divider with generous top padding.

2. **Idle state** (before starting) — bordered panel (`border-hairline rounded-lg bg-panel p-6`, same shape as the existing "content coming soon" placeholder in `DocsPage.tsx`):
   - Short description line (`text-ink-muted text-sm`): "5 câu hỏi được chọn ngẫu nhiên từ kho câu hỏi của chương này."
   - If `use-quiz-progress` has a stored last score for this slug: a small pill above the button, styled like the existing "Sắp ra mắt" badge (`bg-well text-ink-faint rounded-full px-2.5 py-1 text-xs`), reading "Lần trước: {score}/{total}".
   - "Bắt đầu làm quiz" button — same primary CTA style used elsewhere (`bg-accent text-white rounded-md px-6 py-3 text-sm font-medium hover:bg-accent-emphasis active:scale-[0.98]`).

3. **In-progress question** —
   - Top row: `font-mono text-ink-faint text-sm` "Câu {n}/5" + a thin progress bar (`h-1 rounded-full bg-well`, filled portion `bg-accent`).
   - Question text: `text-ink text-[17px] font-medium leading-relaxed`.
   - Options: each a clickable row (`border-hairline rounded-lg px-4 py-3`, hover `border-hairline-strong bg-panel`); selected-but-not-checked-yet state uses `border-accent bg-accent/5` (same tint the Sidebar uses for the active nav item, `bg-accent/10`). Radio/checkbox indicators are hand-built (a bordered circle or square, filled with `bg-accent` when selected) rather than native `<input type="radio">`/`<input type="checkbox">`, matching how `ThemeToggle`/`DocsNavDropdown` build their own controls instead of using native form widgets. Each option row carries `role="radio"`/`role="checkbox"` + `aria-checked` (matching the question's mode) and the option list carries `role="radiogroup"`/`role="group"`, so keyboard/screen-reader use isn't lost by skipping native inputs.
   - "Kiểm tra" button: disabled/dimmed (`opacity-40`, not clickable) until ≥1 option is selected.

4. **After "Kiểm tra"** — the only new semantic colors added to the site, though not a new CSS token: Tailwind's built-in `green`/`red` palettes are already used once in this codebase (`MarkdownContent`'s amber notice blockquote), so no `@theme` changes are needed, just the utility classes:
   - Correct option(s): pale green — `border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-950/30`.
   - Incorrectly-selected option(s): pale red — `border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-950/30`.
   - Explanation appears below as a callout, same shape as `MarkdownContent`'s existing blockquote treatment (`border-l-4 rounded-r-md px-4 py-3 text-sm`), neutral-toned (`bg-panel border-hairline-strong text-ink-body`) regardless of right/wrong — the colored options already carry the right/wrong signal, the explanation box doesn't need to repeat it.
   - Button changes to "Câu tiếp theo →" (or "Xem kết quả" on question 5).

5. **Result screen** — score (`text-ink text-3xl font-semibold`, same scale as the chapter H1), one short remark line, "Làm lại" button using the site's existing secondary-button style (`border border-hairline text-ink-secondary hover:border-hairline-strong hover:bg-panel rounded-md px-6 py-3 text-sm font-medium`). Clicking it re-rolls 5 new questions immediately (no page reload) and overwrites the stored last score.

## Progress persistence (`use-quiz-progress`)

- Key: `pro192-quiz-<slug>` in `localStorage`.
- Value: `{ score: number, total: number, completedAt: string }` (ISO timestamp, unused for now beyond potential future display, stored for forward-compatibility at negligible cost).
- Written once, when the result screen is reached (not per-question).
- Read once on `QuizSection` mount to populate the idle-state "last score" pill.
- No expiry, no size concerns (11 chapters × ~80 bytes each, trivial).

## Draft chapters

No special-case code needed beyond the rendering gate already described: a chapter with `status: 'draft'` has no body and, in practice, will have no quiz file authored either, so `getQuizPool` returns `[]` and `QuizSection` renders nothing. If a draft chapter somehow got a quiz file before its body was written, the quiz would still render — this is acceptable (not worth adding a redundant `status` check when the empty-pool check already covers the real-world case).

## Testing plan

- Unit-test the shuffle+pick function (`pickQuestions`) for: pool larger than 5 (always returns exactly 5, all distinct, all present in the original pool), pool smaller than or equal to 5 (returns the entire pool, shuffled), empty pool (returns `[]`).
- Unit-test scoring logic for single-choice and multi-choice, including the "selected superset of correct ids" and "selected subset missing an id" incorrect cases for multi-choice.
- Manual verification in dev server: full flow through one chapter's quiz (start → answer each question type → see feedback/explanation → reach result → "Làm lại" reshuffles → localStorage pill appears on next visit), in both `vi` and `en`, both light and dark.
- `npm run build`, `oxlint`, `tsc -b` must stay clean, matching the project's existing verification bar.

## Content authoring scope

This spec covers the **mechanism** only. Writing the actual question banks for all 11 chapters is a separate, large content task (recommend ≥15 questions per chapter) that happens after this mechanism ships — initial implementation should ship with a small placeholder set (a few questions) for 1–2 chapters to prove the UI end-to-end, not all 11 chapters fully populated.
