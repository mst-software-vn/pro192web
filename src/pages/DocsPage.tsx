import { useEffect } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { MarkdownContent } from '../components/MarkdownContent'
import { QuizSection } from '../components/quiz/QuizSection'
import { getChapter } from '../content/chapters'
import { LEGACY_SLUG_REDIRECTS } from '../content/legacy-slugs'
import { useLanguage } from '../hooks/use-language'

export function DocsPage() {
  const { slug } = useParams()
  const legacyRedirect = slug ? LEGACY_SLUG_REDIRECTS[slug] : undefined
  const chapter = slug ? getChapter(slug) : undefined
  const { language } = useLanguage()
  const isEn = language === 'en'

  useEffect(() => {
    const title = chapter ? (isEn ? chapter.titleEn : chapter.title) : isEn ? 'Page not found' : 'Không tìm thấy trang'
    document.title = `${title} · PRO192`
  }, [chapter, isEn])

  if (legacyRedirect) {
    return <Navigate to={`/docs/${legacyRedirect}`} replace />
  }

  if (!chapter) {
    return (
      <div className="mx-auto max-w-[760px]">
        <h1 className="text-ink text-3xl font-semibold tracking-tight">
          {isEn ? 'Page not found' : 'Không tìm thấy trang'}
        </h1>
        <p className="text-ink-muted mt-3">
          {isEn ? "The chapter you're looking for doesn't exist." : 'Chương học bạn tìm không tồn tại.'}
        </p>
      </div>
    )
  }

  const wantsVi = language === 'vi'
  const body = wantsVi ? (chapter.bodyVi ?? chapter.body) : chapter.body
  const isFallback = wantsVi && !chapter.bodyVi && Boolean(chapter.body)

  return (
    <article className="mx-auto max-w-[760px]">
      <header className="border-hairline mb-8 border-b pb-8">
        <h1 className="text-ink text-3xl font-semibold tracking-tight sm:text-4xl">
          {isEn ? chapter.titleEn : chapter.title}
        </h1>
        <p className="text-ink-muted mt-3 text-[15px] leading-relaxed">
          {isEn ? chapter.descriptionEn : chapter.description}
        </p>
      </header>

      {chapter.slug === 'welcome' ? (
        <div className="border-accent-on-surface/20 bg-accent-on-surface/8 mb-8 flex flex-col items-start gap-4 rounded-xl border px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative h-10 w-11 shrink-0">
              <div className="border-hairline-strong bg-canvas absolute top-1 left-0 h-9.5 w-7.5 rotate-[-8deg] rounded-[4px] border" />
              <div className="border-hairline-strong bg-canvas absolute top-0.5 left-1.75 h-9.5 w-7.5 rotate-[4deg] rounded-[4px] border" />
              <div className="bg-accent border-accent absolute top-0 left-3.5 flex h-9.5 w-7.5 items-end justify-center rounded-[4px] border pb-1">
                <span className="text-[6px] font-bold tracking-wide text-white">PDF</span>
              </div>
            </div>
            <div>
              <p className="text-ink text-sm font-semibold">
                {isEn ? 'Download all course materials' : 'Tải toàn bộ tài liệu khoá học'}
              </p>
              <p className="text-ink-muted mt-1 text-sm">
                {isEn ? '11 chapters · PDF · offline-ready' : '11 chương · PDF · đọc offline'}
              </p>
            </div>
          </div>
          <a
            href="/downloads/pro192-course-pdfs.zip"
            download
            className="bg-accent hover:bg-accent-emphasis inline-flex shrink-0 items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-white transition-colors"
          >
            {isEn ? 'Download' : 'Tải xuống'}
          </a>
        </div>
      ) : null}

      {isFallback ? (
        <p className="text-ink-faint mb-6 text-sm italic">
          Bản dịch tiếng Việt đang được cập nhật — hiển thị bản gốc tiếng Anh.
        </p>
      ) : null}

      {body ? (
        <MarkdownContent markdown={body} />
      ) : (
        <div className="border-hairline-strong bg-panel rounded-lg border border-dashed px-6 py-12 text-center">
          <p className="text-ink-muted text-sm">
            {isEn
              ? "This chapter's content is being prepared and will be updated soon."
              : 'Nội dung chương này đang được biên soạn và sẽ sớm được cập nhật.'}
          </p>
        </div>
      )}

      <QuizSection key={chapter.slug} slug={chapter.slug} />
    </article>
  )
}
