import { NavLink } from 'react-router-dom'
import { chapters, type ChapterGroup } from '../content/chapters'

interface SidebarProps {
  /** Gọi sau khi bấm 1 mục — dùng để đóng drawer trên mobile */
  onNavigate?: () => void
}

function groupChapters(): ChapterGroup[] {
  const groups: ChapterGroup[] = []
  for (const chapter of chapters) {
    const current = groups[groups.length - 1]
    if (current && current.name === chapter.group) {
      current.items.push(chapter)
    } else {
      groups.push({ name: chapter.group, items: [chapter] })
    }
  }
  return groups
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const groups = groupChapters()

  return (
    <nav className="space-y-7">
      {groups.map((group) => (
        <div key={group.name}>
          <p className="mb-2 px-3 text-xs font-semibold tracking-wider text-neutral-500 uppercase">
            {group.name}
          </p>
          <ul className="space-y-0.5">
            {group.items.map((chapter) => (
              <li key={chapter.slug}>
                <NavLink
                  to={`/docs/${chapter.slug}`}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    `flex items-center justify-between gap-2 rounded-md px-3 py-1.5 text-[14px] transition-colors ${
                      isActive
                        ? 'bg-accent/10 font-medium text-accent-dark'
                        : 'text-neutral-400 hover:bg-neutral-900 hover:text-neutral-200'
                    }`
                  }
                >
                  <span>{chapter.title}</span>
                  {chapter.status === 'draft' ? (
                    <span className="shrink-0 rounded-full bg-neutral-800 px-1.5 py-0.5 text-[10px] font-medium tracking-wide text-neutral-500 uppercase">
                      Sắp ra mắt
                    </span>
                  ) : null}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}
