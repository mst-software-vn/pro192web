import { Link } from 'react-router-dom'
import { chapters, groupChapters } from '../../content/chapters'

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

// Mega menu xổ xuống khi hover mục "Chapters" — liệt kê toàn bộ chương học thật của
// pro192web (13 chương, kể cả Trừu tượng và Lưu ý khi thi PE), gom nhóm giống hệt
// Sidebar bên /docs (dùng chung groupChapters()) thay vì chỉ cuộn tới #chapters.
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
                  {group.name}
                </p>
                <div className="flex flex-col gap-0.5">
                  {group.items.map((chapter) => (
                    <Link
                      key={chapter.slug}
                      to={`/docs/${chapter.slug}`}
                      className="text-ink-muted hover:bg-well hover:text-ink -mx-2 rounded-md px-2 py-1.5 text-[13.5px] transition-colors"
                    >
                      {chapter.title}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="border-hairline mt-5 flex items-center justify-between border-t pt-4">
            <span className="text-ink-faint text-xs">{chapters.length} chương · song ngữ Việt/Anh</span>
            <Link to="/docs" className="text-accent-dark flex items-center gap-1 text-xs font-semibold hover:underline">
              Xem tất cả
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
