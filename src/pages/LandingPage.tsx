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

      {/* Features, chapter grid, Footer — added in later tasks */}
    </div>
  )
}
