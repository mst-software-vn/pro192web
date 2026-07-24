import { describe, expect, it } from 'vitest'
import type { Chapter } from '../content/types'
import { buildSearchIndex, stripDiacritics } from './search-index'

function makeChapter(overrides: Partial<Chapter> = {}): Chapter {
  return {
    slug: 'test-chapter',
    title: 'Chương thử',
    description: 'Mô tả',
    titleEn: 'Test Chapter',
    descriptionEn: 'Description',
    group: 'Test',
    status: 'published',
    body: '## Heading One\n\nSome text.\n\n### Heading Two\n\nMore text.',
    bodyVi: '## Tiêu đề một\n\nVăn bản.\n\n### Tiêu đề hai\n\nVăn bản khác.',
    ...overrides,
  }
}

describe('stripDiacritics', () => {
  it('removes vietnamese diacritics and lowercases', () => {
    expect(stripDiacritics('Giá trị')).toBe('gia tri')
  })

  it('handles đ/Đ specially since unicode NFD does not decompose it', () => {
    expect(stripDiacritics('Đóng gói')).toBe('dong goi')
  })

  it('leaves plain ascii text unchanged apart from lowercasing', () => {
    expect(stripDiacritics('Constructor')).toBe('constructor')
  })
})

describe('buildSearchIndex', () => {
  it('produces one chapter entry and one heading entry per heading, in vietnamese', () => {
    const index = buildSearchIndex([makeChapter()], 'vi')

    expect(index).toHaveLength(3)
    expect(index[0]).toMatchObject({ type: 'chapter', slug: 'test-chapter', chapterTitle: 'Chương thử' })
    expect(index[1]).toMatchObject({ type: 'heading', slug: 'test-chapter', headingText: 'Tiêu đề một', headingId: 'tieu-e-mot' })
    expect(index[2]).toMatchObject({ type: 'heading', slug: 'test-chapter', headingText: 'Tiêu đề hai', headingId: 'tieu-e-hai' })
  })

  it('uses the english body and title when language is en', () => {
    const index = buildSearchIndex([makeChapter()], 'en')

    expect(index[0].chapterTitle).toBe('Test Chapter')
    expect(index[1].headingText).toBe('Heading One')
  })

  it('produces only a chapter entry for a chapter with no body at all', () => {
    const index = buildSearchIndex([makeChapter({ body: undefined, bodyVi: undefined })], 'vi')

    expect(index).toHaveLength(1)
    expect(index[0].type).toBe('chapter')
  })

  it('falls back to the english body when bodyVi is missing, in vi mode', () => {
    const index = buildSearchIndex([makeChapter({ bodyVi: undefined })], 'vi')

    expect(index[1].headingText).toBe('Heading One')
  })

  it('populates normalized fields with diacritics stripped', () => {
    const index = buildSearchIndex([makeChapter()], 'vi')

    expect(index[0].chapterTitleNormalized).toBe('chuong thu')
    expect(index[1].headingTextNormalized).toBe('tieu de mot')
  })
})
