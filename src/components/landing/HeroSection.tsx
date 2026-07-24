import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { CodeBlock } from './CodeBlock'

function FptBadgeIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 40 40" aria-hidden>
      <circle cx="20" cy="20" r="19" fill="#F37022" />
      <text x="20" y="27" fontSize="20" fontWeight="800" fill="#fff" textAnchor="middle" fontFamily="inherit">
        f
      </text>
    </svg>
  )
}

export function HeroSection() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="relative mx-auto grid max-w-310 grid-cols-1 items-center gap-8 px-6 py-9 sm:px-10 sm:py-13 lg:grid-cols-[1.05fr_1.15fr] lg:gap-14 lg:py-20"
    >
      <div>
        <div className="mb-6.5 ml-2 inline-flex items-center gap-2.5 rounded-lg border border-[#F37022]/30 bg-[#F37022]/6 px-3 py-1.5">
          <FptBadgeIcon />
          <div className="flex flex-col leading-tight">
            <span className="text-[12.5px] font-bold text-[#F37022]">FPT University</span>
            <span className="text-[10.5px] text-(--landing-dim)">Dành cho sinh viên Đại học FPT</span>
          </div>
        </div>

        <h1 className="mb-5.5 text-[40px] leading-[1.04] font-extrabold tracking-tight text-balance sm:text-[60px]">
          Master
          <br />
          Object-Oriented
          <br />
          Programming
        </h1>

        <p className="mb-9 max-w-110 text-[17.5px] leading-relaxed text-(--landing-muted)">
          A focused, hands-on Java course for FPT University students. Learn OOP the way real engineers write it.
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <Link
            to="/docs/chao-mung"
            className="inline-flex items-center gap-2 rounded-lg bg-(--landing-accent-strong) px-6 py-3.25 text-[15px] font-semibold text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-colors hover:bg-accent-emphasis"
          >
            Bắt đầu học <span className="text-[17px]">→</span>
          </Link>
          <a
            href="#chapters"
            className="inline-flex items-center rounded-lg border border-(--landing-border-strong) px-5.5 py-3.25 text-[15px] font-medium transition-colors hover:border-(--landing-dim)"
          >
            View chapters
          </a>
        </div>
      </div>

      <CodeBlock />
    </motion.section>
  )
}
