import { slugify } from './slugify'

export interface HeadingItem {
  id: string
  text: string
  depth: 2 | 3
  line: number
}

// Chỉ lấy H2/H3 cho mục lục "On this page" — H4 trở xuống quá chi tiết để liệt kê.
// Id sinh ra ở đây phải khớp id do MarkdownContent gắn cho heading khi render.
export function extractHeadings(markdown: string): HeadingItem[] {
  const seen = new Map<string, number>()
  const headings: HeadingItem[] = []
  const lines = markdown.split('\n')

  lines.forEach((rawLine, line) => {
    const match = /^(#{2,3})\s+(.+)$/.exec(rawLine.trim())
    if (!match) return

    const depth = match[1].length as 2 | 3
    const text = match[2].replace(/[`*_]/g, '').trim()
    const baseId = slugify(text)
    const occurrence = seen.get(baseId) ?? 0
    seen.set(baseId, occurrence + 1)
    const id = occurrence > 0 ? `${baseId}-${occurrence}` : baseId

    headings.push({ id, text, depth, line })
  })

  return headings
}

// Đếm số khối code (```...```) và số ảnh (![alt](src)) trong 1 chương — dùng cho số
// liệu thống kê ở Landing, tính động từ nội dung thật thay vì hardcode.
export function countCodeBlocks(markdown: string): number {
  const fenceCount = (markdown.match(/^```/gm) ?? []).length
  return Math.floor(fenceCount / 2)
}

export function countImages(markdown: string): number {
  return (markdown.match(/!\[[^\]]*\]\([^)]+\)/g) ?? []).length
}
