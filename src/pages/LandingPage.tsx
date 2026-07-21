import { Link } from 'react-router-dom'
import { BlurText } from '../components/BlurText'
import { RevealOnScroll } from '../components/RevealOnScroll'
import { chapters, firstChapterSlug } from '../content/chapters'

// Landing page marketing — nền sáng, tách biệt hoàn toàn với khu vực Docs (nền tối).
export function LandingPage() {
  return (
    <div className="min-h-svh bg-white">
      <header className="border-b border-neutral-200">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <span className="text-[15px] font-semibold tracking-tight text-neutral-900">
            PRO192 <span className="text-accent">·</span> Java Edition
          </span>
          <Link
            to={`/docs/${firstChapterSlug}`}
            className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-700 active:scale-[0.98]"
          >
            Docs
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,var(--color-accent-soft),transparent_60%)]"
        />
        <div className="relative mx-auto max-w-3xl px-6 py-28 text-center sm:py-36">
          <RevealOnScroll>
            <p className="mb-4 text-sm font-medium tracking-widest text-neutral-500 uppercase">
              MST Software
            </p>
          </RevealOnScroll>
          <BlurText
            text="Tài liệu học Lập trình Hướng đối tượng với Java"
            tag="h1"
            className="justify-center text-4xl font-semibold tracking-tight text-neutral-900 sm:text-6xl"
          />
          <RevealOnScroll delay={150}>
            <p className="mx-auto mt-6 max-w-xl text-lg text-neutral-600">
              Giáo trình PRO192 được hệ thống hoá lại: từ nền tảng Java, đóng gói, kế thừa, đa hình
              đến xử lý ngoại lệ — rõ ràng, dễ tra cứu, đúng chuẩn học thuật.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Link
                to={`/docs/${firstChapterSlug}`}
                className="rounded-md bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-700 active:scale-[0.98]"
              >
                Bắt đầu học
              </Link>
              <a
                href="#noi-dung"
                className="rounded-md border border-neutral-300 px-6 py-3 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-400 hover:bg-neutral-50 active:scale-[0.98]"
              >
                Xem nội dung khoá học
              </a>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <section id="noi-dung" className="border-t border-neutral-200 px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <RevealOnScroll>
            <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">
              Nội dung khoá học
            </h2>
            <p className="mt-2 max-w-2xl text-neutral-600">
              11 chương bám sát chương trình PRO192, đi từ khái niệm nền tảng đến các chủ đề nâng
              cao của lập trình hướng đối tượng.
            </p>
          </RevealOnScroll>

          <ol className="mt-10 grid gap-px overflow-hidden rounded-lg border border-neutral-200 bg-neutral-200 sm:grid-cols-2">
            {chapters.map((chapter, index) => (
              <li key={chapter.slug} className="bg-white">
                <RevealOnScroll delay={(index % 2) * 80}>
                  <Link
                    to={`/docs/${chapter.slug}`}
                    className="group block p-6 transition-colors hover:bg-neutral-50"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="font-mono text-sm text-neutral-400">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      {chapter.status === 'draft' ? (
                        <span className="shrink-0 rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-medium tracking-wide text-neutral-500 uppercase">
                          Sắp ra mắt
                        </span>
                      ) : null}
                    </div>
                    <h3 className="mt-3 text-base font-semibold text-neutral-900 group-hover:text-accent">
                      {chapter.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-neutral-600">
                      {chapter.description}
                    </p>
                  </Link>
                </RevealOnScroll>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <footer className="border-t border-neutral-200 px-6 py-10 text-center text-sm text-neutral-500">
        © 2026 MST Software · Tài liệu học Java OOP (PRO192)
      </footer>
    </div>
  )
}
