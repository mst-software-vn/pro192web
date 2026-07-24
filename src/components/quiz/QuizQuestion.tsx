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
