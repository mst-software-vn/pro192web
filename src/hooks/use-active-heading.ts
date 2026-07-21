import { useEffect, useRef, useState } from 'react'

// Theo dõi heading nào đang ở đầu vùng đọc để làm nổi bật mục tương ứng trong TOC
// (scroll-spy) — trừ hao chiều cao header sticky (~96px) khi tính vùng "đang đọc".
export function useActiveHeading(ids: string[]): string | null {
  const key = ids.join('|')
  // extractHeadings() tạo mảng mới mỗi lần render — đọc qua ref để effect bên dưới
  // chỉ chạy lại khi tập id thực sự đổi (theo `key`), không phải mỗi lần render.
  const idsRef = useRef(ids)
  idsRef.current = ids
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    const currentIds = idsRef.current
    if (currentIds.length === 0) {
      setActiveId(null)
      return
    }

    const elements = currentIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting)
        if (visible.length === 0) return
        const topmost = visible.reduce((a, b) =>
          a.boundingClientRect.top < b.boundingClientRect.top ? a : b,
        )
        setActiveId(topmost.target.id)
      },
      { rootMargin: '-96px 0px -70% 0px', threshold: 0 },
    )

    elements.forEach((el) => observer.observe(el))
    setActiveId(elements[0].id)

    return () => observer.disconnect()
  }, [key])

  return activeId
}
