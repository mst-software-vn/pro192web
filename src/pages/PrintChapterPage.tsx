import { useParams } from 'react-router-dom'
import { MarkdownContent } from '../components/MarkdownContent'
import { getChapter } from '../content/chapters'

export function PrintChapterPage() {
  const { slug } = useParams()
  const chapter = slug ? getChapter(slug) : undefined

  if (!chapter || !chapter.body) return null

  return (
    <div className="bg-canvas mx-auto max-w-[760px] px-10 py-10">
      <header className="border-hairline mb-8 border-b pb-6">
        <div className="mb-4 flex items-center gap-2">
          <img src="/images/logo-transparent.png" alt="PRO192" className="h-8" />
          <span className="text-ink-faint text-sm font-medium">PRO192 · {chapter.titleEn}</span>
        </div>
        <h1 className="text-ink text-3xl font-semibold tracking-tight">{chapter.titleEn}</h1>
        <p className="text-ink-muted mt-3 text-[15px] leading-relaxed">{chapter.descriptionEn}</p>
      </header>

      <MarkdownContent markdown={chapter.body} />
    </div>
  )
}
