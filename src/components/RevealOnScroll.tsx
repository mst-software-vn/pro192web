import type { ReactNode } from 'react'
import { useScrollReveal } from '../hooks/use-scroll-reveal'

interface RevealOnScrollProps {
  children: ReactNode
  /** Độ trễ (ms) — dùng để tạo hiệu ứng xuất hiện so le (staggered) cho danh sách */
  delay?: number
  className?: string
}

export function RevealOnScroll({ children, delay = 0, className }: RevealOnScrollProps) {
  const { ref, visible } = useScrollReveal<HTMLDivElement>()

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
      } ${className ?? ''}`}
      style={{ transitionDelay: visible ? `${delay}ms` : '0ms' }}
    >
      {children}
    </div>
  )
}
