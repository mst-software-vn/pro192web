import { useMemo, useState } from 'react'
import { getQuizPool } from '../../content/quizzes'
import { useLanguage } from '../../hooks/use-language'
import { useQuizProgress } from '../../hooks/use-quiz-progress'
import { pickQuestions } from '../../lib/quiz'
import { QuizQuestion } from './QuizQuestion'

type Phase = 'active' | 'result'

interface AnswerRecord {
  selectedIds: string[]
  correct: boolean
}

interface QuizSectionProps {
  slug: string
}

// Không còn màn "idle" chờ bấm Start — quiz hiển thị câu hỏi đầu tiên ngay khi vào trang
// (2026-07-25, theo yêu cầu). "Làm lại" cũng quay thẳng về active, không qua idle nữa.
export function QuizSection({ slug }: QuizSectionProps) {
  const { language } = useLanguage()
  const isEn = language === 'en'
  const pool = useMemo(() => getQuizPool(slug), [slug])
  const { recordProgress } = useQuizProgress(slug)

  const [round, setRound] = useState(0)
  const questions = useMemo(() => {
    // round chỉ dùng để ép useMemo tính lại khi bấm "Làm lại", giá trị không cần đọc
    void round
    return pickQuestions(pool)
  }, [pool, round])
  const [phase, setPhase] = useState<Phase>('active')
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<AnswerRecord[]>([])

  if (pool.length === 0) return null

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
    setPhase('active')
    setIndex(0)
    setAnswers([])
  }

  const score = answers.filter((a) => a.correct).length

  return (
    <section className="border-hairline mt-16 border-t pt-12">
      <h2 className="text-ink mb-4 text-2xl font-semibold tracking-tight">
        {isEn ? 'Test your understanding' : 'Kiểm tra kiến thức'}
      </h2>

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
