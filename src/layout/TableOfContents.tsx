import type { HeadingItem } from '../lib/markdown'

interface TableOfContentsProps {
  headings: HeadingItem[]
  activeId: string | null
}

export function TableOfContents({ headings, activeId }: TableOfContentsProps) {
  if (headings.length === 0) return null

  return (
    <nav className="sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto">
      <p className="mb-3 text-xs font-semibold tracking-wider text-neutral-500 uppercase">
        Trên trang này
      </p>
      <ul className="space-y-2.5 border-l border-neutral-800 pl-4">
        {headings.map((heading) => {
          const isActive = heading.id === activeId
          return (
            <li key={heading.id} className={heading.depth === 3 ? 'pl-3' : undefined}>
              <a
                href={`#${heading.id}`}
                className={`text-[13px] leading-5 transition-colors ${
                  isActive ? 'font-medium text-accent-dark' : 'text-neutral-500 hover:text-neutral-300'
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
