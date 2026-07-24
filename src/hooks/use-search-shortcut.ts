import { useEffect } from 'react'

// Lắng nghe ⌘K (macOS) / Ctrl+K (Windows/Linux) trong toàn bộ cửa sổ — dùng
// preventDefault() vì một số trình duyệt tự có hành vi riêng cho tổ hợp phím này
// (vd focus vào address bar), nếu không sẽ xung đột với việc mở modal tìm kiếm.
export function useSearchShortcut(onTrigger: () => void): void {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const isShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k'
      if (!isShortcut) return
      event.preventDefault()
      onTrigger()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onTrigger])
}
