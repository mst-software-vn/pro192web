import { slugify } from './slugify'

export interface HeadingItem {
  id: string
  text: string
  depth: 2 | 3
}

// Chỉ lấy H2/H3 cho mục lục "On this page" — H4 trở xuống quá chi tiết để liệt kê.
// Id sinh ra ở đây phải khớp id do MarkdownContent gắn cho heading khi render.
export function extractHeadings(markdown: string): HeadingItem[] {
  const seen = new Map<string, number>()
  const headings: HeadingItem[] = []

  for (const rawLine of markdown.split('\n')) {
    const match = /^(#{2,3})\s+(.+)$/.exec(rawLine.trim())
    if (!match) continue

    const depth = match[1].length as 2 | 3
    const text = match[2].replace(/[`*_]/g, '').trim()
    const baseId = slugify(text)
    const occurrence = seen.get(baseId) ?? 0
    seen.set(baseId, occurrence + 1)
    const id = occurrence > 0 ? `${baseId}-${occurrence}` : baseId

    headings.push({ id, text, depth })
  }

  return headings
}
