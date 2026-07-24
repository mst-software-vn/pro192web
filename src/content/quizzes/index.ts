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
