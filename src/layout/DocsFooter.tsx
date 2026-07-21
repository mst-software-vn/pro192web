import { Link } from 'react-router-dom'
import { firstChapterSlug } from '../content/chapters'
import { useLanguage } from '../hooks/use-language'

const DOCS_LINKS = [
  { labelVi: 'Chào mừng', labelEn: 'Welcome', to: '/docs/chao-mung' },
  { labelVi: 'Nền tảng', labelEn: 'Foundations', to: '/docs/nen-tang' },
  { labelVi: 'Đóng gói', labelEn: 'Encapsulation', to: '/docs/dong-goi' },
]

const COURSE_LINKS = [
  { labelVi: 'Trang chủ', labelEn: 'Home', to: '/' },
  { labelVi: 'Đề cương môn học', labelEn: 'Syllabus', to: '/syllabus-pro192-spring2021' },
]

export function DocsFooter() {
  const { language } = useLanguage()
  const isEn = language === 'en'

  return (
    <footer className="border-hairline border-t">
      <div className="mx-auto max-w-360 px-4 py-14 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr]">
          <div>
            <span className="text-ink text-[15px] font-semibold tracking-tight">PRO192 · Java Edition</span>
            <p className="text-ink-muted mt-3 max-w-xs text-sm leading-relaxed">
              {isEn
                ? 'Documentation for learning Object-Oriented Programming with Java, organized from the PRO192 curriculum — developed by MST Software.'
                : 'Tài liệu học Lập trình Hướng đối tượng với Java, hệ thống hoá từ giáo trình PRO192 — phát triển bởi MST Software.'}
            </p>
          </div>

          <div>
            <p className="text-ink-faint mb-3 text-xs font-semibold tracking-wider uppercase">
              {isEn ? 'Documentation' : 'Tài liệu'}
            </p>
            <ul className="space-y-2">
              {DOCS_LINKS.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-ink-muted hover:text-ink text-sm transition-colors">
                    {isEn ? link.labelEn : link.labelVi}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to={`/docs/${firstChapterSlug}`}
                  className="text-ink-muted hover:text-ink text-sm transition-colors"
                >
                  {isEn ? 'View all 11 chapters' : 'Xem tất cả 11 chương'}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-ink-faint mb-3 text-xs font-semibold tracking-wider uppercase">
              {isEn ? 'Course' : 'Khoá học'}
            </p>
            <ul className="space-y-2">
              {COURSE_LINKS.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-ink-muted hover:text-ink text-sm transition-colors">
                    {isEn ? link.labelEn : link.labelVi}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-hairline mt-12 flex flex-col gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-ink-faint text-xs">
            {isEn
              ? '© 2026 MST Software · Java OOP (PRO192) documentation'
              : '© 2026 MST Software · Tài liệu học Java OOP (PRO192)'}
          </p>
          <p className="text-ink-faint text-xs">
            {isEn
              ? 'Built for students learning Object-Oriented Programming'
              : 'Xây dựng cho sinh viên học Lập trình Hướng đối tượng'}
          </p>
        </div>
      </div>
    </footer>
  )
}
