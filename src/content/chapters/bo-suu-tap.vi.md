## Collection Framework in Java

Trong hầu hết các bài toán thực tế, dữ liệu liên quan đến một vấn đề thường là các nhóm, mỗi nhóm chứa nhiều object. Một nhóm object được gọi là một collection. Trong Java, một collection framework được giới thiệu để hỗ trợ công cụ quản lý collection dễ dàng hơn.

### Overview of Abstract Data Types

Một abstract data type (ADT) là một mô hình toán học cho một kiểu dữ liệu, được định nghĩa bởi hành vi (behavior) của nó theo góc nhìn người dùng. Trong Java, ADT thường được khai báo dưới dạng interface. `Collection`, `Set`, `Map` đều là ADT.

- Thêm phần tử mới (Add new element).
- Tìm kiếm một phần tử (Search an element).
- Xoá một phần tử (Remove an element).
- Duyệt (truy cập tất cả phần tử lần lượt).
- Sắp xếp các phần tử.

ADT (mô hình toán học, góc nhìn người dùng) trái ngược với data structure — cách biểu diễn cụ thể của dữ liệu (góc nhìn người hiện thực, góc nhìn vật lý).

### The Java Collections Framework

Java Collections Framework cung cấp một kiến trúc thống nhất để biểu diễn và thao tác trên các collection. Nó bao gồm interface, các hiện thực (implementation) và thuật toán để làm việc với các nhóm object.

- Giảm công sức lập trình bằng cách cung cấp sẵn data structure và thuật toán để bạn không phải tự viết.
- Tăng hiệu năng bằng cách cung cấp các hiện thực hiệu suất cao cho data structure và thuật toán.
- Cho phép tương tác (interoperability) giữa các API không liên quan bằng cách thiết lập một "ngôn ngữ chung" để truyền collection qua lại.
- Giảm công sức học API vì bạn chỉ cần học một bộ API collection nhỏ, thay vì nhiều API rời rạc, tự phát.
- Giảm công sức thiết kế và hiện thực API vì bạn không cần tự tạo ra các API collection tự phát.
- Khuyến khích tái sử dụng phần mềm bằng cách cung cấp một interface chuẩn cho collection và các thuật toán thao tác trên chúng.

![Collections framework interface structure](/images/bo-suu-tap/1.jpg "Cấu trúc phân cấp các interface trong Java Collections Framework")

![Collection Implementations](/images/bo-suu-tap/2.jpg "Bảng các class hiện thực tương ứng với từng interface và cách lưu trữ")

Để biết thêm chi tiết, xem [Javadoc](https://docs.oracle.com/javase/8/docs/technotes/guides/collections/overview.html).

## List and ArrayList

Tất cả reference tới các phần tử được lưu trong một array một chiều, gọi là array list. Cách tổ chức này có thể dùng để lưu các phần tử tuỳ ý (arbitrary) và chúng có thể trùng lặp (duplicated).

![ArrayList demonstration](/images/bo-suu-tap/3.jpg "Sơ đồ bộ nhớ minh hoạ một ArrayList chứa các đối tượng khác kiểu")

![ArrayList characteristics](/images/bo-suu-tap/4.jpg "Bảng các thao tác cơ bản và cách thực hiện trên List")

Nếu các object trong một collection không thuộc cùng một class, reference trong collection sẽ hoạt động như reference tới object của class `Object`. Dựa trên tính kế thừa (inheritance) của OOP, phép gán sau là hợp lệ: `Father_reference = Son_reference;`

Khi dùng generics, bạn có thể chỉ định kiểu phần tử để đảm bảo type safety và tránh phải cast.

```java
ArrayList<Rectangle> list = new ArrayList<>();
list.add(new Rectangle(2, 3));
Rectangle r = list.get(0); // No cast needed
```

### Demonstrations

**Demonstration 1:** sử dụng một ArrayList chứa các phần tử tuỳ ý (arbitrary elements).

![ArrayList arbitrary elements](/images/bo-suu-tap/5.jpg "Lớp Rectangle dùng trong ví dụ ArrayList chứa phần tử tuỳ ý")

![Objects of Rectangle in ArrayList](/images/bo-suu-tap/6.jpg "ArrayListDemo01: thêm phần tử tuỳ kiểu (int, String, Rectangle) vào cùng một ArrayList")

Thử nghiệm: nếu bạn muốn gọi một method riêng của subclass, bạn phải cast.

**Demonstration 2:** sử dụng một ArrayList để lưu các phần tử cùng kiểu (same-type elements).

![ArrayList same-type elements](/images/bo-suu-tap/7.jpg "ArrayListDemo02: ArrayList<Rectangle2> chỉ chứa các phần tử cùng kiểu")

**Demonstration 3:** quản lý danh sách sinh viên bằng ArrayList.

![Class Design](/images/bo-suu-tap/8.jpg "Sơ đồ thiết kế class: Inputter, Menu, Student, StudentList, StudentManager")

![Algorithm 1](/images/bo-suu-tap/9.jpg "Lớp Inputter: phương thức inputInt và inputStr")

![Algorithm 2](/images/bo-suu-tap/10.jpg "Lớp Inputter: phương thức inputNonBlankStr và inputPattern")

![Algorithm 3](/images/bo-suu-tap/11.jpg "Lớp Menu: phương thức getChoice cho ArrayList và mảng Object")

![Algorithm 4](/images/bo-suu-tap/13.jpg "Lớp Student: thuộc tính, constructor, toString, getter và setter")

![Algorithm 5](/images/bo-suu-tap/14.jpg "Lớp StudentList kế thừa ArrayList<Student>: constructor, search và isCodeDupplicated")

![Algorithm 6](/images/bo-suu-tap/15.jpg "Lớp StudentList: phương thức addStudent thêm sinh viên mới")

![Algorithm 7](/images/bo-suu-tap/16.jpg "Lớp StudentList: phương thức searchStudent tìm sinh viên theo mã")

![Algorithm 8](/images/bo-suu-tap/17.jpg "Lớp StudentList: phương thức updateStudent cập nhật tên và điểm")

![Algorithm 9](/images/bo-suu-tap/18.jpg "Lớp StudentList: phương thức removeStudent xoá sinh viên theo mã")

![Algorithm 10](/images/bo-suu-tap/19.jpg "Lớp StudentList: phương thức printAll in toàn bộ danh sách")

![Algorithm 11](/images/bo-suu-tap/20.jpg "Lớp StudentManager: phương thức main với vòng lặp menu")

Test case:

```
Student managing Program
1-Add new student
2-Search a student
3-Update name and mark
4-Remove a student
5-List all
6-Quit
Choose 1..6:
```

![Test cases](/images/bo-suu-tap/21.jpg "Bảng test case: input và kết quả cho từng lựa chọn của menu")

## Set and TreeSet

Một `Set` là một nhóm các object phân biệt (distinct). Class `TreeSet` lưu các phần tử trong một cấu trúc cây có thứ tự, tự cân bằng (self-balancing). Không cho phép trùng lặp.

![TreeSet structure](/images/bo-suu-tap/22.jpg "Cấu trúc cây: Root, Father, Child, Non-terminal node, Leaf")

`TreeSet` được hiện thực dưới dạng một cây có thứ tự, tự cân bằng. Nó đảm bảo chi phí thời gian `log(n)` cho các thao tác cơ bản (add, remove, contains).

- Phải duy trì một nhóm có thứ tự.
- Thao tác tìm kiếm phải có hiệu năng cao.
- Các phần tử phải implement `Comparable`, hoặc phải cung cấp một `Comparator`. Thứ tự mà set duy trì phải nhất quán với `equals` nếu muốn hiện thực đúng interface `Set`.

### Demonstrations

**Demonstration 1:** class `Student` không implement bất kỳ method so sánh nào, nên xảy ra lỗi compile-time.

![TreeSet error](/images/bo-suu-tap/23.jpg "Student không implement Comparable → ClassCastException khi thêm vào TreeSet")

**Demonstration 2:** `TreeSet` các số nguyên (`Integer` implement `Comparable`, không cho trùng lặp).

![TreeSet of integers](/images/bo-suu-tap/24.jpg "UseTreeSet: thêm, xoá và duyệt một TreeSet số nguyên bằng Iterator")

**Demonstration 3:** `TreeSet` các object tự định nghĩa (`Student`), với add, search, remove, duyệt tăng dần và giảm dần.

![TreeSet students a](/images/bo-suu-tap/25.jpg "Lớp Student implements Comparable<Student>, so sánh theo ID")

![TreeSet students b](/images/bo-suu-tap/26.jpg "Lớp StudentSet kế thừa TreeSet<Student>: tìm kiếm bằng ceiling")

![TreeSet students c](/images/bo-suu-tap/27.jpg "StudentPrg: khởi tạo StudentSet và thêm một số sinh viên")

![TreeSet students d](/images/bo-suu-tap/28.jpg "StudentPrg: tìm kiếm, duyệt tăng dần/giảm dần và xoá phần tử")

![TreeSet students output](/images/bo-suu-tap/30.jpg "Kết quả chạy chương trình TreeSet quản lý sinh viên")

## Map and HashMap

Một `Map` liên kết các key duy nhất với value. Class `HashMap` cung cấp một hiện thực dựa trên hash-table cho interface `Map`, cho phép truy cập value theo key nhanh chóng.

![Map structure](/images/bo-suu-tap/31.jpg "Mỗi phần tử của Map là một cặp Key (K) trỏ tới Value (V)")

Một `Map` giống như một cuốn từ điển. Map kiểm tra tính duy nhất của key dựa trên method `equals()`, không phải toán tử `==`. Key có thể là một số hoặc một chuỗi (ví dụ Student ID, product ID).

### Hash Function and Hash Table

Một hash-table là một tập hợp các sub-set, nhưng chỉ số vị trí được xác định bởi một hàm, gọi là hash function (h). Phép toán số học modulo (hay `mod`/`%` trong ngôn ngữ lập trình) thường được dùng trong hash function.

![Hash function and hash-table](/images/bo-suu-tap/32.jpg "Element (K,V) qua hash function h để xác định vị trí sub-set trong hash table")

Cách hiện thực này cung cấp hiệu năng thời gian hằng số (constant-time) cho các thao tác cơ bản (`get` và `put`), với điều kiện hash function phân tán các phần tử hợp lý giữa các bucket.

Để biết thêm chi tiết, xem [Javadoc](https://docs.oracle.com/javase/8/docs/api/java/util/HashMap.html).

### Demonstration

**Demonstration:** một hashmap rỗng được khởi tạo, sau đó một số person (nickName, person) được put vào và một số thao tác cơ bản trên hashmap được thực hiện.

![HashMap demo 1](/images/bo-suu-tap/33.jpg "Lớp Person: thuộc tính nickName, name, age và constructor")

![HashMap demo 2](/images/bo-suu-tap/34.jpg "Lớp PersonSet kế thừa HashMap<String, Person>: searchNick và removeNick")

![HashMap demo 3](/images/bo-suu-tap/35.jpg "Lớp PersonSet: printList_K và printList_V duyệt theo key và theo value")

![HashMap demo 4](/images/bo-suu-tap/36.jpg "PersonMng: khởi tạo PersonSet và thêm một số person")

![HashMap demo 5](/images/bo-suu-tap/37.jpg "PersonMng: in danh sách và tìm kiếm theo nickName")

![HashMap demo 6](/images/bo-suu-tap/38.jpg "PersonMng: duyệt theo keyset/values và xoá một person")

![HashMap output](/images/bo-suu-tap/39.jpg "Kết quả chạy chương trình quản lý person bằng HashMap")

## Supporting Classes

Cùng với Collections framework, package `java.util` còn chứa các supporting class (lớp hỗ trợ) hiện thực nhiều thao tác trên collection và array. Hầu hết các method này đều là `public static`. Các thao tác như sắp xếp (sorting), xáo trộn (shuffling), sao chép (copying), tìm kiếm (searching), phối hợp (composition), tìm giá trị cực trị (min, max), v.v. đều được hiện thực.

| Supporting class | Parameter of methods |
| --- | --- |
| `java.util.Collections` | Collection |
| `java.util.Arrays` | Array |

- [Read more Collections in Javadoc](https://docs.oracle.com/javase/8/docs/api/java/util/Collections.html)
- [Read more Arrays in Javadoc](https://docs.oracle.com/javase/8/docs/api/java/util/Arrays.html)

**Demonstration:** một `ArrayList` các employee sẽ được sắp xếp theo 2 cơ chế: (1) sắp xếp theo ID tăng dần; (2) sắp xếp theo salary giảm dần.

![Sorting ArrayList of employees](/images/bo-suu-tap/40.jpg "Lớp Employee implements Comparable<Employee>: so sánh mặc định theo ID")

![Sorting by salary](/images/bo-suu-tap/41.jpg "Lớp Employee: compareTo theo ID và Comparator sắp xếp theo salary giảm dần")

![Sorting output](/images/bo-suu-tap/42.jpg "EmployeeSorter: sắp xếp danh sách bằng Collections.sort với 2 tiêu chí")

![Sorting output 2](/images/bo-suu-tap/43.jpg "Kết quả danh sách trước và sau khi sắp xếp theo 2 cơ chế")

### Tóm tắt

- Abstract data type (ADT) là một mô hình toán học cho một kiểu dữ liệu, được xác định dựa trên sự tổng quát hoá, trong đó data structure được bỏ qua. Trong các ngôn ngữ lập trình, ADT thường được khai báo dưới dạng interface.
- `Collection`, `Set`, `Map` đều là ADT.
- Java Collections framework, trong package `java.util`, hỗ trợ tất cả các thao tác cơ bản, phổ biến trên collection và map; các thuật toán cơ bản trên collection và array được hiện thực trong 2 supporting class `Collections` và `Arrays`.

Gợi ý chọn class để quản lý một nhóm phần tử:

| Group characteristics | The class should be chosen |
| --- | --- |
| Phần tử có thể trùng lặp | `java.util.ArrayList` |
| Phần tử phải phân biệt, có thứ tự và mỗi thao tác cần hiệu năng cao | `java.util.TreeSet` |
| Mỗi phần tử chứa một key duy nhất và các thao tác cần hiệu năng rất cao | `java.util.HashMap` |

Với các thao tác bổ sung trên collection và array như sắp xếp, sao chép, v.v., tham khảo các class: `java.util.Collections` và `java.util.Arrays`.

### Course Slide

- [Collections.pdf](https://pro192web.netlify.app/resource/Collections.pdf)

### Reading

- [Support Classes.pdf](https://pro192web.netlify.app/resource/Support%20Classes.pdf)
