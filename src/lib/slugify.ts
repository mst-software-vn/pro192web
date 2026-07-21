// Chuyển tiêu đề (heading) thành id URL-safe, dùng chung cho anchor và mục lục "On this page".
const COMBINING_DIACRITICS = /[̀-ͯ]/g

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(COMBINING_DIACRITICS, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}
