import { chapters } from '../../content/chapters'
import { getTotalQuizQuestionCount } from '../../content/quizzes'
import { countCodeBlocks, countImages } from '../../lib/markdown'

interface Stat {
  value: string
  label: string
}

// Số liệu tính động từ dữ liệu thật (chapters/quiz/markdown) thay vì hardcode — tránh
// lặp lại lỗi số liệu bị lệch sau khi thêm chương/nội dung mới đã gặp trước đó ở footer.
function buildStats(): Stat[] {
  const totalCodeBlocks = chapters.reduce((sum, chapter) => sum + countCodeBlocks(chapter.body ?? ''), 0)
  const totalImages = chapters.reduce((sum, chapter) => sum + countImages(chapter.body ?? ''), 0)

  return [
    { value: String(chapters.length), label: 'Chương học' },
    { value: String(getTotalQuizQuestionCount()), label: 'Câu hỏi quiz' },
    { value: String(totalCodeBlocks), label: 'Đoạn code mẫu' },
    { value: String(totalImages), label: 'Hình minh hoạ' },
    { value: '2', label: 'Ngôn ngữ (Việt/Anh)' },
  ]
}

export function StatsSection() {
  const stats = buildStats()

  return (
    <section className="mx-auto max-w-310 px-6 py-14 sm:px-10 sm:py-20">
      <p className="mb-8 text-center text-[11px] font-bold tracking-[0.12em] text-accent-dark uppercase">
        Trusted by students learning Java OOP
      </p>
      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-8">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className={`min-w-27.5 flex-1 text-center ${
              index < stats.length - 1 ? 'border-r border-hairline-strong last:border-r-0' : ''
            }`}
          >
            <div className="text-ink text-[44px] leading-none font-extrabold tracking-tight tabular-nums">
              {stat.value}
            </div>
            <div className="text-ink-muted mt-2 text-[12.5px]">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
