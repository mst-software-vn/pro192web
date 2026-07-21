## Inheritance

### Định nghĩa

Các ngôn ngữ hướng đối tượng hiện thực khả năng tái sử dụng (reusability) của cấu trúc code thông qua inheritance. Inheritance là khái niệm nổi bật thứ hai sau encapsulation. Nó đề cập đến mối quan hệ giữa các class, trong đó một class kế thừa toàn bộ cấu trúc của một class khác. Inheritance mang tính phân cấp (hierarchical) một cách tự nhiên, là một mối quan hệ chặt chẽ hơn composition và là mối quan hệ coupled cao nhất, chỉ sau friendship.

#### Cấu trúc phân cấp trong thế giới thực

Ví dụ, cấu trúc nhân sự truyền thống trong quản lý nguồn nhân lực, với CEO ở đỉnh cấu trúc, phía dưới là các deputy và senior manager, tiếp theo là team leader và worker. Những cấu trúc như vậy giúp việc vận hành hàng ngày của một tổ chức trở nên dễ quản lý. Trong một cửa hàng bán lẻ, sản phẩm được tổ chức và quản lý theo nhóm chủ đề như hard goods, perishable foods, v.v. Những nhóm này là một phần không thể thiếu trong việc kiểm soát tồn kho và quản lý thanh toán. Chúng ta thường dùng tree diagram và organogram để nắm bắt và visualize các mối quan hệ này. Ví dụ, với ví dụ cửa hàng bán lẻ:

![Inheritance Example 1](/images/ke-thua/1.jpg "Sơ đồ phân cấp ví dụ cửa hàng bán lẻ")

Trong bối cảnh OO design, chúng ta quan tâm đến các hierarchy đại diện cho thiết kế mang tính tiến triển (progressive) của một tập hợp class. Gốc của thiết kế là một entity tương đối abstract, và chúng ta xây dựng dựa trên entity đó để tạo ra các entity ngày càng concrete hơn. Xem xét kỹ hơn ví dụ trước

![Inheritance Example 2](/images/ke-thua/2.jpg "Sơ đồ phân cấp chi tiết hơn của ví dụ cửa hàng")

Chúng ta nhận thấy entity Item tương đối abstract theo nghĩa là chúng ta không thể vào một cửa hàng và mua một "item". Nếu chúng ta nói với nhân viên rằng "muốn mua một item", chúng ta sẽ nhận được câu trả lời "item nào?". Chúng ta có thể mua các entity cụ thể, hay concrete, nhưng không phải những entity tương đối abstract trong khái niệm hoá của chúng. Nhưng điều đó không có nghĩa là các entity ở level cao hơn không có giá trị. Chúng chỉ đóng vai trò là các base definition để chúng ta xây dựng các entity concrete hơn. Chúng ta nói rằng các entity ở level cao hơn là các class "parent", "base" hoặc "super", và các entity ở level thấp hơn được xây dựng từ chúng là các class "child", "derived" hoặc "sub".

#### Quan hệ "is-a"

Ý tưởng chính ở đây là quan hệ "is-a". Nhìn vào ví dụ cửa hàng, chúng ta thấy HardGood is-a Item và ElectricalGood is-a HardGood, và mở rộng ra là is-a Item. Điều đó cho thấy, về mặt type, ElectricalGood có type ElectricalGood và cũng có type HardGood và cuối cùng là Item. Đây là kiểu quan hệ phân cấp mà Java và các chương trình OO khác được thiết kế để nắm bắt.

Không phải mọi hierarchy trong thế giới thực mà chúng ta hình dung đều phù hợp với kiểu phân tích super và sub class này. Xét lại ví dụ nhân sự đã đề cập trước đó. CEO là người đứng đầu tổ chức, nhưng lại không hợp lý khi làm base class. Một senior manager không đồng thời là CEO. Một team member không đồng thời là senior manager. Vì vậy, thay vì organogram nhân sự cổ điển mà bạn có thể đã quen thuộc, một quan hệ OO phù hợp hơn có thể trông như sau:

![Inheritance Example 3](/images/ke-thua/3.jpg "Sơ đồ quan hệ OO phù hợp thay cho sơ đồ tổ chức nhân sự cổ điển")

Một quan hệ phân cấp tương thích với OO như vậy là một ví dụ của khái niệm OO quan trọng là "polymorphism".

Polymorphism ở cấp độ class là khái niệm mà một object có thể mang nhiều hình dạng (form) khác nhau. Nếu một object thuộc class type X có parent class là type Y, thì X có thể mang hình dạng của một object thuộc type X hoặc Y, và do đó có thể xuất hiện dưới nhiều hình dạng.

### Derived and Super Classes

Về mặt OO design, chúng ta cần xem xét những attribute và method nào mà một tập hợp class có chung. Khi xác định được các attribute và method chung, chúng ta có thể factorise thiết kế của các class đó sao cho các attribute và method dùng chung trở thành một phần của super class.

Chúng ta sẽ dùng một ví dụ để hiểu cách thức hoạt động này. Xét một cửa hàng bán đồ cổ, cụ thể là vase, statue và painting. Bây giờ chúng ta sẽ xem xét một số attribute phù hợp cho phân tích OO ban đầu:

![Inheritance Example 4](/images/ke-thua/4.jpg "Các thuộc tính ban đầu của Vase, Statue, Painting")

Chúng ta sẽ tạo ba class cho từng loại sản phẩm mà cửa hàng bán. Chúng ta có thể thấy các class có một số attribute chung, và một số attribute riêng biệt cho từng class. Nhưng chúng ta cũng thấy rằng trên thực tế cả ba class đều là ví dụ của "item" — những thứ mà cửa hàng bán. Vì vậy chúng ta có thể factorise thiết kế với một Item superclass, sau đó biến ba class cụ thể thành sub class của superclass đó. Điều này có lợi vì giảm việc trùng lặp code không cần thiết (đồng thời mô hình hoá vấn đề thực tế tốt hơn). Quan hệ super và sub class được biểu diễn bằng một mũi tên chỉ từ sub class về phía super class:

![Inheritance Example 5](/images/ke-thua/5.jpg "Sơ đồ quan hệ super class Item và các sub class Vase, Statue, Painting")

Để hiện thực quan hệ "is-a" của class diagram trên, chúng ta dùng keyword `extends`

Giả sử các class này được lưu trong cùng một package

```java
public class Item
{
     int value;
     String creator;

    //The below is methods that you need to implement
    //default constructor
    public Item(){
         value=0;
         creator="";
     }
     //constructor with parameters
     public Item(int value, String creator){
         this.value=value;
         this.creator=creator;
     }
    //getter
    //setter
    //other logic methods
}

public class Vase extends Item
{
     int height;
     String material;

    //The below is methods that you need to implement
    //constructors
    //getter
    //setter
    //other logic methods
}

public class Statue extends Item
{
     int weight;
     String colour;

    //The below is methods that you need to implement
    //constructors
    //getter
    //setter
    //other logic methods
}

public class Painting extends Item
{
     int height;
     int width;
     boolean isWatercolour;
     boolean isFramed;

    //The below is methods that you need to implement
    //constructors
    //getter
    //setter
    //other logic methods
}
```

![AntiqueShop Example](/images/ke-thua/6.jpg "Sơ đồ minh hoạ AntiqueShop với Item, Vase, Statue, Painting")

Class Vase có tổng cộng bốn attribute. Hai trong số đó là riêng của nó, và hai được "kế thừa" (inherited) từ superclass. Tương tự, class Painting có sáu attribute, bốn riêng và hai được kế thừa từ superclass. Vì vậy, một super, base hoặc parent class chứa một tập attribute cơ bản, dự định trở thành một phần trong việc hiện thực các sub class được xây dựng từ nó. Các sub class có attribute riêng khiến chúng trở nên độc nhất, và chúng kế thừa attribute từ superclass.

Bây giờ, bạn tạo file tên `AntiqueShop.java`, method main nằm trong đó

```java
public class AntiqueShop
{
    public static void main(String[] args){

        Vase v1 = new Vase();
        v1.value = 100;
        v1.creator="Test1";
        // you can assign values to other attributies of v1
        v1.height=100;
        v1.material="wood";
        // this code only uses to check v1's  fields


        Statue s1=new Statue();
        s1.value=200;
        s1.creator="Test2";
        // you can assign values to other attributies of s1
        s1.weight=100;
        s1.colour="blue";
        // this code only uses to check s1's  fields

        Painting p1=new Painting();
        p1.value=300;
        p1.creator="Test3";
        // you can assign values to other attributies of p1
        p1.height=200;
        p1.width=100;
        p1.isWatercolour=true;
        p1.isFramed=true;
        // this code only uses to check p1's  fields

    }
}
```

### Functions in Inheritance

Chúng ta tạo ba object v1, s1, p1 từ ba subclass. Các object này có các attribute "kế thừa"

Tương tự, chúng ta thêm một method vào super class Item, method đó cũng được kế thừa trong ba sub class. Chúng ta có thể gọi các method kế thừa đó như thể chúng được định nghĩa ngay trong class definition của chính nó. Ví dụ, chúng ta thêm method `output()` vào class Item.

```java
public class Item
{
    public int value;
    public String creator;

    //The below is methods that you need to implement
    //constructors
    //getter
    //setter
    public void output(){
        System.out.println("This item is worth " + value + " pounds");
        System.out.println("This item is created by " + creator );
    }
}
```

Chỉnh sửa method main:

```java
public class AntiqueShop
{
    public static void main(String[] args){

        Vase v1 = new Vase();
        v1.value = 100;
        v1.creator="Test1";
        v1.output();

        Statue s1=new Statue();
        s1.value=200;
        s1.creator="Test2";
        s1.output();

        Painting p1=new Painting();
        p1.value=300;
        p1.creator="Test3";
        p1.output();
    }
}
```

**Output:**

```
This item is worth 100 pounds This item is created by Test1 This item is worth 200 pounds This item is created by Test2 This item is worth 300 pounds This item is created by Test3
```

Lưu ý rằng, tạm thời tất cả attribute và method đều được khai báo là public. Đây không hẳn là một OO design practice tốt và chúng ta cần áp dụng nguyên lý encapsulation. Điều này gợi ý rằng attribute của super class nên là protected.

Các quy tắc chi phối cách chúng ta đảm bảo inheritance như sau:

- **private**: attribute và method chỉ có thể truy cập được từ bên trong chính class đó, và không đảm bảo có sẵn trong bất kỳ class nào extend từ nó.
- **protected**: attribute và method là private nhưng có sẵn từ bên trong chính class đó và bất kỳ class nào extend từ nó.
- **public**: attribute và method có thể truy cập được từ bên trong class và từ bất kỳ class hoặc calling code nào khác.

### Thêm Constructor

Bây giờ chúng ta đã biết inheritance cho phép sub class kế thừa attribute và method từ super class. Chúng ta sẽ xem xét cách xây dựng constructor method sao cho instance của sub class được tạo ra một cách hiệu quả nhất.

Xét việc thêm constructor vào class Vase.

```java
public class Vase extends Item
{
    private int height;
    private String material;

    //The below is methods that you need to implement
    public Vase(){
         value=0;
         creator="";
         height=0;
         material="";
    }
    public Vase(int value, String creator, int height, String material){
         this.value=value;
         this.creator=creator;
         this.height=height;
         this.material=material;
    }
}
```

Vì class Vase có bốn field, bạn có thể hiện thực constructor như trên. Nhưng đó không phải cách coding hiệu quả. Nó sẽ dẫn đến trùng lặp code

Để giảm trùng lặp code, các field chung được khởi tạo bằng cách sử dụng constructor của superclass.

Chúng ta chỉnh sửa code của class Vase như sau:

```java
public class Vase extends Item
{
    private int height;
    private String material;

    //The below is methods that you need to implement
    public Vase(){
        super(); //call the default constructor of the Item class
        height=0;
        material="";
    }
    public Vase(int value, String creator, int height, String material){
        super(value, creator);  //call the constructor with 2 parameters of the Item class
        this.height=height;
        this.material=material;
    }
}
```

Keyword `super` tham chiếu đến super class

> **Lưu ý:** Khi một sub class gọi constructor của parent class bằng lệnh gọi `super()`, lệnh này phải là dòng đầu tiên trong constructor của chính nó. Điều này để đảm bảo object được construct từ super class xa nhất trước tiên.
>
> Một derived class mặc định không kế thừa constructor của superclass
>
> Nếu một constructor không gọi tường minh constructor của superclass, Java compiler sẽ tự động chèn một lệnh gọi đến constructor không tham số (no-argument constructor) của superclass. Nếu superclass không có no-argument constructor, bạn sẽ gặp lỗi compile-time. Object có sẵn constructor như vậy, nên nếu Object là superclass duy nhất thì không có vấn đề gì.

Tương tự, chúng ta thêm constructor vào các sub class khác

Chúng ta dùng Java keyword `super` như một qualifier để gọi method của superclass: `super.methodName(arguments);`

Ví dụ:

```java
public class Item{
     ...
     void displayDiscount(){  System.out.println("discounting ...");}
}
public class Vase extends Item{
    ...
    @Override
    void displayDiscount(){
           super.displayDiscount();
           System.out.println("and taking ...");
    }
    public static void main(String[] args){

        Vase obj=new Vase();
        obj.displayDiscount();
    }
}
```

Trong subclass Vase, method `displayDiscount` có cùng signature (tên, cùng số lượng và type của parameter) và return type như trong superclass. Đây được gọi là override method của superclass. Chúng ta sẽ học về override method ở topic tiếp theo

Bất cứ khi nào chúng ta muốn gọi phiên bản method của super (ví dụ `displayDiscount`) được định nghĩa bởi superclass. Chúng ta dùng keyword `super`

**Output:**

```
discounting ... and taking ...
```

### Hidden methods: Re-implement lại static method đã được implement trong super class

![Hidden Method](/images/ke-thua/7.jpg "Minh hoạ hidden method - re-implement static method từ super class")

#### Sử dụng instanceof operator

Xét code trong file `AntiqueShop.java`:

```java
public class AntiqueShop
{
    public static void main(String[] args){

        Vase v1 = new Vase(100,"Paris",200,"rock");
        Statue s1= new Statue(200,"VN", 1000,"white");
        Painting p1=new Painting(300,"USA",2000,1500,true,true);

        Item tmp=v1;
    }
}
```

Trong code trên, chúng ta tạo ba object v1, s1, p1 và khởi tạo giá trị bằng constructor with parameters. Sau đó, một reference variable tmp có type là Item superclass. Nó lưu địa chỉ của object v1. Xem hình bên dưới:

![Inheritance Example 6](/images/ke-thua/8.jpg "Sơ đồ minh hoạ biến tmp kiểu Item trỏ tới đối tượng Vase v1")

**dynamic type**: Một reference variable có type của superclass có thể lưu địa chỉ của object thuộc sub class. Đây gọi là dynamic type, tức là type mà nó có tại runtime.

**static type**: type mà nó có khi được khai báo lần đầu. Static type checking được compiler thực thi.

Tương tự, chúng ta có thể dùng variable tmp để lưu địa chỉ của object s1, p1.

Làm sao để kiểm tra variable tmp đang trỏ đến địa chỉ của một object cụ thể?

Sử dụng keyword `instanceof`.

Xét code:

```java
public class AntiqueShop
{
    public static void main(String[] args){

        Vase v1 = new Vase(100,"Paris",200,"rock");
        Statue s1= new Statue(200,"VN", 1000,"white");
        Painting p1=new Painting(300,"USA",2000,1500,true,true);
        Item tmp=v1;
        if(tmp instanceof Vase)
            System.out.println("tmp is pointing to the Vase object");
        else if(tmp instanceof Statue)
            System.out.println("tmp is pointing to the Statue object");
        else
            System.out.println("tmp is pointing to the Painting object");
    }
}
```

**Output:**

```
tmp is pointing to the Vase object
```

Operator `instanceof` sẽ trả về true hoặc false. Trong ví dụ trên, vì variable tmp đang trỏ đến object Vase, nên instruction "tmp instanceof Vase" trả về true.

### Casting

Bây giờ, chúng ta thêm method `putFlowers()` vào class Vase

```java
public class Vase extends Item
{
    private int height;
    private String material;

    //The below is methods that you need to implement
    public Vase(){
         super();
         height=0;
         material="";
    }
    public Vase(int value, String creator, int height, String material){
         super(value, creator);
         this.height=height;
         this.material=material;
    }
    public void putFlowers(){
          System.out.println("flowers are put in the vase");
    }
}
```

Trong method main, chúng ta chỉnh sửa

```java
public class AntiqueShop
{
    public static void main(String[] args){

        Vase v1 = new Vase(100,"Paris",200,"rock");
        Statue s1= new Statue(200,"VN", 1000,"white");
        Painting p1=new Painting(300,"USA",2000,1500,true,true);
        Item tmp=v1;
        if(tmp instanceof Vase){
            System.out.println("tmp is pointing to the Vase object");
            ((Vase)tmp).putFlowers();
        }
        else if(tmp instanceof Statue)
            System.out.println("tmp is pointing to the Statue object");
        else
            System.out.println("tmp is pointing to the Painting object");

    }
}
```

Variable tmp có type của superclass chỉ có thể gọi các method của superclass. Để gọi method của subclass, chúng ta phải cast tường minh (explicitly). Nếu code cố cast một object sang một subclass mà nó không phải là instance, một lỗi `ClassCastException` sẽ được throw. Ví dụ,

```java
...
System.out.println("tmp is pointing to the Vase object");
((Statue)tmp).setColour("Gray"); // causes an error
...
```

> **Lưu ý:** Trong Java, class Object mặc định là parent class của tất cả các class.

### Tóm tắt

- Các ngôn ngữ hướng đối tượng hiện thực khả năng tái sử dụng cấu trúc code thông qua inheritance
- Một derived class mặc định không kế thừa constructor của super class
- Các constructor trong một inheritance hierarchy thực thi theo thứ tự từ super class đến derived class
- Sử dụng keyword instanceof nếu chúng ta cần kiểm tra type của reference variable.
- Kiểm tra type của reference variable trước khi cast tường minh.

### Course Slide

- [Inheritance.pdf](https://pro192web.netlify.app/resource/Inheritance.pdf)
