export type ChapterStatus = 'published' | 'draft'

export interface Chapter {
  slug: string
  title: string
  description: string
  titleEn: string
  descriptionEn: string
  group: string
  status: ChapterStatus
  body?: string
  bodyVi?: string
}

/** Một nhóm chương cùng chủ đề, hiển thị dưới 1 tiêu đề nhóm trong sidebar */
export interface ChapterGroup {
  name: string
  items: Chapter[]
}

export interface QuizOption {
  /** 'a' | 'b' | 'c' | 'd'... — stable id used for grading, independent of display order */
  id: string
  /** Tiếng Việt — bắt buộc */
  text: string
  /** Bản dịch tiếng Anh — tuỳ chọn, fallback về `text` khi thiếu */
  textEn?: string
}

export interface QuizQuestion {
  id: string
  /** Tiếng Việt — bắt buộc (ngược với Chapter.body: quiz được soạn mới bằng tiếng Việt) */
  question: string
  questionEn?: string
  options: QuizOption[]
  /** 1 phần tử = single-choice (radio), nhiều hơn 1 = multi-choice (checkbox) */
  correctOptionIds: string[]
  explanation: string
  explanationEn?: string
}
