## Tổng quan dự án pro192web

**Là gì:** Nền tảng học Lập trình Hướng đối tượng (OOP) bằng Java — môn PRO192 tại Đại học FPT. Do MST Software xây dựng, là bản rebuild bằng React của trang tài liệu tĩnh cũ (pro192web.netlify.app). Production: https://pro192web.chunhau-py-015.workers.dev/

**Tầm nhìn:** Không chỉ là làm mới UI — mục tiêu dài hạn là biến thành một learning platform có thể mở rộng (tìm kiếm thật, có thể sau này có quiz/exercise...), không dừng ở nội dung tĩnh.

**Nội dung:** 11 chương bám sát syllabus PRO192 chính thức: Chào mừng → Introduction Course → Nền tảng → Đóng gói → Kế thừa → Đa hình → Mảng đối tượng → Bộ sưu tập (Collections) → Bộ nhớ động → Xử lý ngoại lệ → Nhập xuất tệp (File IO). Song ngữ Việt (mặc định) / English.

### Tech stack (đã khoá — không đổi nếu không được yêu cầu rõ)
React 19 + TypeScript 6 + Vite 8 · React Router DOM v7 (SPA client-side) · Tailwind CSS v4 (CSS-first config, KHÔNG có `tailwind.config.js`) · Motion (Framer Motion v12) · react-markdown + remark-gfm · prism-react-renderer (Java syntax highlight) · Deploy Cloudflare Workers qua wrangler v4 · Lint bằng oxlint (KHÔNG dùng ESLint) · Husky pre-commit chạy oxlint.

### Kiến trúc
- **Routing** (`src/router/AppRouter.tsx`): tất cả route lazy-load. `/` → `LandingPage` (marketing) · `/docs/:slug` → `DocsPage` bên trong `DocsLayout` (3 cột: Sidebar trái · nội dung giữa · TableOfContents phải) · `/syllabus-pro192-spring2021` → `SyllabusPage`. `LanguageProvider` bọc toàn bộ app.
- **Hệ thống nội dung**: Chapter là data thuần (`src/content/chapters/index.ts` + `types.ts`), nội dung markdown nạp từ file `.md`/`.vi.md` cạnh nhau qua `import.meta.glob(..., { eager: true })` — bundle lúc build, không fetch runtime. `bodyVi` fallback về `body` (tiếng Anh) kèm thông báo "đang cập nhật bản dịch" khi thiếu. Syllabus (`src/content/syllabus.ts`) là data bảng hardcode riêng, không phải markdown.
- **`docs/content/*/content.md` + `docs/images/`**: nội dung SCRAPE từ site cũ — chỉ để tham khảo khi viết nội dung thật vào `src/content/chapters/*.md`, KHÔNG được build/bundle vào app.
- **Render markdown** (`src/components/MarkdownContent.tsx`): custom component mapping cho react-markdown — heading tự sinh slug (phục vụ TOC), ảnh fallback về khung placeholder khi 404, code block qua `CodeBlock` (prism-react-renderer, luôn nền tối bất kể theme), blockquote có style riêng (vàng/xanh) dựa trên match text cụ thể trong nội dung — hơi fragile, cẩn thận khi sửa nội dung liên quan.
- **Theme**: token ngữ nghĩa CSS-first trong `src/index.css` (`--canvas`, `--ink`, `--hairline`...), đổi giá trị qua class `.dark`. `useTheme` hook quản lý light/dark/system, lưu localStorage, tự theo dõi đổi theme hệ điều hành khi ở chế độ system. Landing page luôn dùng accent xanh cố định (`#2563eb`), không đổi theo theme; khu vực Docs thì theme-aware đầy đủ.
- **Ngôn ngữ**: `useLanguage` hook (Context + localStorage, mặc định `vi`), tách biệt với theme vì cần re-render nội dung.

### Điểm cần lưu ý / còn dang dở
- `SearchField.tsx` mới chỉ là UI, chưa gắn logic tìm kiếm thật.
- `.claude/rules/` hiện đang trống.
- Chưa có `.codegraph/` — bỏ qua CodeGraph, dùng Read/Grep bình thường cho tới khi được index.
- Skill thiết kế UI đang áp dụng: `.agents/skills/minimalist-ui/` (mono ấm, editorial, bento grid, pastel nhạt) — landing page hiện tại dùng accent xanh chứ chưa theo đúng bảng màu này, đây là trạng thái có sẵn, không tự ý sửa nếu không được yêu cầu.

<!-- CODEGRAPH_START -->
## CodeGraph

In repositories indexed by CodeGraph (a `.codegraph/` directory exists at the repo root), reach for it BEFORE grep/find or reading files when you need to understand or locate code:

- **MCP tool** (when available): `codegraph_explore` answers most code questions in one call — the relevant symbols' verbatim source plus the call paths between them, including dynamic-dispatch hops grep can't follow. Name a file or symbol in the query to read its current line-numbered source. If it's listed but deferred, load it by name via tool search.
- **Shell** (always works): `codegraph explore "<symbol names or question>"` prints the same output.

If there is no `.codegraph/` directory, skip CodeGraph entirely — indexing is the user's decision.
<!-- CODEGRAPH_END -->
