import { Link } from 'react-router-dom'
import { LanguageSelector } from '../components/LanguageSelector'
import { SearchField } from '../components/SearchField'
import { ThemeToggle } from '../components/ThemeToggle'

interface DocsHeaderProps {
  onOpenMenu: () => void
}

export function DocsHeader({ onOpenMenu }: DocsHeaderProps) {
  return (
    <header className="border-hairline bg-canvas/95 sticky top-0 z-30 border-b backdrop-blur">
      <div className="flex h-16 items-center gap-3 px-4 lg:px-8">
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="Mở menu điều hướng"
          className="text-ink-muted hover:bg-panel hover:text-ink -ml-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-md lg:hidden"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-5 w-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <Link to="/" className="flex shrink-0 items-baseline gap-2">
          <span className="text-ink text-[15px] font-semibold tracking-tight">PRO192</span>
          <span className="text-ink-faint text-xs">Docs</span>
        </Link>

        <div className="hidden max-w-sm flex-1 md:block">
          <SearchField />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <LanguageSelector />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
