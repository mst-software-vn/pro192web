import { Link } from 'react-router-dom'

interface DocsHeaderProps {
  onOpenMenu: () => void
}

export function DocsHeader({ onOpenMenu }: DocsHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-neutral-800 bg-neutral-950/95 backdrop-blur">
      <div className="flex h-16 items-center gap-4 px-4 lg:px-8">
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="Mở menu điều hướng"
          className="-ml-1 flex h-9 w-9 items-center justify-center rounded-md text-neutral-400 hover:bg-neutral-900 hover:text-white lg:hidden"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-5 w-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <Link to="/" className="flex items-baseline gap-2">
          <span className="text-[15px] font-semibold tracking-tight text-white">PRO192</span>
          <span className="text-xs text-neutral-500">Docs</span>
        </Link>
      </div>
    </header>
  )
}
