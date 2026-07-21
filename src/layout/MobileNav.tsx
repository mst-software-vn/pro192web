import { Sidebar } from './Sidebar'

interface MobileNavProps {
  open: boolean
  onClose: () => void
}

// Drawer trượt từ trái — chỉ hiển thị dưới breakpoint lg (thay thế sidebar cố định).
export function MobileNav({ open, onClose }: MobileNavProps) {
  return (
    <div className={`fixed inset-0 z-40 lg:hidden ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/60 transition-opacity duration-200 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <div
        className={`border-hairline bg-canvas absolute inset-y-0 left-0 w-72 max-w-[85vw] overflow-y-auto border-r px-5 py-6 transition-transform duration-200 ${
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
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        <Sidebar onNavigate={onClose} />
      </div>
    </div>
  )
}
