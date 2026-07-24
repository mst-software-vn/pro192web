# Tóm tắt nội dung từng chương

Tóm tắt ngắn gọn kiến thức của 11 chương, dựa trên nội dung gốc trong `docs/content/*/content.md` (bản scrape từ site cũ — dùng để tham khảo khi viết/mở rộng nội dung thật ở `src/content/chapters/`).

## 1. Chào mừng (Welcome)

Giới thiệu tổng quan môn PRO192: mô tả môn học, chuẩn đầu ra (hiểu OOP, cú pháp Java, đọc/ghi stream, xử lý ngoại lệ, quan hệ giữa các lớp, đa hình/đóng gói/kế thừa, lớp trừu tượng/interface, mảng đối tượng, Java Collections), chính sách học thuật (gian lận, đạo văn, bản quyền), và môn tiên quyết PRF192.

## 2. Introduction Course

Đặt vấn đề vì sao cần lập trình hướng đối tượng: độ phức tạp của phần mềm lớn, cách chia bài toán thành object/class thay vì chỉ theo hướng thủ tục. Giới thiệu thuật ngữ nền tảng — object, class, encapsulation, inheritance, polymorphism, abstraction — và cách biểu diễn class bằng sơ đồ UML (thuộc tính, phương thức, ký hiệu truy cập +/-/#).

## 3. Nền tảng (Foundations)

Java Virtual Machine và bytecode, các bước tạo/biên dịch/chạy một chương trình Java. Từ khoá và định danh, kiểu dữ liệu nguyên thuỷ và kiểu tham chiếu (mảng, class, interface), mảng một chiều và nhiều chiều, phạm vi biến (scope), toán tử và cấu trúc điều khiển (if/switch, vòng lặp, break/continue).

## 4. Đóng gói (Encapsulation)

Khái niệm class/field/method và cách thiết kế class từ danh từ (thuộc tính) và động từ (hành vi) của bài toán thực tế. Ví dụ xuyên suốt là class `Car`: constructor mặc định và có tham số (nạp chồng constructor), từ khoá `this`, getter/setter, package, và 4 mức truy cập `private/public/protected/default`.

## 5. Kế thừa (Inheritance)

Quan hệ "is-a", lớp cha/lớp con, từ khoá `extends` qua ví dụ `Item → Vase/Statue/Painting`. Cách field/method được kế thừa, ảnh hưởng của access modifier lên kế thừa, gọi constructor lớp cha bằng `super()` (bắt buộc là dòng đầu tiên), override cơ bản, khái niệm static type/dynamic type, toán tử `instanceof` và ép kiểu (casting) kèm rủi ro `ClassCastException`.

## 6. Đa hình (Polymorphism)

Nạp chồng (overloading) constructor/method theo số lượng và kiểu tham số, ghi đè (overriding) method với `@Override`, phân biệt static binding (nạp chồng, biên dịch) và dynamic binding (ghi đè, runtime). Lớp trừu tượng (`abstract class`, `abstract method`) và interface (`interface`, `implements`) — nền tảng cho đa hình và "đa kế thừa" kiểu dữ liệu trong Java.

## 7. Mảng đối tượng (Array of Objects)

Quản lý một danh sách đối tượng thuộc cùng hệ thừa kế bằng mảng tham chiếu kiểu lớp cha (`Item[]`), qua ví dụ `ItemList`/`AntiqueShop` hoàn chỉnh: thêm, tìm, sửa, xoá, lọc theo kiểu con, sắp xếp (bubble sort). Phần cuối tài liệu gốc còn lấn sang I/O Stream cơ bản, đọc/ghi file văn bản và serialization đối tượng (`java.io.Serializable`) — trùng một phần nội dung với chương Nhập xuất tệp do bản gốc gộp chung hai chủ đề trong cùng buổi học.

## 8. Bộ sưu tập (Collections)

Khái niệm Abstract Data Type (ADT) và Java Collections Framework. Ba cấu trúc chính: `List`/`ArrayList` (cho phép trùng, dùng generic để tránh ép kiểu), `Set`/`TreeSet` (phần tử duy nhất, luôn có thứ tự, cần `Comparable`/`Comparator`), `Map`/`HashMap` (khoá-giá trị, truy xuất qua hash function). Kèm bảng gợi ý chọn cấu trúc dữ liệu theo đặc điểm bài toán, và hai lớp hỗ trợ `java.util.Collections`/`java.util.Arrays`.

## 9. Bộ nhớ động (Dynamic Memory)

Ba vùng nhớ khi chương trình chạy: static heap (định nghĩa class), dynamic heap (đối tượng, cấp phát bằng `new`), và stack (biến cục bộ, tham số, bị xoá khi method kết thúc). Cấp phát động, gán `null` để đối tượng đủ điều kiện thu gom, và cơ chế Garbage Collector tự động giải phóng bộ nhớ trong Java (không cần `free`/`delete` thủ công).

## 10. Xử lý ngoại lệ (Exception Handling)

Khái niệm exception và vòng đời (tạo đối tượng exception, ném cho runtime xử lý). Phân biệt checked exception (bắt buộc xử lý lúc biên dịch) và unchecked exception (runtime). Cơ chế `try-catch-finally`, nhiều `catch` cho một `try`, `try-catch` lồng nhau, từ khoá `throws` để đẩy lỗi ra ngoài, và việc tự định nghĩa exception riêng.

## 11. Nhập xuất tệp (File IO)

Khái niệm I/O Stream và ba luồng chuẩn `System.in`/`System.out`/`System.err`. Dùng `Scanner` để đọc dữ liệu từ bàn phím (các phương thức `nextInt`, `nextLine`, `nextDouble`...), và đọc dữ liệu từ file văn bản bằng `BufferedReader`/`FileReader` kết hợp xử lý `IOException`.
