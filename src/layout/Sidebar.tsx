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
          <p className="text-ink-faint mb-2 px-3 text-xs font-semibold tracking-wider uppercase">
            {group.name}
          </p>
          <ul className="space-y-0.5">
            {group.items.map((chapter) => (
              <li key={chapter.slug}>
                <NavLink
                  to={`/docs/${chapter.slug}`}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    `flex items-center justify-between gap-2 rounded-md px-3 py-1.5 text-[15px] transition-colors ${isActive
                      ? 'bg-accent/10 text-accent-on-surface font-medium'
                      : 'text-ink-muted hover:bg-panel hover:text-ink-secondary'
                    }`
                  }
                >
                  <span>{chapter.title}</span>
                  {chapter.status === 'draft' ? (
                    <span className="bg-well text-ink-faint shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium tracking-wide uppercase">
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
