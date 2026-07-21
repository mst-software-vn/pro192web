import { useParams } from 'react-router-dom'
import { MarkdownContent } from '../components/MarkdownContent'
import { getChapter } from '../content/chapters'

export function DocsPage() {
  const { slug } = useParams()
  const chapter = slug ? getChapter(slug) : undefined

  if (!chapter) {
    return (
      <div className="mx-auto max-w-[760px]">
        <h1 className="text-ink text-3xl font-semibold tracking-tight">Không tìm thấy trang</h1>
        <p className="text-ink-muted mt-3">Chương học bạn tìm không tồn tại.</p>
      </div>
    )
  }

  return (
    <article className="mx-auto max-w-[760px]">
      <header className="border-hairline mb-8 border-b pb-8">
        <h1 className="text-ink text-3xl font-semibold tracking-tight sm:text-4xl">{chapter.title}</h1>
        <p className="text-ink-muted mt-3 text-[15px] leading-relaxed">{chapter.description}</p>
      </header>

      {chapter.body ? (
        <MarkdownContent markdown={chapter.body} />
      ) : (
        <div className="border-hairline-strong bg-panel rounded-lg border border-dashed px-6 py-12 text-center">
          <p className="text-ink-muted text-sm">Nội dung chương này đang được biên soạn và sẽ sớm được cập nhật.</p>
        </div>
      )}
    </article>
  )
}
