import type { HeadingItem } from '../lib/markdown'
import { useLanguage } from '../hooks/use-language'

interface TableOfContentsProps {
  headings: HeadingItem[]
  activeId: string | null
}

export function TableOfContents({ headings, activeId }: TableOfContentsProps) {
  const { language } = useLanguage()
  if (headings.length === 0) return null

  return (
    <nav className="sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto">
      <p className="text-ink-faint mb-3 text-xs font-semibold tracking-wider uppercase">
        {language === 'en' ? 'On this page' : 'Trên trang này'}
      </p>
      <ul className="border-hairline space-y-2.5 border-l pl-4">
        {headings.map((heading) => {
          const isActive = heading.id === activeId
          return (
            <li key={heading.id} className={heading.depth === 3 ? 'pl-3' : undefined}>
              <a
                href={`#${heading.id}`}
                className={`text-[13px] leading-5 transition-colors ${
                  isActive ? 'text-accent-on-surface font-medium' : 'text-ink-faint hover:text-ink-muted'
                }`}
              >
                {heading.text}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
