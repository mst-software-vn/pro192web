## Chào mừng đến với Hướng đối tượng (Object-Oriented)

### A Language for Complex Applications

Các ứng dụng phần mềm hiện đại phức tạp, có tính động và nhiều chi tiết. Số dòng code có thể lên đến hàng trăm nghìn hoặc hàng triệu dòng. Các ứng dụng này phát triển theo thời gian. Có những ứng dụng mất nhiều năm nỗ lực lập trình mới hoàn thiện. Việc xây dựng những ứng dụng như vậy cần nhiều lập trình viên với các mức độ chuyên môn khác nhau. Công việc của họ bao gồm các sub-project độc lập, có thể kiểm thử riêng; các sub-project này có thể chuyển giao, thực tiễn, nâng cấp được và thậm chí có thể tái sử dụng trong các ứng dụng tương lai khác. Các nguyên lý của kỹ thuật phần mềm gợi ý rằng mỗi thành phần nên có tính cohesive cao và tập hợp các thành phần nên loosely coupled. Các ngôn ngữ hướng đối tượng (object-oriented) cung cấp công cụ để hiện thực các nguyên lý này.

### COMPLEXITY

Các ứng dụng lớn thì phức tạp (complex). Chúng ta giải quyết tính phức tạp đó bằng cách xác định các đặc điểm quan trọng nhất của problem domain; tức là, lĩnh vực chuyên môn cần được xem xét để giải quyết vấn đề. Chúng ta diễn đạt các đặc điểm đó dưới dạng data và activity. Chúng ta xác định các data object và các activity trên các object đó như những nhiệm vụ bổ trợ lẫn nhau (complementary tasks).

Hãy xem xét một hệ thống đăng ký khoá học (course enrollment system) cho một chương trình tại một college hoặc university. Mỗi participant

- đăng ký nhiều face-to-face course
- đăng ký nhiều hybrid course
- nhận điểm (grade) ở mỗi course

Sơ đồ cấu trúc sau đây xác định các activity.

![Algorithmic structure diagram](/images/introduction-course/1.jpg "Sơ đồ cấu trúc thuật toán của hệ thống đăng ký khoá học")

Nếu chúng ta chuyển sự chú ý sang các object liên quan, chúng ta sẽ thấy một Course và một Hybrid Course. Tập trung vào Course, chúng ta quan sát thấy nó có một Course Code. Chúng ta lookup Code đó trong Calendar của institution để xác định thời điểm Course đó được offer.

Chúng ta nói rằng một Course có một Code và sử dụng (uses-a) một Grading Scheme, và rằng Hybrid Course là một loại (is-a-kind-of) Course. Sơ đồ dưới đây thể hiện các mối quan hệ này giữa các object trong problem domain này. Các connector xác định loại quan hệ. Connector hình tròn đóng (closed circle) biểu thị quan hệ has-a, connector hình tròn mở (open circle) biểu thị quan hệ uses-a và connector mũi tên (arrow) biểu thị quan hệ is-a-kind-of.

![Class relationships diagram](/images/introduction-course/2.jpg "Sơ đồ quan hệ giữa các lớp Course, Hybrid Course, Code và Grading Scheme")

Khi chuyển sự chú ý từ các activity trong structure chart sang các object trong relationship diagram, chúng ta đã chuyển từ một mô tả procedural về vấn đề sang một mô tả object-oriented.

Hai cách tiếp cận bổ trợ lẫn nhau này để làm chủ tính phức tạp đã có từ ít nhất thời Hy Lạp cổ đại. Heraclitus nhìn thế giới dưới góc độ quá trình (process), trong khi Democritus nhìn thế giới dưới góc độ **các atom rời rạc.**

Việc học cách chia một vấn đề phức tạp thành các object và xác định mối quan hệ giữa các object là nội dung của các môn system analysis and design. Nội dung được đề cập trong môn học này giới thiệu một số khái niệm chính của analysis and design cùng với cú pháp Java để hiện thực các khái niệm này trong code.

### Object Terminology

Giới thiệu về object và class, giới thiệu về encapsulation, inheritance và polymorphism

Lập trình hướng đối tượng (object-oriented programming) phản ánh cách chúng ta quản lý các công việc hằng ngày. Giáo sư Miller của Princeton University đã chứng minh rằng hầu hết chúng ta chỉ có thể tiếp nhận khoảng bảy chunk thông tin cùng một lúc. Khi còn nhỏ, chúng ta học cách chơi với các tập hợp chunk nhỏ từ sớm. Khi lớn lên, chúng ta học cách chia nhỏ các vấn đề gặp phải thành các tập hợp chunk có thể quản lý được.

Một chunk trong object-oriented programming được gọi là một object. Cấu trúc dùng chung của một tập hợp các object tương tự nhau được gọi là class của chúng. Cấu trúc dùng chung này bao gồm cấu trúc dữ liệu (data) trong các object tương tự đó cũng như logic thao tác trên dữ liệu đó.

Chương này giới thiệu các khái niệm object, class, encapsulation, inheritance và polymorphism. Các chương tiếp theo sẽ trình bày chi tiết từng khái niệm.

### ABSTRACTION

Các giải pháp lập trình cho các vấn đề của ứng dụng bao gồm các component. Quá trình thiết kế các giải pháp này liên quan đến abstraction. Trong ngôn ngữ lập trình C, chúng ta trừu tượng hoá (abstract) code chung, lưu nó trong một struct hoặc function và tham chiếu đến struct hoặc function đó từ nhiều nơi khác nhau trong source code, nhờ đó tránh được việc trùng lặp code.

Một giải pháp lập trình hướng đối tượng cho một vấn đề của ứng dụng bao gồm các component gọi là object. Quá trình thiết kế một giải pháp object-oriented cũng liên quan đến abstraction. Chúng ta xác định các đặc điểm quan trọng nhất của object, công khai (publicly) chúng và ẩn đi các chi tiết ít quan trọng hơn bên trong bản thân object đó.

![Abstraction diagram](/images/introduction-course/3.jpg "Sơ đồ minh hoạ khái niệm trừu tượng hoá (abstraction)")

Mỗi object có một ranh giới khái niệm rõ ràng (crisp conceptual boundary) và hoạt động theo cách phù hợp với chính nó. Hãy so sánh một cuốn sách (book) với một tập ghi chú (set of notes). Một cuốn sách có các trang được đóng lại (bound) và có thể lật (flipped). Thứ tự các trang là cố định. Một tập ghi chú bao gồm các trang rời có thể được sắp xếp lại theo bất kỳ thứ tự nào. Chúng ta biểu diễn cuốn sách như một object và tập ghi chú như một object khác; mỗi object có một cấu trúc khác nhau.

Ví dụ:

- Một cái tai không thể nhìn, một con mắt không thể nghe và một cái miệng không thể ngửi.
- Một con ngựa không thể sủa và một con chó không thể kêu ộp ộp (croak).

### CLASSES

Chúng ta mô tả cấu trúc của các object tương tự nhau dưới dạng class của chúng. Các object thuộc cùng một class có cùng cấu trúc, nhưng có thể có state khác nhau. Các loại variable mô tả state của chúng là giống nhau, nhưng thường có giá trị khác nhau. Ví dụ, tất cả các cuốn sách trong hình trên đều có title và author, nhưng mỗi cuốn sách có title và author khác nhau.

![Classes diagram](/images/introduction-course/4.jpg "Sơ đồ minh hoạ khái niệm lớp (class)")

Chúng ta nói rằng mỗi object là một instance của class của nó.

### UML

Unified Modelling Language (UML) là một ngôn ngữ modeling đa mục đích (general-purpose) được phát triển để mô tả các hệ thống object và mối quan hệ giữa các class của chúng. Ngôn ngữ này định nghĩa các ký hiệu chuẩn cho class và mối quan hệ giữa chúng.

![Class relationships diagram](/images/introduction-course/5.jpg "Sơ đồ UML mô tả quan hệ giữa các lớp")

#### The Class Diagram

Đồ hoạ chính trong UML là class diagram: một hình chữ nhật gồm ba ngăn (compartment):

- ngăn trên cùng xác định class bằng tên của nó
- ngăn giữa xác định tên và kiểu (type) của các attribute cùng với visibility
- ngăn dưới cùng xác định tên, kiểu return và kiểu parameter của các operation

trong đó visibility là một trong các loại sau:

- `+`: public
- `-`: private
- `#`: protected
- ` `: default (package)

![Class UML diagram](/images/introduction-course/6.jpg "Cấu trúc 3 ngăn của một class diagram trong UML")

#### Terminology

UML sử dụng các thuật ngữ attribute và operation. Một số ngôn ngữ hướng đối tượng sử dụng các thuật ngữ khác. Các thuật ngữ tương đương là:

- attribute (UML) -> field, data member, property, member variable
- operation (UML) -> method (Java), procedure, message, member function

### ENCAPSULATION

Encapsulation là khái niệm cốt lõi của object-oriented programming. Nó đề cập đến việc tích hợp data và logic trong implementation của một class, từ đó thiết lập một interface rõ ràng (crisp) giữa implementation và bất kỳ client nào. Encapsulation duy trì tính high cohesion bên trong một class và low coupling giữa implementation của class đó và bất kỳ client nào của nó.

Một class definition khai báo các variable và các function prototype. Các variable lưu trữ dữ liệu của mỗi object và các function chứa logic thao tác trên dữ liệu đó. Client truy cập object thông qua việc gọi các function này mà không cần biết về dữ liệu được lưu trữ bên trong object hay logic thao tác trên dữ liệu đó.

![Encapsulation diagram](/images/introduction-course/7.jpg "Sơ đồ minh hoạ khái niệm đóng gói (encapsulation)")

Một class được encapsulate tốt sẽ ẩn toàn bộ chi tiết implementation bên trong chính nó. Client không thấy được dữ liệu mà object của class đó lưu trữ bên trong nó hoặc logic mà nó sử dụng để quản lý dữ liệu nội bộ. Client chỉ thấy một interface sạch và đơn giản đến object đó.

Miễn là các class trong một giải pháp lập trình được encapsulate tốt, bất kỳ lập trình viên nào cũng có thể nâng cấp cấu trúc nội bộ của bất kỳ object nào do một lập trình viên khác phát triển mà không cần thay đổi bất kỳ client code nào.

### INHERITANCE AND POLYMORPHISM

Polymorphism liên kết implementation cho một object dựa trên type của nó. Trong hình dưới đây, object HybridCourse có một mode delivery khác so với object Course, nhưng cùng assessment. Cả hai object đều thuộc cùng một hierarchy: cả hai đều là object Course.

Một query `mode()` trên type Course sẽ trả về kết quả khác so với query `mode()` trên type Hybrid Course. Mặt khác, một query `assessments()` trên type Course sẽ trả về kết quả giống với trên type HybridCourse.

![Different behavior diagram](/images/introduction-course/8.jpg "Sơ đồ minh hoạ hành vi khác nhau giữa Course và HybridCourse")

![Identical behavior diagram](/images/introduction-course/9.jpg "Sơ đồ minh hoạ hành vi giống nhau giữa Course và HybridCourse")

Polymorphic programming cho phép chúng ta giảm thiểu việc trùng lặp code giữa các object thuộc cùng một inheritance hierarchy.

Encapsulation, inheritance và polymorphism là những nền tảng cốt lõi (cornerstone) của bất kỳ ngôn ngữ lập trình hướng đối tượng nào.

### Tóm tắt

- Object là các abstraction của những chunk thông tin quan trọng nhất từ một problem domain. Chúng phân biệt các tập hợp đặc điểm (feature set) khác nhau trong problem domain.
- Một class mô tả cấu trúc chung của một tập hợp các object tương tự nhau. Mỗi object trong tập hợp đó là một instance duy nhất của class của nó.
- Encapsulation ẩn các chi tiết implementation bên trong một class - dữ liệu nội bộ và logic nội bộ không thể nhìn thấy được đối với các client application sử dụng object của class đó.
- Chúng ta có thể nâng cấp cấu trúc của một class được encapsulate tốt mà không cần thay đổi bất kỳ client code nào.
- Những nền tảng cốt lõi của object-oriented programming là encapsulation, inheritance và polymorphism.

### Course Slide

- [Introduction.pdf](https://pro192web.netlify.app/resource/Introduction.pdf)