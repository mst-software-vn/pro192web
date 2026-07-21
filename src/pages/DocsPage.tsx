import { useParams } from 'react-router-dom'
import { MarkdownContent } from '../components/MarkdownContent'
import { getChapter } from '../content/chapters'

export function DocsPage() {
  const { slug } = useParams()
  const chapter = slug ? getChapter(slug) : undefined

  if (!chapter) {
    return (
      <div className="mx-auto max-w-[760px]">
        <h1 className="text-3xl font-semibold tracking-tight text-white">Không tìm thấy trang</h1>
        <p className="mt-3 text-neutral-400">Chương học bạn tìm không tồn tại.</p>
      </div>
    )
  }

  return (
    <article className="mx-auto max-w-[760px]">
      <header className="mb-8 border-b border-neutral-800 pb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          {chapter.title}
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-neutral-400">{chapter.description}</p>
      </header>

      {chapter.body ? (
        <MarkdownContent markdown={chapter.body} />
      ) : (
        <div className="rounded-lg border border-dashed border-neutral-700 bg-neutral-900 px-6 py-12 text-center">
          <p className="text-sm text-neutral-400">
            Nội dung chương này đang được biên soạn và sẽ sớm được cập nhật.
          </p>
        </div>
      )}
    </article>
  )
}
