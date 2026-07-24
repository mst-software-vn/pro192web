import { Link } from 'react-router-dom'
import { chapters } from '../../data/chapters'

const GITHUB_URL = 'https://github.com/mst-software-vn/pro192web'
const FACEBOOK_URL = 'https://www.facebook.com/mstsoftware.vn'

function GithubIcon({ size = 19 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
      />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z" />
    </svg>
  )
}

const footLinkClassName = 'block text-sm text-(--landing-foot-link) transition-colors hover:text-(--landing-foot-link-hover)'

export function SiteFooter() {
  const basicChapters = chapters.slice(0, 6)
  const advancedChapters = chapters.slice(6)

  return (
    <footer className="border-t border-white/4 bg-(--landing-foot-bg)">
      <div className="mx-auto max-w-310 px-6 pt-14 pb-8 sm:px-10">
        <div className="grid grid-cols-1 gap-10 border-b border-(--landing-foot-border) pb-10 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div>
            <div className="mb-4 flex items-center gap-2.5">
              <div className="flex h-7.5 w-7.5 items-center justify-center rounded-md bg-(--landing-accent-strong) text-[15px] font-extrabold text-white">
                P
              </div>
              <span className="text-[20px] font-extrabold tracking-tight">PRO192</span>
            </div>
            <p className="mb-1 text-sm font-semibold text-(--landing-muted)">Java Object-Oriented Programming</p>
            <p className="mb-5 max-w-70 text-[13px] leading-relaxed text-(--landing-dim)">
              A free learning platform for FPT University students.
            </p>
            <div className="flex items-center gap-3">
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.75 rounded-full border border-(--landing-foot-border) px-3 py-1.5 text-[12.5px] font-semibold text-(--landing-foot-link) transition-colors hover:border-(--landing-accent) hover:text-(--landing-foot-link-hover)"
              >
                MST Software
              </a>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="text-(--landing-foot-link) transition-colors hover:text-(--landing-foot-link-hover)"
              >
                <GithubIcon />
              </a>
            </div>
          </div>

          <div>
            <p className="mb-3.5 text-[11px] font-semibold tracking-widest text-[#6b7280] uppercase">Chương học</p>
            <div className="flex flex-col gap-2.5">
              {basicChapters.map((chapter) => (
                <Link key={chapter.id} to={`/docs/${chapter.slug}`} className={footLinkClassName}>
                  {chapter.name}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3.5 text-[11px] font-semibold tracking-widest text-[#6b7280] uppercase">Nâng cao</p>
            <div className="flex flex-col gap-2.5">
              {advancedChapters.map((chapter) => (
                <Link key={chapter.id} to={`/docs/${chapter.slug}`} className={footLinkClassName}>
                  {chapter.name}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3.5 text-[11px] font-semibold tracking-widest text-[#6b7280] uppercase">Tài nguyên</p>
            <div className="flex flex-col gap-2.5">
              <Link to="/docs" className={footLinkClassName}>
                Docs
              </Link>
              <Link to="/syllabus-pro192-spring2021" className={footLinkClassName}>
                Giáo trình
              </Link>
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className={footLinkClassName}>
                GitHub Repository
              </a>
              <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className={footLinkClassName}>
                MST Software
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3.5 pt-6 text-[13px] text-[#6b7280] sm:flex-row sm:justify-between">
          <span>© 2026 MST Software · All rights reserved.</span>
          <span>Built for FPT University students</span>
          <div className="flex items-center gap-3.5">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-(--landing-foot-link) transition-colors hover:text-(--landing-foot-link-hover)"
            >
              <GithubIcon size={18} />
            </a>
            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="text-(--landing-foot-link) transition-colors hover:text-(--landing-foot-link-hover)"
            >
              <FacebookIcon />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
