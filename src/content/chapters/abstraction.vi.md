## Abstraction (Trừu tượng)

### Trừu tượng là gì?

Abstraction (tính trừu tượng) là một trong bốn trụ cột của Lập trình Hướng đối tượng, cùng với Encapsulation (Đóng gói), Inheritance (Kế thừa) và Polymorphism (Đa hình). Nó có nghĩa là chỉ để lộ ra những tính năng thiết yếu của một object — object đó *làm được gì* — trong khi ẩn đi chi tiết bên trong *cách nó làm điều đó như thế nào*.

Một ví dụ trực quan: khi lái xe hơi, bạn chỉ tương tác với một tập hợp nhỏ các điều khiển đã được định nghĩa rõ ràng — vô lăng, bàn đạp, cần số. Bạn không cần biết hệ thống phun nhiên liệu, quá trình đốt cháy hay hộp số hoạt động bên trong như thế nào. Người thiết kế xe đã trừu tượng hoá một cỗ máy phức tạp thành một giao diện lái xe đơn giản.

Trong Java, tính trừu tượng được hiện thực qua hai cơ chế ngôn ngữ:

- **Abstract class (lớp trừu tượng)** — một class không thể tự khởi tạo, dùng làm nền tảng chung định nghĩa *những gì* các lớp con phải làm, đồng thời có thể cung cấp sẵn một phần hiện thực dùng chung.
- **Interface** — một hợp đồng thuần tuý định nghĩa *những gì* một class có thể làm, mà không quy định *làm như thế nào*, và không có state (trạng thái) dùng chung nào cả.

Rất dễ nhầm lẫn giữa abstraction và encapsulation, vì cả hai đều liên quan đến việc "ẩn" một thứ gì đó:

| | Encapsulation | Abstraction |
|---|---|---|
| Ẩn đi | **State** bên trong (các field) | **Cách hiện thực** bên trong (một hành vi hoạt động ra sao) |
| Cơ chế | Access modifier (`private`, `protected`) | Abstract class, interface |
| Câu hỏi nó trả lời | "Bạn có được đụng trực tiếp vào dữ liệu của tôi không?" | "Bạn có cần biết cái này hoạt động ra sao không?" |
| Ví dụ | Field `balance` của `BankAccount` là `private` | Phương thức `calculateArea()` của `Shape` không có hiện thực ở kiểu cơ sở |

### Abstract Class (Lớp trừu tượng)

#### Khai báo một Abstract Class

Một abstract class được khai báo với từ khoá `abstract`. Nó có thể chứa các abstract method (không có thân hàm) lẫn các method, field và constructor được hiện thực đầy đủ bình thường — nhưng không bao giờ có thể khởi tạo trực tiếp bằng `new`.

```java
public abstract class Shape {
    protected String name;

    public Shape(String name) {
        this.name = name;
    }

    // Abstract method — không có thân hàm, mọi lớp con phải hiện thực
    public abstract double calculateArea();

    // Concrete method — hiện thực dùng chung, kế thừa nguyên vẹn
    public void displayInfo() {
        System.out.printf("%s has an area of %.2f%n", name, calculateArea());
    }
}
```

```java
Shape shape = new Shape("Generic"); // Lỗi biên dịch: Shape là abstract, không thể khởi tạo
```

Một lớp con phải hiện thực mọi abstract method mà nó kế thừa, nếu không bản thân nó cũng phải được khai báo là `abstract`:

```java
public class Circle extends Shape {
    private double radius;

    public Circle(double radius) {
        super("Circle");
        this.radius = radius;
    }

    @Override
    public double calculateArea() {
        return Math.PI * radius * radius;
    }
}

public class Rectangle extends Shape {
    private double width;
    private double height;

    public Rectangle(double width, double height) {
        super("Rectangle");
        this.width = width;
        this.height = height;
    }

    @Override
    public double calculateArea() {
        return width * height;
    }
}
```

```java
Shape circle = new Circle(5);
Shape rectangle = new Rectangle(4, 6);

circle.displayInfo();     // Circle has an area of 78.54
rectangle.displayInfo();  // Rectangle has an area of 24.00
```

Chú ý rằng `circle` và `rectangle` được khai báo với kiểu tham chiếu `Shape` — đây chính là tính đa hình đang hoạt động — nhưng chính tính trừu tượng mới là thứ giúp ta viết `displayInfo()` *một lần duy nhất*, ở lớp cơ sở, mà không cần biết nó sẽ chạy trên shape cụ thể nào.

#### Abstract Class vẫn có thể có Constructor

Một hiểu lầm phổ biến là abstract class không thể có constructor, vì ta không bao giờ gọi `new` trực tiếp lên nó được. Thực tế, nó hoàn toàn có thể — và constructor đó sẽ chạy mỗi khi một lớp con được khởi tạo, thông qua lời gọi `super()` (tường minh hoặc ngầm định):

```java
public abstract class Employee {
    protected String name;
    protected String id;

    public Employee(String name, String id) {
        this.name = name;
        this.id = id;
        System.out.println("Employee constructor ran for " + name);
    }

    public abstract double calculateSalary();
}

public class Manager extends Employee {
    private double baseSalary;
    private double bonus;

    public Manager(String name, String id, double baseSalary, double bonus) {
        super(name, id); // Chạy constructor của Employee trước
        this.baseSalary = baseSalary;
        this.bonus = bonus;
    }

    @Override
    public double calculateSalary() {
        return baseSalary + bonus;
    }
}
```

#### Abstract Class có thể trộn lẫn Abstract và Concrete Method

Một abstract class không nhất thiết phải trừu tượng 100%. Việc trộn lẫn các method bắt buộc phải thay đổi theo từng lớp con với các method dùng chung nguyên vẹn là rất phổ biến — và thường chính là mục đích của nó:

```java
public abstract class Employee {
    protected String name;
    protected String id;

    public Employee(String name, String id) {
        this.name = name;
        this.id = id;
    }

    public abstract double calculateSalary(); // Thay đổi theo từng loại nhân viên

    public void printPaySlip() { // Dùng chung cho mọi loại nhân viên
        System.out.printf("Pay slip for %s (%s): $%.2f%n", name, id, calculateSalary());
    }
}
```

### Interface

#### Khai báo một Interface

Một interface định nghĩa một hợp đồng: một tập hợp signature của các method mà bất kỳ class nào hiện thực nó đều phải cung cấp. Khác với abstract class, interface không có state (field theo từng instance) và, theo truyền thống, hoàn toàn không có hiện thực.

```java
public interface Payable {
    double calculatePayment();
}
```

```java
public class Freelancer implements Payable {
    private double hourlyRate;
    private int hoursWorked;

    public Freelancer(double hourlyRate, int hoursWorked) {
        this.hourlyRate = hourlyRate;
        this.hoursWorked = hoursWorked;
    }

    @Override
    public double calculatePayment() {
        return hourlyRate * hoursWorked;
    }
}
```

Bất kỳ field nào khai báo trong interface đều ngầm định là `public static final` — tức là một hằng số, không phải state riêng theo từng instance:

```java
public interface Config {
    int MAX_RETRIES = 3; // ngầm định public static final
}
```

#### Một Class có thể hiện thực nhiều Interface

Java không cho phép một class `extends` nhiều hơn một class, nhưng nó *có thể* `implements` bao nhiêu interface tuỳ thích. Đây chính là cách Java đạt được đa kế thừa về **kiểu (type)** mà không gặp phải sự mơ hồ của đa kế thừa về **state**:

```java
public interface Payable {
    double calculatePayment();
}

public interface Reportable {
    String generateReport();
}

public class Contractor implements Payable, Reportable {
    private String name;
    private double contractValue;

    public Contractor(String name, double contractValue) {
        this.name = name;
        this.contractValue = contractValue;
    }

    @Override
    public double calculatePayment() {
        return contractValue;
    }

    @Override
    public String generateReport() {
        return name + " — contract value: $" + contractValue;
    }
}
```

#### Default và Static Method (từ Java 8)

Từ Java 8, interface không còn hoàn toàn trừu tượng nữa — chúng có thể cung cấp `default` method (một thân hàm mà class hiện thực tự động kế thừa, và có thể override nếu muốn) và `static` method (method tiện ích được gọi trên chính interface, không phải trên instance):

```java
public interface Payable {
    double calculatePayment();

    // Default method — class hiện thực được dùng miễn phí
    default void printPaymentSlip() {
        System.out.printf("Payment due: $%.2f%n", calculatePayment());
    }

    // Static method — gọi bằng Payable.formatCurrency(...), không phải trên 1 instance
    static String formatCurrency(double amount) {
        return String.format("$%,.2f", amount);
    }
}
```

```java
Freelancer freelancer = new Freelancer(50, 120);
freelancer.printPaymentSlip();          // Payment due: $6000.00
System.out.println(Payable.formatCurrency(6000)); // $6,000.00
```

Default method tồn tại chủ yếu để interface có thể tiến hoá theo thời gian — trước đây, thêm một method mới vào interface sẽ làm vỡ mọi class đã hiện thực nó; một default method với hiện thực mặc định hợp lý thì không. Nếu một class hiện thực hai interface mà cả hai đều khai báo *cùng một* default method, Java sẽ buộc bạn phải tự giải quyết xung đột bằng cách override lại nó — Java sẽ không tự đoán bạn muốn dùng cái nào.

Một interface cũng có thể extends một hoặc nhiều interface khác:

```java
public interface Payable {
    double calculatePayment();
}

public interface TaxablePayable extends Payable {
    double calculateTax();

    default double calculateNetPayment() {
        return calculatePayment() - calculateTax();
    }
}
```

### Abstract Class hay Interface — Khi nào dùng cái nào?

| | Abstract Class | Interface |
|---|---|---|
| Từ khoá | `extends` (chỉ 1) | `implements` (nhiều được) |
| Instance field (state) | Có | Không — chỉ có hằng số `public static final` |
| Constructor | Có | Không |
| Method có thân hàm | Bao nhiêu cũng được, tự do | Chỉ qua `default`/`static`/`private` (từ Java 8/9) |
| Quan hệ nó mô tả | "**is-a**" — một hệ thống phân cấp chặt chẽ, duy nhất | "**can-do**" — một năng lực, có thể trộn lẫn giữa các class không liên quan |
| Khi nào nên dùng | Các lớp con dùng chung state hoặc hành vi có ý nghĩa, và rõ ràng thuộc cùng một họ | Các class không liên quan cần đảm bảo cùng một năng lực (vd `Comparable`, `Runnable`, `Payable`) |

Một quy tắc thực dụng: hãy bắt đầu với interface, vì đây là lựa chọn linh hoạt và ít ràng buộc hơn. Chỉ dùng đến abstract class khi các lớp con thực sự cần dùng chung state hoặc hành vi mặc định phức tạp hơn những gì một default method có thể diễn đạt thoải mái.

### Kết hợp cả hai

Hai cơ chế này thường được kết hợp trong cùng một thiết kế thực tế. Ở đây, `Employee` là một abstract class mô tả một hệ thống phân cấp "is-a" chặt chẽ với state dùng chung, còn `Payable` là một interface mà bất kỳ thực thể nào có thể "được trả lương" đều có thể cắm vào — kể cả những thứ hoàn toàn không phải `Employee`, như `Contractor` ở phần trước:

```java
public abstract class Employee {
    protected String name;
    protected String id;

    public Employee(String name, String id) {
        this.name = name;
        this.id = id;
    }

    public abstract double calculateSalary();

    public void displayBasicInfo() {
        System.out.println(name + " (" + id + ")");
    }
}

public interface Payable {
    double calculatePayment();

    default void printPaymentSlip() {
        System.out.printf("Payment due: $%.2f%n", calculatePayment());
    }
}

public class Manager extends Employee implements Payable {
    private double baseSalary;
    private double bonus;

    public Manager(String name, String id, double baseSalary, double bonus) {
        super(name, id);
        this.baseSalary = baseSalary;
        this.bonus = bonus;
    }

    @Override
    public double calculateSalary() {
        return baseSalary + bonus;
    }

    @Override
    public double calculatePayment() {
        return calculateSalary();
    }
}
```

```java
Manager manager = new Manager("Alice", "M-01", 2000, 500);
manager.displayBasicInfo();   // Alice (M-01)
manager.printPaymentSlip();   // Payment due: $2500.00
```

`Manager` thuộc về họ `Employee` (trừu tượng hoá qua abstract class), đồng thời nó cũng "được trả lương" — `Payable` (trừu tượng hoá qua interface) — hai hợp đồng độc lập, cùng được thoả mãn bởi một class duy nhất, mà không cơ chế nào cản trở cơ chế còn lại.

### Tóm tắt

- Abstraction ẩn đi **độ phức tạp trong cách hiện thực**, chỉ để lộ ra những gì một object có thể làm — không phải nó làm điều đó như thế nào. Nó trả lời câu hỏi "bạn có cần biết cái này hoạt động ra sao không?", trong khi encapsulation trả lời "bạn có được đụng trực tiếp vào dữ liệu của tôi không?".
- Một **abstract class** không thể khởi tạo, có thể chứa cả abstract lẫn concrete method, field và constructor, và mô tả một quan hệ "is-a" chặt chẽ thông qua đơn kế thừa.
- Một **interface** định nghĩa một hợp đồng thuần tuý, không có state riêng theo instance. Một class có thể hiện thực bao nhiêu interface tuỳ thích, mô tả các năng lực "can-do" độc lập với nhau.
- Từ Java 8, interface có thể cung cấp `default` và `static` method với hiện thực thật sự, giúp interface tiến hoá mà không làm vỡ các class đã hiện thực nó từ trước.
- Abstract class và interface không phải đối thủ của nhau — các thiết kế thực tế thường kết hợp cả hai, mỗi cái dùng cho đúng thế mạnh của nó.
