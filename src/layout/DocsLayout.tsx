import { useState } from 'react'
import { Outlet, useParams } from 'react-router-dom'
import { getChapter } from '../content/chapters'
import { useActiveHeading } from '../hooks/use-active-heading'
import { extractHeadings } from '../lib/markdown'
import { DocsHeader } from './DocsHeader'
import { MobileNav } from './MobileNav'
import { Sidebar } from './Sidebar'
import { TableOfContents } from './TableOfContents'

// Bố cục docs 3 cột kiểu Laravel: sidebar trái · cột đọc giữa · mục lục phải.
// Sidebar cố định + TOC chỉ hiện ở desktop; mobile dùng drawer từ DocsHeader.
export function DocsLayout() {
  const { slug } = useParams()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  const chapter = slug ? getChapter(slug) : undefined
  const headings = chapter?.body ? extractHeadings(chapter.body) : []
  const activeHeadingId = useActiveHeading(headings.map((heading) => heading.id))

  return (
    <div className="min-h-svh bg-neutral-950">
      <DocsHeader onOpenMenu={() => setMobileNavOpen(true)} />
      <MobileNav open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      <div className="mx-auto flex max-w-[1440px] gap-10 px-4 lg:px-8">
        <aside className="hidden w-64 shrink-0 py-10 lg:block">
          <div className="sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto">
            <Sidebar />
          </div>
        </aside>

        <main className="min-w-0 flex-1 py-10">
          <Outlet />
        </main>

        <aside className="hidden w-56 shrink-0 py-10 xl:block">
          <TableOfContents headings={headings} activeId={activeHeadingId} />
        </aside>
      </div>
    </div>
  )
}
