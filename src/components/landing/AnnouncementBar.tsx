import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'

const FACEBOOK_URL = 'https://www.facebook.com/mstsoftware.vn'

// Thanh thông báo trên cùng, có thể đóng — trạng thái chỉ tồn tại trong phiên hiện tại
// (không lưu localStorage), khớp hành vi bản thiết kế gốc.
export function AnnouncementBar() {
  const [visible, setVisible] = useState(true)

  return (
    <AnimatePresence initial={false}>
      {visible ? (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="overflow-hidden bg-[linear-gradient(90deg,#1e3a5f,#1e40af)]"
        >
          <div className="relative px-12 py-2.5 text-center text-[13px] text-[#dbeafe]">
            <span className="hidden sm:inline">
              PRO192 is proudly developed by <strong className="font-semibold text-white">MST Software</strong> ·{' '}
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#bfdbfe] underline underline-offset-2"
              >
                Learn more about MST →
              </a>
            </span>
            <span className="sm:hidden">
              PRO192 by MST Software ·{' '}
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#bfdbfe] underline"
              >
                Learn more →
              </a>
            </span>
            <button
              type="button"
              onClick={() => setVisible(false)}
              aria-label="Dismiss"
              className="absolute top-1/2 right-3 -translate-y-1/2 rounded-md px-2 py-1 text-lg leading-none text-[#bfdbfe] transition-colors hover:bg-white/10 hover:text-white"
            >
              ×
            </button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
