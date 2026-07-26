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

export function useQuizProgress(slug: string) {
  const [progress, setProgress] = useState<QuizProgress | null>(() => readQuizProgress(slug))

  function recordProgress(score: number, total: number) {
    const next: QuizProgress = { score, total, completedAt: new Date().toISOString() }
    writeQuizProgress(slug, next)
    setProgress(next)
  }

  return { progress, recordProgress }
}
