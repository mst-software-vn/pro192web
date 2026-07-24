import Fuse from 'fuse.js'
import { useEffect, useMemo, useState, type KeyboardEvent } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { chapters } from '../../content/chapters'
import { useLanguage } from '../../hooks/use-language'
import { useRecentSearches, type RecentSearchEntry } from '../../hooks/use-recent-searches'
import { buildSearchIndex, stripDiacritics, type SearchEntry } from '../../lib/search-index'

interface SearchModalProps {
  open: boolean
  onClose: () => void
}

const MAX_RESULTS = 8

function toResultRow(entry: SearchEntry): RecentSearchEntry {
  if (entry.type === 'heading') {
    return {
      slug: entry.slug,
      headingId: entry.headingId,
      title: entry.headingText ?? entry.chapterTitle,
      breadcrumb: `${entry.chapterTitle} › ${entry.headingText}`,
    }
  }
  return { slug: entry.slug, title: entry.chapterTitle, breadcrumb: entry.chapterTitle }
}

export function SearchModal({ open, onClose }: SearchModalProps) {
  const { language } = useLanguage()
  const isEn = language === 'en'
  const navigate = useNavigate()
  const { recent, record } = useRecentSearches()

  const [query, setQuery] = useState('')
  const [highlighted, setHighlighted] = useState(0)

  const fuse = useMemo(() => {
    const index = buildSearchIndex(chapters, language)
    return new Fuse(index, {
      keys: ['chapterTitleNormalized', 'headingTextNormalized'],
      threshold: 0.35,
      ignoreLocation: true,
      minMatchCharLength: 2,
    })
  }, [language])

  const trimmedQuery = query.trim()
  const isSearching = trimmedQuery.length >= 2

  const rows = useMemo<RecentSearchEntry[]>(() => {
    if (!isSearching) return recent
    const normalizedQuery = stripDiacritics(trimmedQuery)
    return fuse
      .search(normalizedQuery)
      .slice(0, MAX_RESULTS)
      .map((result) => toResultRow(result.item))
  }, [fuse, isSearching, trimmedQuery, recent])

  useEffect(() => {
    setHighlighted(0)
  }, [query])

  useEffect(() => {
    if (!open) setQuery('')
  }, [open])

  function activate(row: RecentSearchEntry) {
    record(row)
    onClose()
    navigate(`/docs/${row.slug}${row.headingId ? `#${row.headingId}` : ''}`)
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      onClose()
    } else if (event.key === 'ArrowDown') {
      event.preventDefault()
      setHighlighted((value) => (rows.length === 0 ? 0 : (value + 1) % rows.length))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setHighlighted((value) => (rows.length === 0 ? 0 : (value - 1 + rows.length) % rows.length))
    } else if (event.key === 'Enter') {
      const current = rows[highlighted]
      if (current) activate(current)
    }
  }

  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/25 px-4 pt-16"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
        onKeyDown={handleKeyDown}
        className="border-hairline-strong bg-canvas w-full max-w-xl overflow-hidden rounded-2xl border shadow-[0_32px_80px_-20px_rgba(0,0,0,0.55)]"
      >
        <div className="border-hairline flex items-center gap-2.5 border-b px-4 py-3.5">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            className="text-ink-faint h-4.5 w-4.5 shrink-0"
          >
            <circle cx="11" cy="11" r="7" />
            <path strokeLinecap="round" d="m20 20-3.5-3.5" />
          </svg>
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={isEn ? 'Search documentation...' : 'Tìm kiếm tài liệu...'}
            className="text-ink placeholder:text-ink-faint flex-1 bg-transparent text-sm outline-none"
          />
        </div>

        <div className="max-h-96 overflow-y-auto py-2">
          {isSearching && rows.length === 0 ? (
            <p className="text-ink-muted px-4 py-8 text-center text-sm">
              {isEn ? `No results found for "${trimmedQuery}"` : `Không tìm thấy kết quả cho "${trimmedQuery}"`}
            </p>
          ) : null}

          {!isSearching && rows.length > 0 ? (
            <p className="text-ink-faint px-4 pt-1 pb-2 text-xs font-semibold tracking-wider uppercase">
              {isEn ? 'Recent searches' : 'Tìm kiếm gần đây'}
            </p>
          ) : null}

          {rows.map((row, rowIndex) => (
            <button
              key={`${row.slug}-${row.headingId ?? 'chapter'}`}
              type="button"
              onMouseEnter={() => setHighlighted(rowIndex)}
              onClick={() => activate(row)}
              className={`flex w-full items-start gap-2.5 px-4 py-2.5 text-left transition-colors ${highlighted === rowIndex ? 'bg-accent/10' : 'hover:bg-panel'
                }`}
            >
              <span className="text-ink-faint mt-0.5 font-mono text-sm">#</span>
              <span className="min-w-0 flex-1">
                <span className="text-ink block truncate text-sm font-medium">{row.title}</span>
                <span className="text-ink-faint block truncate text-xs">{row.breadcrumb}</span>
              </span>
            </button>
          ))}
        </div>

        <div className="border-hairline text-ink-faint flex items-center justify-between border-t px-4 py-2.5 text-xs">
          <span>{isEn ? '↑↓ Select · ↵ Open' : '↑↓ Chọn · ↵ Mở'}</span>
          <span>{isEn ? 'Esc Close' : 'Esc Đóng'}</span>
        </div>
      </div>
    </div>,
    document.body,
  )
}
