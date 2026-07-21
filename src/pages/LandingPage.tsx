import { Link } from 'react-router-dom'
import { BlurText } from '../components/BlurText'
import { CodeBlock } from '../components/CodeBlock'
import { RevealOnScroll } from '../components/RevealOnScroll'
import { contentStats, firstChapterSlug } from '../content/chapters'
import { LandingHeader } from '../layout/LandingHeader'

const HERO_CODE = `public class Employee extends Person {
    private double salary;

    public Employee(String name, double salary) {
        super(name);
        this.salary = salary;
    }

    @Override
    public void introduce() {
        System.out.println("Tôi là " + getName() + ", lương " + salary);
    }
}`

// Landing page marketing — theo theme sáng/tối chung của site (không còn cố định sáng).
export function LandingPage() {
  return (
    <div className="bg-canvas min-h-svh">
      <LandingHeader />

      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_0%,var(--color-accent-soft),transparent_60%)] dark:bg-[radial-gradient(circle_at_30%_0%,color-mix(in_srgb,var(--color-accent)_18%,transparent),transparent_60%)]"
        />
        <div
          aria-hidden
          className="border-hairline pointer-events-none absolute inset-0 opacity-[0.4] [background-image:linear-gradient(var(--hairline)_1px,transparent_1px),linear-gradient(90deg,var(--hairline)_1px,transparent_1px)] [background-size:40px_40px] [mask-image:radial-gradient(circle_at_30%_0%,black,transparent_70%)]"
        />

        <div className="relative mx-auto grid max-w-6xl gap-12 px-6 py-24 lg:grid-cols-2 lg:items-center lg:py-32">
          <div>
            <RevealOnScroll>
              <p className="text-ink-muted mb-4 text-sm font-medium tracking-widest uppercase">
                MST Software
              </p>
            </RevealOnScroll>
            <BlurText
              text="Tài liệu học Lập trình Hướng đối tượng với Java"
              tag="h1"
              className="text-ink text-4xl font-semibold tracking-tight sm:text-5xl"
            />
            <RevealOnScroll delay={150}>
              <p className="text-ink-body mt-6 max-w-xl text-lg">
                Giáo trình PRO192 được hệ thống hoá lại: từ nền tảng Java, đóng gói, kế thừa, đa
                hình đến xử lý ngoại lệ — rõ ràng, dễ tra cứu, đúng chuẩn học thuật.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-3">
                <Link
                  to={`/docs/${firstChapterSlug}`}
                  className="bg-accent hover:bg-accent-emphasis rounded-md px-6 py-3 text-sm font-medium text-white transition-colors active:scale-[0.98]"
                >
                  Bắt đầu học
                </Link>
                <a
                  href="#noi-dung"
                  className="border-hairline text-ink-secondary hover:border-hairline-strong hover:bg-panel rounded-md border px-6 py-3 text-sm font-medium transition-colors active:scale-[0.98]"
                >
                  Xem nội dung khoá học
                </a>
              </div>
            </RevealOnScroll>
          </div>

          <RevealOnScroll delay={100} className="lg:justify-self-end">
            <div className="w-full max-w-md lg:max-w-lg">
              <CodeBlock code={HERO_CODE} language="java" />
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <section className="border-hairline border-t px-6 py-10">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 text-center sm:grid-cols-4">
          {[
            { label: 'chương', value: String(contentStats.chapterCount) },
            { label: 'ví dụ code Java', value: String(contentStats.codeBlockCount) },
            {
              label: 'hình minh hoạ',
              value: `${Math.floor(contentStats.imageCount / 50) * 50}+`,
            },
            { label: '', value: 'Song ngữ Việt / English' },
          ].map((stat) => (
            <div key={stat.label || stat.value}>
              <p className="text-accent-on-surface text-2xl font-semibold tracking-tight sm:text-3xl">
                {stat.value}
              </p>
              {stat.label ? <p className="text-ink-muted mt-1 text-sm">{stat.label}</p> : null}
            </div>
          ))}
        </div>
      </section>

      <section className="border-hairline border-t px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <RevealOnScroll>
            <h2 className="text-ink text-2xl font-semibold tracking-tight">Vì sao học tại đây?</h2>
          </RevealOnScroll>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: 'Song ngữ Việt – Anh',
                description: 'Nội dung dịch sang tiếng Việt, giữ nguyên thuật ngữ lập trình chuẩn.',
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-5 w-5">
                    <circle cx="12" cy="12" r="9" />
                    <path strokeLinecap="round" d="M3 12h18M12 3c2.5 2.5 3.8 5.7 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.7-3.8-9s1.3-6.5 3.8-9Z" />
                  </svg>
                ),
              },
              {
                title: 'Code minh hoạ thực tế',
                description: 'Mỗi khái niệm đi kèm ví dụ Java và sơ đồ minh hoạ cụ thể.',
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8 9-4 3 4 3M16 9l4 3-4 3M13 6l-2 12" />
                  </svg>
                ),
              },
              {
                title: 'Miễn phí & mã nguồn mở',
                description: 'Toàn bộ nội dung công khai trên GitHub, tự do tham khảo và đóng góp.',
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v3m0 12v3m9-9h-3M6 12H3m14.5-6.5-2.1 2.1M8.6 15.4l-2.1 2.1m0-11 2.1 2.1m8.8 8.8 2.1 2.1" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                ),
              },
              {
                title: 'Bám sát syllabus PRO192',
                description: 'Cấu trúc chương bám theo syllabus chính thức của môn học.',
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 19.5V6a2 2 0 0 1 2-2h11a1 1 0 0 1 1 1v14.5M6 19.5A1.5 1.5 0 0 1 7.5 18H18M6 19.5A1.5 1.5 0 0 0 7.5 21H18v-3" />
                  </svg>
                ),
              },
            ].map((feature, index) => (
              <RevealOnScroll key={feature.title} delay={index * 80}>
                <div className="border-hairline h-full rounded-lg border p-6">
                  <div className="bg-accent-soft text-accent-on-surface flex h-10 w-10 items-center justify-center rounded-md dark:bg-white/5">
                    {feature.icon}
                  </div>
                  <h3 className="text-ink mt-4 text-base font-semibold">{feature.title}</h3>
                  <p className="text-ink-body mt-1.5 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Chapter grid, Footer — added in later tasks */}
    </div>
  )
}
