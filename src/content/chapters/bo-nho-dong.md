## Memory Management in Java

### Static and Dynamic Heap and Stack

In Java, memory management is the process of allocation and de-allocation of objects. Java does memory management automatically using a garbage collector, so you do not need to implement memory management logic in your application.

- Read more: Oracle Docs
- Read more: JavaTpoint

Allocation happens directly when you create an object with new and indirectly when you call a method with local variables or arguments. Local data of a method (return data, parameters, variables) is allocated on the stack and discarded when the method exits, but objects are allocated on the heap and have a longer lifetime.

- **Static heap**: Contains class declarations when classes are loaded. Use the static keyword for static methods, variables, classes, and blocks.
- **Dynamic heap**: The runtime data area for all Java objects and arrays. Created when the JVM starts and may grow/shrink as the application runs. Objects not used become garbage and are de-allocated.
- **Stack**: Memory for temporary variables and method calls. Each method call creates a new block in the stack for its local values and references. When the method ends, the block is erased.

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

When the program runs, the class definition Tester is loaded to static heap.

Running main creates stack space for variables age and sc. age is stored directly in stack; sc points to a Scanner object in heap.

![Java memory layout](/images/bo-nho-dong/2.png "Sơ đồ bộ nhớ: static heap, stack và dynamic heap khi chạy Tester")

When main finishes, its stack space is discarded. age and sc are killed.

The Scanner object in heap still exists and becomes garbage.

### Dynamic Allocation

Example code:

```java
public static void main(String[] args) {
    int a[] = new int[5];   // [1]
    String s = new String("hello");  // [2]
}
```

When main runs, a and s are allocated in stack memory as references.

At [1], new allocates memory in heap for an array of 5 elements and returns its address to a.

At [2], new allocates memory in heap for the string "hello" and returns its address to s.

![Dynamic allocation](/images/bo-nho-dong/3.png "Sơ đồ minh hoạ cấp phát động cho mảng a và chuỗi s trên heap")

To make a reference point to nothing, use null:

```java
int a[]=null;
String s=null;
```

### Dynamic Deallocation

In Java, you never explicitly free memory. Java provides automatic garbage collection. Local variables in a method are allocated when the method runs and deallocated automatically when it terminates. Unused objects in heap memory are deallocated by the Java system.

#### Scope and garbage collection

When the program runs to a certain line, variables may go out of scope and objects become garbage. Setting a reference to null also makes the object eligible for garbage collection.

```java
public class test {
    public static void main(String[] args) {
        String s1=new String("hello");
        int x=5;
        if(x<10){
            String s2=new String("students");
            int y=3;
            //other statements
        }
        int t=7;
        s1=null;
        t=t+1;
        //other statements
    }
}
```

### Garbage Collection

The JVM supports a garbage collector to free Java programmers from explicitly managing heap memory. It is called by the JVM only and cannot be activated manually. The Java heap is managed by two lists: free block list and allocated block list. After many allocations and de-allocations, memory may become fragmented.

- Read more: Java Memory Management Whitepaper
- Read more: Garbage Collection in Java

The runtime system keeps track of allocated memory and determines whether it is still usable. The garbage collector runs only when the system heap becomes exhausted and has the lowest priority. If objects are garbage, they are deallocated automatically.

### Summary

- The memory available to an application at run-time consists of static and dynamic heap and stack
- Static memory contains class definitions and shared data of the application
- Java supports dynamic memory for applications at run-time upon request
- The keyword new allocates a region of dynamic memory and returns its starting address
- We store the address of dynamically allocated memory in the reference variable
- Deallocation is made by Garbage Collector

### Course Slide

- [Memory Management in Java.pdf](https://pro192web.netlify.app/resource/Memory%20Management%20in%20Java.pdf)
