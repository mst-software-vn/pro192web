import { Link } from 'react-router-dom'
import { chapters, firstChapterSlug } from '../content/chapters'
import { useLanguage } from '../hooks/use-language'
import { useSimulatedVisitorCount } from '../hooks/use-simulated-visitor-count'

function UsersIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5 shrink-0 text-green-500"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

const DOCS_LINKS = [
  { labelVi: 'Chào mừng', labelEn: 'Welcome', to: '/docs/welcome' },
  { labelVi: 'Nền tảng', labelEn: 'Foundations', to: '/docs/foundations' },
  { labelVi: 'Đóng gói', labelEn: 'Encapsulation', to: '/docs/encapsulation' },
]

const COURSE_LINKS = [{ labelVi: 'Trang chủ', labelEn: 'Home', to: '/' }]

const FPT_SYLLABUS_URL = 'https://flm.fpt.edu.vn/gui/tool/AllPrequisiteSubject?educationLevel=fptu'

export function DocsFooter() {
  const { language } = useLanguage()
  const isEn = language === 'en'
  const visitorCount = useSimulatedVisitorCount()

  return (
    <footer className="border-hairline border-t">
      <div className="mx-auto max-w-360 px-4 py-14 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr]">
          <div>
            <div className="flex items-center">
              <img src="/images/logo-transparent.png" alt="PRO192 Docs" className="h-9 dark:hidden" />
              <img src="/images/logo.png" alt="PRO192 Docs" className="hidden h-9 dark:block" />
            </div>
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
                  {isEn ? `View all ${chapters.length} chapters` : `Xem tất cả ${chapters.length} chương`}
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
              <li>
                <a
                  href={FPT_SYLLABUS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink-muted hover:text-ink text-sm transition-colors"
                >
                  {isEn ? 'Syllabus (FPT)' : 'Đề cương môn học (FPT)'}
                </a>
              </li>
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
          <p className="text-ink-faint flex items-center gap-1.5 text-xs">
            <UsersIcon />
            <strong className="text-ink-body font-semibold">{visitorCount}</strong>
            {isEn ? 'online now' : 'đang online'}
          </p>
        </div>
      </div>
    </footer>
  )
}
