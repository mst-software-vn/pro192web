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
