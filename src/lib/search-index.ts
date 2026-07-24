import type { Chapter } from '../content/types'
import { extractHeadings } from './markdown'

export interface SearchEntry {
  type: 'chapter' | 'heading'
  slug: string
  chapterTitle: string
  chapterTitleNormalized: string
  headingText?: string
  headingTextNormalized?: string
  headingId?: string
}

// Bỏ dấu tiếng Việt để so khớp không phân biệt có/không gõ dấu (vd "gia tri" khớp
// "giá trị"). NFD không tách được "đ"/"Đ" (không phải chữ cái + dấu kết hợp trong
// Unicode) nên phải xử lý riêng.
export function stripDiacritics(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
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

    for (const heading of extractHeadings(body)) {
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
  }

  return entries
}
