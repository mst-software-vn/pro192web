## Collection Framework in Java

In almost all real problems, data related to a problem are groups, each group contains many objects. A group of objects is called a collection. In Java, a collection framework is introduced to support tools for managing collections more easily.

### Overview of Abstract Data Types

An abstract data type (ADT) is a mathematical model for a data type, defined by its behaviors from the user's point of view. In Java, ADTs are often declared as interfaces. Collections, sets, and maps are all ADTs.

- Add new element.
- Search an element.
- Remove an element.
- Traverse (access all elements one-by-one).
- Sort elements.

ADT (mathematical model, user view) contrasts with data structure, which is a concrete representation of data (implementer view, physical view).

### The Java Collections Framework

The Java Collections Framework provides a unified architecture for representing and manipulating collections. It includes interfaces, implementations, and algorithms for working with groups of objects.

- Reduces programming effort by providing data structures and algorithms so you don't have to write them yourself.
- Increases performance by providing high-performance implementations of data structures and algorithms.
- Provides interoperability between unrelated APIs by establishing a common language to pass collections back and forth.
- Reduces the effort required to learn APIs by requiring you to learn only a small set of collection APIs, instead of many ad hoc ones.
- Reduces the effort required to design and implement APIs by not requiring you to produce ad hoc collections APIs.
- Fosters software reuse by providing a standard interface for collections and algorithms with which to manipulate them.

![Collections framework interface structure](/images/bo-suu-tap/1.jpg "Cấu trúc phân cấp các interface trong Java Collections Framework")

![Collection Implementations](/images/bo-suu-tap/2.jpg "Bảng các class hiện thực tương ứng với từng interface và cách lưu trữ")

For more details, see the [Javadoc](https://docs.oracle.com/javase/8/docs/technotes/guides/collections/overview.html).

## List and ArrayList

All references to elements are stored in a one-dimensional array, called an array list. This organization can be used to store arbitrary elements and they can be duplicated.

![ArrayList demonstration](/images/bo-suu-tap/3.jpg "Sơ đồ bộ nhớ minh hoạ một ArrayList chứa các đối tượng khác kiểu")

![ArrayList characteristics](/images/bo-suu-tap/4.jpg "Bảng các thao tác cơ bản và cách thực hiện trên List")

If objects in a collection do not belong to the same class, references in a collection will behave as references to objects of the `Object` class. Based on OOP inheritance, the following assignment is valid: `Father_reference = Son_reference;`

When using generics, you can specify the element type for type safety and to avoid casting.

```java
ArrayList<Rectangle> list = new ArrayList<>();
list.add(new Rectangle(2, 3));
Rectangle r = list.get(0); // No cast needed
```

### Demonstrations

**Demonstration 1:** using an ArrayList of arbitrary elements.

![ArrayList arbitrary elements](/images/bo-suu-tap/5.jpg "Lớp Rectangle dùng trong ví dụ ArrayList chứa phần tử tuỳ ý")

![Objects of Rectangle in ArrayList](/images/bo-suu-tap/6.jpg "ArrayListDemo01: thêm phần tử tuỳ kiểu (int, String, Rectangle) vào cùng một ArrayList")

Experiment: if you want to call a method specific to a subclass, you must cast.

**Demonstration 2:** using an ArrayList for storing the same-type elements.

![ArrayList same-type elements](/images/bo-suu-tap/7.jpg "ArrayListDemo02: ArrayList<Rectangle2> chỉ chứa các phần tử cùng kiểu")

**Demonstration 3:** managing a list of students with ArrayList.

![Class Design](/images/bo-suu-tap/8.jpg "Sơ đồ thiết kế class: Inputter, Menu, Student, StudentList, StudentManager")

![Algorithm 1](/images/bo-suu-tap/9.jpg "Lớp Inputter: phương thức inputInt và inputStr")

![Algorithm 2](/images/bo-suu-tap/10.jpg "Lớp Inputter: phương thức inputNonBlankStr và inputPattern")

![Algorithm 3](/images/bo-suu-tap/11.jpg "Lớp Menu: phương thức getChoice cho ArrayList và mảng Object")

![Algorithm 4](/images/bo-suu-tap/13.jpg "Lớp Student: thuộc tính, constructor, toString, getter và setter")

![Algorithm 5](/images/bo-suu-tap/14.jpg "Lớp StudentList kế thừa ArrayList<Student>: constructor, search và isCodeDupplicated")

![Algorithm 6](/images/bo-suu-tap/15.jpg "Lớp StudentList: phương thức addStudent thêm sinh viên mới")

![Algorithm 7](/images/bo-suu-tap/16.jpg "Lớp StudentList: phương thức searchStudent tìm sinh viên theo mã")

![Algorithm 8](/images/bo-suu-tap/17.jpg "Lớp StudentList: phương thức updateStudent cập nhật tên và điểm")

![Algorithm 9](/images/bo-suu-tap/18.jpg "Lớp StudentList: phương thức removeStudent xoá sinh viên theo mã")

![Algorithm 10](/images/bo-suu-tap/19.jpg "Lớp StudentList: phương thức printAll in toàn bộ danh sách")

![Algorithm 11](/images/bo-suu-tap/20.jpg "Lớp StudentManager: phương thức main với vòng lặp menu")

Test cases:

```
Student managing Program
1-Add new student
2-Search a student
3-Update name and mark
4-Remove a student
5-List all
6-Quit
Choose 1..6:
```

![Test cases](/images/bo-suu-tap/21.jpg "Bảng test case: input và kết quả cho từng lựa chọn của menu")

## Set and TreeSet

A `Set` is a group of distinct objects. The `TreeSet` class stores elements in a sorted, self-balancing tree structure. Duplicates are not allowed.

![TreeSet structure](/images/bo-suu-tap/22.jpg "Cấu trúc cây: Root, Father, Child, Non-terminal node, Leaf")

`TreeSet` is implemented as a self-balanced ordered tree. It guarantees `log(n)` time cost for the basic operations (add, remove, and contains).

- A sorted group must be maintained.
- Search operation must have high performance.
- Elements must implement `Comparable` or a `Comparator` must be provided. The ordering maintained by a set must be consistent with `equals` if it is to correctly implement the `Set` interface.

### Demonstrations

**Demonstration 1:** the `Student` class does not implement any comparison method, so a compile-time error occurs.

![TreeSet error](/images/bo-suu-tap/23.jpg "Student không implement Comparable → ClassCastException khi thêm vào TreeSet")

**Demonstration 2:** `TreeSet` of integers (`Integer` implements `Comparable`, no duplicates allowed).

![TreeSet of integers](/images/bo-suu-tap/24.jpg "UseTreeSet: thêm, xoá và duyệt một TreeSet số nguyên bằng Iterator")

**Demonstration 3:** `TreeSet` of user-defined objects (`Student`), with add, search, remove, ascending and descending traversal.

![TreeSet students a](/images/bo-suu-tap/25.jpg "Lớp Student implements Comparable<Student>, so sánh theo ID")

![TreeSet students b](/images/bo-suu-tap/26.jpg "Lớp StudentSet kế thừa TreeSet<Student>: tìm kiếm bằng ceiling")

![TreeSet students c](/images/bo-suu-tap/27.jpg "StudentPrg: khởi tạo StudentSet và thêm một số sinh viên")

![TreeSet students d](/images/bo-suu-tap/28.jpg "StudentPrg: tìm kiếm, duyệt tăng dần/giảm dần và xoá phần tử")

![TreeSet students output](/images/bo-suu-tap/30.jpg "Kết quả chạy chương trình TreeSet quản lý sinh viên")

## Map and HashMap

A `Map` associates unique keys with values. The `HashMap` class provides a hash-table-based implementation of the `Map` interface, allowing fast access to values by key.

![Map structure](/images/bo-suu-tap/31.jpg "Mỗi phần tử của Map là một cặp Key (K) trỏ tới Value (V)")

A `Map` is like a dictionary. Maps check for key uniqueness based on the `equals()` method, not the `==` operator. The key can be a number or a string (such as Student ID, product ID).

### Hash Function and Hash Table

A hash-table is a set of subsets, but the position index is determined by a function, called a hash function (h). The mathematical operation, modulo (or `mod`/`%` in programming languages), is commonly used in hash functions.

![Hash function and hash-table](/images/bo-suu-tap/32.jpg "Element (K,V) qua hash function h để xác định vị trí sub-set trong hash table")

This implementation provides constant-time performance for the basic operations (`get` and `put`), assuming the hash function disperses the elements properly among the buckets.

For more details, see the [Javadoc](https://docs.oracle.com/javase/8/docs/api/java/util/HashMap.html).

### Demonstration

**Demonstration:** an empty hashmap is initiated, then some persons (nickName, person) are put and some basic operations on hashmap are performed.

![HashMap demo 1](/images/bo-suu-tap/33.jpg "Lớp Person: thuộc tính nickName, name, age và constructor")

![HashMap demo 2](/images/bo-suu-tap/34.jpg "Lớp PersonSet kế thừa HashMap<String, Person>: searchNick và removeNick")

![HashMap demo 3](/images/bo-suu-tap/35.jpg "Lớp PersonSet: printList_K và printList_V duyệt theo key và theo value")

![HashMap demo 4](/images/bo-suu-tap/36.jpg "PersonMng: khởi tạo PersonSet và thêm một số person")

![HashMap demo 5](/images/bo-suu-tap/37.jpg "PersonMng: in danh sách và tìm kiếm theo nickName")

![HashMap demo 6](/images/bo-suu-tap/38.jpg "PersonMng: duyệt theo keyset/values và xoá một person")

![HashMap output](/images/bo-suu-tap/39.jpg "Kết quả chạy chương trình quản lý person bằng HashMap")

## Supporting Classes

Along with the Collections framework, the `java.util` package also contains supporting classes in which many operations on collections and arrays are implemented. Almost all of these methods are `public static`. Actions such as sorting, shuffling, copying, searching, composition, finding extreme values (min, max), etc. are implemented.

| Supporting class | Parameter of methods |
| --- | --- |
| `java.util.Collections` | Collection |
| `java.util.Arrays` | Array |

- [Read more Collections in Javadoc](https://docs.oracle.com/javase/8/docs/api/java/util/Collections.html)
- [Read more Arrays in Javadoc](https://docs.oracle.com/javase/8/docs/api/java/util/Arrays.html)

**Demonstration:** an `ArrayList` of employees will be sorted with two mechanisms: (1) sorting by ascending ID; (2) sorting by descending order by salary.

![Sorting ArrayList of employees](/images/bo-suu-tap/40.jpg "Lớp Employee implements Comparable<Employee>: so sánh mặc định theo ID")

![Sorting by salary](/images/bo-suu-tap/41.jpg "Lớp Employee: compareTo theo ID và Comparator sắp xếp theo salary giảm dần")

![Sorting output](/images/bo-suu-tap/42.jpg "EmployeeSorter: sắp xếp danh sách bằng Collections.sort với 2 tiêu chí")

![Sorting output 2](/images/bo-suu-tap/43.jpg "Kết quả danh sách trước và sau khi sắp xếp theo 2 cơ chế")

### Summary

- Abstract data type (ADT) is a mathematical model for a data type that is determined based on generalization in which data structure is omitted. In programming languages, an ADT is commonly declared as an interface.
- `Collection`, `Set`, `Map` are ADTs.
- The Java Collections framework, in the `java.util` package, supports all basic common manipulations on collections and maps; basic algorithms on collections and arrays are implemented in two supporting classes `Collections` and `Arrays`.

Suggestions for choosing a class for managing a group of elements:

| Group characteristics | The class should be chosen |
| --- | --- |
| Elements can be duplicated | `java.util.ArrayList` |
| Elements must be distinct and sorted and each operation needs high performance | `java.util.TreeSet` |
| Each element contains a unique key and operations must have very high performance | `java.util.HashMap` |

For extra operations on collections and arrays such as sorting, copying, etc., refer to classes: `java.util.Collections` and `java.util.Arrays`.

### Course Slide

- [Collections.pdf](https://pro192web.netlify.app/resource/Collections.pdf)

### Reading

- [Support Classes.pdf](https://pro192web.netlify.app/resource/Support%20Classes.pdf)
