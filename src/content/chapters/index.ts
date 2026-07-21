import type { Chapter } from '../types'

export type { ChapterGroup } from '../types'

// Nạp toàn bộ nội dung Markdown tại build-time — không cần fetch runtime.
const rawBodies = import.meta.glob('./*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

function bodyFor(slug: string): string | undefined {
  return rawBodies[`./${slug}.md`]
}

// Thứ tự & metadata khớp docs/content/sidebar/sidebar.txt (nguồn gốc từ pro192web).
// status 'draft' cho các chương chưa có nội dung .md — sẽ chuyển 'published' khi có tài liệu.
const chapterMeta: Omit<Chapter, 'body'>[] = [
  {
    slug: 'chao-mung',
    title: 'Chào mừng',
    description: 'Giới thiệu về khóa học PRO192, mục tiêu và kết quả học tập.',
    group: 'Nhập môn',
    status: 'published',
  },
  {
    slug: 'introduction-course',
    title: 'Introduction Course',
    description:
      'Giới thiệu về cấu trúc khóa học, mục tiêu và các khái niệm nền tảng của lập trình hướng đối tượng với Java.',
    group: 'Nhập môn',
    status: 'published',
  },
  {
    slug: 'nen-tang',
    title: 'Nền tảng',
    description:
      'Kiến thức cơ bản về Java: JVM, nền tảng, kiểu dữ liệu, biến, mảng, toán tử và cấu trúc logic.',
    group: 'Nền tảng ngôn ngữ',
    status: 'published',
  },
  {
    slug: 'dong-goi',
    title: 'Đóng gói',
    description:
      'Đóng gói, lớp, đối tượng, hàm tạo, hàm thành viên và các bộ điều khiển truy cập trong Java.',
    group: 'Lập trình hướng đối tượng',
    status: 'published',
  },
  {
    slug: 'ke-thua',
    title: 'Kế thừa',
    description: 'Kế thừa lớp, từ khóa extends, super và tái sử dụng mã nguồn trong Java.',
    group: 'Lập trình hướng đối tượng',
    status: 'published',
  },
  {
    slug: 'da-hinh',
    title: 'Đa hình',
    description: 'Đa hình, nạp chồng, ghi đè phương thức và liên kết động trong Java.',
    group: 'Lập trình hướng đối tượng',
    status: 'published',
  },
  {
    slug: 'mang-doi-tuong',
    title: 'Mảng đối tượng',
    description: 'Khai báo, khởi tạo và thao tác trên mảng đối tượng trong Java.',
    group: 'Cấu trúc dữ liệu',
    status: 'draft',
  },
  {
    slug: 'bo-suu-tap',
    title: 'Bộ sưu tập',
    description: 'Các kiểu dữ liệu trừu tượng trong Java Collections: List, Set, Map.',
    group: 'Cấu trúc dữ liệu',
    status: 'draft',
  },
  {
    slug: 'bo-nho-dong',
    title: 'Bộ nhớ động',
    description: 'Cấp phát bộ nhớ động và quản lý vòng đời đối tượng trong Java.',
    group: 'Cấu trúc dữ liệu',
    status: 'published',
  },
  {
    slug: 'xu-ly-ngoai-le',
    title: 'Xử lý ngoại lệ',
    description: 'Cơ chế xử lý ngoại lệ (Exception handling) trong Java: try, catch, finally, throw.',
    group: 'Nâng cao',
    status: 'draft',
  },
  {
    slug: 'nhap-xuat-tep',
    title: 'Nhập xuất tệp',
    description: 'Đọc và ghi dữ liệu từ/đến tệp bằng Java I/O streams.',
    group: 'Nâng cao',
    status: 'published',
  },
]

export const chapters: Chapter[] = chapterMeta.map((meta) => ({
  ...meta,
  body: bodyFor(meta.slug),
}))

export function getChapter(slug: string): Chapter | undefined {
  return chapters.find((chapter) => chapter.slug === slug)
}

export const firstChapterSlug = chapters[0].slug
