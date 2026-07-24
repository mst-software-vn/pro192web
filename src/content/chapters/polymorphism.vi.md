## Polymorphism

### Overloading & Overriding

Polymorphism cho phép method và object có thể xuất hiện dưới nhiều hình thức khác nhau. Điều này được hiện thực trong Java thông qua overloading và overriding method.

#### Overloading

Overloading cho phép một class có nhiều method cùng tên nhưng khác nhau về loại parameter hoặc số lượng parameter.

```java
public class Vase extends Item {
    private int height;
    private String material;

    public Vase() {
        super();
        height = 0;
        material = "";
    }
    public Vase(int height, String material) {
        super();
        this.height = height;
        this.material = material;
    }
    public Vase(int value, String creator, int height, String material) {
        super(value, creator);
        this.height = height;
        this.material = material;
    }
}
```

Mỗi constructor có một signature riêng biệt. Compiler sẽ chọn ra constructor phù hợp dựa trên argument được truyền vào.

```java
Vase v1 = new Vase(0, "Dave", 50, "bronze");
Vase v2 = new Vase(100, "plaster");
```

#### Overriding

Overriding cho phép một subclass cung cấp một implementation cụ thể cho một method đã được định nghĩa trong superclass của nó.

```java
public class Item {
    protected int value;
    protected String creator;
    public void input() {
        // ...
    }
    public void output() {
        // ...
    }
}

public class Vase extends Item {
    private int height;
    private String material;
    @Override
    public void input() {
        super.input();
        // ...
    }
    @Override
    public void output() {
        super.output();
        // ...
    }
}
```

Sử dụng annotation `@Override` để chỉ ra rằng bạn đang override một method của superclass.

### Function Bindings

Java sử dụng static binding (compile time) cho các overloaded method và dynamic binding (runtime) cho các overridden method.

### Abstract Classes

Một abstract class chứa các abstract method (không có implementation) và bắt buộc phải được implement bởi các subclass.

```java
public abstract class Item {
    protected int value;
    protected String creator;
    public abstract void displayPrice();
}

public class Vase extends Item {
    private int height;
    private String material;
    @Override
    public void displayPrice() {
        if (height < 100)
            System.out.println("The price is 1000$");
        else
            System.out.println("The price is 2000$");
    }
}
```

Các subclass bắt buộc phải implement tất cả abstract method từ superclass của chúng.

### Interfaces

Một interface định nghĩa các method signature mà các class implement nó phải cung cấp. Interface cho phép multiple inheritance of type (đa kế thừa về type).

```java
public interface Menu {
    void getSalad();
    void getBeefsteak();
}

public class Chef implements Menu {
    public void getSalad() {
        System.out.println("This is a salad");
    }
    public void getBeefsteak() {
        System.out.println("This is a beefsteak");
    }
}
```

Một class có thể implement nhiều interface, từ đó cung cấp polymorphic behavior.

### Tóm tắt

- Polymorphism cho phép object và method có thể tồn tại dưới nhiều hình thức.
- Overloading và overriding là các kỹ thuật then chốt để hiện thực polymorphism.
- Abstract class và interface giúp code trở nên linh hoạt và có thể tái sử dụng.
- Trong OOP, một parent class hoặc interface reference có thể trỏ đến một child class object.

### Course Slide

- [Polymorphism.pdf](https://pro192web.netlify.app/resource/Polymorphism.pdf)