import type { Chapter } from '../content/types'
import { extractHeadings, type HeadingItem } from './markdown'

export interface SearchEntry {
  type: 'chapter' | 'heading' | 'content'
  slug: string
  chapterTitle: string
  chapterTitleNormalized: string
  headingText?: string
  headingTextNormalized?: string
  headingId?: string
  contentText?: string
  contentTextNormalized?: string
}

export function stripDiacritics(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
}

interface ContentBlock {
  text: string
  headingId?: string
  headingText?: string
}

function stripInlineMarkdown(line: string): string {
  return line
    .replace(/^>+\s?/, '')
    .replace(/^[-*+]\s+/, '')
    .replace(/^\d+\.\s+/, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[`*_#]/g, '')
    .trim()
}

const HEADING_LINE = /^(#{1,6})\s+(.+)$/
const FENCE_LINE = /^```/

function extractContentBlocks(markdown: string, headings: HeadingItem[]): ContentBlock[] {
  const lines = markdown.split('\n')
  const blocks: ContentBlock[] = []
  let headingPointer = 0
  let currentHeading: HeadingItem | undefined
  let inCodeBlock = false

  lines.forEach((rawLine, lineIndex) => {
    while (headingPointer < headings.length && headings[headingPointer].line <= lineIndex) {
      currentHeading = headings[headingPointer]
      headingPointer++
    }

    const trimmed = rawLine.trim()
    if (FENCE_LINE.test(trimmed)) {
      inCodeBlock = !inCodeBlock
      return
    }
    if (inCodeBlock || trimmed === '') return

    const headingMatch = HEADING_LINE.exec(trimmed)
    if (headingMatch && headingMatch[1].length <= 3) return

    const text = stripInlineMarkdown(trimmed)
    if (!text) return

    blocks.push({ text, headingId: currentHeading?.id, headingText: currentHeading?.text })
  })

  return blocks
}

export function buildSearchIndex(chapters: Chapter[], language: 'vi' | 'en'): SearchEntry[] {
  const entries: SearchEntry[] = []

  for (const chapter of chapters) {
    const chapterTitle = language === 'en' ? chapter.titleEn : chapter.title
    entries.push({
      type: 'chapter',
      slug: chapter.slug,
      chapterTitle,
      chapterTitleNormalized: stripDiacritics(chapterTitle),
    })

    const body = language === 'en' ? chapter.body : (chapter.bodyVi ?? chapter.body)
    if (!body) continue

    const headings = extractHeadings(body)
    for (const heading of headings) {
      entries.push({
        type: 'heading',
        slug: chapter.slug,
        chapterTitle,
        chapterTitleNormalized: stripDiacritics(chapterTitle),
        headingText: heading.text,
        headingTextNormalized: stripDiacritics(heading.text),
        headingId: heading.id,
      })
    }

    for (const block of extractContentBlocks(body, headings)) {
      entries.push({
        type: 'content',
        slug: chapter.slug,
        chapterTitle,
        chapterTitleNormalized: stripDiacritics(chapterTitle),
        headingText: block.headingText,
        headingId: block.headingId,
        contentText: block.text,
        contentTextNormalized: stripDiacritics(block.text),
      })
    }
  }

  return entries
}
