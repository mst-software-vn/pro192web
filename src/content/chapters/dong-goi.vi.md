## Class and Object

### Class

Ở chủ đề trước, chúng ta đã thấy thuật ngữ "class" nhưng chưa xem xét đầy đủ về ý nghĩa của nó. Bây giờ chúng ta có thể thiết lập một định nghĩa hữu ích:

Một class là một đơn vị tổ chức (organisational unit) của một thiết kế và chương trình Object Oriented.

[Xem định nghĩa class trên trang w3schools](https://www.w3schools.com/java/java_oop.asp)

[Xem định nghĩa class từ các tác giả khác](https://open.umn.edu/opentextbooks/textbooks/java-java-java-object-oriented-problem-solving?fbclid=IwAR2_jsAY7ldx2i-178wHimdAkCz0k65ZBVUR7G7OJSNpN3cikA3sPlGQBcQ)

- **Highly cohesive**: class đại diện cho một entity hoặc một organisational unit hữu ích duy nhất và thực hiện tốt công việc đó.
- **Minimally coupled**: class giới hạn tương tác với các class khác chỉ ở những gì thực sự cần thiết để nó thực hiện được chức năng đã được thiết kế.
- **Encapsulation**: class giữ private những thông tin cần thiết cho hoạt động nội bộ của nó và không expose ra cho các class khác, chỉ public những thông tin cần thiết.

Vì vậy, bất cứ khi nào chúng ta muốn tạo một chương trình OO, chúng ta nên suy nghĩ về khái niệm OO design và cân nhắc những class hoặc entity nào cần tạo, dựa trên các nguyên lý high cohesion, low coupling và encapsulation làm kim chỉ nam.

Một định nghĩa formal của class bao gồm hai thành phần chính: Fields (Attributes) và Methods (Behaviors)

> **Đây là thời điểm tốt để bắt đầu.**

> **Vấn đề:** Một chiếc sports car có thể có nhiều màu sắc khác nhau, với engine power từ 100 HP đến 200 HP. Nó có thể là convertible hoặc regular model. Chiếc xe có một nút bấm để khởi động engine và một parking brake. Khi parking brake được nhả ra và bạn nhấn accelerator, xe sẽ di chuyển theo hướng được xác định bởi cài đặt transmission.

**Design guideline:**

1. **Tìm các danh từ chính (main nouns)**, class thường được mô tả bởi các danh từ chính trong đề bài.
2. **Tìm các danh từ phụ (auxiliary nouns)** mô tả chi tiết của danh từ chính, Fields hoặc Attributes thường được mô tả bởi các danh từ phụ.
3. **Tìm các động từ (verbs)**, methods hoặc behaviors thường được mô tả bởi động từ.
4. **Tìm mối quan hệ (relationship)** giữa các class. TIPS: *Nếu đề bài của bạn có hai danh từ chính, chúng thường có mối quan hệ với nhau.*

![Encapsulation example 1](/images/dong-goi/1.jpg "Phân tích danh từ chính, danh từ phụ và động từ trong đề bài Car")

Chúng ta sử dụng Unified Modeling Language (UML) để mô tả cấu trúc class. UML cung cấp cơ chế để biểu diễn các thành viên của class, như attribute và method, cùng với các thông tin bổ sung.

[Đọc bài viết này để biết thêm về UML](https://en.wikipedia.org/wiki/Class_diagram)

Một UML class diagram được sử dụng để biểu diễn class Car

![Encapsulation example 2](/images/dong-goi/2.jpg "UML class diagram của lớp Car với 3 ngăn: class name, fields, methods")

#### Cách vẽ cấu trúc class?

- đặt danh từ chính (Car) làm class name
- đặt các danh từ phụ (các danh từ mô tả chi tiết của Car) làm fields
- đặt các động từ làm methods
- Để chỉ định visibility của một thành viên trong class (tức là bất kỳ attribute hoặc method nào), các ký hiệu (`-`,`+`,`#`,`~`) phải được đặt trước tên thành viên đó. (Trong Java, `~` được thay bằng `''`). [Xem thêm các ký hiệu](https://en.wikipedia.org/wiki/Class_diagram)

Bây giờ, bạn sẽ hiện thực class này trong Java. Trong editor của bạn, tạo một file mới tên `Car.java` (Lưu ý: tên file phải trùng với tên class). Code của class Car:

```java
public class Car {
    //fields
    private String Colour;
    private int EnginePower;
    private boolean Convertible;
    private boolean parkingBrake;

    //methods
    public Car(){
        Colour="";
        EnginePower=0;
        Convertible=false;
        parkingBrake=false;
    }

    public Car(String Colour, int EnginePower, boolean Convertible, boolean parkingBrake) {
        this.Colour = Colour;
        this.EnginePower = EnginePower;
        this.Convertible = Convertible;
        this.parkingBrake = parkingBrake;
    }

    public void pressStartButton(){
        System.out.println("You can press the star button");
    }

    public void pressAcceleratorButton(){
        System.out.println("You can press the accelerator button");
        System.out.println("Colour:"+ Colour);
        System.out.println("Engine power:"+ EnginePower);
        System.out.println("Convertible:"+ Convertible);
        System.out.println("parking brake:"+ parkingBrake);
    }

    public void setColour(String Colour) {
        this.Colour = Colour;
    }

    public String getColour() {
        return Colour;
    }

    public int getEnginePower() {
        return EnginePower;
    }

    public void setEnginePower(int EnginePower) {
        this.EnginePower = EnginePower;
    }
}
```

![Demo Car Class](/images/dong-goi/3.jpg "Demo chạy chương trình Car Class")

![Output Car Class](/images/dong-goi/4.jpg "Kết quả xuất ra console của Car Class")

### Constructor

Để encapsulation được hoàn chỉnh, cần có một cơ chế để khởi tạo (initialize) các data member ngay tại thời điểm creation-time. Nếu không được khởi tạo tại creation-time, các data member của object sẽ chứa các giá trị undefined cho đến khi client code gọi một modifier để set giá trị đó.

Hàm thành viên đặc biệt mà bất kỳ object nào cũng gọi tại thời điểm creation-time được gọi là constructor của class đó.

Trong ví dụ trên, method đặc biệt `Car(){...}` được thêm vào file `Car.java`. Nó được gọi là default constructor. Do đó, tất cả field của c hoặc c2 được gán các giá trị rỗng (empty). Các giá trị này được gọi là state của object. Việc khởi tạo instance variable của object trong constructor đảm bảo rằng object có một well-defined state ngay từ thời điểm nó được tạo ra.

Default constructor lấy tên của nó theo tên của chính class đó. Prototype của constructor không tham số này có dạng `ClassName()`

#### Overloading Constructor

Overloading constructor của một class giúp bổ sung thêm các tuỳ chọn giao tiếp cho client code. Client code có thể chọn tập argument phù hợp nhất tại thời điểm creation-time.

![Encapsulation8](/images/dong-goi/5.jpg "Minh hoạ đối tượng c3 gọi constructor có tham số")

Method này được gọi là constructor with parameters.

![Encapsulation9](/images/dong-goi/6.jpg "Đối tượng c3 được khởi tạo với các giá trị {\"red\", 100, true, true}")

Trong đoạn code trên, object thứ ba c3 được tạo ra và c3 gọi constructor with parameters. Tất cả field của c3 được gán là `{"red", 100, true, true}`.

![Encapsulation10](/images/dong-goi/7.jpg "Trạng thái các trường của đối tượng c3 sau khi khởi tạo")

Vì c3 gọi `pressAcceleratorButton()`, state của c3 được in ra.

![Encapsulation11](/images/dong-goi/8.jpg "Kết quả in ra khi c3 gọi pressAcceleratorButton()")

> **Lưu ý:** Nếu class definition có prototype cho một constructor có tham số nhưng không có prototype cho constructor không tham số (no-argument default constructor), thì compiler SẼ KHÔNG chèn thêm một empty-body, no-argument default constructor. Compiler chỉ chèn empty-body, no-argument default constructor nếu class definition không khai báo BẤT KỲ constructor nào.

Tất cả các method được hiện thực trong class Car tại thời điểm này được gọi là member method/function.

### The current Object

Khi chạy `c1.pressAcceleratorButton();`, c1 gọi method => object (được xử lý bởi c1) là current object tại thời điểm đó.

Khi chạy `c2.pressAcceleratorButton();`, c2 gọi method => object (được xử lý bởi c2) là current object tại thời điểm đó.

#### This

Keyword `this` trả về địa chỉ của current object. Tức là, this lưu giữ địa chỉ của vùng bộ nhớ chứa toàn bộ dữ liệu được lưu trong instance variable của current object.

**Scope của this:** This được tạo ra và sử dụng chỉ khi member method được gọi. Sau khi member method kết thúc, this sẽ bị discard.

![Encapsulation12](/images/dong-goi/9.jpg "Con trỏ this trỏ đến địa chỉ 4000 của đối tượng c3")

Khi vào constructor with parameters, con trỏ this được Java tạo ra và nó lưu giữ địa chỉ của object (4000). c3 và this đang trỏ đến cùng current object. Sử dụng this ở đây để phân biệt local variable và instance variable/field. Sau khi gán giá trị của các input parameter cho instance variable của c3, this sẽ bị discard.

> **TIPS:** Nếu parameter (formal argument) của một member method trùng tên với instance variable/field, chúng ta sẽ sử dụng keyword this để phân biệt local variable và instance variable.

### Member functions

Member function là các function có declaration nằm bên trong class definition và thao tác trên các data member của class.

Tại thời điểm này, class Car chứa các member function như sau:

![Encapsulation13](/images/dong-goi/10.jpg "Danh sách các member function trong lớp Car")

Sau khi một object được tạo ra và được gán các giá trị mặc định (default values). Bây giờ, nếu bạn muốn set một instance variable thành giá trị khác. Ví dụ, chỉ thay đổi instance variable colour của c3 thành `'black'`. Giải pháp cho trường hợp này là gì?

Không sao, chúng ta sẽ thêm một method `setColour()` vào thiết kế class Car. Code như sau:

![Encapsulation14](/images/dong-goi/11.jpg "Thêm phương thức setColour() vào lớp Car")

Đoạn code main:

![Encapsulation15](/images/dong-goi/12.jpg "Gọi c3.setColour(\"black\") trong hàm main")

Con trỏ c3 gọi `setColour("black")`. Do đó, tại thời điểm này `this.Colour=...` được sử dụng để truy cập instance variable của c3.

Tương tự ý tưởng trên, nếu bạn muốn lấy giá trị của một instance variable, bạn nên thêm một method `getColour()`

![Encapsulation16](/images/dong-goi/13.jpg "Thêm phương thức getColour() vào lớp Car")

Bạn cũng có thể thêm các getter/setter khác. Code hoàn chỉnh:

```java
public class Car {
    //fields
    private String Colour;
    private int EnginePower;
    private boolean Convertible;
    private boolean parkingBrake;

    //methods
    public Car(){
        Colour="";
        EnginePower=0;
        Convertible=false;
        parkingBrake=false;
    }

    public Car(String Colour, int EnginePower, boolean Convertible, boolean parkingBrake) {
        this.Colour = Colour;
        this.EnginePower = EnginePower;
        this.Convertible = Convertible;
        this.parkingBrake = parkingBrake;
    }

    public void pressStartButton(){
        System.out.println("You can press the star button");
    }

    public void pressAcceleratorButton(){
        System.out.println("You can press the accelerator button");
        System.out.println("Colour:"+ Colour);
        System.out.println("Engine power:"+ EnginePower);
        System.out.println("Convertible:"+ Convertible);
        System.out.println("parking brake:"+ parkingBrake);
    }

    public void setColour(String Colour) {
        this.Colour = Colour;
    }

    public String getColour() {
        return Colour;
    }

    public int getEnginePower() {
        return EnginePower;
    }

    public void setEnginePower(int EnginePower) {
        this.EnginePower = EnginePower;
    }
}
```

**Output:**

```Block
You can press the star button
You can press the accelerator button
Colour: Engine power:0 Convertible:false parking brake:false
You can press the accelerator button
Colour: Engine power:0 Convertible:false parking brake:false
You can press the accelerator button
Colour:red Engine power:100 Convertible:true parking brake:true
Colour of c3:black
```

> **TIPS:** Một class thường có bốn nhóm method. Constructor, getter, setter và các method logic khác. Bất kỳ method nào được đặt trong class sẽ thao tác trên các field trong class đó.

## Package

Một *package* là một namespace tổ chức một tập hợp các class và interface liên quan với nhau. Về mặt khái niệm, bạn có thể xem package tương tự như các folder khác nhau trên máy tính của mình.

Vì phần mềm viết bằng ngôn ngữ lập trình Java có thể được cấu thành từ hàng trăm hoặc hàng nghìn class riêng lẻ, nên việc giữ mọi thứ có tổ chức bằng cách đặt các class và interface liên quan vào các package là hợp lý.

[Xem thêm tại Oracle](https://docs.oracle.com/javase/tutorial/java/concepts/package.html)

[Xem thêm tại trang khác](https://www.geeksforgeeks.org/java/packages-in-java/)

### Tạo một package

Để tạo một package, bạn chọn một tên cho package và đặt một package statement với tên đó ở đầu mỗi source file có chứa các type (class, interface, enumeration và annotation type) mà bạn muốn đưa vào package.

Package statement (ví dụ, `package mypkg;`) phải là dòng đầu tiên trong source file. Chỉ có thể có một package statement trong mỗi source file, và nó áp dụng cho tất cả các type trong file đó.

![Package Example](/images/dong-goi/14.jpg "Ví dụ package mypkg với lớp PkgDemo trong NetBeans")

[Đọc thêm](https://docs.oracle.com/javase/tutorial/java/package/createpkgs.html)

## Access Modifier

Để chỉ định visibility của một thành viên trong class (tức là bất kỳ attribute hoặc method nào), chúng ta sử dụng:

- Private: `-`
- Public: `+`
- Protected: `#`
- Default: nếu không có ký hiệu nào, nó được coi là default

Các keyword này được gọi là access modifier

![Encapsulation20](/images/dong-goi/15.jpg "Bảng ký hiệu các access modifier trong UML")

Hãy cùng hiểu về access modifier trong Java qua một bảng đơn giản.

![Encapsulation21](/images/dong-goi/16.jpg "Bảng so sánh phạm vi truy cập của private, default, protected, public")

### Private

Access modifier private chỉ có thể truy cập được bên trong class đó.

Chúng ta cắt method main trong file `Car.java`. Dán nó vào một file khác tên là `Tester.java`.

```java
public class Tester {
        public static void main(String[] args) {
          Car c=new Car();
          c.pressStartButton();
          c.pressAcceleratorButton();

          Car c2=new Car();
          c2.pressAcceleratorButton();

          Car c3=new Car("red", 100, true, true);
          c3.pressAcceleratorButton();
          c3.setColour("black");
          System.out.println("Colour of c3:" + c3.getColour());
          //access the instance variable Colour of c
          c.Colour="Gray"; // error
    }
}
```

Trong method main, việc sử dụng `c.Colour="Gray"` sẽ gây ra lỗi vì đây là private data. Ngoài ra, tất cả private member đều không thể truy cập được từ class khác

### Public

Access modifier public có thể truy cập được ở mọi nơi.

Trong ví dụ trên, class Car là public để có thể sử dụng nó ở mọi nơi. Trong `Tester.java`, chúng ta cũng có thể truy cập các public method.

### Default

Nếu bạn không sử dụng modifier nào, nó được coi là default theo mặc định. Default modifier chỉ có thể truy cập được trong cùng package. Nó không thể được truy cập từ bên ngoài package. Nó cung cấp khả năng truy cập rộng hơn private. Nhưng nó lại restrictive hơn protected và public.

Chỉnh sửa file `Car.java`

```java
package A;
public class Car {
    //fields
    private String Colour;
    private int EnginePower;
    private boolean Convertible;
    private boolean parkingBrake;
    //methods
    public Car(){
        Colour="";
        EnginePower=0;
        Convertible=false;
        parkingBrake=false;
    }

    public Car(String Colour, int EnginePower, boolean Convertible, boolean parkingBrake) {
        this.Colour = Colour;
        this.EnginePower = EnginePower;
        this.Convertible = Convertible;
        this.parkingBrake = parkingBrake;
    }

    void pressStartButton(){
        System.out.println("You can press the star button");
    }
}
```

Chỉnh sửa file `Tester.java`

```java
package B;
import A.Car;
public class Tester {
        public static void main(String[] args) {
          Car c=new Car();
          c.pressStartButton();        // error
          c.pressAcceleratorButton();

          Car c2=new Car();
          c2.pressAcceleratorButton();

          Car c3=new Car("red", 100, true, true);
          c3.pressAcceleratorButton();
          c3.setColour("black");
          System.out.println("Colour of c3:" + c3.getColour());
    }
}
```

Vì method `pressStartButton()` là default, trong method main chúng ta không thể gọi nó.

### Protected

Access modifier protected có thể truy cập được trong cùng package và cả ngoài package nhưng chỉ thông qua inheritance.

## Tóm tắt

- Encapsulation là một cách đóng gói data và method chung vào một unit.
- Để đạt được encapsulation, khai báo các field là private
- Cung cấp các public get và set method để truy cập và cập nhật giá trị của một private variable
- Constructor là một hàm thành viên đặc biệt mà một object gọi tại thời điểm creation-time, tên của constructor là tên của class, không có return type
- Compiler sẽ chèn một constructor với body rỗng vào bất kỳ class definition nào không khai báo constructor
- Các giá trị hiện tại được lưu trong instance variable của một object được gọi là state

### Course Slide

- [Encapsulation.pdf](https://pro192web.netlify.app/resource/Encapsulation.pdf)