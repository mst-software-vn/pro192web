import { motion, type Variants } from 'motion/react'
import { Link } from 'react-router-dom'
import { chapters } from '../../data/chapters'

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
  },
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
}

export function ChapterGrid() {
  return (
    <section id="chapters" className="mx-auto max-w-310 px-6 py-5 sm:px-10 sm:pb-22">
      <div className="mb-6.5 flex items-baseline justify-between">
        <h2 className="text-[15px] font-semibold tracking-[0.04em] text-(--landing-dim) uppercase">
          Course chapters
        </h2>
        <span className="font-mono text-[13px] text-(--landing-faint)">11 chapters</span>
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {chapters.map((chapter) => (
          <motion.div key={chapter.id} variants={cardVariants}>
            <Link
              to={`/docs/${chapter.slug}`}
              className="group relative block min-h-35 overflow-hidden rounded-3.5 border border-(--landing-card-border) bg-(--landing-card) p-5 backdrop-blur-sm transition-[border-color,box-shadow] duration-200 hover:border-(--landing-card-border-hover) hover:shadow-[0_0_0_1px_rgba(59,130,246,0.4),0_8px_32px_rgba(59,130,246,0.15)]"
            >
              <span className="absolute inset-x-0 top-0 h-0.5 bg-[linear-gradient(90deg,#3b82f6,#6366f1)] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
              <span className="pointer-events-none absolute top-2.5 right-4.5 font-sans text-5xl leading-none font-extrabold text-(--landing-chap-num) transition-opacity duration-200 group-hover:opacity-30">
                {String(chapter.id).padStart(2, '0')}
              </span>
              <span className="relative mt-1.5 block text-[18px] font-bold">{chapter.name}</span>
              <span className="absolute bottom-4.5 left-5 inline-flex items-center rounded-full bg-(--landing-accent)/12 px-2.5 py-1 text-[11px] font-semibold tracking-[0.03em] text-[#60a5fa]">
                {chapter.tag}
              </span>

              <span className="absolute inset-0 flex translate-y-full items-end bg-[#080b14]/85 p-5 opacity-0 backdrop-blur-sm transition-[transform,opacity] duration-250 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-y-0 group-hover:opacity-100">
                <span className="text-[13px] leading-[1.55] text-[#cbd5e1] text-pretty">{chapter.description}</span>
              </span>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
