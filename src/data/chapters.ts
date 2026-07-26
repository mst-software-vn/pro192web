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
    slug: 'welcome',
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
    slug: 'foundations',
    name: 'Foundations',
    tag: 'Java Core',
    description:
      'Java Virtual Machine, bytecode, kiểu dữ liệu nguyên thuỷ, mảng, phạm vi biến và cấu trúc điều khiển cơ bản.',
  },
  {
    id: 4,
    slug: 'encapsulation',
    name: 'Encapsulation',
    tag: 'Encapsulation',
    description:
      'Thiết kế class từ thực tế: constructor, getter/setter, từ khoá this, package và 4 mức truy cập private/public/protected/default.',
  },
  {
    id: 5,
    slug: 'inheritance',
    name: 'Inheritance',
    tag: 'Inheritance',
    description:
      'Quan hệ is-a, extends, super(), override cơ bản, static type/dynamic type, instanceof và ép kiểu an toàn.',
  },
  {
    id: 6,
    slug: 'polymorphism',
    name: 'Polymorphism',
    tag: 'Polymorphism',
    description:
      'Overloading, overriding, @Override, static vs dynamic binding, abstract class, interface — nền tảng thiết kế linh hoạt.',
  },
  {
    id: 7,
    slug: 'abstraction',
    name: 'Abstraction',
    tag: 'Abstraction',
    description:
      'Abstract class, interface, default/static method (từ Java 8) và cách chọn đúng cơ chế trừu tượng cho từng bài toán thiết kế.',
  },
  {
    id: 8,
    slug: 'array-of-objects',
    name: 'Array of Objects',
    tag: 'Data Structures',
    description:
      'Quản lý danh sách đối tượng bằng mảng tham chiếu: thêm, tìm, sửa, xoá, lọc, sắp xếp và serialization.',
  },
  {
    id: 9,
    slug: 'collections',
    name: 'Collections',
    tag: 'Collections',
    description:
      'ArrayList, TreeSet, HashMap — Java Collections Framework: chọn đúng cấu trúc dữ liệu cho từng bài toán.',
  },
  {
    id: 10,
    slug: 'dynamic-memory',
    name: 'Dynamic Memory',
    tag: 'Memory',
    description:
      'Stack, heap tĩnh và heap động: cách Java cấp phát bộ nhớ, Garbage Collector và vòng đời của đối tượng.',
  },
  {
    id: 11,
    slug: 'exception-handling',
    name: 'Exception Handling',
    tag: 'Exception',
    description:
      'try-catch-finally, checked vs unchecked exception, throws, lồng nhau, và tự định nghĩa exception riêng.',
  },
  {
    id: 12,
    slug: 'file-io',
    name: 'File I/O',
    tag: 'File I/O',
    description:
      'I/O Stream, Scanner, BufferedReader, FileReader: đọc dữ liệu từ bàn phím và file văn bản, xử lý IOException.',
  },
  {
    id: 13,
    slug: 'pe-exam-guidelines',
    name: 'PE Exam Guidelines',
    tag: 'Exam Prep',
    description:
      'Checklist thực chiến cho kỳ thi thực hành (PE): chuẩn bị máy và thư mục thi, đọc đề đúng cách, làm bài và nộp bài không sai sót.',
  },
]
