import { useParams } from 'react-router-dom'
import { MarkdownContent } from '../components/MarkdownContent'
import { getChapter } from '../content/chapters'
import { useLanguage } from '../hooks/use-language'

export function DocsPage() {
  const { slug } = useParams()
  const chapter = slug ? getChapter(slug) : undefined
  const { language } = useLanguage()

  if (!chapter) {
    return (
      <div className="mx-auto max-w-[760px]">
        <h1 className="text-ink text-3xl font-semibold tracking-tight">Không tìm thấy trang</h1>
        <p className="text-ink-muted mt-3">Chương học bạn tìm không tồn tại.</p>
      </div>
    )
  }

  const wantsVi = language === 'vi'
  const body = wantsVi ? (chapter.bodyVi ?? chapter.body) : chapter.body
  const isFallback = wantsVi && !chapter.bodyVi && Boolean(chapter.body)

  return (
    <article className="mx-auto max-w-[760px]">
      <header className="border-hairline mb-8 border-b pb-8">
        <h1 className="text-ink text-3xl font-semibold tracking-tight sm:text-4xl">{chapter.title}</h1>
        <p className="text-ink-muted mt-3 text-[15px] leading-relaxed">{chapter.description}</p>
      </header>

      {isFallback ? (
        <p className="text-ink-faint mb-6 text-sm italic">
          Bản dịch tiếng Việt đang được cập nhật — hiển thị bản gốc tiếng Anh.
        </p>
      ) : null}

      {body ? (
        <MarkdownContent markdown={body} />
      ) : (
        <div className="border-hairline-strong bg-panel rounded-lg border border-dashed px-6 py-12 text-center">
          <p className="text-ink-muted text-sm">Nội dung chương này đang được biên soạn và sẽ sớm được cập nhật.</p>
        </div>
      )}
    </article>
  )
}
