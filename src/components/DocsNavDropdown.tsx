import { useState } from 'react'
import { Link } from 'react-router-dom'
import { groupChapters } from '../content/chapters'

function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-3.5 w-3.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
    </svg>
  )
}

// Mega-menu "Tài liệu" cho LandingHeader — liệt kê chương theo nhóm, lấy trực tiếp từ
// registry (groupChapters) để không tạo nguồn dữ liệu thứ hai so với Sidebar (Docs).
export function DocsNavDropdown() {
  const [open, setOpen] = useState(false)
  const groups = groupChapters()

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="text-ink-body hover:bg-panel hover:text-ink flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors"
      >
        Tài liệu
        <ChevronDownIcon />
      </button>

      {open ? (
        <>
          <button
            type="button"
            aria-hidden
            tabIndex={-1}
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setOpen(false)}
          />
          <div className="border-hairline bg-canvas absolute top-full left-0 z-50 mt-2 grid w-[640px] max-w-[90vw] grid-cols-3 gap-x-8 gap-y-5 rounded-lg border p-6 shadow-[0_16px_40px_rgba(0,0,0,0.12)]">
            {groups.map((group) => (
              <div key={group.name}>
                <p className="text-ink-faint mb-2 text-xs font-semibold tracking-wider uppercase">
                  {group.name}
                </p>
                <ul className="space-y-0.5">
                  {group.items.map((chapter) => (
                    <li key={chapter.slug}>
                      <Link
                        to={`/docs/${chapter.slug}`}
                        onClick={() => setOpen(false)}
                        className="text-ink-body hover:bg-panel hover:text-ink flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm transition-colors"
                      >
                        <span>{chapter.title}</span>
                        {chapter.status === 'draft' ? (
                          <span className="bg-well text-ink-faint shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium tracking-wide uppercase">
                            Sắp ra mắt
                          </span>
                        ) : null}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </>
      ) : null}
    </div>
  )
}
