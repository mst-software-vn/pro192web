import { useEffect, useState } from 'react'
import { Outlet, useLocation, useParams } from 'react-router-dom'
import { getChapter } from '../content/chapters'
import { useActiveHeading } from '../hooks/use-active-heading'
import { useLanguage } from '../hooks/use-language'
import { extractHeadings } from '../lib/markdown'
import { DocsFooter } from './DocsFooter'
import { DocsHeader } from './DocsHeader'
import { MobileNav } from './MobileNav'
import { Sidebar } from './Sidebar'
import { TableOfContents } from './TableOfContents'

// Bố cục docs 3 cột kiểu Laravel: sidebar trái · cột đọc giữa · mục lục phải.
// Sidebar cố định + TOC chỉ hiện ở desktop; mobile dùng drawer từ DocsHeader.
export function DocsLayout() {
  const { slug } = useParams()
  const { pathname } = useLocation()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  // Chuyển trang (sang chương khác hoặc syllabus) thì cuộn lên đầu ngay lập tức —
  // React Router không tự reset scroll khi điều hướng phía client như trình duyệt vẫn làm.
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])

  const { language } = useLanguage()
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
          <Outlet />
        </main>

        {headings.length > 0 ? (
          <aside className="hidden w-56 shrink-0 py-10 xl:block">
            <TableOfContents headings={headings} activeId={activeHeadingId} />
          </aside>
        ) : null}
      </div>

      <DocsFooter />
    </div>
  )
}
