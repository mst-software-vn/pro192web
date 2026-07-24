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
