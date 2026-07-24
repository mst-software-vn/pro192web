## Tổng quan dự án pro192web

**Là gì:** Nền tảng học Lập trình Hướng đối tượng (OOP) bằng Java — môn PRO192 tại Đại học FPT. Do MST Software xây dựng, là bản rebuild bằng React của trang tài liệu tĩnh cũ (pro192web.netlify.app). Production: https://pro192web.chunhau-py-015.workers.dev/

**Tầm nhìn:** Không chỉ là làm mới UI — mục tiêu dài hạn là biến thành một learning platform có thể mở rộng (tìm kiếm thật, có thể sau này có quiz/exercise...), không dừng ở nội dung tĩnh.

**Nội dung:** 11 chương bám sát syllabus PRO192 chính thức: Chào mừng → Introduction Course → Nền tảng → Đóng gói → Kế thừa → Đa hình → Mảng đối tượng → Bộ sưu tập (Collections) → Bộ nhớ động → Xử lý ngoại lệ → Nhập xuất tệp (File IO). Song ngữ Việt (mặc định) / English.

### Tech stack (đã khoá — không đổi nếu không được yêu cầu rõ)
React 19 + TypeScript 6 + Vite 8 · React Router DOM v7 (SPA client-side) · Tailwind CSS v4 (CSS-first config, KHÔNG có `tailwind.config.js`) · Motion (Framer Motion v12) · react-markdown + remark-gfm · prism-react-renderer (Java syntax highlight) · Deploy Cloudflare Workers qua wrangler v4 · Lint bằng oxlint (KHÔNG dùng ESLint) · Husky pre-commit chạy oxlint · Vitest (unit test cho logic thuần, không test component).

### Kiến trúc
- **Routing** (`src/router/AppRouter.tsx`): tất cả route lazy-load. `/` → `LandingPage` (marketing) · `/docs/:slug` → `DocsPage` bên trong `DocsLayout` (3 cột: Sidebar trái · nội dung giữa · TableOfContents phải) · `/syllabus-pro192-spring2021` → `SyllabusPage`. `LanguageProvider` bọc toàn bộ app.
- **Hệ thống nội dung**: Chapter là data thuần (`src/content/chapters/index.ts` + `types.ts`), nội dung markdown nạp từ file `.md`/`.vi.md` cạnh nhau qua `import.meta.glob(..., { eager: true })` — bundle lúc build, không fetch runtime. `bodyVi` fallback về `body` (tiếng Anh) kèm thông báo "đang cập nhật bản dịch" khi thiếu. Syllabus (`src/content/syllabus.ts`) là data bảng hardcode riêng, không phải markdown.
- **`docs/content/*/content.md` + `docs/images/`**: nội dung SCRAPE từ site cũ — chỉ để tham khảo khi viết nội dung thật vào `src/content/chapters/*.md`, KHÔNG được build/bundle vào app.
- **Render markdown** (`src/components/MarkdownContent.tsx`): custom component mapping cho react-markdown — heading tự sinh slug (phục vụ TOC), ảnh fallback về khung placeholder khi 404, code block qua `CodeBlock` (prism-react-renderer, luôn nền tối bất kể theme), blockquote có style riêng (vàng/xanh) dựa trên match text cụ thể trong nội dung — hơi fragile, cẩn thận khi sửa nội dung liên quan.
- **Theme**: token ngữ nghĩa CSS-first trong `src/index.css` (`--canvas`, `--ink`, `--hairline`...), đổi giá trị qua class `.dark`. `useTheme` hook quản lý light/dark/system, lưu localStorage, tự theo dõi đổi theme hệ điều hành khi ở chế độ system. Dark mode dùng tông đen-xanh (navy, `--canvas: #080b14`) thống nhất cho cả Docs lẫn Landing (đổi từ đen trung tính trước đây). Landing page giờ theme-aware đầy đủ (dùng chung `useTheme()`), light mode có nền gradient xanh nhạt + hiệu ứng glow riêng — token riêng nằm ở `src/styles/landing.css` (`--landing-*`, chỉ giữ những gì thật sự khác site: bề mặt kính mờ, panel code viewer, gradient/glow nền), còn màu chữ/border/accent dùng chung token của site (`text-ink`, `border-hairline-strong`, `bg-accent`...).
- **Ngôn ngữ**: `useLanguage` hook (Context + localStorage, mặc định `vi`), tách biệt với theme vì cần re-render nội dung.
- **Quiz cuối chương**: `QuizSection`/`QuizQuestion` (`src/components/quiz/`) render ở cuối `DocsPage.tsx`. Kho câu hỏi mỗi chương là 1 file `src/content/quizzes/<slug>.ts` (giống quy ước `.md` của `src/content/chapters`), nạp qua `getQuizPool()`. Mỗi lần vào trang bốc ngẫu nhiên cố định 5 câu (`pickQuestions` trong `src/lib/quiz.ts`, có unit test). Điểm lần gần nhất lưu localStorage (`pro192-quiz-<slug>`). Đã có kho câu hỏi thật (6 câu/chương, song ngữ) cho 9 chương: `foundations`, `encapsulation`, `inheritance`, `polymorphism`, `array-of-objects`, `collections`, `dynamic-memory`, `exception-handling`, `file-io`. Có chủ đích KHÔNG làm quiz cho `welcome` và `introduction-course` (theo yêu cầu). `QuizSection` tự ẩn khi kho rỗng.
- **Slug chương — tiếng Anh**: slug định danh chương (dùng cho URL `/docs/<slug>`, tên file `.md`/`.vi.md`, thư mục `public/images/<slug>/`, file `src/content/quizzes/<slug>.ts`) đã đổi từ tiếng Việt sang tiếng Anh (vd `dong-goi` → `encapsulation`, `ke-thua` → `inheritance`) — chỉ đổi slug/tên file, tiêu đề/mô tả hiển thị (`title`, `description`) vẫn giữ tiếng Việt. URL tiếng Việt cũ tự động redirect sang slug mới qua `src/content/legacy-slugs.ts` (`LEGACY_SLUG_REDIRECTS`) + `Navigate` trong `DocsPage.tsx`. Thư mục tham khảo `docs/content/`, `docs/screenshots/`, `docs/images/` cũng đã đổi tên đồng bộ theo slug mới.
- **LandingPage (redesign)**: đã chuyển hoàn toàn từ `docs/design-references/PRO192-Landing.dc.html` sang component thật ở `src/components/landing/` (`AnnouncementBar`, `LandingNav`, `HeroSection`, `CodeBlock` riêng cho hero — không phải `src/components/CodeBlock.tsx` dùng cho Docs, `ChapterGrid`, `SiteFooter`) + `src/pages/LandingPage.tsx` lắp ráp. Dữ liệu hiển thị 11 chương cho lưới này nằm ở `src/data/chapters.ts` (field `id/slug/name/tag/description`) — **khác** với `src/content/chapters/` (dữ liệu đầy đủ dùng cho `/docs`); `slug` ở 2 nơi khớp nhau theo thứ tự để card/CTA trỏ đúng route thật `/docs/<slug>`, nhưng đây là 2 nguồn dữ liệu riêng biệt, sửa 1 bên không tự động cập nhật bên kia.

### Điểm cần lưu ý / còn dang dở
- `SearchField.tsx` mới chỉ là UI, chưa gắn logic tìm kiếm thật.
- `.claude/rules/` hiện đang trống.
- Chưa có `.codegraph/` — bỏ qua CodeGraph, dùng Read/Grep bình thường cho tới khi được index.
- Skill thiết kế UI đang áp dụng: `.agents/skills/minimalist-ui/` (mono ấm, editorial, bento grid, pastel nhạt, cấm font Inter, cấm shadow đậm/glow) — cả Docs lẫn Landing đều dùng accent xanh và Landing còn có hiệu ứng glow/shadow màu, chưa theo đúng bảng màu/quy tắc này; đây là quyết định có chủ đích của user (xem file HTML tham chiếu ở `docs/design-references/`), không tự ý sửa lại theo skill nếu không được yêu cầu.
- **Dead code chưa dọn** (không còn được import ở đâu sau khi LandingPage đổi thiết kế, cần hỏi user trước khi xoá): `src/layout/LandingHeader.tsx`, `src/layout/LandingMobileNav.tsx`, `src/components/DocsNavDropdown.tsx`, `src/components/GithubStarButton.tsx`.

<!-- CODEGRAPH_START -->
## CodeGraph

In repositories indexed by CodeGraph (a `.codegraph/` directory exists at the repo root), reach for it BEFORE grep/find or reading files when you need to understand or locate code:

- **MCP tool** (when available): `codegraph_explore` answers most code questions in one call — the relevant symbols' verbatim source plus the call paths between them, including dynamic-dispatch hops grep can't follow. Name a file or symbol in the query to read its current line-numbered source. If it's listed but deferred, load it by name via tool search.
- **Shell** (always works): `codegraph explore "<symbol names or question>"` prints the same output.

If there is no `.codegraph/` directory, skip CodeGraph entirely — indexing is the user's decision.
<!-- CODEGRAPH_END -->
