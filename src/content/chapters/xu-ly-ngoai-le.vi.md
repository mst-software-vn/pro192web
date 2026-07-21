## Exception

[What Is an Exception](#what-is-an-exception) | [Kinds of Exception](#kinds-of-exception) | [How to fix](#how-to-fix) | [Examples](#examples) | [Workshop](#workshop)

Một exception là một sự kiện (event) xảy ra trong quá trình thực thi (execution) của một chương trình, làm gián đoạn luồng thực thi bình thường của các instruction trong chương trình đó.

Khi một lỗi xảy ra bên trong một method, method đó sẽ tạo ra một object và trao nó cho runtime system. Object này, được gọi là exception object, chứa thông tin về lỗi, bao gồm type của lỗi và state của chương trình tại thời điểm lỗi xảy ra. Việc tạo một exception object và trao nó cho runtime system được gọi là throwing an exception (ném ra một exception).

[Đọc thêm](https://docs.oracle.com/javase/tutorial/essential/exceptions/index.html)

### What Is an Exception

Ví dụ:

- người dùng có thể nhập một filename không hợp lệ;
- một file được truy cập không tồn tại hoặc có thể chứa dữ liệu bị lỗi (corrupted);
- một network link có thể bị lỗi;
- …

Những trường hợp thuộc loại này được gọi là exception condition trong Java và được biểu diễn bằng object (tất cả exception đều kế thừa từ `java.lang.Throwable`).

Xem xét đoạn code gây ra một exception:

![exception code example](/images/xu-ly-ngoai-le/1.jpg "Ví dụ code gây ra ArithmeticException")

Tại dòng 4, method main gây ra một lỗi và method này tạo ra một exception object, có type là `ArithmeticException`. Sau đó JVM sẽ throw nó đến method main. Vì method main không làm gì để kiểm soát lỗi này, output sẽ trông như thế này.

Khi lỗi xảy ra tại dòng 4, statement tại dòng 5 sẽ bị bỏ qua (dismissed).

### Kinds of Exception

#### Checked exception

Checked exception là các exception được kiểm tra tại compile time. Bạn bắt buộc phải xử lý chúng bằng cơ chế try-catch hoặc cơ chế throws-declaration.

Ví dụ:

![checked exception example](/images/xu-ly-ngoai-le/2.jpg "Ví dụ checked exception với FileReader()")

Trong ví dụ trên, method `FileReader()` đang throw một exception đến đây. Vì vậy, bạn bắt buộc phải sử dụng cơ chế try-catch hoặc cơ chế throws để xử lý.

#### Unchecked exception

Một unchecked exception là một exception xảy ra tại thời điểm thực thi (execution). Đây cũng được gọi là Runtime Exception. Chương trình sẽ không gây ra lỗi compilation. Phần lớn các exception này xảy ra do dữ liệu xấu (bad data) được người dùng cung cấp trong quá trình tương tác giữa người dùng và chương trình.

Ví dụ:

![unchecked exception example](/images/xu-ly-ngoai-le/3.jpg "Ví dụ unchecked exception với truy cập mảng ngoài phạm vi")

Nếu bạn đã khai báo một array có kích thước 5 trong chương trình của mình, và cố gắng gọi phần tử thứ 6 của array đó thì

[Đọc thêm](https://stackify.com/types-of-exceptions-java/)

### How to fix

Chúng ta có thể sử dụng cơ chế try-catch hoặc cơ chế throws để xử lý nhằm tránh lỗi này.

#### try-catch mechanism

Xem xét luồng (flow) và cú pháp (syntax):

![try-catch syntax](/images/xu-ly-ngoai-le/4.jpg "Sơ đồ luồng và cú pháp try-catch-finally")

Statement try cho phép bạn định nghĩa một block code sẽ được kiểm tra lỗi trong khi nó đang được thực thi.

Statement catch cho phép bạn định nghĩa một block code sẽ được thực thi, nếu có lỗi xảy ra trong block try.

Statement finally cho phép bạn thực thi code, sau try...catch, bất kể kết quả là gì.

> **Lưu ý:** Bạn không thể sử dụng finally mà không có block try. Block finally là optional (tuỳ chọn).

Trong ví dụ DemoException2, chúng ta sẽ chỉnh sửa

![DemoException2 example](/images/xu-ly-ngoai-le/5.jpg "Ví dụ DemoException2 dùng try-catch")

Khi chương trình chạy đến dòng 14, nếu file tên "computer.txt" không tồn tại thì một exception object sẽ được tạo ra (có type là `FileNotFoundException`) bởi method main và JVM sẽ throw object đó đến block catch, variable e được sử dụng để lưu địa chỉ của object đó. Trong block catch, bạn có thể sử dụng variable e để lấy thông tin lỗi.

Output sẽ là:

```Block
something are wrong
try-catch is finished
```

Trong ví dụ ExceptionDemo_1, chúng ta sẽ chỉnh sửa

![ExceptionDemo_1 example](/images/xu-ly-ngoai-le/6.jpg "Ví dụ ExceptionDemo_1 dùng try-catch")

Khi bạn cố gắng lấy phần tử thứ 6, một exception object sẽ được tạo ra (có type là `ArrayIndexOutOfBoundsException`). JVM sẽ throw object đó đến block catch.

Output sẽ là:

```Block
1,2,3,4,5,something are wrong
try-catch is finished
```

#### throws mechanism

Trong ví dụ DemoException2, lỗi xảy ra trong main, để fix một checked exception chúng ta sử dụng keyword throws. Chúng ta sẽ chỉnh sửa:

![throws mechanism example](/images/xu-ly-ngoai-le/7.jpg "Ví dụ dùng throws để xử lý checked exception")

Output sẽ là: `something are wrong` nếu file tên "computer.txt" không tồn tại.

### Examples

Đoạn code dưới đây in ra "age is 20 or older" nếu age nhỏ hơn 20 hoặc nhập vào một đoạn text.

![age example code](/images/xu-ly-ngoai-le/8.jpg "Ví dụ code kiểm tra age với exception")

Khi code chạy đến dòng 20, nếu bạn nhập một đoạn text "hello" thì method này sẽ tạo ra một exception object và JVM sẽ throw nó đến block catch để xử lý. Output sẽ là:

![output for hello input](/images/xu-ly-ngoai-le/9.jpg "Kết quả khi nhập chuỗi \"hello\"")

Nếu bạn nhập 18 thì statement `throw new Exception()` sẽ tạo ra một exception object. Object này sẽ được throw đến block catch. Output sẽ là:

![output for 18 input](/images/xu-ly-ngoai-le/10.jpg "Kết quả khi nhập 18")

### Summary

- Một block try luôn được theo sau bởi một block catch, dùng để xử lý exception xảy ra trong block try tương ứng.
- Một block try duy nhất có thể có nhiều block catch liên kết với nó. [Xem catching multiple exceptions in java](https://docs.oracle.com/javase/7/docs/technotes/guides/language/catch-multiple.html)
- Một statement try có thể được lồng (nested) bên trong block try hoặc block catch của một statement try khác. [Xem Nesting of try/catch Blocks](https://beginnersbook.com/2013/04/nested-try-catch/#:~:text=When%20a%20try%20catch%20block,that%20that%20catch%20block%20executes.)
- Khi bạn viết một method gây ra một exception. Nếu bạn không muốn xử lý lỗi này, bạn có thể throw nó đến một method khác để xử lý lỗi bằng cách sử dụng keyword throws
- Bạn có thể tạo class exception của riêng mình [Xem Custom Exception Classes](https://www.javatpoint.com/custom-exception)

### Course slide

- [Exceptions.pdf](https://pro192web.netlify.app/resource/Exception%20Handling.pdf)

### Workshop

Hoàn thành [workshop2](https://pro192web.netlify.app/workshop/workshop2.pdf)