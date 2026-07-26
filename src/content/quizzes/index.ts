import type { QuizQuestion } from '../types'

const modules = import.meta.glob(['./*.ts', '!./index.ts', '!./*.test.ts'], { eager: true }) as Record<
  string,
  { questions: QuizQuestion[] }
>

export function getQuizPool(slug: string): QuizQuestion[] {
  return modules[`./${slug}.ts`]?.questions ?? []
}

export function getTotalQuizQuestionCount(): number {
  return Object.values(modules).reduce((sum, module) => sum + module.questions.length, 0)
}
