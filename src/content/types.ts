// Kiểu dữ liệu cho hệ thống nội dung docs — tách hoàn toàn khỏi UI.
// Mỗi chương học là một mục trong sidebar; nội dung thân bài nằm ở file .md riêng.

export type ChapterStatus = 'published' | 'draft'

export interface Chapter {
  /** Định danh dùng cho URL: /docs/<slug> */
  slug: string
  /** Nhãn hiển thị trên sidebar và tiêu đề trang (tiếng Việt) */
  title: string
  /** Mô tả ngắn (tiếng Việt) cho card ở landing và phần mở đầu trang docs */
  description: string
  /** Nhóm trong sidebar (kiểu Laravel: gom mục theo chủ đề) */
  group: string
  /** published: đã có nội dung .md · draft: đang cập nhật */
  status: ChapterStatus
  /** Nội dung Markdown thô, tiếng Anh (chỉ có ở chương published) */
  body?: string
  /** Bản dịch tiếng Việt của body — chưa dịch hết mọi chương, fallback về `body` khi thiếu */
  bodyVi?: string
}

/** Một nhóm chương cùng chủ đề, hiển thị dưới 1 tiêu đề nhóm trong sidebar */
export interface ChapterGroup {
  name: string
  items: Chapter[]
}
