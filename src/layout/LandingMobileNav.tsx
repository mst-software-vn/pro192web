import { Link } from 'react-router-dom'
import { firstChapterSlug } from '../content/chapters'
import { Sidebar } from './Sidebar'

interface LandingMobileNavProps {
  open: boolean
  onClose: () => void
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-4 w-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}

// Drawer mobile riêng cho Landing (khác hamburger mở sidebar của Docs) — liệt kê
// chương theo nhóm bằng cách tái dùng nguyên Sidebar, không viết lại danh sách lần 2.
export function LandingMobileNav({ open, onClose }: LandingMobileNavProps) {
  return (
    <div className={`fixed inset-0 z-40 lg:hidden ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/60 transition-opacity duration-200 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <div
        className={`border-hairline bg-canvas absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col overflow-y-auto border-r px-5 py-6 transition-transform duration-200 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-6 flex items-center justify-between">
          <span className="text-ink text-[15px] font-semibold tracking-tight">PRO192</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng menu"
            className="text-ink-muted hover:bg-panel hover:text-ink flex h-8 w-8 items-center justify-center rounded-md"
          >
            <CloseIcon />
          </button>
        </div>

        <Link
          to="/syllabus-pro192-spring2021"
          onClick={onClose}
          className="text-ink-muted hover:bg-panel hover:text-ink-secondary mb-4 block rounded-md px-3 py-1.5 text-[15px] transition-colors"
        >
          Giáo trình
        </Link>

        <Sidebar onNavigate={onClose} />

        <Link
          to={`/docs/${firstChapterSlug}`}
          onClick={onClose}
          className="bg-accent hover:bg-accent-emphasis mt-6 block shrink-0 rounded-md px-4 py-2.5 text-center text-sm font-medium text-white transition-colors"
        >
          Bắt đầu học
        </Link>
      </div>
    </div>
  )
}
