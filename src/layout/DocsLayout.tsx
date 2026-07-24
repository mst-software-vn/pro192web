import { useEffect, useState } from 'react'
import { Outlet, useLocation, useParams } from 'react-router-dom'
import { getChapter } from '../content/chapters'
import { useActiveHeading } from '../hooks/use-active-heading'
import { useLanguage } from '../hooks/use-language'
import { useTocCollapsed } from '../hooks/use-toc-collapsed'
import { extractHeadings } from '../lib/markdown'
import { DocsFooter } from './DocsFooter'
import { DocsHeader } from './DocsHeader'
import { MobileNav } from './MobileNav'
import { Sidebar } from './Sidebar'
import { TableOfContents } from './TableOfContents'

export interface DocsOutletContext {
  tocCollapsed: boolean
}

function ChevronIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3 w-3 shrink-0 rotate-180"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}

// Bố cục docs 3 cột kiểu Laravel: sidebar trái · cột đọc giữa · mục lục phải.
// Sidebar cố định + TOC chỉ hiện ở desktop; mobile dùng drawer từ DocsHeader.
export function DocsLayout() {
  const { slug } = useParams()
  const location = useLocation()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  // Ẩn nguyên cột phải (TOC + thẻ tải PDF) khi bấm toggle, để cột nội dung giữa (flex-1)
  // tự giãn ra chiếm hết chỗ trống — không phải chỉ ẩn mỗi danh sách heading bên trong.
  // Lưu localStorage để giữ nguyên lựa chọn qua các lần điều hướng/tải lại trang.
  const { collapsed: tocCollapsed, setCollapsed: setTocCollapsed } = useTocCollapsed()

  // Chuyển trang thì cuộn lên đầu ngay lập tức (React Router không tự reset scroll
  // như trình duyệt vẫn làm) — TRỪ khi URL có #hash (vd từ search modal nhảy tới 1
  // heading cụ thể), lúc đó cuộn tới đúng heading thay vì lên đầu trang.
  useEffect(() => {
    if (location.hash) {
      const target = document.getElementById(location.hash.slice(1))
      if (target) {
        target.scrollIntoView({ behavior: 'instant', block: 'start' })
        return
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [location.pathname, location.hash])

  const { language } = useLanguage()
  const isEn = language === 'en'
  const chapter = slug ? getChapter(slug) : undefined
  const activeBody = language === 'vi' ? (chapter?.bodyVi ?? chapter?.body) : chapter?.body
  const headings = activeBody ? extractHeadings(activeBody) : []
  const activeHeadingId = useActiveHeading(headings.map((heading) => heading.id))

  return (
    <div className="bg-canvas flex min-h-svh flex-col">
      <DocsHeader onOpenMenu={() => setMobileNavOpen(true)} />
      <MobileNav open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      <div className="mx-auto flex w-full max-w-360 flex-1 gap-10 px-4 lg:px-8">
        <aside className="hidden w-64 shrink-0 py-10 lg:block">
          <div className="sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto">
            <Sidebar />
          </div>
        </aside>

        <main className="min-w-0 flex-1 py-10">
          <Outlet context={{ tocCollapsed } satisfies DocsOutletContext} />
        </main>

        {headings.length > 0 && !tocCollapsed ? (
          <aside className="hidden w-56 shrink-0 py-10 xl:block">
            <TableOfContents
              headings={headings}
              activeId={activeHeadingId}
              onCollapse={() => setTocCollapsed(true)}
            />
          </aside>
        ) : null}
      </div>

      {headings.length > 0 && tocCollapsed ? (
        <button
          type="button"
          onClick={() => setTocCollapsed(false)}
          aria-label={isEn ? 'Show sidebar' : 'Hiện cột bên phải'}
          className="border-hairline-strong bg-canvas text-ink-muted hover:border-accent hover:text-ink fixed top-28 right-6 z-20 hidden h-7 w-7 items-center justify-center rounded-full border shadow-sm transition-colors xl:flex"
        >
          <ChevronIcon />
        </button>
      ) : null}

      <DocsFooter />
    </div>
  )
}
