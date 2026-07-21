## Foundations

### Java Virtual Machine

Java Virtual Machine là một abstract computing machine. Giống như một máy tính thật, nó có một instruction set và thao tác trên nhiều memory area khác nhau tại run time. Việc hiện thực một programming language bằng cách sử dụng một virtual machine là khá phổ biến; virtual machine nổi tiếng nhất có lẽ là P-Code machine của UCSD Pascal. [Xem Wiki để biết chi tiết.](https://en.wikipedia.org/wiki/Java_virtual_machine)

![Java Virtual Machine](/images/nen-tang/1.jpg "Overview of a Java virtual machine (JVM) architecture based on The Java Virtual Machine Specification Java SE 7 Edition")

### Platform Independence

Chìa khoá giúp Java giải quyết được cả vấn đề security lẫn portability là ở chỗ output của một Java compiler không phải là executable code. Thay vào đó, nó là ByteCode - một tập instruction được tối ưu hoá cao, được thiết kế để thực thi bởi hệ thống runtime của Java, được gọi là Java Virtual Machine (JVM).

### Demo: First Program

Các bước:

1. Tạo một project NetBeans Java mới
2. Thêm một class Java
3. Viết code
4. Compile/Chạy chương trình

![First Java Program](/images/nen-tang/2.jpg "Bước 1 - Tạo project mới")

![Step 2](/images/nen-tang/3.jpg "Bước 2 - Thêm class Java")

![Step 2.2](/images/nen-tang/4.jpg "Bước 2.2 - Viết code")

![Step 3](/images/nen-tang/5.jpg "Bước 3 - Biên dịch chương trình")

![Step 4](/images/nen-tang/6.jpg "Bước 4 - Chạy chương trình")

### Keywords and Identifiers

Keywords: Hầu hết tất cả đều tương tự như trong ngôn ngữ C.

![Keywords](/images/nen-tang/7.jpg "Danh sách từ khoá trong Java")

### Data Types

Java là một strongly typed language. Sau đây là các data type và cách khai báo của chúng.

Khai báo (declaration):

```java
Type var [=Initial value];

int RollID;
char type='A';
```

![Primary Data Types](/images/nen-tang/8.jpg "Các kiểu dữ liệu nguyên thuỷ (primary data types)")

#### Reference Type

Sau đây là các reference type trong Java.

- Array
- Class Object
- Interface

```java
int[] ar;
ar= new int[3];
ar[0]=1; ar[1]=2; ar[2]=3;
```

![Reference Data Types](/images/nen-tang/9.jpg "Các kiểu dữ liệu tham chiếu (reference data types)")

![Array](/images/nen-tang/10.jpg "Minh hoạ mảng trong bộ nhớ")

### Scope

Scope của một declaration là phần của chương trình mà declaration đó có thể được nhìn thấy (visible). Scope bao gồm:

- Function scope - visible với source code bên trong function
- Class scope - visible với các member function của class
- Block scope - visible với block code đó
- Global scope - visible với toàn bộ chương trình
- File scope - visible với source code bên trong file

Scope của một non-global declaration bắt đầu tại declaration đó và kết thúc tại closing brace của declaration đó. Một non-global declaration được gọi là local declaration.

### One Dimensional Arrays

Một array là một container object chứa một số lượng cố định các giá trị thuộc cùng một type. Độ dài (length) của array được thiết lập khi array được tạo ra. Mỗi item trong array được gọi là một element, và mỗi element được truy cập thông qua chỉ số (numerical index) của nó.

![One Dimensional Array](/images/nen-tang/11.jpg "Minh hoạ mảng một chiều")

```java
int[] ar;  // for detail click here
float anArrayOfFloats[];
```

### Multiple Dimensional Arrays

Xem xét ví dụ:

```java
public static void main(String[] args) {
    int m[][]= { {1,2,3,4}, {91,92}, {2001,2002}};
    int[] replacement = {5,6,7,8,9,10};
    m[1]= replacement;
    for(int i=0;i<3;i++){
        for(int j=0;j<m[i].length;j++){
            System.out.println(m[i][j]);
        }
    }
}
```

Đây là một sơ đồ bộ nhớ mẫu (sample memory map) của đoạn code trên

![2D Array Memory Map](/images/nen-tang/13.jpg "Sơ đồ bộ nhớ của mảng hai chiều")

Chúng ta đã tạo ra một multidimensional array tên là m, nó chứa 8 element. Variable m đang lưu giá trị: 8000 chính là địa chỉ của một array. m có thể được xem như một array chứa các array một chiều (array of one-dimensional array). Trong ví dụ trên, statement: m[1]=replacement để gán 1000 cho m tại index 1. Bây giờ, m có thể chứa 12 element. output: 1,2,3,4,5,6,7,8,9,10,2001,2002

### Operators

![Operators](/images/nen-tang/14.jpg "Bảng toán tử trong Java theo thứ tự ưu tiên giảm dần")

![Bitwise Operators Demo](/images/nen-tang/15.png "Ví dụ chạy thực tế các toán tử bitwise (dịch bit, AND, OR, XOR) và instanceof trên NetBeans")

![Bitwise Operators Concept](/images/nen-tang/16.png "Cách biểu diễn nhị phân và cơ chế hoạt động của toán tử dịch bit (<<, >>, >>>) cùng toán tử bitwise (AND, OR, XOR)")

### Logic constructs

Các statement bên trong source file của bạn thường được thực thi từ trên xuống dưới, theo thứ tự chúng xuất hiện. Tuy nhiên, các control flow statement lại phá vỡ luồng thực thi bằng cách sử dụng decision making, looping và branching, cho phép chương trình của bạn thực thi có điều kiện các block code cụ thể. Phần này mô tả các decision-making statement (if-then, if-then-else, switch), các looping statement (for, while, do-while), và các branching statement (break, continue, return) được hỗ trợ bởi ngôn ngữ lập trình Java.

- [If statement](https://docs.oracle.com/javase/tutorial/java/nutsandbolts/if.html) [for detail]
- [Switch statement](https://docs.oracle.com/javase/tutorial/java/nutsandbolts/switch.html) [for detail]
- [While, do, for statements](https://docs.oracle.com/javase/tutorial/java/nutsandbolts/while.html) [for detail]

### Summary

- Một declaration liên kết một identifier với một type
- Một definition gắn ý nghĩa cho một identifier và là một executable statement
- Scope của một declaration là phần của chương trình mà trong đó declaration được nhìn thấy (visible)
- Các type trong Java là primitive type và reference type

### Course Slide

- [Learning the Java Language.pdf](https://pro192web.netlify.app/resource/Learning%20the%20Java%20Language.pdf)

### Reading

- [Download & Install JDK & NetBeans 8.pdf](https://pro192web.netlify.app/resource/Download%20&%20Install%20JDK%20&%20NetBeans%208.pdf)
- [Get Start.pdf](https://pro192web.netlify.app/resource/Get%20start.pdf)
- [Numbers and Strings.pdf](https://pro192web.netlify.app/resource/Numbers%20and%20Strings.pdf)