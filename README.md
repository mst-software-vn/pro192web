<div align="center">
  <img src="public/images/logo-transparent.png" alt="PRO192 Docs" width="120" />

  # PRO192 — Tài liệu Lập trình Hướng đối tượng với Java

  Nền tảng học Java OOP dành cho sinh viên PRO192, Đại học FPT.
  Xây dựng và duy trì bởi MST Software.

  [![React](https://img.shields.io/badge/React-19-149eca?logo=react&logoColor=white)](https://react.dev)
  [![TypeScript](https://img.shields.io/badge/TypeScript-6-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
  [![Vite](https://img.shields.io/badge/Vite-8-646cff?logo=vite&logoColor=white)](https://vite.dev)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
  [![React Router](https://img.shields.io/badge/React_Router-7-ca4245?logo=reactrouter&logoColor=white)](https://reactrouter.com)
  [![Cloudflare Workers](https://img.shields.io/badge/Cloudflare_Workers-deployed-f38020?logo=cloudflareworkers&logoColor=white)](https://workers.cloudflare.com)

  [Xem bản demo trực tiếp](https://pro192web.chunhau-py-015.workers.dev/) · [English summary](#english)
</div>

---

## Mục lục

- [Giới thiệu](#giới-thiệu)
- [Demo](#demo)
- [Nội dung khoá học](#nội-dung-khoá-học)
- [Tính năng](#tính-năng)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Bắt đầu](#bắt-đầu)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Đóng góp nội dung](#đóng-góp-nội-dung)
- [Lộ trình phát triển](#lộ-trình-phát-triển)
- [Giấy phép](#giấy-phép)
- [English](#english)

## Giới thiệu

PRO192 Docs là bản viết lại toàn bộ trang tài liệu môn Lập trình Hướng đối tượng (PRO192) của Đại học FPT, chuyển từ một trang tĩnh cũ (pro192web.netlify.app) sang một ứng dụng React hiện đại. Nội dung bám sát syllabus chính thức của môn học: từ nền tảng Java, đóng gói, kế thừa, đa hình, cho đến cấu trúc dữ liệu và xử lý ngoại lệ — trình bày song ngữ Việt/Anh, có ví dụ code minh hoạ và tra cứu nhanh theo chương.

Đây không chỉ là một lần làm mới giao diện. Nội dung được tách hoàn toàn khỏi lớp hiển thị (mỗi chương là một file Markdown độc lập), để dự án có thể mở rộng thành một nền tảng học tập đầy đủ hơn theo thời gian, thay vì dừng lại ở một tài liệu tĩnh.

## Demo

Bản triển khai mới nhất luôn có tại: **https://pro192web.chunhau-py-015.workers.dev/**

<!-- TODO: chèn ảnh chụp màn hình hoặc GIF giao diện tại đây -->

## Nội dung khoá học

| # | Chương | Chapter |
|---|--------|---------|
| 1 | Chào mừng | Welcome |
| 2 | Introduction Course | Introduction Course |
| 3 | Nền tảng | Foundations |
| 4 | Đóng gói | Encapsulation |
| 5 | Kế thừa | Inheritance |
| 6 | Đa hình | Polymorphism |
| 7 | Mảng đối tượng | Array of Objects |
| 8 | Bộ sưu tập | Collections |
| 9 | Bộ nhớ động | Dynamic Memory |
| 10 | Xử lý ngoại lệ | Exception Handling |
| 11 | Nhập xuất tệp | File IO |

## Tính năng

- **Song ngữ Việt/Anh** — chuyển đổi ngôn ngữ theo từng chương, tự động fallback sang bản gốc khi chưa có bản dịch.
- **Giao diện sáng/tối/hệ thống** — lưu lựa chọn của người dùng, tự đồng bộ khi hệ điều hành đổi theme.
- **Code Java có cú pháp tô màu** — mỗi ví dụ minh hoạ đều dùng grammar Java riêng, có nút sao chép nhanh.
- **Điều hướng kiểu tài liệu kỹ thuật** — sidebar theo nhóm chủ đề, mục lục bám theo tiêu đề (table of contents), điều hướng mượt trên cả desktop và mobile.
- **Trang Syllabus riêng** — đề cương môn học chính thức (PRO192, Spring 2021), tra cứu ngay trong ứng dụng.
- **Triển khai biên (edge)** — phục vụ qua Cloudflare Workers, SPA tải nhanh, tách bundle theo route.

## Công nghệ sử dụng

| Nhóm | Công nghệ |
|------|-----------|
| Framework | React 19, TypeScript 6 |
| Build tool | Vite 8 |
| Routing | React Router DOM v7 (client-side, SPA) |
| Giao diện | Tailwind CSS v4 (cấu hình CSS-first, không dùng `tailwind.config.js`) |
| Hiệu ứng | Motion (Framer Motion v12) |
| Nội dung | react-markdown + remark-gfm |
| Code highlighting | prism-react-renderer |
| Triển khai | Cloudflare Workers (wrangler v4) |
| Lint | oxlint |
| Git hooks | Husky (kiểm tra commit message, lint trước khi commit) |

## Bắt đầu

Yêu cầu: Node.js 20 trở lên.

```bash
git clone https://github.com/mst-software-vn/pro192web.git
cd pro192web
npm install
```

Các lệnh có sẵn:

```bash
npm run dev       # chạy dev server (Vite)
npm run build     # type-check (tsc -b) rồi build production
npm run preview   # xem trước bản build production
npm run lint      # kiểm tra code bằng oxlint
```

## Cấu trúc dự án

```
src/
├── components/     # Component dùng chung (CodeBlock, MarkdownContent, ThemeToggle...)
├── content/
│   ├── chapters/    # Metadata + nội dung Markdown của từng chương (.md / .vi.md)
│   ├── syllabus.ts  # Dữ liệu đề cương môn học
│   └── types.ts     # Kiểu dữ liệu Chapter / ChapterGroup
├── hooks/           # useLanguage, useTheme, useActiveHeading...
├── layout/          # DocsLayout, Sidebar, TableOfContents, LandingHeader...
├── lib/             # Markdown parsing, slugify, Prism Java grammar
├── pages/           # LandingPage, DocsPage, SyllabusPage
└── router/          # AppRouter — khai báo toàn bộ route

docs/
├── content/         # Nội dung gốc scrape từ site cũ — chỉ để tham khảo, KHÔNG build vào app
├── images/          # Ảnh minh hoạ gốc, đối chiếu khi viết lại nội dung
└── screenshots/      # Ảnh chụp màn hình site cũ, phục vụ tham khảo nội dung
```

## Đóng góp nội dung

Mỗi chương là một cặp file Markdown trong `src/content/chapters/` (`<slug>.md` tiếng Anh, `<slug>.vi.md` bản dịch tiếng Việt tuỳ chọn), được khai báo metadata trong `src/content/chapters/index.ts`. Ảnh minh hoạ đặt trong `public/images/` và tham chiếu bằng đường dẫn tuyệt đối (`/images/...`). Nội dung ở `docs/content/` là bản scrape từ site cũ, chỉ dùng để đối chiếu khi biên soạn lại — không đại diện cho nội dung đang publish.

## Lộ trình phát triển

- Gắn logic tìm kiếm thật cho thanh tìm kiếm (hiện mới là giao diện).
- Bổ sung thêm chương mới hoặc mở rộng nội dung các chương hiện có.
- Từng bước hoàn thiện bản dịch tiếng Việt cho các chương còn thiếu `bodyVi`.

## Giấy phép

Dự án được thực hiện bởi MST Software theo đơn đặt hàng của Đại học FPT. Toàn bộ mã nguồn và nội dung thuộc quyền sở hữu của MST Software và Đại học FPT.

© 2026 MST Software.

---

## English

**PRO192 Docs** is a full React rewrite of the legacy static documentation site for PRO192 (Object-Oriented Programming using Java) at FPT University, commissioned by FPT and built by MST Software. It covers the official 11-chapter syllabus — from Java foundations through encapsulation, inheritance, polymorphism, collections and exception handling — with bilingual Vietnamese/English content, highlighted Java code samples, and documentation-style navigation.

The rewrite goes beyond a visual refresh: chapter content lives in standalone Markdown files, fully separated from the UI layer, so the project can grow into a broader learning platform rather than stay a static document.

**Live demo:** https://pro192web.chunhau-py-015.workers.dev/

**Stack:** React 19, TypeScript 6, Vite 8, React Router DOM v7 (SPA), Tailwind CSS v4 (CSS-first config), Motion, react-markdown + remark-gfm, prism-react-renderer, deployed on Cloudflare Workers, linted with oxlint, Husky git hooks.

**Getting started:**

```bash
git clone https://github.com/mst-software-vn/pro192web.git
cd pro192web
npm install
npm run dev
```

**License:** Proprietary — built by MST Software for FPT University. All rights reserved. © 2026 MST Software.
