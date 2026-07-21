import { useEffect, useRef, useState } from 'react'

// Hiệu ứng fade-in khi phần tử cuộn vào khung nhìn — dùng IntersectionObserver
// (không nghe sự kiện scroll), tôn trọng prefers-reduced-motion, đúng theo minimalist-ui.
export function useScrollReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return { ref, visible }
}
