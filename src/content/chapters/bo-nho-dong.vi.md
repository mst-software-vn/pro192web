## Quản lý bộ nhớ trong Java (Memory Management in Java)

### Static và Dynamic Heap và Stack

Trong Java, quản lý bộ nhớ (memory management) là quá trình allocation và de-allocation các object. Java thực hiện memory management một cách tự động bằng garbage collector, vì vậy bạn không cần phải hiện thực logic quản lý bộ nhớ trong ứng dụng của mình.

- Đọc thêm: [Oracle Docs](https://docs.oracle.com/cd/E13150_01/jrockit_jvm/jrockit/geninfo/diagnos/garbage_collect.html)
- Đọc thêm: [JavaTpoint](https://www.javatpoint.com.cach3.com/index.html#google_vignette)

Allocation xảy ra trực tiếp khi bạn tạo một object bằng new và xảy ra gián tiếp khi bạn gọi một method với local variable hoặc argument. Local data của một method (dữ liệu return, parameter, variable) được allocate trên stack và bị discard khi method kết thúc, nhưng object được allocate trên heap và có lifetime dài hơn.

- **Static heap**: Chứa các class declaration khi class được load. Sử dụng keyword static cho static method, variable, class và block.
- **Dynamic heap**: Vùng dữ liệu runtime cho tất cả object và array trong Java. Được tạo khi JVM khởi động và có thể tăng/giảm khi ứng dụng chạy. Các object không còn được sử dụng sẽ trở thành garbage và bị de-allocate.
- **Stack**: Bộ nhớ dành cho temporary variable và method call. Mỗi lần gọi method sẽ tạo một block mới trên stack cho các local value và reference của nó. Khi method kết thúc, block đó sẽ bị xoá.

```java
public class Tester {
    public static void main(String[] args) {
        int age;
        Scanner sc=new Scanner(System.in);
        System.out.println("input age:");
        age=sc.nextInt();
        System.out.println("age:"+age);
    }
}
```

1. Khi chương trình chạy, class definition Tester được load vào static heap.

2. Chạy main sẽ tạo stack space cho các variable age và sc. age được lưu trực tiếp trong stack; sc trỏ đến một Scanner object trên heap.

3. Khi main kết thúc, stack space của nó bị discard. age và sc bị huỷ.

4. Scanner object trên heap vẫn còn tồn tại và trở thành garbage.

![Java memory layout](/images/bo-nho-dong/2.png "Sơ đồ bộ nhớ: static heap, stack và dynamic heap khi chạy Tester")

### Dynamic Allocation

Ví dụ code:

```java
public static void main(String[] args) {
    int a[] = new int[5];   // [1]
    String s = new String("hello");  // [2]
}
```

- Khi main chạy, a và s được allocate trong stack memory dưới dạng reference.

- Tại [1], new sẽ allocate bộ nhớ trên heap cho một array gồm 5 phần tử và trả về địa chỉ của nó cho a.

- Tại [2], new sẽ allocate bộ nhớ trên heap cho chuỗi "hello" và trả về địa chỉ của nó cho s.

![Dynamic allocation](/images/bo-nho-dong/3.png "Sơ đồ minh hoạ cấp phát động cho mảng a và chuỗi s trên heap")

Để cho một reference trỏ đến không nơi nào cả, sử dụng null:

```java
int a[] = null;
String s = null;
```

### Dynamic Deallocation

Trong Java, bạn không bao giờ phải explicit free bộ nhớ. Java cung cấp cơ chế garbage collection tự động. Local variable trong một method được allocate khi method chạy và tự động deallocate khi method kết thúc. Các object không còn sử dụng trong heap memory sẽ được hệ thống Java deallocate.

```java
public class test {

    public static void main(String[] args) {

        String s1 = new String("hello");
        int x = 5;

        if (x < 10) {
            String s2 = new String("students");
            int y = 3;
            // other statements
        }

        int t = 7;
        s1 = null;
        t = t + 1;
        // other statements
    }

}
```

Khi chương trình chạy đến một dòng nhất định, các variable có thể ra khỏi scope và object trở thành garbage. Việc set một reference thành null cũng khiến object đó eligible để bị garbage collect.

### Garbage Collection

JVM hỗ trợ một garbage collector để giải phóng lập trình viên Java khỏi việc phải explicit quản lý heap memory. Nó chỉ được gọi bởi JVM và không thể được kích hoạt thủ công. Java heap được quản lý bởi hai list: free block list và allocated block list. Sau nhiều lần allocation và de-allocation, bộ nhớ có thể bị fragment.

- Đọc thêm: [Java Memory Management Whitepaper](https://www.oracle.com/technetwork/java/javase/memorymanagement-whitepaper-150215.pdf)
- Đọc thêm: [Garbage Collection in Java](https://www.oracle.com/webfolder/technetwork/tutorials/obe/java/gc01/index.html)

Runtime system theo dõi bộ nhớ đã allocate và xác định xem nó còn usable hay không. Garbage collector chỉ chạy khi system heap bị exhausted và có priority thấp nhất. Nếu các object là garbage, chúng sẽ tự động bị deallocate.

### Tóm tắt

- Bộ nhớ khả dụng cho một ứng dụng tại run-time bao gồm static và dynamic heap và stack
- Static memory chứa class definition và dữ liệu dùng chung của ứng dụng
- Java hỗ trợ dynamic memory cho ứng dụng tại run-time theo yêu cầu
- Keyword new sẽ allocate một vùng dynamic memory và trả về địa chỉ bắt đầu của nó
- Chúng ta lưu địa chỉ của bộ nhớ được cấp phát động (dynamically allocated memory) trong reference variable
- Deallocation được thực hiện bởi Garbage Collector

### Course Slide

- [Memory Management in Java.pdf](https://pro192web.netlify.app/resource/Memory%20Management%20in%20Java.pdf)