# Redesign Landing Page + Landing Header

## Bối cảnh

Nội dung 9/11 chương Docs đã gần hoàn chỉnh (2 chương "Mảng đối tượng", "Bộ sưu tập" cố tình để sau cùng). Landing Page (`/`) hiện quá đơn giản: header chỉ có logo + 1 nút "Docs", hero + 1 grid chương, không có yếu tố xanh dương thương hiệu, trông sơ sài so với các trang chủ tham khảo (Laravel, Auth0, NestJS, Next.js). Mục tiêu: làm Landing Page chuyên nghiệp, nhiều chi tiết hơn nhưng không rườm rà, tăng diện tích màu xanh (`--color-accent`) làm nhận diện thương hiệu, tận dụng logo mới (`logo-transparent.png` cho light, `logo.jpg` cho dark).

Quyết định phạm vi quan trọng: **Docs giữ nguyên header hiện tại** (`DocsHeader.tsx` không đổi). Chỉ **Landing Page có header mới** — không dùng chung 1 component header cho cả 2 khu vực.

## Kiến trúc / component

```
src/layout/
  DocsHeader.tsx        (không đổi)
  LandingHeader.tsx     (mới — thay cho header inline hiện có trong LandingPage.tsx)

src/components/
  GithubStarButton.tsx  (mới)
  DocsNavDropdown.tsx   (mới — mega-menu "Tài liệu", chỉ dùng trong LandingHeader)
  SearchField.tsx       (có sẵn — tái dùng nguyên trạng, không sửa)
  ThemeToggle.tsx        (có sẵn — tái dùng nguyên trạng, không sửa)
  CodeBlock.tsx          (có sẵn — tái dùng cho hero code showcase)

src/pages/
  LandingPage.tsx       (viết lại phần thân trang, dùng token màu thay vì hard-code neutral-*)
```

`DocsNavDropdown` và `GithubStarButton` đọc dữ liệu trực tiếp từ `chapters` (registry có sẵn ở `src/content/chapters/index.ts`) — không tạo nguồn dữ liệu thứ hai.

## Theme

Landing chuyển từ "luôn sáng, hard-code `neutral-*`/`bg-white`" sang dùng theme toggle chung của site (`useTheme` / `.dark` class trên `<html>`) và các token ngữ nghĩa đã có trong `index.css` (`bg-canvas`, `text-ink`, `text-ink-body`, `border-hairline`, `text-accent-on-surface`...). Không cần state theme riêng cho Landing — `ThemeToggle` đã toggle global.

Logo: `<img>` đổi theo theme bằng CSS (`dark:hidden` / `hidden dark:block`), không cần JS — dùng `logo-transparent.png` ở light, `logo.jpg` ở dark, giống cách `DocsHeader` đã dùng `logo.jpg`.

## 1. LandingHeader (mới)

Bố cục desktop (≥ `lg`), một hàng:

```
[Logo]   Tài liệu ▾   Giáo trình        [Search... ⌘K]   [★ GitHub 3]  [🌙]  [Bắt đầu học]
```

- **Logo** → link `/`.
- **"Tài liệu ▾"**: nút mở `DocsNavDropdown` — mega-menu liệt kê chương theo `chapter.group` (4 nhóm: Nhập môn, Nền tảng ngôn ngữ, Lập trình hướng đối tượng, Cấu trúc dữ liệu, Nâng cao — lấy trực tiếp từ registry, không hard-code lần 2). Mỗi item link tới `/docs/{slug}`. Pattern mở/đóng (state `open`, overlay đóng khi click ngoài) giống `ThemeToggle`/`LanguageSelector` đã có.
- **"Giáo trình"**: link thẳng `/syllabus-pro192-spring2021`.
- **`SearchField`**: tái dùng nguyên component (hiện tại chỉ là UI trang trí, chưa gắn logic — giữ nguyên, không mở rộng chức năng tìm kiếm thật trong phạm vi này).
- **`GithubStarButton`**: xem chi tiết mục 3.
- **`ThemeToggle`**: tái dùng nguyên component.
- **CTA "Bắt đầu học"**: link `/docs/{firstChapterSlug}`, style nút accent xanh (`bg-accent hover:bg-accent-emphasis`).

Mobile (< `lg`): chỉ hiện Logo | `GithubStarButton` (icon-only, ẩn số) | `ThemeToggle` | nút hamburger. Hamburger mở một panel/sheet xổ xuống chứa: link "Tài liệu" (expand danh sách phẳng theo nhóm, không mega-menu 2 tầng), "Giáo trình", CTA "Bắt đầu học". Đây là hamburger **riêng của Landing**, độc lập hoàn toàn với hamburger mở sidebar của `DocsHeader`.

## 2. Hero

2 cột trên desktop, xếp dọc trên mobile:

- **Trái**: giữ cấu trúc hiện tại (nhãn "MST Software", `BlurText` H1, mô tả, 2 CTA) nhưng đổi màu chữ sang token (`text-ink`, `text-ink-body`).
- **Phải**: một khối code editor mock — dùng `CodeBlock` render một đoạn Java thật (ví dụ kế thừa `Employee extends Person`, có `@Override`) với title bar giả lập tên file (`Employee.java`), bo góc, shadow nhẹ.
- **Nền**: `radial-gradient` từ `--color-accent-soft` (light) / bản mờ tương ứng cho dark, chồng thêm 1 lớp SVG grid pattern rất mờ (`opacity` thấp, `stroke` theo `--color-hairline`). Full-bleed phía sau toàn hero, dùng `aria-hidden`, `pointer-events-none` như cách làm hiện tại của khối gradient cũ.

## 3. GithubStarButton

- Fetch `GET https://api.github.com/repos/mst-software-vn/pro192web` một lần khi mount (không cần polling).
- Trạng thái: `loading` (chỉ hiện icon GitHub, không số) → `success` (icon + `stargazers_count`) → `error/rate-limited` (fallback về icon + text "GitHub", ẩn số, không hiện thông báo lỗi cho người dùng — im lặng theo dõi qua console.warn nếu cần debug).
- Toàn bộ nút bọc trong `<a href="https://github.com/mst-software-vn/pro192web" target="_blank" rel="noreferrer">` — fetch lỗi không được chặn việc click mở link.

## 4. Stats bar

Ngay dưới hero, 1 hàng 4 số liệu **thật**, tính tại build-time từ chính `chapters` registry (đếm số chương, số ```` ```java ```` block, số `![` trong toàn bộ `.md` đã publish) — không hard-code số liệu rời rạc dễ lệch khi thêm nội dung mới:

`11 chương` · `62 ví dụ code Java` · `100+ hình minh hoạ` · `Song ngữ Việt / English`

## 5. "Vì sao học tại đây" — 4 thẻ

Icon SVG inline (tự vẽ theo pattern có sẵn trong `ThemeToggle`/`DocsHeader`, không thêm icon library):

1. Song ngữ Việt – Anh, giữ thuật ngữ lập trình chuẩn.
2. Code minh hoạ thực tế, có ảnh sơ đồ đi kèm.
3. Miễn phí & mã nguồn mở (link GitHub).
4. Bám sát syllabus PRO192 chính thức.

## 6. Grid 11 chương

Giữ nguyên như hiện tại (`ol` + `RevealOnScroll` stagger) — không sửa.

## 7. Footer (mới, thay dòng copyright đơn)

3 cột + dòng copyright cuối:

- Cột 1: Logo + 1 câu mô tả ngắn.
- Cột 2 "Tài liệu": vài link chương tiêu biểu + link "Giáo trình".
- Cột 3 "Dự án": link GitHub repo, (không thêm mục nào không có thật — không bịa Twitter/Discord/blog).
- Cuối: `© 2026 MST Software · Tài liệu học Java OOP (PRO192)`.

## Xử lý lỗi / edge case

- GitHub API lỗi/rate-limit → ẩn số sao, giữ nguyên link, không crash, không hiện lỗi cho người dùng.
- Ảnh logo: dùng thuần CSS `dark:` để chuyển đổi, không có JS nào có thể fail.
- Mega-menu / mobile sheet: đóng khi click ra ngoài hoặc nhấn `Escape` (theo đúng pattern `ThemeToggle` đang dùng).

## Kiểm chứng sau khi cài đặt

1. `npm run build` + `npm run lint` sạch.
2. Headless-Chrome kiểm tra `LandingPage` ở light/dark, desktop (~1280px) và mobile (~375px): mega-menu mở/đóng đúng, `GithubStarButton` hiện số thật (hoặc fallback nếu rate-limit), hamburger mobile mở đúng panel, hero hiển thị code block có syntax highlight.
3. Xác nhận `DocsHeader`/Docs area **không bị ảnh hưởng** — vẫn hiển thị và hoạt động y như trước khi đổi Landing.

## Ngoài phạm vi (không làm trong lần này)

- Không gắn logic tìm kiếm thật cho `SearchField` (vẫn là UI trang trí như hiện tại ở Docs).
- Không động vào 2 chương "Mảng đối tượng", "Bộ sưu tập" (còn draft, làm sau).
- Không đổi cấu trúc/route ngoài những gì nêu trên.
