# Chapter Quiz Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an optional multiple-choice quiz at the end of each chapter's Docs page, drawing 5 random questions from a per-chapter hardcoded question bank, with instant-feedback grading and a "last score" pill persisted in localStorage.

**Architecture:** Pure-function core (`pickQuestions`, `isAnswerCorrect` in `src/lib/quiz.ts`) is unit-tested with Vitest. Per-chapter question banks live in `src/content/quizzes/<slug>.ts` (same convention as the existing `src/content/chapters/*.md` files) and are loaded at build time via `import.meta.glob`. Two React components (`QuizSection` orchestrator, `QuizQuestion` per-question UI) render the flow and are wired into the bottom of `src/pages/DocsPage.tsx`. A tiny `use-quiz-progress` hook wraps localStorage read/write, also unit-tested.

**Tech Stack:** React 19, TypeScript 6 (strict), Vitest (new devDependency — approved by user), Tailwind CSS v4 utility classes reusing existing Docs semantic tokens, no other new dependencies.

## Global Constraints

- No `any` anywhere; every new file fully typed (project-wide TypeScript strict rule).
- Tailwind v4 utility classes only; reuse existing semantic tokens (`bg-canvas`, `bg-panel`, `text-ink`/`text-ink-body`/`text-ink-muted`/`text-ink-faint`, `border-hairline`/`border-hairline-strong`, `bg-accent`/`hover:bg-accent-emphasis`, `bg-well`) — the only new colors are Tailwind's built-in `green`/`red` palettes for correct/incorrect state, already precedented by `MarkdownContent`'s amber notice.
- `oxlint` and `tsc -b --noEmit` must stay clean after every task.
- One commit per task, commit message lowercase, single line, `type: subject` format, no `Co-Authored-By` trailer (enforced by `.husky/commit-msg`).
- `vitest` is the one new npm dependency for this feature (user-approved) — do not add any other dependency (no jsdom, no @testing-library/react) without asking first.
- Quiz content language: Vietnamese fields (`question`, `text`, `explanation`) are required/primary; English fields (`questionEn`, `textEn`, `explanationEn`) are optional, falling back silently to the Vietnamese text when missing and viewing in English mode — reversed from `Chapter.body`/`bodyVi` because quiz content is authored fresh in Vietnamese, not translated from a legacy English source.
- Content scope for this plan: only the `dong-goi` (Encapsulation) chapter gets a real question bank (6 questions, proving both single- and multi-choice). Writing question banks for the other 10 chapters is explicitly out of scope — separate future work per the approved spec.

---

## File Structure

```
package.json                              — modify: add vitest devDependency + "test" script
vitest.config.ts                          — create: minimal standalone Vitest config

src/content/types.ts                      — modify: add QuizOption, QuizQuestion interfaces
src/lib/quiz.ts                           — create: pickQuestions, isAnswerCorrect (pure, unit-tested)
src/lib/quiz.test.ts                      — create

src/content/quizzes/dong-goi.ts           — create: 6-question bank for Encapsulation
src/content/quizzes/index.ts              — create: getQuizPool(slug) loader
src/content/quizzes/index.test.ts         — create

src/hooks/use-quiz-progress.ts            — create: readQuizProgress/writeQuizProgress + useQuizProgress hook
src/hooks/use-quiz-progress.test.ts       — create

src/components/quiz/QuizQuestion.tsx      — create: single-question UI (options, check, feedback, explanation)
src/components/quiz/QuizSection.tsx       — create: orchestrator (idle/active/result phases)

src/pages/DocsPage.tsx                    — modify: render <QuizSection slug={chapter.slug} /> after the chapter body
```

---

### Task 1: Add Vitest test runner

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`
- Create: `src/lib/smoke.test.ts` (temporary — deleted in this same task after confirming the runner works)

**Interfaces:**
- Produces: `npm run test` script that later tasks' test files rely on.

- [ ] **Step 1: Install Vitest**

Run: `npm install --save-dev vitest`

Expected: `package.json` gains a `vitest` entry under `devDependencies`; `package-lock.json` updates.

- [ ] **Step 2: Add the `test` script**

In `package.json`, add to `"scripts"` (alongside the existing `dev`/`build`/`lint`/`preview`/`prepare`):

```json
    "test": "vitest run",
```

- [ ] **Step 3: Create a standalone Vitest config**

Create `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
  },
})
```

This is deliberately separate from `vite.config.ts` (which loads `@cloudflare/vite-plugin`, irrelevant and potentially disruptive for a plain Node-environment unit test run).

- [ ] **Step 4: Write a smoke test to confirm the runner works**

Create `src/lib/smoke.test.ts`:

```ts
import { describe, expect, it } from 'vitest'

describe('vitest setup', () => {
  it('runs', () => {
    expect(1 + 1).toBe(2)
  })
})
```

- [ ] **Step 5: Run it**

Run: `npx vitest run`
Expected: `1 passed`, output shows `src/lib/smoke.test.ts`.

- [ ] **Step 6: Delete the smoke test**

Run: `rm src/lib/smoke.test.ts`

It served only to prove the runner works; real tests start in Task 2.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json vitest.config.ts
git commit -m "chore: add vitest test runner"
```

---

### Task 2: Quiz types + pure logic (`pickQuestions`, `isAnswerCorrect`)

**Files:**
- Modify: `src/content/types.ts`
- Create: `src/lib/quiz.ts`
- Test: `src/lib/quiz.test.ts`

**Interfaces:**
- Consumes: nothing new.
- Produces: `QuizOption`, `QuizQuestion` types (from `src/content/types.ts`); `pickQuestions(pool: QuizQuestion[], count?: number): QuizQuestion[]` and `isAnswerCorrect(question: QuizQuestion, selectedIds: string[]): boolean` (from `src/lib/quiz.ts`) — later tasks import both from these exact paths.

- [ ] **Step 1: Add quiz types**

In `src/content/types.ts`, append after the existing `ChapterGroup` interface:

```ts

export interface QuizOption {
  /** 'a' | 'b' | 'c' | 'd'... — stable id used for grading, independent of display order */
  id: string
  /** Tiếng Việt — bắt buộc */
  text: string
  /** Bản dịch tiếng Anh — tuỳ chọn, fallback về `text` khi thiếu */
  textEn?: string
}

export interface QuizQuestion {
  id: string
  /** Tiếng Việt — bắt buộc (ngược với Chapter.body: quiz được soạn mới bằng tiếng Việt) */
  question: string
  questionEn?: string
  options: QuizOption[]
  /** 1 phần tử = single-choice (radio), nhiều hơn 1 = multi-choice (checkbox) */
  correctOptionIds: string[]
  explanation: string
  explanationEn?: string
}
```

- [ ] **Step 2: Write the failing tests**

Create `src/lib/quiz.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import type { QuizQuestion } from '../content/types'
import { isAnswerCorrect, pickQuestions } from './quiz'

function makeQuestion(id: string, correctOptionIds: string[]): QuizQuestion {
  return {
    id,
    question: `Question ${id}`,
    options: [
      { id: 'a', text: 'A' },
      { id: 'b', text: 'B' },
      { id: 'c', text: 'C' },
      { id: 'd', text: 'D' },
    ],
    correctOptionIds,
    explanation: `Explanation ${id}`,
  }
}

describe('pickQuestions', () => {
  it('returns exactly `count` questions when the pool is larger', () => {
    const pool = Array.from({ length: 10 }, (_, i) => makeQuestion(String(i), ['a']))
    expect(pickQuestions(pool, 5)).toHaveLength(5)
  })

  it('only returns questions that exist in the original pool, with no duplicates', () => {
    const pool = Array.from({ length: 10 }, (_, i) => makeQuestion(String(i), ['a']))
    const result = pickQuestions(pool, 5)
    const ids = result.map((q) => q.id)
    expect(new Set(ids).size).toBe(5)
    for (const id of ids) {
      expect(pool.some((q) => q.id === id)).toBe(true)
    }
  })

  it('returns the entire pool (shuffled) when the pool has fewer than `count` questions', () => {
    const pool = [makeQuestion('1', ['a']), makeQuestion('2', ['a']), makeQuestion('3', ['a'])]
    const result = pickQuestions(pool, 5)
    expect(result).toHaveLength(3)
    expect(new Set(result.map((q) => q.id))).toEqual(new Set(['1', '2', '3']))
  })

  it('returns an empty array for an empty pool', () => {
    expect(pickQuestions([], 5)).toEqual([])
  })

  it('defaults `count` to 5', () => {
    const pool = Array.from({ length: 8 }, (_, i) => makeQuestion(String(i), ['a']))
    expect(pickQuestions(pool)).toHaveLength(5)
  })
})

describe('isAnswerCorrect', () => {
  it('is correct when the single selected option matches the single correct option', () => {
    expect(isAnswerCorrect(makeQuestion('q1', ['a']), ['a'])).toBe(true)
  })

  it('is incorrect when the selected option does not match', () => {
    expect(isAnswerCorrect(makeQuestion('q1', ['a']), ['b'])).toBe(false)
  })

  it('is correct for multi-choice when the selected set exactly matches the correct set, regardless of order', () => {
    const question = makeQuestion('q2', ['a', 'c'])
    expect(isAnswerCorrect(question, ['a', 'c'])).toBe(true)
    expect(isAnswerCorrect(question, ['c', 'a'])).toBe(true)
  })

  it('is incorrect for multi-choice when missing a correct option', () => {
    expect(isAnswerCorrect(makeQuestion('q2', ['a', 'c']), ['a'])).toBe(false)
  })

  it('is incorrect for multi-choice when an extra incorrect option is selected', () => {
    expect(isAnswerCorrect(makeQuestion('q2', ['a', 'c']), ['a', 'c', 'b'])).toBe(false)
  })

  it('is incorrect when no options are selected', () => {
    expect(isAnswerCorrect(makeQuestion('q1', ['a']), [])).toBe(false)
  })
})
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `npx vitest run src/lib/quiz.test.ts`
Expected: FAIL — `Cannot find module './quiz'` (file doesn't exist yet).

- [ ] **Step 4: Implement `src/lib/quiz.ts`**

```ts
import type { QuizQuestion } from '../content/types'

/** Fisher–Yates shuffle (unbiased), then take the first `count` — or the whole
 * pool, shuffled, if it has `count` or fewer questions. */
export function pickQuestions(pool: QuizQuestion[], count = 5): QuizQuestion[] {
  const shuffled = [...pool]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled.slice(0, Math.min(count, shuffled.length))
}

/** Correct iff the selected set is exactly equal to the question's correct set —
 * handles single-choice and multi-choice with the same rule (no partial credit). */
export function isAnswerCorrect(question: QuizQuestion, selectedIds: string[]): boolean {
  const correct = question.correctOptionIds
  if (selectedIds.length !== correct.length) return false
  const selectedSet = new Set(selectedIds)
  return correct.every((id) => selectedSet.has(id))
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run src/lib/quiz.test.ts`
Expected: `12 passed`.

- [ ] **Step 6: Typecheck and lint**

Run: `npx tsc -b --noEmit && npx oxlint src/content/types.ts src/lib/quiz.ts src/lib/quiz.test.ts`
Expected: no errors, no warnings.

- [ ] **Step 7: Commit**

```bash
git add src/content/types.ts src/lib/quiz.ts src/lib/quiz.test.ts
git commit -m "feat: add quiz question types and grading logic"
```

---

### Task 3: Quiz content loader + Encapsulation question bank

**Files:**
- Create: `src/content/quizzes/dong-goi.ts`
- Create: `src/content/quizzes/index.ts`
- Test: `src/content/quizzes/index.test.ts`

**Interfaces:**
- Consumes: `QuizQuestion` (from `src/content/types.ts`, Task 2).
- Produces: `getQuizPool(slug: string): QuizQuestion[]` (from `src/content/quizzes/index.ts`) — `QuizSection` (Task 6) calls this.

- [ ] **Step 1: Write the question bank**

Create `src/content/quizzes/dong-goi.ts`:

```ts
import type { QuizQuestion } from '../types'

export const questions: QuizQuestion[] = [
  {
    id: 'dong-goi-1',
    question: 'Đóng gói (encapsulation) trong Java chủ yếu nhằm mục đích gì?',
    questionEn: 'What is the primary purpose of encapsulation in Java?',
    options: [
      { id: 'a', text: 'Giấu dữ liệu và cách xử lý bên trong class, chỉ lộ ra giao diện cần thiết', textEn: 'Hide a class’s internal data and logic, exposing only the necessary interface' },
      { id: 'b', text: 'Cho phép 1 class kế thừa từ nhiều class khác', textEn: 'Allow a class to inherit from multiple other classes' },
      { id: 'c', text: 'Tăng tốc độ biên dịch chương trình', textEn: 'Speed up program compilation' },
      { id: 'd', text: 'Tự động sinh ra các phương thức getter/setter', textEn: 'Automatically generate getter/setter methods' },
    ],
    correctOptionIds: ['a'],
    explanation:
      'Đóng gói là giữ dữ liệu (field) và logic xử lý bên trong class ở mức private, chỉ cho phép truy cập qua các phương thức public — client không cần biết chi tiết triển khai bên trong.',
    explanationEn:
      'Encapsulation keeps a class’s fields and logic private, exposing access only through public methods — clients never need to know the internal implementation details.',
  },
  {
    id: 'dong-goi-2',
    question: 'Nếu một thuộc tính/phương thức không có access modifier nào (default), nó có thể được truy cập từ đâu?',
    questionEn: 'If a field or method has no access modifier (default/package-private), where can it be accessed from?',
    options: [
      { id: 'a', text: 'Chỉ trong chính class đó', textEn: 'Only within that class itself' },
      { id: 'b', text: 'Trong cùng package', textEn: 'From anywhere in the same package' },
      { id: 'c', text: 'Ở bất kỳ đâu trong chương trình', textEn: 'From anywhere in the program' },
      { id: 'd', text: 'Chỉ từ class con (subclass)', textEn: 'Only from a subclass' },
    ],
    correctOptionIds: ['b'],
    explanation:
      'default (không ghi modifier) nghĩa là truy cập được trong cùng package — rộng hơn private, nhưng hẹp hơn protected/public.',
    explanationEn:
      'Default (no modifier) access means visible anywhere in the same package — wider than private, narrower than protected/public.',
  },
  {
    id: 'dong-goi-3',
    question: 'Trình biên dịch Java tự động thêm constructor mặc định (không tham số) khi nào?',
    questionEn: 'When does the Java compiler automatically insert a no-argument default constructor?',
    options: [
      { id: 'a', text: 'Luôn luôn, bất kể class có khai báo constructor hay không' },
      { id: 'b', text: 'Chỉ khi class không khai báo BẤT KỲ constructor nào' },
      { id: 'c', text: 'Chỉ khi class có khai báo constructor có tham số' },
      { id: 'd', text: 'Không bao giờ, phải luôn tự viết' },
    ],
    correctOptionIds: ['b'],
    explanation:
      'Nếu class đã khai báo ít nhất 1 constructor (kể cả có tham số), trình biên dịch sẽ KHÔNG tự thêm constructor mặc định nữa.',
  },
  {
    id: 'dong-goi-4',
    question: 'Từ khoá `this` trong một phương thức thành viên dùng để làm gì?',
    questionEn: 'What does the `this` keyword refer to inside an instance method?',
    options: [
      { id: 'a', text: 'Tham chiếu tới class cha', textEn: 'A reference to the parent class' },
      { id: 'b', text: 'Tham chiếu tới đối tượng hiện tại đang gọi phương thức', textEn: 'A reference to the current object invoking the method' },
      { id: 'c', text: 'Khai báo một biến tĩnh', textEn: 'Declares a static variable' },
      { id: 'd', text: 'Gọi phương thức main', textEn: 'Calls the main method' },
    ],
    correctOptionIds: ['b'],
    explanation:
      '`this` trỏ tới địa chỉ của đối tượng hiện tại — thường dùng để phân biệt tham số/biến cục bộ với field cùng tên.',
    explanationEn:
      '`this` holds the address of the current object — commonly used to disambiguate a parameter/local variable from a field of the same name.',
  },
  {
    id: 'dong-goi-5',
    question: 'Chọn TẤT CẢ phát biểu đúng về access modifier trong Java (câu này có thể có nhiều đáp án đúng):',
    questionEn: 'Select ALL correct statements about Java access modifiers (this question may have more than one correct answer):',
    options: [
      { id: 'a', text: 'private chỉ truy cập được trong chính class đó', textEn: 'private is only accessible within that class itself' },
      { id: 'b', text: 'public truy cập được ở bất kỳ đâu', textEn: 'public is accessible from anywhere' },
      { id: 'c', text: 'protected chỉ truy cập được trong cùng file', textEn: 'protected is only accessible within the same file' },
      { id: 'd', text: 'default truy cập được từ mọi package', textEn: 'default is accessible from every package' },
    ],
    correctOptionIds: ['a', 'b'],
    explanation:
      'private giới hạn trong class, public không giới hạn — hai phát biểu này đúng. protected thực ra truy cập được trong cùng package cộng với từ subclass ở package khác (không phải "chỉ cùng file"), và default chỉ truy cập được trong CÙNG package (không phải "mọi package") — nên (c) và (d) sai.',
    explanationEn:
      'private is limited to the class, public has no limit — both true. protected is actually accessible within the same package plus from subclasses in other packages (not "only the same file"), and default is only accessible within the SAME package (not "every package") — so (c) and (d) are false.',
  },
  {
    id: 'dong-goi-6',
    question: 'Package trong Java dùng để làm gì?',
    options: [
      { id: 'a', text: 'Tăng tốc độ chạy chương trình' },
      { id: 'b', text: 'Gom nhóm các class/interface liên quan lại với nhau theo namespace' },
      { id: 'c', text: 'Bắt buộc phải có ít nhất 1 constructor' },
      { id: 'd', text: 'Thay thế hoàn toàn cho access modifier' },
    ],
    correctOptionIds: ['b'],
    explanation:
      'Package là một namespace tổ chức các class/interface liên quan, giúp quản lý mã nguồn lớn dễ dàng hơn — tương tự khái niệm thư mục trên máy tính.',
  },
]
```

(Question 3 has no `questionEn`/option `textEn` and question 6 has no `questionEn`/`explanationEn` at all — deliberate, so manual testing in Task 6 can exercise the Vietnamese fallback path.)

- [ ] **Step 2: Write the failing test for the loader**

Create `src/content/quizzes/index.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { getQuizPool } from './index'

describe('getQuizPool', () => {
  it('returns the question bank for a chapter that has one', () => {
    const pool = getQuizPool('dong-goi')
    expect(pool.length).toBeGreaterThan(0)
    expect(pool[0].id).toContain('dong-goi')
  })

  it('returns an empty array for a chapter with no quiz file', () => {
    expect(getQuizPool('does-not-exist')).toEqual([])
  })
})
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npx vitest run src/content/quizzes/index.test.ts`
Expected: FAIL — `Cannot find module './index'`.

- [ ] **Step 4: Implement the loader**

Create `src/content/quizzes/index.ts`:

```ts
import type { QuizQuestion } from '../types'

// Nạp toàn bộ kho câu hỏi tại build-time, giống cách src/content/chapters/index.ts
// nạp markdown. Loại trừ chính file index.ts khỏi glob pattern.
const modules = import.meta.glob(['./*.ts', '!./index.ts'], { eager: true }) as Record<
  string,
  { questions: QuizQuestion[] }
>

export function getQuizPool(slug: string): QuizQuestion[] {
  return modules[`./${slug}.ts`]?.questions ?? []
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/content/quizzes/index.test.ts`
Expected: `2 passed`.

- [ ] **Step 6: Typecheck and lint**

Run: `npx tsc -b --noEmit && npx oxlint src/content/quizzes`
Expected: no errors, no warnings.

- [ ] **Step 7: Commit**

```bash
git add src/content/quizzes
git commit -m "feat: add quiz content loader and encapsulation question bank"
```

---

### Task 4: Quiz progress persistence (localStorage)

**Files:**
- Create: `src/hooks/use-quiz-progress.ts`
- Test: `src/hooks/use-quiz-progress.test.ts`

**Interfaces:**
- Consumes: nothing new.
- Produces: `QuizProgress` type, `readQuizProgress(slug: string): QuizProgress | null`, `writeQuizProgress(slug: string, progress: QuizProgress): void`, and the `useQuizProgress(slug: string)` hook returning `{ progress: QuizProgress | null, recordProgress: (score: number, total: number) => void }` — `QuizSection` (Task 6) uses the hook.

- [ ] **Step 1: Write the failing tests**

Create `src/hooks/use-quiz-progress.test.ts`:

```ts
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
    expect(readQuizProgress('dong-goi')).toBeNull()
  })

  it('round-trips a written progress record', () => {
    writeQuizProgress('dong-goi', { score: 4, total: 5, completedAt: '2026-07-24T00:00:00.000Z' })
    expect(readQuizProgress('dong-goi')).toEqual({ score: 4, total: 5, completedAt: '2026-07-24T00:00:00.000Z' })
  })

  it('keeps progress separate per chapter slug', () => {
    writeQuizProgress('dong-goi', { score: 4, total: 5, completedAt: '2026-07-24T00:00:00.000Z' })
    writeQuizProgress('ke-thua', { score: 2, total: 5, completedAt: '2026-07-24T00:00:00.000Z' })
    expect(readQuizProgress('dong-goi')?.score).toBe(4)
    expect(readQuizProgress('ke-thua')?.score).toBe(2)
  })

  it('returns null when the stored value is corrupted JSON', () => {
    localStorage.setItem('pro192-quiz-broken', '{not valid json')
    expect(readQuizProgress('broken')).toBeNull()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/hooks/use-quiz-progress.test.ts`
Expected: FAIL — `Cannot find module './use-quiz-progress'`.

- [ ] **Step 3: Implement the hook**

Create `src/hooks/use-quiz-progress.ts`:

```ts
import { useState } from 'react'

export interface QuizProgress {
  score: number
  total: number
  completedAt: string
}

const STORAGE_PREFIX = 'pro192-quiz-'

export function readQuizProgress(slug: string): QuizProgress | null {
  const raw = localStorage.getItem(STORAGE_PREFIX + slug)
  if (!raw) return null
  try {
    return JSON.parse(raw) as QuizProgress
  } catch {
    return null
  }
}

export function writeQuizProgress(slug: string, progress: QuizProgress): void {
  localStorage.setItem(STORAGE_PREFIX + slug, JSON.stringify(progress))
}

// Lưu điểm lần làm quiz gần nhất theo từng chương — không có hạn dùng, không giới hạn
// dung lượng đáng kể (11 chương x ~80 byte), tương tự cách site lưu theme/ngôn ngữ.
export function useQuizProgress(slug: string) {
  const [progress, setProgress] = useState<QuizProgress | null>(() => readQuizProgress(slug))

  function recordProgress(score: number, total: number) {
    const next: QuizProgress = { score, total, completedAt: new Date().toISOString() }
    writeQuizProgress(slug, next)
    setProgress(next)
  }

  return { progress, recordProgress }
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/hooks/use-quiz-progress.test.ts`
Expected: `4 passed`.

- [ ] **Step 5: Typecheck and lint**

Run: `npx tsc -b --noEmit && npx oxlint src/hooks/use-quiz-progress.ts src/hooks/use-quiz-progress.test.ts`
Expected: no errors, no warnings.

- [ ] **Step 6: Commit**

```bash
git add src/hooks/use-quiz-progress.ts src/hooks/use-quiz-progress.test.ts
git commit -m "feat: add quiz progress persistence hook"
```

---

### Task 5: `QuizQuestion` component

**Files:**
- Create: `src/components/quiz/QuizQuestion.tsx`

**Interfaces:**
- Consumes: `QuizQuestion` type (`src/content/types.ts`), `isAnswerCorrect` (`src/lib/quiz.ts`).
- Produces: `QuizQuestion` component with props `{ question: QuizQuestionData; index: number; total: number; isEn: boolean; isLast: boolean; onAnswered: (record: { selectedIds: string[]; correct: boolean }) => void; onNext: () => void }` — `QuizSection` (Task 6) renders this with `key={question.id}` so each question gets fresh internal state on advance.

No automated test for this task — it is a rendering/interaction component with no existing React Testing Library setup in this project (adding one is out of scope per the Global Constraints). Verified manually in Task 6, once wired into a real page.

- [ ] **Step 1: Implement the component**

Create `src/components/quiz/QuizQuestion.tsx`:

```tsx
import { useState } from 'react'
import type { QuizQuestion as QuizQuestionData } from '../../content/types'
import { isAnswerCorrect } from '../../lib/quiz'

interface QuizQuestionProps {
  question: QuizQuestionData
  index: number
  total: number
  isEn: boolean
  isLast: boolean
  onAnswered: (record: { selectedIds: string[]; correct: boolean }) => void
  onNext: () => void
}

export function QuizQuestion({ question, index, total, isEn, isLast, onAnswered, onNext }: QuizQuestionProps) {
  const [selected, setSelected] = useState<string[]>([])
  const [checked, setChecked] = useState(false)
  const isMulti = question.correctOptionIds.length > 1

  function toggleOption(optionId: string) {
    if (checked) return
    if (isMulti) {
      setSelected((prev) => (prev.includes(optionId) ? prev.filter((id) => id !== optionId) : [...prev, optionId]))
    } else {
      setSelected([optionId])
    }
  }

  function handleCheck() {
    const correct = isAnswerCorrect(question, selected)
    setChecked(true)
    onAnswered({ selectedIds: selected, correct })
  }

  const questionText = isEn ? (question.questionEn ?? question.question) : question.question
  const explanationText = isEn ? (question.explanationEn ?? question.explanation) : question.explanation
  const progressPercent = ((index + (checked ? 1 : 0)) / total) * 100

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <span className="text-ink-faint font-mono text-sm whitespace-nowrap">
          {isEn ? `Question ${index + 1}/${total}` : `Câu ${index + 1}/${total}`}
        </span>
        <div className="bg-well h-1 flex-1 rounded-full">
          <div className="bg-accent h-1 rounded-full transition-all" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      <p className="text-ink mb-5 text-[17px] leading-relaxed font-medium">{questionText}</p>

      <div role={isMulti ? 'group' : 'radiogroup'} className="space-y-2">
        {question.options.map((option) => {
          const optionText = isEn ? (option.textEn ?? option.text) : option.text
          const isSelected = selected.includes(option.id)
          const isCorrectOption = question.correctOptionIds.includes(option.id)

          let stateClassName = 'border-hairline hover:border-hairline-strong hover:bg-panel'
          if (checked) {
            if (isCorrectOption) {
              stateClassName = 'border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-950/30'
            } else if (isSelected) {
              stateClassName = 'border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-950/30'
            } else {
              stateClassName = 'border-hairline opacity-60'
            }
          } else if (isSelected) {
            stateClassName = 'border-accent bg-accent/5'
          }

          return (
            <button
              key={option.id}
              type="button"
              role={isMulti ? 'checkbox' : 'radio'}
              aria-checked={isSelected}
              disabled={checked}
              onClick={() => toggleOption(option.id)}
              className={`text-ink-body flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-colors ${stateClassName}`}
            >
              <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center border ${
                  isMulti ? 'rounded-sm' : 'rounded-full'
                } ${isSelected ? 'border-accent bg-accent' : 'border-hairline-strong'}`}
              />
              {optionText}
            </button>
          )
        })}
      </div>

      {checked ? (
        <div className="border-hairline-strong bg-panel text-ink-body mt-4 rounded-r-md border-l-4 px-4 py-3 text-sm">
          {explanationText}
        </div>
      ) : null}

      <div className="mt-5">
        {checked ? (
          <button
            type="button"
            onClick={onNext}
            className="bg-accent hover:bg-accent-emphasis rounded-md px-6 py-3 text-sm font-medium text-white transition-colors active:scale-[0.98]"
          >
            {isLast ? (isEn ? 'See results' : 'Xem kết quả') : isEn ? 'Next question →' : 'Câu tiếp theo →'}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleCheck}
            disabled={selected.length === 0}
            className="bg-accent hover:bg-accent-emphasis rounded-md px-6 py-3 text-sm font-medium text-white transition-colors active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isEn ? 'Check' : 'Kiểm tra'}
          </button>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Typecheck and lint**

Run: `npx tsc -b --noEmit && npx oxlint src/components/quiz/QuizQuestion.tsx`
Expected: no errors, no warnings.

- [ ] **Step 3: Commit**

```bash
git add src/components/quiz/QuizQuestion.tsx
git commit -m "feat: add quiz question component"
```

---

### Task 6: `QuizSection` orchestrator + wire into `DocsPage`

**Files:**
- Create: `src/components/quiz/QuizSection.tsx`
- Modify: `src/pages/DocsPage.tsx`

**Interfaces:**
- Consumes: `getQuizPool` (`src/content/quizzes/index.ts`), `pickQuestions` (`src/lib/quiz.ts`), `useQuizProgress` (`src/hooks/use-quiz-progress.ts`), `useLanguage` (`src/hooks/use-language.tsx`), `QuizQuestion` component (`src/components/quiz/QuizQuestion.tsx`).
- Produces: `QuizSection` component with props `{ slug: string }`, rendered by `DocsPage`.

- [ ] **Step 1: Implement `QuizSection`**

Create `src/components/quiz/QuizSection.tsx`:

```tsx
import { useMemo, useState } from 'react'
import { getQuizPool } from '../../content/quizzes'
import { useLanguage } from '../../hooks/use-language'
import { useQuizProgress } from '../../hooks/use-quiz-progress'
import { pickQuestions } from '../../lib/quiz'
import { QuizQuestion } from './QuizQuestion'

type Phase = 'idle' | 'active' | 'result'

interface AnswerRecord {
  selectedIds: string[]
  correct: boolean
}

interface QuizSectionProps {
  slug: string
}

export function QuizSection({ slug }: QuizSectionProps) {
  const { language } = useLanguage()
  const isEn = language === 'en'
  const pool = useMemo(() => getQuizPool(slug), [slug])
  const { progress, recordProgress } = useQuizProgress(slug)

  const [round, setRound] = useState(0)
  const questions = useMemo(() => pickQuestions(pool), [pool, round])
  const [phase, setPhase] = useState<Phase>('idle')
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<AnswerRecord[]>([])

  if (pool.length === 0) return null

  function handleStart() {
    setPhase('active')
    setIndex(0)
    setAnswers([])
  }

  function handleAnswered(record: AnswerRecord) {
    setAnswers((prev) => [...prev, record])
  }

  function handleNext() {
    if (index + 1 < questions.length) {
      setIndex((value) => value + 1)
      return
    }
    const finalAnswers = [...answers]
    const score = finalAnswers.filter((a) => a.correct).length
    recordProgress(score, questions.length)
    setPhase('result')
  }

  function handleRetry() {
    setRound((value) => value + 1)
    setPhase('idle')
  }

  const score = answers.filter((a) => a.correct).length

  return (
    <section className="border-hairline mt-16 border-t pt-12">
      <h2 className="text-ink mb-4 text-2xl font-semibold tracking-tight">
        {isEn ? 'Test your understanding' : 'Kiểm tra kiến thức'}
      </h2>

      {phase === 'idle' ? (
        <div className="border-hairline bg-panel rounded-lg border p-6">
          <p className="text-ink-muted mb-4 text-sm">
            {isEn
              ? "5 questions picked at random from this chapter's question bank."
              : '5 câu hỏi được chọn ngẫu nhiên từ kho câu hỏi của chương này.'}
          </p>
          {progress ? (
            <span className="bg-well text-ink-faint mb-4 inline-block rounded-full px-2.5 py-1 text-xs">
              {isEn ? `Last time: ${progress.score}/${progress.total}` : `Lần trước: ${progress.score}/${progress.total}`}
            </span>
          ) : null}
          <div>
            <button
              type="button"
              onClick={handleStart}
              className="bg-accent hover:bg-accent-emphasis rounded-md px-6 py-3 text-sm font-medium text-white transition-colors active:scale-[0.98]"
            >
              {isEn ? 'Start quiz' : 'Bắt đầu làm quiz'}
            </button>
          </div>
        </div>
      ) : null}

      {phase === 'active' ? (
        <QuizQuestion
          key={questions[index].id}
          question={questions[index]}
          index={index}
          total={questions.length}
          isEn={isEn}
          isLast={index === questions.length - 1}
          onAnswered={handleAnswered}
          onNext={handleNext}
        />
      ) : null}

      {phase === 'result' ? (
        <div className="border-hairline bg-panel rounded-lg border p-6 text-center">
          <p className="text-ink mb-2 text-3xl font-semibold">
            {score}/{questions.length}
          </p>
          <p className="text-ink-muted mb-5 text-sm">
            {isEn
              ? 'Nice work — you can retry with a new random set anytime.'
              : 'Bạn có thể làm lại với bộ câu hỏi mới bất cứ lúc nào.'}
          </p>
          <button
            type="button"
            onClick={handleRetry}
            className="border-hairline text-ink-secondary hover:border-hairline-strong hover:bg-panel rounded-md border px-6 py-3 text-sm font-medium transition-colors"
          >
            {isEn ? 'Try again' : 'Làm lại'}
          </button>
        </div>
      ) : null}
    </section>
  )
}
```

- [ ] **Step 2: Wire into `DocsPage`**

In `src/pages/DocsPage.tsx`, add the import:

```ts
import { QuizSection } from '../components/quiz/QuizSection'
```

Then change the closing of the `<article>` so `QuizSection` renders after the body/placeholder block. The current end of the file reads:

```tsx
      {body ? (
        <MarkdownContent markdown={body} />
      ) : (
        <div className="border-hairline-strong bg-panel rounded-lg border border-dashed px-6 py-12 text-center">
          <p className="text-ink-muted text-sm">
            {isEn
              ? "This chapter's content is being prepared and will be updated soon."
              : 'Nội dung chương này đang được biên soạn và sẽ sớm được cập nhật.'}
          </p>
        </div>
      )}
    </article>
  )
}
```

Change it to:

```tsx
      {body ? (
        <MarkdownContent markdown={body} />
      ) : (
        <div className="border-hairline-strong bg-panel rounded-lg border border-dashed px-6 py-12 text-center">
          <p className="text-ink-muted text-sm">
            {isEn
              ? "This chapter's content is being prepared and will be updated soon."
              : 'Nội dung chương này đang được biên soạn và sẽ sớm được cập nhật.'}
          </p>
        </div>
      )}

      <QuizSection slug={chapter.slug} />
    </article>
  )
}
```

- [ ] **Step 3: Typecheck and lint**

Run: `npx tsc -b --noEmit && npx oxlint src/components/quiz src/pages/DocsPage.tsx`
Expected: no errors, no warnings.

- [ ] **Step 4: Run the full test suite**

Run: `npx vitest run`
Expected: all tests from Tasks 2–4 still pass (component/page changes in this task don't touch tested logic).

- [ ] **Step 5: Manual verification in the dev server**

Run: `npm run dev`, open `/docs/dong-goi` in a browser.

Check, in both light and dark mode, and both `vi` and `en` (language selector in the header):
- Quiz section appears below the chapter content, titled "Kiểm tra kiến thức" / "Test your understanding".
- "Bắt đầu làm quiz" starts the flow at "Câu 1/5".
- Selecting an option highlights it (pale accent tint); "Kiểm tra" is disabled until something is selected.
- After "Kiểm tra": correct option(s) turn pale green, any wrong selected option turns pale red, explanation box appears below.
- Question 5 (the multi-choice one, `dong-goi-5`) allows selecting more than one option before checking.
- Question 3 and question 6 show the Vietnamese text as a fallback when language is switched to English (no English text was authored for them).
- Reaching the last question shows "Xem kết quả" instead of "Câu tiếp theo →"; clicking it shows the score screen.
- "Làm lại" immediately reshuffles and restarts at "Câu 1/5" without a page reload.
- Reloading the page after finishing once shows the "Lần trước: n/5" pill on the idle screen.
- Visit `/docs/chao-mung` (a chapter with no quiz file yet) and confirm no quiz section renders at all, no console errors.

- [ ] **Step 6: Production build check**

Run: `npm run build`
Expected: builds cleanly, no TypeScript errors.

- [ ] **Step 7: Commit**

```bash
git add src/components/quiz/QuizSection.tsx src/pages/DocsPage.tsx
git commit -m "feat: add quiz section to chapter pages"
```

---

### Task 7: Update `.claude/CLAUDE.md`

**Files:**
- Modify: `.claude/CLAUDE.md`

Per this project's standing rule (confirm before changes drift the documented project overview, then update the doc to match), add a short note about the new quiz feature and the new Vitest test runner to the "Kiến trúc" and "Tech stack" sections.

- [ ] **Step 1: Update the tech stack line**

In `.claude/CLAUDE.md`, find the "Tech stack (đã khoá...)" line and append `· Vitest (unit test cho logic thuần, không test component)` to the end of it.

- [ ] **Step 2: Add an architecture bullet**

In the "Kiến trúc" section, add a new bullet after the existing `**Ngôn ngữ**` bullet:

```markdown
- **Quiz cuối chương**: `QuizSection`/`QuizQuestion` (`src/components/quiz/`) render ở cuối `DocsPage.tsx`. Kho câu hỏi mỗi chương là 1 file `src/content/quizzes/<slug>.ts` (giống quy ước `.md` của `src/content/chapters`), nạp qua `getQuizPool()`. Mỗi lần vào trang bốc ngẫu nhiên cố định 5 câu (`pickQuestions` trong `src/lib/quiz.ts`, có unit test). Điểm lần gần nhất lưu localStorage (`pro192-quiz-<slug>`). Hiện mới chỉ có kho câu hỏi thật cho chương `dong-goi` — 10 chương còn lại chưa có, `QuizSection` tự ẩn khi kho rỗng.
```

- [ ] **Step 3: Commit**

```bash
git add .claude/CLAUDE.md
git commit -m "docs: document quiz feature in claude instructions"
```

---

## Self-Review Notes

- **Spec coverage:** data model ✓ (Task 2), file organization ✓ (Task 3), selection algorithm ✓ (Task 2, tested), scoring ✓ (Task 2, tested), components ✓ (Tasks 5–6), UI/UX flow states (idle/active/result, feedback colors, explanation, retry) ✓ (Tasks 5–6), progress persistence ✓ (Task 4, tested), draft-chapter/no-quiz-file gate ✓ (Task 6, `pool.length === 0` early return), content authoring scope (1 chapter only) ✓ (Task 3).
- **Type consistency checked:** `QuizQuestion`/`QuizOption` (Task 2) used identically in `src/lib/quiz.ts` (Task 2), `src/content/quizzes/*.ts` (Task 3), `QuizQuestion.tsx` props (Task 5), and `QuizSection.tsx` (Task 6) — same import path `../../content/types` (or `../content/types` from `src/lib`) throughout. `pickQuestions`/`isAnswerCorrect` signatures from Task 2 match their call sites in Task 6/Task 5 exactly.
- **No placeholders:** every step above has complete, runnable code — no TBD/TODO.
