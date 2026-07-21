import { useLanguage } from '../hooks/use-language'

// Thanh tìm kiếm kiểu Laravel Docs — hiện tại chỉ là UI, chưa gắn logic tìm kiếm thật.
export function SearchField() {
  const { language } = useLanguage()

  return (
    <button
      type="button"
      className="max-w-xl border-hairline bg-panel/60 text-ink-faint hover:border-hairline-strong flex w-full items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-4 w-4 shrink-0">
        <circle cx="11" cy="11" r="7" />
        <path strokeLinecap="round" d="m20 20-3.5-3.5" />
      </svg>
      <span className="flex-1 text-left">{language === 'en' ? 'Search documentation...' : 'Tìm kiếm tài liệu...'}</span>
      <kbd className="border-hairline text-ink-faint hidden shrink-0 rounded border px-1.5 py-0.5 font-mono text-[11px] sm:inline-block">
        ⌘K
      </kbd>
    </button>
  )
}
