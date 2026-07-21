## Standard Input and Output

[I/O Streams](#io-stream) | [I/O from the Command Line](#io-from-the-command-line) | [Example](#example)

Topic này đề cập đến các class của nền tảng Java (Java platform) được sử dụng cho input và output cơ bản. Nó tập trung chủ yếu vào I/O Streams, một khái niệm mạnh mẽ giúp đơn giản hoá đáng kể các thao tác I/O.

### I/O Stream

Một I/O Stream đại diện cho một input source hoặc một output destination. Một stream có thể đại diện cho nhiều loại source và destination khác nhau, bao gồm disk file, device, các chương trình khác, và memory array.

Stream hỗ trợ nhiều loại data khác nhau, bao gồm byte đơn giản, primitive data type, ký tự được localize (localized character), và object. Một số stream chỉ đơn giản là truyền tải data; số khác lại thao túng (manipulate) và biến đổi (transform) data theo những cách hữu ích.

[Đọc thêm](https://docs.oracle.com/javase/tutorial/essential/io/streams.html)

### I/O from the Command Line

Một chương trình thường được chạy từ command line và tương tác với người dùng trong môi trường command line. Nền tảng Java hỗ trợ kiểu tương tác này theo hai cách: thông qua Standard Streams và thông qua Console.

Nền tảng Java hỗ trợ ba Standard Streams: Standard Input, được truy cập thông qua `System.in`; Standard Output, được truy cập thông qua `System.out`; và Standard Error, được truy cập thông qua `System.err`.

Các object này được định nghĩa tự động và không cần phải mở (opened). Standard Output và Standard Error đều dành cho output; việc có error output riêng biệt cho phép người dùng chuyển hướng (divert) output thông thường sang một file mà vẫn có thể đọc được các error message. Để biết thêm thông tin, hãy tham khảo [tài liệu](https://docs.oracle.com/javase/tutorial/essential/io/cl.html) của command line interpreter mà bạn đang sử dụng.

Để lấy input từ người dùng, chúng ta cũng có thể sử dụng class Scanner [(Scanning)](https://docs.oracle.com/javase/tutorial/essential/io/scanning.html). Class này hỗ trợ một số method để lấy các loại giá trị khác nhau từ người dùng

| Method | Mô tả |
| --- | --- |
| `nextBoolean()` | Đọc một giá trị boolean từ người dùng |
| `nextByte()` | Đọc một giá trị byte từ người dùng |
| `nextDouble()` | Đọc một giá trị double từ người dùng |
| `nextFloat()` | Đọc một giá trị float từ người dùng |
| `nextInt()` | Đọc một giá trị int từ người dùng |
| `nextLine()` | Đọc một giá trị String từ người dùng |
| `nextLong()` | Đọc một giá trị long từ người dùng |
| `nextShort()` | Đọc một giá trị short từ người dùng |

### Example

![Example](/images/nhap-xuat-tep/1.png "Ví dụ đọc dữ liệu từ người dùng bằng Scanner")

Trong ví dụ trên, chúng ta cần import library class Scanner từ package java.util.Scanner. Để sử dụng class này ở dòng 10, chúng ta khai báo variable sc và tạo một object từ class này. Tại sao chúng ta cần điều này? Đừng lo, khi bạn đến với topic class and object, bạn sẽ được giải thích tại sao phải làm như vậy.

Tại dòng 11, một message Enter number of elements được in ra.

Tại dòng 12, statement `sc.nextLine()` dùng để lấy một string từ người dùng, sau đó chúng ta sử dụng `Integer.parseInt()` để convert string được nhập vào thành giá trị integer.

Tại dòng 19, `System.out.format` được sử dụng trong Java để format output.

### Summary

- Cách dễ dàng để lấy dữ liệu người dùng là sử dụng library class Scanner
- Sử dụng System.out để in dữ liệu ra console
- Chúng ta có thể convert một string thành số bằng cách sử dụng một số class như Integer, Float,....

### Reading from a File

```java
try (BufferedReader br = new BufferedReader(new FileReader("input.txt"))) {
    String line;
    while ((line = br.readLine()) != null) {
        System.out.println(line);
    }
} catch (IOException e) {
    e.printStackTrace();
}
```