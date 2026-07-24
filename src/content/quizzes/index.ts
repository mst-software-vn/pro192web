import type { QuizQuestion } from '../types'

// Nạp toàn bộ kho câu hỏi tại build-time, giống cách src/content/chapters/index.ts
// nạp markdown. Loại trừ chính file index.ts VÀ mọi file *.test.ts khỏi glob pattern —
// thiếu vế loại trừ *.test.ts sẽ khiến index.test.ts (import describe/it từ vitest) bị
// nạp eager vào thẳng bundle của app và crash ngay khi chạy trong trình duyệt thật.
const modules = import.meta.glob(['./*.ts', '!./index.ts', '!./*.test.ts'], { eager: true }) as Record<
  string,
  { questions: QuizQuestion[] }
>

export function getQuizPool(slug: string): QuizQuestion[] {
  return modules[`./${slug}.ts`]?.questions ?? []
}
