import { slugify } from './slugify'

export interface HeadingItem {
  id: string
  text: string
  depth: 2 | 3
  line: number
}

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

export function countCodeBlocks(markdown: string): number {
  const fenceCount = (markdown.match(/^```/gm) ?? []).length
  return Math.floor(fenceCount / 2)
}

export function countImages(markdown: string): number {
  return (markdown.match(/!\[[^\]]*\]\([^)]+\)/g) ?? []).length
}
