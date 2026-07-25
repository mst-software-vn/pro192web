import { Link } from 'react-router-dom'
import { chapters } from '../content/chapters'
import { useLanguage } from '../hooks/use-language'

function ChevronLeftIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 shrink-0"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  )
}

function ChevronRightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 shrink-0"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}

interface PageNavProps {
  slug: string
}

// Điều hướng chương trước/sau — dựa theo đúng thứ tự khai báo trong
// src/content/chapters/index.ts (khớp thứ tự hiển thị ở Sidebar).
export function PageNav({ slug }: PageNavProps) {
  const { language } = useLanguage()
  const isEn = language === 'en'
  const index = chapters.findIndex((chapter) => chapter.slug === slug)
  const prev = index > 0 ? chapters[index - 1] : undefined
  const next = index >= 0 && index < chapters.length - 1 ? chapters[index + 1] : undefined

  if (!prev && !next) return null

  return (
    <div className="border-hairline mt-8 flex items-center justify-between gap-4 border-t pt-8">
      {prev ? (
        <Link to={`/docs/${prev.slug}`} className="text-ink-muted hover:text-ink flex items-center gap-1.5 text-sm transition-colors">
          <ChevronLeftIcon />
          <span className="font-semibold">{isEn ? prev.titleEn : prev.title}</span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link
          to={`/docs/${next.slug}`}
          className="text-ink-muted hover:text-ink ml-auto flex items-center gap-1.5 text-sm transition-colors"
        >
          <span className="font-semibold">{isEn ? next.titleEn : next.title}</span>
          <ChevronRightIcon />
        </Link>
      ) : (
        <span />
      )}
    </div>
  )
}
