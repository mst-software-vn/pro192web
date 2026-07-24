import { describe, expect, it } from 'vitest'
import { countCodeBlocks, countImages } from './markdown'

describe('countCodeBlocks', () => {
  it('returns 0 when there are no fenced code blocks', () => {
    expect(countCodeBlocks('Just some text.\n\nAnother paragraph.')).toBe(0)
  })

  it('counts a single fenced code block as 1', () => {
    const markdown = 'Some text\n\n```java\nint x = 1;\n```\n\nMore text.'
    expect(countCodeBlocks(markdown)).toBe(1)
  })

  it('counts multiple fenced code blocks', () => {
    const markdown = '```java\nint x = 1;\n```\n\ntext\n\n```java\nint y = 2;\n```\n\n```\nplain\n```'
    expect(countCodeBlocks(markdown)).toBe(3)
  })
})

describe('countImages', () => {
  it('returns 0 when there are no images', () => {
    expect(countImages('Just some text with a [link](https://example.com).')).toBe(0)
  })

  it('counts a single markdown image', () => {
    expect(countImages('![alt text](/images/foo/1.jpg "caption")')).toBe(1)
  })

  it('counts multiple markdown images and ignores plain links', () => {
    const markdown = '![one](/a.jpg)\n\n[not an image](/b.jpg)\n\n![two](/c.jpg)'
    expect(countImages(markdown)).toBe(2)
  })
})
