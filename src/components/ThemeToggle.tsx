import { useState, type ReactElement } from 'react'
import { useTheme, type ThemePreference } from '../hooks/use-theme'

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-4 w-4">
      <circle cx="12" cy="12" r="4" />
      <path
        strokeLinecap="round"
        d="M12 3v2M12 19v2M5.64 5.64l1.42 1.42M16.94 16.94l1.42 1.42M3 12h2M19 12h2M5.64 18.36l1.42-1.42M16.94 7.06l1.42-1.42"
      />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-4 w-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" />
    </svg>
  )
}

function MonitorIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-4 w-4">
      <rect x="3" y="4.5" width="18" height="12" rx="1.5" />
      <path strokeLinecap="round" d="M8.5 20h7M12 16.5V20" />
    </svg>
  )
}

const OPTIONS: { value: ThemePreference; label: string; icon: () => ReactElement }[] = [
  { value: 'light', label: 'Sáng', icon: SunIcon },
  { value: 'dark', label: 'Tối', icon: MoonIcon },
  { value: 'system', label: 'Hệ thống', icon: MonitorIcon },
]

export function ThemeToggle() {
  const { preference, setPreference } = useTheme()
  const [open, setOpen] = useState(false)

  const Current = OPTIONS.find((option) => option.value === preference)?.icon ?? MonitorIcon

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label="Đổi giao diện sáng/tối"
        aria-expanded={open}
        className="text-ink-muted hover:bg-panel hover:text-ink flex h-9 w-9 items-center justify-center rounded-md transition-colors"
      >
        <Current />
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
            {OPTIONS.map((option) => {
              const Icon = option.icon
              const isActive = option.value === preference
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    setPreference(option.value)
                    setOpen(false)
                  }}
                  className={`flex w-full items-center gap-2.5 px-3 py-1.5 text-[13px] transition-colors ${
                    isActive ? 'text-accent-on-surface font-medium' : 'text-ink-body hover:bg-panel'
                  }`}
                >
                  <Icon />
                  {option.label}
                </button>
              )
            })}
          </div>
        </>
      ) : null}
    </div>
  )
}
