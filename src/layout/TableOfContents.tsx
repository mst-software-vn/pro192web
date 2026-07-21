import type { HeadingItem } from '../lib/markdown'

interface TableOfContentsProps {
  headings: HeadingItem[]
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  if (headings.length === 0) return null

  return (
    <nav className="sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto">
      <p className="mb-3 text-xs font-semibold tracking-wider text-neutral-500 uppercase">
        Trên trang này
      </p>
      <ul className="space-y-2.5 border-l border-neutral-800 pl-4">
        {headings.map((heading) => (
          <li key={heading.id} className={heading.depth === 3 ? 'pl-3' : undefined}>
            <a
              href={`#${heading.id}`}
              className="text-[13px] leading-5 text-neutral-500 transition-colors hover:text-accent-dark"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
