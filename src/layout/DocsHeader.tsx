import { useState } from 'react'
import { Link } from 'react-router-dom'
import { LanguageSelector } from '../components/LanguageSelector'
import { SearchField } from '../components/SearchField'
import { SearchModal } from '../components/search/SearchModal'
import { ThemeToggle } from '../components/ThemeToggle'
import { useLanguage } from '../hooks/use-language'
import { useSearchShortcut } from '../hooks/use-search-shortcut'

const GITHUB_URL = 'https://github.com/mst-software-vn/pro192web'

function GithubIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 16 16" fill="currentColor" className="shrink-0">
      <path
        fillRule="evenodd"
        d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
      />
    </svg>
  )
}

interface DocsHeaderProps {
  onOpenMenu: () => void
}

export function DocsHeader({ onOpenMenu }: DocsHeaderProps) {
  const { language } = useLanguage()
  const [searchOpen, setSearchOpen] = useState(false)

  useSearchShortcut(() => setSearchOpen(true))

  return (
    <header className="border-hairline bg-canvas/95 sticky top-0 z-30 border-b backdrop-blur">
      <div className="mx-auto flex h-20 w-full max-w-360 items-center gap-10 px-4 lg:px-12">
        <div className="flex shrink-0 items-center gap-3 lg:w-64">
          <button
            type="button"
            onClick={onOpenMenu}
            aria-label={language === 'en' ? 'Open navigation menu' : 'Mở menu điều hướng'}
            className="text-ink-muted hover:bg-panel hover:text-ink -ml-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-md lg:hidden"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Logo */}
          <Link to="/" className="flex shrink-0 items-center">
            <img src="/images/logo-transparent.png" alt="PRO192 Docs" className="h-9 dark:hidden" />
            <img src="/images/logo.png" alt="PRO192 Docs" className="hidden h-9 dark:block" />
          </Link>
        </div>

        <div className="hidden min-w-0 flex-1 md:block lg:px-3">
          <SearchField onClick={() => setSearchOpen(true)} />
        </div>

        <div className="flex shrink-0 items-center justify-end gap-2 xl:w-56">
          <LanguageSelector />
          <ThemeToggle />
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub repository"
            className="text-ink-muted hover:bg-panel hover:text-ink flex h-9 w-9 shrink-0 items-center justify-center rounded-md transition-colors"
          >
            <GithubIcon />
          </a>
        </div>
      </div>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  )
}
