import { useState } from 'react'
import { useLanguage, type Language } from '../hooks/use-language'

const LANGUAGES: { code: Language; short: string; label: string }[] = [
  { code: 'vi', short: 'VI', label: 'Tiếng Việt' },
  { code: 'en', short: 'EN', label: 'English' },
]

// Chọn ngôn ngữ hiển thị nội dung Docs — đổi body chương sang bản dịch tương ứng
// (fallback tiếng Anh nếu chương chưa có bản dịch tiếng Việt).
export function LanguageSelector() {
  const [open, setOpen] = useState(false)
  const { language, setLanguage } = useLanguage()
  const current = LANGUAGES.find((lang) => lang.code === language) ?? LANGUAGES[0]

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="border-hairline text-ink-secondary hover:bg-panel flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm transition-colors"
      >
        <span className="sm:hidden">{current.short}</span>
        <span className="hidden sm:inline">{current.label}</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-3.5 w-3.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open ? (
        <>
          <button
            type="button"
            aria-hidden
            tabIndex={-1}
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setOpen(false)}
          />
          <div className="border-hairline bg-canvas absolute top-full right-0 z-50 mt-2 w-36 overflow-hidden rounded-md border py-1 shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
            {LANGUAGES.map((lang) => {
              const isActive = lang.code === language
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    setLanguage(lang.code)
                    setOpen(false)
                  }}
                  className={`flex w-full items-center px-3 py-1.5 text-[13px] transition-colors ${
                    isActive ? 'text-accent-on-surface font-medium' : 'text-ink-body hover:bg-panel'
                  }`}
                >
                  {lang.label}
                </button>
              )
            })}
          </div>
        </>
      ) : null}
    </div>
  )
}
