import { chapters } from '../content/chapters'
import type { HeadingItem } from '../lib/markdown'
import { useLanguage } from '../hooks/use-language'

interface TableOfContentsProps {
  headings: HeadingItem[]
  activeId: string | null
  onCollapse: () => void
}

function ListIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-3.5 w-3.5 shrink-0"
    >
      <path d="M2.75 14.25H15.25" />
      <path d="M2.75 3.75H15.25" />
      <path d="M2.75 9H8.25" />
    </svg>
  )
}

function ChevronIcon({ pointLeft }: { pointLeft: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`h-3 w-3 shrink-0 transition-transform duration-200 ${pointLeft ? 'rotate-180' : ''}`}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}

export function TableOfContents({ headings, activeId, onCollapse }: TableOfContentsProps) {
  const { language } = useLanguage()
  const isEn = language === 'en'

  return (
    <div className="sticky top-24 flex max-h-[calc(100vh-6rem)] flex-col gap-12 overflow-y-auto">
      {headings.length > 0 ? (
        <nav>
          <div className="mb-3 flex items-center gap-2">
            <button
              type="button"
              onClick={onCollapse}
              aria-label={isEn ? 'Hide sidebar' : 'Ẩn cột bên phải'}
              className="border-hairline-strong text-ink-muted hover:border-accent hover:text-ink flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-full border transition-colors"
            >
              <ChevronIcon pointLeft={false} />
            </button>
            <p className="text-ink-faint flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase">
              <ListIcon />
              {isEn ? 'On this page' : 'Trên trang này'}
            </p>
          </div>

          <ul className="border-hairline space-y-2.5 border-l pl-4">
            {headings.map((heading) => {
              const isActive = heading.id === activeId
              return (
                <li key={heading.id} className={heading.depth === 3 ? 'pl-3' : undefined}>
                  <a
                    href={`#${heading.id}`}
                    className={`text-[13px] leading-5 transition-colors ${isActive ? 'text-accent-on-surface font-medium' : 'text-ink-faint hover:text-ink-muted'
                      }`}
                  >
                    {heading.text}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
      ) : null}

      <div className="border-hairline-strong bg-panel flex flex-col gap-2.5 rounded-lg border border-dashed p-3.5">
        <div className="flex items-center gap-2">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-accent-on-surface h-4 w-4 shrink-0"
          >
            <path d="M12 3v12m0 0-4-4m4 4 4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
          </svg>
          <span className="text-ink text-xs font-semibold">{isEn ? 'Download PDF' : 'Tải PDF'}</span>
        </div>
        <p className="text-ink-faint text-[11px] leading-snug">
          {isEn ? `${chapters.length} chapters · full set` : `${chapters.length} chương · trọn bộ`}
        </p>
        <a
          href="/downloads/pro192-course-pdfs.zip"
          download
          className="text-accent-on-surface border-accent-on-surface/30 hover:bg-accent-on-surface/10 rounded-md border py-1.5 text-center text-[11.5px] font-semibold transition-colors"
        >
          {isEn ? 'Download' : 'Tải xuống'}
        </a>
      </div>
    </div>
  )
}
