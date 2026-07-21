import { useState } from 'react'
import { Link } from 'react-router-dom'
import { DocsNavDropdown } from '../components/DocsNavDropdown'
import { GithubStarButton } from '../components/GithubStarButton'
import { SearchField } from '../components/SearchField'
import { ThemeToggle } from '../components/ThemeToggle'
import { firstChapterSlug } from '../content/chapters'
import { LandingMobileNav } from './LandingMobileNav'

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}

// Header riêng cho Landing Page — KHÔNG dùng chung với DocsHeader (quyết định của user).
// Cấu trúc: Logo | Tài liệu (mega-menu) · Giáo trình | Search | GitHub · Theme · CTA.
export function LandingHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="border-hairline bg-canvas/95 sticky top-0 z-30 border-b backdrop-blur">
      <div className="mx-auto flex h-18 max-w-6xl items-center gap-4 px-6">
        <Link to="/" className="flex shrink-0 items-center">
          <img src="/images/logo-transparent.png" alt="PRO192 Docs" className="h-9 dark:hidden" />
          <img src="/images/logo.jpg" alt="PRO192 Docs" className="hidden h-9 dark:block" />
        </Link>

        <nav className="hidden shrink-0 items-center gap-1 lg:flex">
          <DocsNavDropdown />
          <Link
            to="/syllabus-pro192-spring2021"
            className="text-ink-body hover:bg-panel hover:text-ink rounded-md px-3 py-2 text-sm font-medium transition-colors"
          >
            Giáo trình
          </Link>
        </nav>

        <div className="hidden min-w-0 flex-1 md:block">
          <SearchField />
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <GithubStarButton />
          <ThemeToggle />
          <Link
            to={`/docs/${firstChapterSlug}`}
            className="bg-accent hover:bg-accent-emphasis hidden rounded-md px-4 py-2 text-sm font-medium text-white transition-colors active:scale-[0.98] lg:inline-block"
          >
            Bắt đầu học
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Mở menu điều hướng"
            className="text-ink-muted hover:bg-panel hover:text-ink flex h-9 w-9 shrink-0 items-center justify-center rounded-md lg:hidden"
          >
            <MenuIcon />
          </button>
        </div>
      </div>

      <LandingMobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  )
}
