## Foundations

### Java Virtual Machine

The Java Virtual Machine is an abstract computing machine. Like a real computing machine, it has an instruction set and manipulates various memory areas at run time. It is reasonably common to implement a programming language using a virtual machine; the best-known virtual machine may be the P-Code machine of UCSD Pascal. See Wiki for a detailed exposition.

![Java Virtual Machine](/images/nen-tang/jvm-architecture.png "Overview of a Java virtual machine (JVM) architecture based on The Java Virtual Machine Specification Java SE 7 Edition")

### Platform Independence

The key that allowed Java to solve both the security and the portability problems is that the output of a Java compiler is not executable code. Rather, it is ByteCode - a highly optimized set of instructions designed to be executed by the Java run-time system, which is called the Java Virtual Machine (JVM).

### Demo: First Program

Steps:

1. Create a new Java NetBeans project
2. Add a Java class
3. Write code
4. Compile/Run the program

![First Java Program](/images/nen-tang/first-program-step-1.png "Bước 1 - Tạo project mới")

![Step 2](/images/nen-tang/first-program-step-2.png "Bước 2 - Thêm class Java")

![Step 2.2](/images/nen-tang/first-program-step-2-2.png "Bước 2.2 - Viết code")

![Step 3](/images/nen-tang/first-program-step-3.png "Bước 3 - Biên dịch chương trình")

![Step 4](/images/nen-tang/first-program-step-4.png "Bước 4 - Chạy chương trình")

### Keywords and Identifiers

Keywords: Almost all of them are similar to those in C language.

![Keywords](/images/nen-tang/keywords.png "Danh sách từ khoá trong Java")

### Data Types

Java is a strongly typed language. Following are the data types and their declarations.

Declaration:

```java
Type var [=Initial value];

int RollID;
char type='A';
```

![Primary Data Types](/images/nen-tang/primary-data-types.png "Các kiểu dữ liệu nguyên thuỷ (primary data types)")

#### Reference Type

Following are the reference types in Java.

- array
- class object
- interface

```java
int[] ar;
ar= new int[3];
ar[0]=1; ar[1]=2; ar[2]=3;
```

![Reference Data Types](/images/nen-tang/reference-data-types.png "Các kiểu dữ liệu tham chiếu (reference data types)")

![Array](/images/nen-tang/array.png "Minh hoạ mảng trong bộ nhớ")

### Scope

The scope of a declaration is the portion of a program over which that declaration is visible. Scopes include:

- function scope - visible to the source code within the function
- class scope - visible to the member functions of the class
- block scope - visible to the code block
- global scope - visible to the entire program
- file scope - visible to the source code within the file

The scope of a non-global declaration begins at the declaration and ends at the closing brace for that declaration. A non-global declaration is called a local declaration.

### One Dimensional Arrays

An array is a container object that holds a fixed number of values of a single type. The length of an array is established when the array is created. Each item in an array is called an element, and each element is accessed by its numerical index.

![One Dimensional Array](/images/nen-tang/one-dimensional-array.png "Minh hoạ mảng một chiều")

```java
int[] ar;  // for detail click here
float anArrayOfFloats[];
```

### Multiple Dimensional Arrays

Consider the example:

![2D Array Code](/images/nen-tang/2d-array-code.png "Ví dụ code mảng hai chiều")

This is a sample memory map of the above code

![2D Array Memory Map](/images/nen-tang/2d-array-memory-map.png "Sơ đồ bộ nhớ của mảng hai chiều")

We have created a multidimensional array named m, it holds 8 elements. The variable m is storing the value: 8000 that is the address of an array. m can be seen as an array of one–dimensional array. In the above example, the statement: m[1]=replacement to assign 1000 to m at index 1. Now, the m can hold 12 elements. output: 1,2,3,4,5,6,7,8,9,10,2001,2002

### Operators

![Operators](/images/nen-tang/operators-1.png "Bảng toán tử Java - phần 1")

![Operators 2](/images/nen-tang/operators-2.png "Bảng toán tử Java - phần 2")

![Operators 3](/images/nen-tang/operators-3.png "Bảng toán tử Java - phần 3")

### Logic constructs

The statements inside your source files are generally executed from top to bottom, in the order that they appear. Control flow statements, however, break up the flow of execution by employing decision making, looping, and branching, enabling your program to conditionally execute particular blocks of code. This section describes the decision-making statements (if-then, if-then-else, switch), the looping statements (for, while, do-while), and the branching statements (break, continue, return) supported by the Java programming language.

- if statement [for detail]
- switch statement [for detail]
- while, do, for statements [for detail]

### Summary

- a declaration associates an identifier with a type
- a definition attaches meaning to an identifier and is an executable statement
- the scope of a declaration is that part of the program throughout which the declaration is visible
- the types of the Java are primitive types and reference types

### Course Slide

- Learning the Java Language.pdf

### Reading

- Download & Install JDK & NetBeans 8.pdf
- Get Start.pdf
- Numbers and Strings.pdf
