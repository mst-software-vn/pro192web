import { motion, type Easing } from 'motion/react'
import { useEffect, useMemo, useRef, useState, type Ref } from 'react'

// Vendored & ported to TypeScript từ react-bits (BlurText, biến thể JS-TW) — giữ nguyên
// logic animation gốc, chỉ thêm kiểu dữ liệu. Nguồn: reactbits.dev — MIT + Commons Clause
// (dùng làm 1 phần của website được phép; không bán lại/redistribute component riêng lẻ).
// https://github.com/DavidHDev/react-bits/blob/main/src/content/TextAnimations/BlurText/BlurText.jsx

type AnimationSnapshot = Record<string, string | number>

function buildKeyframes(
  from: AnimationSnapshot,
  steps: AnimationSnapshot[],
): Record<string, Array<string | number>> {
  const keys = new Set([...Object.keys(from), ...steps.flatMap((step) => Object.keys(step))])

  const keyframes: Record<string, Array<string | number>> = {}
  keys.forEach((key) => {
    keyframes[key] = [from[key], ...steps.map((step) => step[key])]
  })
  return keyframes
}

interface BlurTextProps {
  text?: string
  delay?: number
  className?: string
  animateBy?: 'words' | 'chars'
  direction?: 'top' | 'bottom'
  threshold?: number
  rootMargin?: string
  animationFrom?: AnimationSnapshot
  animationTo?: AnimationSnapshot[]
  easing?: Easing
  onAnimationComplete?: () => void
  stepDuration?: number
  /** Thẻ HTML bọc ngoài — mặc định 'p' như bản gốc; đổi 'h1' khi dùng làm tiêu đề trang
   * để giữ đúng ngữ nghĩa heading (bản gốc hard-code <p>, không có tuỳ chọn này). */
  tag?: 'p' | 'h1' | 'h2' | 'h3' | 'span'
}

export function BlurText({
  text = '',
  delay = 200,
  className = '',
  animateBy = 'words',
  direction = 'top',
  threshold = 0.1,
  rootMargin = '0px',
  animationFrom,
  animationTo,
  easing,
  onAnimationComplete,
  stepDuration = 0.35,
  tag: Tag = 'p',
}: BlurTextProps) {
  const elements = animateBy === 'words' ? text.split(' ') : text.split('')
  const [inView, setInView] = useState(false)
  const ref = useRef<HTMLElement>(null)

  // Tôn trọng prefers-reduced-motion (nhất quán với RevealOnScroll) — hiện chữ ngay,
  // bỏ qua hiệu ứng mờ dần cho người dùng đã tắt hiệu ứng chuyển động ở hệ điều hành.
  useEffect(() => {
    if (!ref.current) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setInView(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.unobserve(ref.current as HTMLElement)
        }
      },
      { threshold, rootMargin },
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold, rootMargin])

  const defaultFrom = useMemo<AnimationSnapshot>(
    () =>
      direction === 'top'
        ? { filter: 'blur(10px)', opacity: 0, y: -50 }
        : { filter: 'blur(10px)', opacity: 0, y: 50 },
    [direction],
  )

  const defaultTo = useMemo<AnimationSnapshot[]>(
    () => [
      { filter: 'blur(5px)', opacity: 0.5, y: direction === 'top' ? 5 : -5 },
      { filter: 'blur(0px)', opacity: 1, y: 0 },
    ],
    [direction],
  )

  const fromSnapshot = animationFrom ?? defaultFrom
  const toSnapshots = animationTo ?? defaultTo

  const stepCount = toSnapshots.length + 1
  const totalDuration = stepDuration * (stepCount - 1)
  const times = Array.from({ length: stepCount }, (_, i) => (stepCount === 1 ? 0 : i / (stepCount - 1)))

  return (
    <Tag
      // `ref` chỉ dùng để observe kích thước/vị trí (IntersectionObserver) — an toàn khi
      // dùng chung cho mọi thẻ HTML, TypeScript không tự suy luận được với tag động.
      ref={ref as Ref<HTMLParagraphElement>}
      className={className}
      style={{ display: 'flex', flexWrap: 'wrap' }}
    >
      {elements.map((segment, index) => {
        const animateKeyframes = buildKeyframes(fromSnapshot, toSnapshots)

        return (
          <motion.span
            className="inline-block will-change-[transform,filter,opacity]"
            key={index}
            initial={fromSnapshot}
            animate={inView ? animateKeyframes : fromSnapshot}
            transition={{
              duration: totalDuration,
              times,
              delay: (index * delay) / 1000,
              ease: easing,
            }}
            onAnimationComplete={index === elements.length - 1 ? onAnimationComplete : undefined}
          >
            {segment === ' ' ? ' ' : segment}
            {animateBy === 'words' && index < elements.length - 1 && ' '}
          </motion.span>
        )
      })}
    </Tag>
  )
}
