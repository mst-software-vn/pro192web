import { Link } from 'react-router-dom'
import { firstChapterSlug } from '../content/chapters'

const DOCS_LINKS = [
  { label: 'Chào mừng', to: '/docs/chao-mung' },
  { label: 'Nền tảng', to: '/docs/nen-tang' },
  { label: 'Đóng gói', to: '/docs/dong-goi' },
]

const COURSE_LINKS = [
  { label: 'Trang chủ', to: '/' },
  { label: 'Đề cương môn học', to: '/syllabus-pro192-spring2021' },
]

export function DocsFooter() {
  return (
    <footer className="border-hairline border-t">
      <div className="mx-auto max-w-[1440px] px-4 py-14 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr]">
          <div>
            <span className="text-ink text-[15px] font-semibold tracking-tight">PRO192 · Java Edition</span>
            <p className="text-ink-muted mt-3 max-w-xs text-sm leading-relaxed">
              Tài liệu học Lập trình Hướng đối tượng với Java, hệ thống hoá từ giáo trình PRO192 —
              phát triển bởi MST Software.
            </p>
          </div>

          <div>
            <p className="text-ink-faint mb-3 text-xs font-semibold tracking-wider uppercase">Tài liệu</p>
            <ul className="space-y-2">
              {DOCS_LINKS.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-ink-muted hover:text-ink text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to={`/docs/${firstChapterSlug}`}
                  className="text-ink-muted hover:text-ink text-sm transition-colors"
                >
                  Xem tất cả 11 chương
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-ink-faint mb-3 text-xs font-semibold tracking-wider uppercase">Khoá học</p>
            <ul className="space-y-2">
              {COURSE_LINKS.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-ink-muted hover:text-ink text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-hairline mt-12 flex flex-col gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-ink-faint text-xs">© 2026 MST Software · Tài liệu học Java OOP (PRO192)</p>
          <p className="text-ink-faint text-xs">Xây dựng cho sinh viên học Lập trình Hướng đối tượng</p>
        </div>
      </div>
    </footer>
  )
}
