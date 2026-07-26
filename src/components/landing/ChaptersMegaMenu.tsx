import { Link } from 'react-router-dom'
import { chapters, groupChapters, groupLabel } from '../../content/chapters'

function ChevronIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-180"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

export function ChaptersMegaMenu() {
  const groups = groupChapters()

  return (
    <div className="group relative">
      <button
        type="button"
        className="flex items-center gap-1.5 text-sm text-ink-muted transition-colors hover:text-ink"
      >
        Chapters
        <ChevronIcon />
      </button>

      <div className="invisible absolute top-full left-1/2 z-50 w-165 -translate-x-1/2 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
        <div className="mt-3 rounded-2xl border border-hairline-strong bg-panel p-6 shadow-[0_24px_60px_-16px_rgba(0,0,0,0.6)]">
          <div className="grid grid-cols-3 gap-x-8 gap-y-5">
            {groups.map((group) => (
              <div key={group.name}>
                <p className="text-ink-faint mb-2.5 text-[11px] font-semibold tracking-wider uppercase">
                  {groupLabel(group.name, 'en')}
                </p>
                <div className="flex flex-col gap-0.5">
                  {group.items.map((chapter) => (
                    <Link
                      key={chapter.slug}
                      to={`/docs/${chapter.slug}`}
                      className="text-ink-muted hover:bg-well hover:text-ink -mx-2 rounded-md px-2 py-1.5 text-[13.5px] transition-colors"
                    >
                      {chapter.titleEn}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="border-hairline mt-5 flex items-center justify-between border-t pt-4">
            <span className="text-ink-faint text-xs">{chapters.length} chapters · bilingual Vietnamese/English</span>
            <Link to="/docs" className="text-accent-dark flex items-center gap-1 text-xs font-semibold hover:underline">
              View all
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
