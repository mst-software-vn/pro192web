import { NavLink } from 'react-router-dom'
import { groupChapters, groupLabel } from '../content/chapters'
import { useLanguage } from '../hooks/use-language'

interface SidebarProps {
  /** Gọi sau khi bấm 1 mục — dùng để đóng drawer trên mobile */
  onNavigate?: () => void
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const groups = groupChapters()
  const { language } = useLanguage()

  return (
    <nav className="space-y-7">
      {groups.map((group) => (
        <div key={group.name}>
          <p className="text-ink-faint mb-2 px-3 text-xs font-semibold tracking-wider uppercase">
            {groupLabel(group.name, language)}
          </p>
          <ul className="space-y-0.5">
            {group.items.map((chapter) => (
              <li key={chapter.slug}>
                <NavLink
                  to={`/docs/${chapter.slug}`}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    `flex items-center justify-between gap-2 rounded-md px-3 py-1.5 text-[16px] transition-colors ${isActive
                      ? 'bg-accent/10 text-accent-on-surface font-medium'
                      : 'text-ink-muted hover:bg-panel hover:text-ink-secondary'
                    }`
                  }
                >
                  <span>{language === 'en' ? chapter.titleEn : chapter.title}</span>
                  {chapter.status === 'draft' ? (
                    <span className="bg-well text-ink-faint shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium tracking-wide uppercase">
                      {language === 'en' ? 'Coming soon' : 'Sắp ra mắt'}
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
