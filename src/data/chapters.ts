// Dữ liệu hiển thị cho lưới 11 chương trên LandingPage — mô tả marketing ngắn,
// tách biệt khỏi src/content/chapters (dữ liệu đầy đủ, dùng cho trang /docs).
// `slug` khớp 1-1 với slug thật trong src/content/chapters/index.ts theo đúng thứ tự
// để card chương và CTA điều hướng tới đúng nội dung thật, không phải route ảo.
export interface Chapter {
  id: number
  slug: string
  name: string
  tag: string
  description: string
}

export const chapters: Chapter[] = [
  {
    id: 1,
    slug: 'chao-mung',
    name: 'Welcome',
    tag: 'Giới thiệu',
    description:
      'Tổng quan môn PRO192: chuẩn đầu ra, chính sách học thuật, và môn tiên quyết PRF192. Nơi bắt đầu hành trình OOP của bạn.',
  },
  {
    id: 2,
    slug: 'introduction-course',
    name: 'Introduction',
    tag: 'OOP Concepts',
    description:
      'Tại sao cần OOP? Khái niệm object, class, encapsulation, inheritance, polymorphism — nền tảng của mọi hệ thống phần mềm lớn.',
  },
  {
    id: 3,
    slug: 'nen-tang',
    name: 'Foundations',
    tag: 'Java Core',
    description:
      'Java Virtual Machine, bytecode, kiểu dữ liệu nguyên thuỷ, mảng, phạm vi biến và cấu trúc điều khiển cơ bản.',
  },
  {
    id: 4,
    slug: 'dong-goi',
    name: 'Encapsulation',
    tag: 'Encapsulation',
    description:
      'Thiết kế class từ thực tế: constructor, getter/setter, từ khoá this, package và 4 mức truy cập private/public/protected/default.',
  },
  {
    id: 5,
    slug: 'ke-thua',
    name: 'Inheritance',
    tag: 'Inheritance',
    description:
      'Quan hệ is-a, extends, super(), override cơ bản, static type/dynamic type, instanceof và ép kiểu an toàn.',
  },
  {
    id: 6,
    slug: 'da-hinh',
    name: 'Polymorphism',
    tag: 'Polymorphism',
    description:
      'Overloading, overriding, @Override, static vs dynamic binding, abstract class, interface — nền tảng thiết kế linh hoạt.',
  },
  {
    id: 7,
    slug: 'mang-doi-tuong',
    name: 'Array of Objects',
    tag: 'Data Structures',
    description:
      'Quản lý danh sách đối tượng bằng mảng tham chiếu: thêm, tìm, sửa, xoá, lọc, sắp xếp và serialization.',
  },
  {
    id: 8,
    slug: 'bo-suu-tap',
    name: 'Collections',
    tag: 'Collections',
    description:
      'ArrayList, TreeSet, HashMap — Java Collections Framework: chọn đúng cấu trúc dữ liệu cho từng bài toán.',
  },
  {
    id: 9,
    slug: 'bo-nho-dong',
    name: 'Dynamic Memory',
    tag: 'Memory',
    description:
      'Stack, heap tĩnh và heap động: cách Java cấp phát bộ nhớ, Garbage Collector và vòng đời của đối tượng.',
  },
  {
    id: 10,
    slug: 'xu-ly-ngoai-le',
    name: 'Exception Handling',
    tag: 'Exception',
    description:
      'try-catch-finally, checked vs unchecked exception, throws, lồng nhau, và tự định nghĩa exception riêng.',
  },
  {
    id: 11,
    slug: 'nhap-xuat-tep',
    name: 'File I/O',
    tag: 'File I/O',
    description:
      'I/O Stream, Scanner, BufferedReader, FileReader: đọc dữ liệu từ bàn phím và file văn bản, xử lý IOException.',
  },
]
