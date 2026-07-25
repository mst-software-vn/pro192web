import { useState } from 'react'
import { useLanguage } from '../hooks/use-language'

type Rating = 'yes' | 'no'

const OPTIONS_VI = [
  'Hướng dẫn hoạt động đúng như mong đợi',
  'Dễ dàng tìm thấy thông tin cần thiết',
  'Dễ hiểu về nội dung và tính năng',
  'Tài liệu được cập nhật đầy đủ',
  'Khác',
]

const OPTIONS_EN = [
  'The guide worked as expected',
  'It was easy to find the information I needed',
  'It was easy to understand the product and features',
  'The documentation is up to date',
  'Something else',
]

function ThumbsUpIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 shrink-0"
    >
      <path d="M7 10v12" />
      <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
    </svg>
  )
}

function ThumbsDownIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 shrink-0"
    >
      <path d="M17 14V2" />
      <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z" />
    </svg>
  )
}

// Widget feedback kiểu tài liệu quốc tế (Mintlify/GitBook...) — chỉ để giống UI cho
// quen thuộc, KHÔNG gửi dữ liệu đi đâu cả (không có backend thu thập feedback nào),
// "Submit" chỉ đổi UI state tại chỗ. Cố ý KHÔNG lưu localStorage theo đúng yêu cầu —
// reload trang là quay lại trạng thái ban đầu, không nhớ đã từng trả lời.
export function PageFeedback() {
  const { language } = useLanguage()
  const isEn = language === 'en'
  const options = isEn ? OPTIONS_EN : OPTIONS_VI

  const [rating, setRating] = useState<Rating | null>(null)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  function handleCancel() {
    setRating(null)
    setSelectedOption(null)
  }

  if (submitted) {
    return (
      <div className="border-hairline mt-16 border-t pt-8">
        <p className="text-ink-muted text-sm">{isEn ? 'Thank you for your feedback!' : 'Cảm ơn phản hồi của bạn!'}</p>
      </div>
    )
  }

  return (
    <div className="border-hairline mt-16 border-t pt-8">
      <div className="flex items-center justify-between gap-4">
        <p className="text-ink-body text-sm">{isEn ? 'Was this page helpful?' : 'Trang này có hữu ích không?'}</p>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => setRating('yes')}
            className={`flex items-center gap-1.5 rounded-md border px-3.5 py-1.5 text-sm font-medium transition-colors ${
              rating === 'yes'
                ? 'border-accent-on-surface text-accent-on-surface'
                : 'border-hairline-strong text-ink-muted hover:text-ink hover:border-ink-faint'
            }`}
          >
            <ThumbsUpIcon />
            {isEn ? 'Yes' : 'Có'}
          </button>
          <button
            type="button"
            onClick={() => setRating('no')}
            className={`flex items-center gap-1.5 rounded-md border px-3.5 py-1.5 text-sm font-medium transition-colors ${
              rating === 'no'
                ? 'border-accent-on-surface text-accent-on-surface'
                : 'border-hairline-strong text-ink-muted hover:text-ink hover:border-ink-faint'
            }`}
          >
            <ThumbsDownIcon />
            {isEn ? 'No' : 'Không'}
          </button>
        </div>
      </div>

      {rating ? (
        <div className="border-hairline mt-6 border-t pt-6">
          <p className="text-ink mb-3 text-[15px] font-medium">
            {isEn ? 'Great! What worked best for you?' : 'Tuyệt! Điều gì hữu ích nhất với bạn?'}
          </p>
          <div className="mb-5 flex flex-col gap-2.5">
            {options.map((option) => (
              <label key={option} className="text-ink-body flex cursor-pointer items-center gap-2.5 text-sm">
                <input
                  type="radio"
                  name="page-feedback-option"
                  checked={selectedOption === option}
                  onChange={() => setSelectedOption(option)}
                  className="accent-(--accent-on-surface) h-4 w-4 shrink-0"
                />
                {option}
              </label>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCancel}
              className="border-hairline-strong text-ink-secondary hover:bg-panel rounded-md border px-4 py-2 text-sm font-medium transition-colors"
            >
              {isEn ? 'Cancel' : 'Huỷ'}
            </button>
            <button
              type="button"
              onClick={() => setSubmitted(true)}
              disabled={!selectedOption}
              className="bg-accent hover:bg-accent-emphasis disabled:bg-well disabled:text-ink-faint rounded-md px-4 py-2 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed"
            >
              {isEn ? 'Submit feedback' : 'Gửi phản hồi'}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
