import type { QuizQuestion } from '../types'

export const questions: QuizQuestion[] = [
  {
    id: 'dong-goi-1',
    question: 'Đóng gói (encapsulation) trong Java chủ yếu nhằm mục đích gì?',
    questionEn: 'What is the primary purpose of encapsulation in Java?',
    options: [
      { id: 'a', text: 'Giấu dữ liệu và cách xử lý bên trong class, chỉ lộ ra giao diện cần thiết', textEn: 'Hide a class\'s internal data and logic, exposing only the necessary interface' },
      { id: 'b', text: 'Cho phép 1 class kế thừa từ nhiều class khác', textEn: 'Allow a class to inherit from multiple other classes' },
      { id: 'c', text: 'Tăng tốc độ biên dịch chương trình', textEn: 'Speed up program compilation' },
      { id: 'd', text: 'Tự động sinh ra các phương thức getter/setter', textEn: 'Automatically generate getter/setter methods' },
    ],
    correctOptionIds: ['a'],
    explanation:
      'Đóng gói là giữ dữ liệu (field) và logic xử lý bên trong class ở mức private, chỉ cho phép truy cập qua các phương thức public — client không cần biết chi tiết triển khai bên trong.',
    explanationEn:
      'Encapsulation keeps a class\'s fields and logic private, exposing access only through public methods — clients never need to know the internal implementation details.',
  },
  {
    id: 'dong-goi-2',
    question: 'Nếu một thuộc tính/phương thức không có access modifier nào (default), nó có thể được truy cập từ đâu?',
    questionEn: 'If a field or method has no access modifier (default/package-private), where can it be accessed from?',
    options: [
      { id: 'a', text: 'Chỉ trong chính class đó', textEn: 'Only within that class itself' },
      { id: 'b', text: 'Trong cùng package', textEn: 'From anywhere in the same package' },
      { id: 'c', text: 'Ở bất kỳ đâu trong chương trình', textEn: 'From anywhere in the program' },
      { id: 'd', text: 'Chỉ từ class con (subclass)', textEn: 'Only from a subclass' },
    ],
    correctOptionIds: ['b'],
    explanation:
      'default (không ghi modifier) nghĩa là truy cập được trong cùng package — rộng hơn private, nhưng hẹp hơn protected/public.',
    explanationEn:
      'Default (no modifier) access means visible anywhere in the same package — wider than private, narrower than protected/public.',
  },
  {
    id: 'dong-goi-3',
    question: 'Trình biên dịch Java tự động thêm constructor mặc định (không tham số) khi nào?',
    options: [
      { id: 'a', text: 'Luôn luôn, bất kể class có khai báo constructor hay không' },
      { id: 'b', text: 'Chỉ khi class không khai báo BẤT KỲ constructor nào' },
      { id: 'c', text: 'Chỉ khi class có khai báo constructor có tham số' },
      { id: 'd', text: 'Không bao giờ, phải luôn tự viết' },
    ],
    correctOptionIds: ['b'],
    explanation:
      'Nếu class đã khai báo ít nhất 1 constructor (kể cả có tham số), trình biên dịch sẽ KHÔNG tự thêm constructor mặc định nữa.',
  },
  {
    id: 'dong-goi-4',
    question: 'Từ khoá `this` trong một phương thức thành viên dùng để làm gì?',
    questionEn: 'What does the `this` keyword refer to inside an instance method?',
    options: [
      { id: 'a', text: 'Tham chiếu tới class cha', textEn: 'A reference to the parent class' },
      { id: 'b', text: 'Tham chiếu tới đối tượng hiện tại đang gọi phương thức', textEn: 'A reference to the current object invoking the method' },
      { id: 'c', text: 'Khai báo một biến tĩnh', textEn: 'Declares a static variable' },
      { id: 'd', text: 'Gọi phương thức main', textEn: 'Calls the main method' },
    ],
    correctOptionIds: ['b'],
    explanation:
      '`this` trỏ tới địa chỉ của đối tượng hiện tại — thường dùng để phân biệt tham số/biến cục bộ với field cùng tên.',
    explanationEn:
      '`this` holds the address of the current object — commonly used to disambiguate a parameter/local variable from a field of the same name.',
  },
  {
    id: 'dong-goi-5',
    question: 'Chọn TẤT CẢ phát biểu đúng về access modifier trong Java (câu này có thể có nhiều đáp án đúng):',
    questionEn: 'Select ALL correct statements about Java access modifiers (this question may have more than one correct answer):',
    options: [
      { id: 'a', text: 'private chỉ truy cập được trong chính class đó', textEn: 'private is only accessible within that class itself' },
      { id: 'b', text: 'public truy cập được ở bất kỳ đâu', textEn: 'public is accessible from anywhere' },
      { id: 'c', text: 'protected chỉ truy cập được trong cùng file', textEn: 'protected is only accessible within the same file' },
      { id: 'd', text: 'default truy cập được từ mọi package', textEn: 'default is accessible from every package' },
    ],
    correctOptionIds: ['a', 'b'],
    explanation:
      'private giới hạn trong class, public không giới hạn — hai phát biểu này đúng. protected thực ra truy cập được trong cùng package cộng với từ subclass ở package khác (không phải "chỉ cùng file"), và default chỉ truy cập được trong CÙNG package (không phải "mọi package") — nên (c) và (d) sai.',
    explanationEn:
      'private is limited to the class, public has no limit — both true. protected is actually accessible within the same package plus from subclasses in other packages (not "only the same file"), and default is only accessible within the SAME package (not "every package") — so (c) and (d) are false.',
  },
  {
    id: 'dong-goi-6',
    question: 'Package trong Java dùng để làm gì?',
    options: [
      { id: 'a', text: 'Tăng tốc độ chạy chương trình' },
      { id: 'b', text: 'Gom nhóm các class/interface liên quan lại với nhau theo namespace' },
      { id: 'c', text: 'Bắt buộc phải có ít nhất 1 constructor' },
      { id: 'd', text: 'Thay thế hoàn toàn cho access modifier' },
    ],
    correctOptionIds: ['b'],
    explanation:
      'Package là một namespace tổ chức các class/interface liên quan, giúp quản lý mã nguồn lớn dễ dàng hơn — tương tự khái niệm thư mục trên máy tính.',
  },
]
