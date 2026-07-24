// Map slug tiếng Việt cũ (trước khi đổi sang tiếng Anh) sang slug mới — để URL cũ
// (đã từng chạy production) không bị 404 mà tự chuyển hướng sang route đúng.
export const LEGACY_SLUG_REDIRECTS: Record<string, string> = {
  'chao-mung': 'welcome',
  'nen-tang': 'foundations',
  'dong-goi': 'encapsulation',
  'ke-thua': 'inheritance',
  'da-hinh': 'polymorphism',
  'mang-doi-tuong': 'array-of-objects',
  'bo-suu-tap': 'collections',
  'bo-nho-dong': 'dynamic-memory',
  'xu-ly-ngoai-le': 'exception-handling',
  'nhap-xuat-tep': 'file-io',
}
