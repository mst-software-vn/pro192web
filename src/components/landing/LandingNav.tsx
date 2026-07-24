import { useState, type ReactElement } from 'react'
import { Link } from 'react-router-dom'
import { useTheme, type ThemePreference } from '../../hooks/use-theme'

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

function SearchIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  )
}

function SystemIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  )
}

const THEME_ICON: Record<ThemePreference, () => ReactElement> = {
  light: SunIcon,
  dark: MoonIcon,
  system: SystemIcon,
}

const NEXT_PREFERENCE: Record<ThemePreference, ThemePreference> = {
  light: 'dark',
  dark: 'system',
  system: 'light',
}

// Nav riêng cho bản thiết kế mới của LandingPage — không tái dùng src/layout/LandingHeader.tsx
// (nằm ngoài phạm vi được sửa của task, và khác hẳn về ngôn ngữ hình ảnh: nav cũ theo
// token --ink/--hairline chung site, nav này theo token --landing-* riêng cho trang này).
export function LandingNav() {
  const { preference, setPreference } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)
  const ThemeIcon = THEME_ICON[preference]

  return (
    <div className="border-b border-(--landing-header-border) bg-(--landing-header-bg) backdrop-blur-md">
      <div className="mx-auto max-w-310 px-6 sm:px-10">
        <nav className="flex h-17 items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7.5 w-7.5 items-center justify-center rounded-md bg-(--landing-accent-strong) text-[15px] font-extrabold text-white shadow-[0_0_20px_rgba(59,130,246,0.45)]">
              P
            </div>
            <span className="text-[16px] font-bold tracking-tight">PRO192</span>
          </div>

          <div className="flex items-center gap-5.5">
            <div className="hidden items-center gap-5.5 text-sm text-(--landing-muted) md:flex">
              <a href="#chapters" className="transition-colors hover:text-(--landing-text)">
                Chapters
              </a>
              <Link to="/docs" className="transition-colors hover:text-(--landing-text)">
                Docs
              </Link>
              <span className="cursor-default opacity-60">Blog</span>
            </div>

            <button
              type="button"
              className="hidden w-42 items-center gap-2 rounded-md border border-(--landing-border-strong) bg-(--landing-search-bg) px-3 py-2 text-[13.5px] text-(--landing-dim) transition-colors hover:border-(--landing-accent) lg:flex"
            >
              <SearchIcon />
              <span className="flex-1 text-left">Search...</span>
              <kbd className="rounded border border-(--landing-border-strong) px-1.5 py-0.5 font-mono text-[11px] text-(--landing-dim)">
                ⌘K
              </kbd>
            </button>

            <div className="flex items-center gap-1.5">
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub repository"
                className="flex h-8.5 w-8.5 items-center justify-center rounded-lg text-(--landing-muted) transition-colors hover:bg-(--landing-card) hover:text-(--landing-text)"
              >
                <GithubIcon />
              </a>

              <button
                type="button"
                onClick={() => setPreference(NEXT_PREFERENCE[preference])}
                aria-label="Toggle theme"
                title={`Theme: ${preference}`}
                className="flex h-8.5 w-8.5 items-center justify-center rounded-lg border border-(--landing-border-strong) bg-(--landing-card) text-(--landing-muted) transition-colors hover:text-(--landing-text)"
              >
                <ThemeIcon />
              </button>

              <button
                type="button"
                onClick={() => setMobileOpen((value) => !value)}
                aria-label="Menu"
                className="flex h-8.5 w-8.5 items-center justify-center rounded-lg border border-(--landing-border-strong) bg-(--landing-card) text-(--landing-muted) md:hidden"
              >
                <MenuIcon />
              </button>
            </div>
          </div>
        </nav>

        {mobileOpen ? (
          <div className="flex flex-col gap-1 border-t border-(--landing-header-border) py-4 md:hidden">
            <a
              href="#chapters"
              onClick={() => setMobileOpen(false)}
              className="px-1.5 py-2.5 text-[15px] text-(--landing-muted)"
            >
              Chapters
            </a>
            <Link
              to="/docs"
              onClick={() => setMobileOpen(false)}
              className="px-1.5 py-2.5 text-[15px] text-(--landing-muted)"
            >
              Docs
            </Link>
            <span className="px-1.5 py-2.5 text-[15px] text-(--landing-muted) opacity-60">Blog</span>
          </div>
        ) : null}
      </div>
    </div>
  )
}
