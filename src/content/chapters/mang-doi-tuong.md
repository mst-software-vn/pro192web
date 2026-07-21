## Array of Objects

A systematic technique for accessing objects of different dynamic type within the same hierarchy is through an array of pointers of their static type. The executable code dereferences each pointer at run time based on its object's dynamic type.

In the previous topic, an antique shop sells antique items, namely vases, statues, and paintings. For now, we want to manage the list of objects such as vases, statues, paintings in an array. The objects pointed to by the array elements may be of differing dynamic type, but are of the same static type (type of the superclass). [Read dynamic & static type again](https://pro192web.netlify.app/Org_code/Inheritance.html#instanceof)

For example, we create the file named `ItemList.java`, it contains an array as follows:

```java
public class ItemList {
    Item[] list;        // an array to store all items
    int numOfItem;       // to store the number of items that added to the list
    final int MAX = 100; // is the size of the array

    public ItemList() {
        list = new Item[MAX];
        numOfItem = 0;
    }
}
```

Following are the basic operations supported by an array.

- Print all the array elements (objects) one by one.
- Adds an object at the given index.
- Deletes an object at the given index.
- Searches an object using the given index or by the value.
- Updates an object at the given index.

We will implement these later. For now, the main method to test some basic functions in the antique shop.

```java
public class antiqueShop {
    public static void main(String[] args) {
        ItemList obj = new ItemList();
        Scanner sc = new Scanner(System.in);
        int choice = 0;
        do {
            System.out.println("1. add a new vase");
            System.out.println("2. add a new statue");
            System.out.println("3. add a new painting");
            System.out.println("4. display all items");
            System.out.println("5. find the items by the creator ");
            System.out.println("6. update the item by its index");
            System.out.println("7. remove the item by its index");
            System.out.println("8. display the list of vase items ");
            System.out.println("9. sorts items in ascending order based on their values ");
            System.out.println("10. exit");
            System.out.println("input your choice:");
            choice = sc.nextInt();
            switch (choice) {
                case 1:
                    Item tmp = new Vase();
                    tmp.input();
                    //call the addItem method at here
                    break;
                case 2:
                    Item tmp2 = new Statue();
                    tmp2.input();
                    //call the addItem method at here
                    break;
                case 3:
                    Item tmp3 = new Painting();
                    tmp3.input();
                    //call the addItem method at here
                    break;
                case 4:
                    //call the displayAll method at here
                    break;
                case 5:
                    //call the findItems method at here
                    break;
                case 6:
                    //call the updateItem method at here
                    break;
                case 7:
                    //call the removeItem method at here
                    break;
                case 8:
                    //call the displayItemByType method at here
                    break;
                case 9:
                    //call the sortItems() method at here
                    break;
            }
        } while (choice <= 9);
    }
}
```

To explore the instruction that is highlighted, consider the figure below:

![Empty Array of Objects](/images/mang-doi-tuong/1.jpg "Trạng thái ban đầu: mảng list rỗng, toàn bộ phần tử là null")

After starting, the `obj` variable points to address 1000, this block contains the reference variable `list` that is pointing to address 2000. It is an array of pointers. All elements are initiated to `null`.

To complete the program, we add a method named `addItem` to the `ItemList` class.

```java
public class ItemList {
    ...
    public boolean addItem(Item item) {
        if (item == null || numOfItem >= MAX)
            return false;
        list[numOfItem] = item;
        numOfItem++;
        return true;
    }
}
```

Edit the case 1 in the main method:

```java
public class antiqueShop {
    public static void main(String[] args) {
        ....
        switch (choice) {
            case 1:
                Item tmp = new Vase();
                tmp.input();
                if (obj.addItem(tmp)) {
                    System.out.println("added");
                }
                break;
        }
    }
}
```

If the choice is 1, steps are performed:

- A `Vase` object is created at address 300.
- Its state likes the sample after inputting.
- Address 300 is passed to the `addItem` method.
- Add this address to the array at an index that is `numOfItem`.
- Increase the `numOfItem` by 1.

![Adding the First Item](/images/mang-doi-tuong/2.jpg "Sau khi thêm đối tượng Vase đầu tiên vào mảng (tmp trỏ tới địa chỉ 300)")

We add more some methods to the `ItemList` class:

```java
public class ItemList {
    ...
    // this method prints out information of all items
    public void displayAll() {
        if (numOfItem == 0)
            System.out.println("the list is empty");
        for (int i = 0; i < numOfItem; i++) {
            System.out.println(list[i]);
        }
    }

    // this method finds the item by its creator
    // return the item that is found of the first occurrence.
    public Item findItem(String creator) {
        for (int i = 0; i < numOfItem; i++)
            if (list[i].getCreator().equals(creator))
                return list[i];
        return null;
    }

    // this method returns the zero_based index of the first occurrence.
    public int findItemIndex(String creator) {
        for (int i = 0; i < numOfItem; i++)
            if (list[i].getCreator().equals(creator))
                return i;
        return -1;
    }

    // this method updates the item at the specified position in this list
    // input: the index you wish to update
    public boolean updateItem(int index) {
        if (index >= 0 && index < numOfItem) {
            list[index].input();
            return true;
        }
        return false;
    }

    // this method removes the item at the specified position in this list.
    // Shifts any subsequent elements to the left
    // input: the index you wish to remove
    public boolean removeItem(int index) {
        if (index >= 0 && index < numOfItem) {
            for (int j = index; j < numOfItem; j++) {
                list[j] = list[j + 1];
            }
            numOfItem--;
            return true;
        }
        return false;
    }

    // this method prints out all items that belong to the given type in the list.
    public void displayItemsByType(String type) {
        if (type.equals("Vase")) {
            for (int i = 0; i < numOfItem; i++)
                if (list[i] instanceof Vase) System.out.println(list[i]);
        } else if (type.equals("Statue")) {
            for (int i = 0; i < numOfItem; i++)
                if (list[i] instanceof Statue) System.out.println(list[i]);
        } else {
            for (int i = 0; i < numOfItem; i++)
                if (list[i] instanceof Painting) System.out.println(list[i]);
        }
    }

    // this method sorts items in ascending order based on their values.
    public void sortItems() {
        for (int i = 0; i < numOfItem; i++)
            for (int j = numOfItem - 1; j > i; j--) {
                if (list[i].getValue() < list[j - 1].getValue()) {
                    Item tmp = list[j];
                    list[j] = list[j - 1];
                    list[j - 1] = tmp;
                }
            }
    }
}
```

```java
public class antiqueShop {
    public static void main(String[] args) {
        ....
        switch (choice) {
            case 1:
                Item tmp = new Vase();
                tmp.input();
                if (obj.addItem(tmp)) {
                    System.out.println("added");
                }
                break;
            case 2:
                Item tmp2 = new Statue();
                tmp2.input();
                if (obj.addItem(tmp2)) {
                    System.out.println("added");
                }
                break;
            case 3:
                Item tmp3 = new Painting();
                tmp3.input();
                if (obj.addItem(tmp3)) {
                    System.out.println("added");
                }
                break;
            case 4:
                obj.displayAll();
                break;
            case 5:
                String creator = "Paris";
                Item result = obj.findItem(creator);
                if (result == null) System.out.println("not found");
                else System.out.println("the item is found " + result);
                break;
            case 6:
                int index = 2;
                if (obj.updateItem(index)) {
                    System.out.println("After updating: ");
                    obj.displayAll();
                } else System.out.println("can not update the item");
                break;
            case 7:
                int index = 1;
                if (obj.removeItem(index)) {
                    System.out.println("After removing: ");
                    obj.displayAll();
                } else System.out.println("can not remove the item");
                break;
            case 8:
                String type = "Painting";
                obj.displayItemsByType(type);
                break;
            case 9:
                obj.sortItems();
                obj.displayAll();
        } //end switch
        ...
    }
}
```

To explore what is doing, we look at the figure:

![Removing an Item](/images/mang-doi-tuong/3.jpg "Sau khi xoá phần tử tại index 1, các phần tử phía sau dịch trái")

The `findItemIndex` method finds the item within the list and returns the position of the first occurrence in the list. For example, if you wish to get the position of the item which value is 100 then the method returns 0.

The `findItem` method finds the item within the list and returns the address of the first occurrence in the list. For example, if you wish to get the item which creator is Paris then the method returns 300.

If you wish to remove the item at index 1, the method `removeItem(index)` will shift any subsequent elements up. After shifting, the old item that was at position 1 becomes garbage and Java will deallocate it.

In the `sortItems` method, we implement the bubble sorting algorithm.

[Read bubble sorting algorithm in Wiki](https://en.wikipedia.org/wiki/Bubble_sort#:~:text=Bubble%20sort,%20sometimes%20referred%20to%20as%20sinking%20sort,,list%20is%20repeated%20until%20the%20list%20is%20sorted.)

[Read the Arrays class to sort user-defined objects](https://makeinjava.com/sort-user-defined-objects-pojo-array-java-example-comparator-interface/)


## File I/O

Input and output data sources of a program can be the keyboard, monitor, file in an external disk. In this lesson, basic concepts and tools for handling all kinds of data, from primitive values to advanced objects are introduced.

A file is a group of related data which are stored in external memory (disk) for the common use between some programs. The file designer will decide the format of stored data. In general, a thing containing data is called a file. So, a directory is a file, a device (keyboard, monitor, network interface card, disk, …) is a file. Data in a normal file can include text, images, sounds. Information stored in a file must be persistent. This means that data in a file must survive even when the process, which created it, terminated.

- **Text format:** a data unit is a character or digit (ASCII code). So, all numbers in a program (numeric variables) must be transferred to a string of digits before they are written to file.
- **Binary format:** data in a file is a figure of a variable's memory bitmap in the program.

Text format is more flexible than binary format but a cost must be paid for type conversions. Files in text format can be viewed and updated using any normal editor such as Notepad, MS Word, …

The binary format is efficient because no data type transfer is needed, but data in a file can be accessed by appropriate programs only.

The link to read more: [IO Streams](https://docs.oracle.com/javase/tutorial/essential/io/streams.html)

Steps for accessing a file:

1. Open file.
2. Read data from file to a program's variable, or write the value in the program's variable to file.
3. Close file.

### Stream

An I/O Stream represents an input source or an output destination. A stream can represent many different kinds of sources and destinations, including disk files, devices, other programs, and memory arrays.

An I/O Stream contains a reference to a data source, methods for accessing data in the source, and methods for type conversions.

Streams support many different kinds of data, including simple bytes, primitive data types, localized characters, and objects. Some streams simply pass on data; others manipulate and transform the data in useful ways (type conversions may be needed).

No matter how they work internally, all streams present the same simple model to programs that use them: a stream is a sequence of data. A program uses an input stream to read data from a source, one item at a time, and uses an output stream to write data to a destination, one item at a time.

![Input Stream Diagram](/images/mang-doi-tuong/4.jpg "Luồng dữ liệu đi vào chương trình (Data Source → Stream → Program)")

![Output Stream Diagram](/images/mang-doi-tuong/5.jpg "Luồng dữ liệu đi ra từ chương trình (Program → Stream → Data Source)")

[Introduction to the java.io package](https://docs.oracle.com/javase/7/docs/api/java/io/package-summary.html)

[Introduction to I/O Stream](https://docs.oracle.com/javase/tutorial/essential/io/streams.html)

[Introduction to the File class](https://docs.oracle.com/javase/7/docs/api/java/io/File.html)


### Showing File Information

In the following program, the user will give a pathname, the program will show information about this pathname in the file system.

![FileDemo — showFolder method](/images/mang-doi-tuong/6.jpg "Phương thức showFolder hiển thị thông tin thư mục")

![FileDemo — showFile method](/images/mang-doi-tuong/7.jpg "Phương thức showFile hiển thị thông tin tệp tin thường")

![FileDemo — showChildren method](/images/mang-doi-tuong/8.jpg "Phương thức showChildren hiển thị các thư mục con và tệp tin bên trong")

![FileDemo — main method](/images/mang-doi-tuong/9.jpg "Phương thức main để kiểm thử chương trình FileDemo")

Result in 3 cases:

![FileDemo Result](/images/mang-doi-tuong/10.jpg "Kết quả chạy chương trình với 3 trường hợp: đường dẫn không tồn tại, là tệp tin, là thư mục")

### Accessing ASCII Text Files

When a text file is used, the file designer will decide text organization (data meanings) in a file. So, all read/write operations must perform appropriately.

The following pictures depict ways we can use to access a text file:

![Reading a Text File Model](/images/mang-doi-tuong/11.jpg "Mô hình các lớp dùng để đọc dữ liệu từ tệp văn bản")

![Writing a Text File Model](/images/mang-doi-tuong/12.jpg "Mô hình các lớp dùng để ghi dữ liệu ra tệp văn bản")

### Build a Complete Program

Build a program that is needed to help users manage a list of products.

- Details of a product include `String ID`, `String name`, `int price`.
- An initial list of products is stored in a text file, named `products.txt`.
- Initial data in the file as below:

```
P001, Sony TV 65, 850
P006, Sharp TV 40, 210
P003, TCL TV 55, 310
P007, Bose sounddock 30 III, 500
P002, Bose soundbar 230 I, 800
P004, Denon soundbar S330, 1100
```

Users can choose an operation at a time using a simple menu. Operations are required:

- Add a product.
- Search a product based on its ID.
- Print products based on a part of its name. For example, "TV" or "soundbar".
- Print all products in descending order of prices.
- Save the current list to file, named `Products.txt`.

Constraints:

- The ID of a product must be in the "P000" format.
- The product name is not blank and there is no extra blank.
- The product's price must be > 0.
- The product's ID is unique.

Class design:

- Class `Inputter` for inputting data to ensure that they satisfy the problem's constraints.
- Class `Menu` for program's menu.
- Class `Product` for a product.
- Class `ProductList` for a list of products.
- Class `ProductManager` for the program.

Software structure and menu:

![Product Manager — Project Structure and Menu](/images/mang-doi-tuong/13.jpg "Cấu trúc thư mục dự án và menu chương trình quản lý sản phẩm")

> **Note:** A class that uses classes in a package should be outside of the package. The `ProductManager` class is put outside of the `products` package.

![Products.txt and ProductManager.bat](/images/mang-doi-tuong/14.jpg "Nội dung tệp Products.txt (dữ liệu ban đầu) và tệp thực thi ProductManager.bat")

**Implementations**

The `Inputter` class is the tool for inputting data based on the program's constraints.

![Inputter class — normalize method](/images/mang-doi-tuong/15.jpg "Lớp Inputter: phương thức normalize chuẩn hoá chuỗi nhập vào")

![Inputter class — getNonBlankStr method](/images/mang-doi-tuong/16.jpg "Lớp Inputter: phương thức getNonBlankStr lấy chuỗi không rỗng")

**Regular Expression**

A regular expression is a way or a language that helps us describe strings that are in a pre-defined specific pattern.

Example: `"[pP][\\d]{3}"` — pattern for "p000", "P001", "P909".

Meanings of parts:

- `[pP]`: one character and it must be 'p' or 'P'.
- `[\\d]{3}`: 3 digits.

In the `String` class, we can use the `boolean matches(String regEx)` method to check whether a string matches the specified regular expression or not.

[For more details](https://docs.oracle.com/en/java/javase/16/docs/api/java.base/java/util/regex/Pattern.html)

![Inputter class — getPatternStr method](/images/mang-doi-tuong/17.jpg "Lớp Inputter: phương thức getPatternStr kiểm tra chuỗi theo Regular Expression")

![Inputter class — getIntGreater method](/images/mang-doi-tuong/18.jpg "Lớp Inputter: phương thức getIntGreater lấy số nguyên lớn hơn giá trị cho trước")

> **Exercise:** Upgrade the Product Manager program above. Add the following extra operations to this program:
>
> - Print products whose prices are between min price and max price.
> - Update name and price of a product based on its ID.
> - Remove a product based on its ID.

![Menu class](/images/mang-doi-tuong/19.jpg "Lớp Menu hiển thị các lựa chọn và nhận lựa chọn của người dùng")

![Product class — fields and constructor](/images/mang-doi-tuong/20.jpg "Lớp Product: thuộc tính và constructor")

![Product class — comparator1](/images/mang-doi-tuong/21.jpg "Lớp Product: Comparator để sắp xếp theo giá giảm dần, ID tăng dần")

![Product class — toString and getters/setters](/images/mang-doi-tuong/22.jpg "Lớp Product: phương thức toString, getter và setter")

![ProductList class — imports and constructor](/images/mang-doi-tuong/23.jpg "Lớp ProductList kế thừa ArrayList<Product>: import và constructor")

![ProductList — loadFromFile method](/images/mang-doi-tuong/24.jpg "Phương thức loadFromFile đọc danh sách sản phẩm từ tệp văn bản")

![ProductList — saveToFile method](/images/mang-doi-tuong/25.jpg "Phương thức saveToFile ghi danh sách sản phẩm ra tệp văn bản")

![ProductList — search method](/images/mang-doi-tuong/26.jpg "Phương thức search tìm sản phẩm theo ID")

![ProductList — addProduct method](/images/mang-doi-tuong/27.jpg "Phương thức addProduct thêm sản phẩm mới vào danh sách")

![ProductList — searchProduct method](/images/mang-doi-tuong/28.jpg "Phương thức searchProduct tìm và hiển thị sản phẩm theo ID")

![ProductList — printByName method](/images/mang-doi-tuong/29.jpg "Phương thức printByName in các sản phẩm theo một phần tên")

![ProductList — printAll method](/images/mang-doi-tuong/30.jpg "Phương thức printAll sắp xếp và in toàn bộ danh sách sản phẩm")

![ProductManager class — main setup](/images/mang-doi-tuong/31.jpg "Lớp ProductManager: khởi tạo menu và nạp dữ liệu ban đầu từ tệp")

![ProductManager class — main loop](/images/mang-doi-tuong/32.jpg "Lớp ProductManager: vòng lặp menu xử lý các lựa chọn của người dùng")

### Accessing Object Files

Serialization is a process in which binary data bytes of an object will be transferred to a stream.

De-serialization is a process in which binary data bytes in a stream will be transferred to fields of an object.

Each programming language chooses a way to serialize an object. Following are some concerns:

- Whether class information of the object is stored in a file or not.
- What is the order of fields that will be stored? Down order (field 1, field 2, …) is applied, or up order should be used?

**How to serialize a Java object to a stream?**

To serialize data of objects to a stream, a class of objects must implement the `java.io.Serializable` interface. This interface has no method. The Java compiler will add systematic code needed to serialize and de-serialize between objects and a binary stream.

Because object files are binary, users can not use text editors to see or edit data. All read and write operations must be performed by suitable programs.

**What fields will be serialized?**

Not all data of an object are serialized to a stream. `static` and `transient` fields are not serialized.

> **Note:**
>
> - The `static` modifier is used when a field is the common field of a class.
> - The `transient` modifier is used when a field has value as a result of computation from other fields. [Read more](https://www.geeksforgeeks.org/java/transient-keyword-java/)

Model for reading objects from and writing objects to an object stream.

![Object Serialization Model](/images/mang-doi-tuong/33.jpg "Mô hình serialization/de-serialization đối tượng qua ObjectInputStream/ObjectOutputStream")

The following image helps us explore the structure of an object file in Java.

![Object File Structure](/images/mang-doi-tuong/34.jpg "Cấu trúc tệp đối tượng: thông tin package, class và tên field được lưu ở đầu tệp")

- Package and class information, including field names and field types (I: int), are put at the beginning of the file.
- Fields are written to file in reverse order.
- Each time objects are written to file, information about package and class will be written.

We are notified about properties when manipulating object files as below:

- All objects in the file should be loaded to memory.
- Use the override mode to write objects to the file.

**Problem:** the following demonstration will depict the way to access an object file containing some books.

Software structure of Book Managing Program:

![Book Manager — Project Structure](/images/mang-doi-tuong/35.jpg "Cấu trúc dự án ObjectFileDemo quản lý sách")

![Book class](/images/mang-doi-tuong/36.jpg "Lớp Book implements Serializable")

![BookList class — imports and constructor](/images/mang-doi-tuong/37.jpg "Lớp BookList kế thừa ArrayList<Book>: import và constructor")

![BookList — loadFromFile method](/images/mang-doi-tuong/38.jpg "Phương thức loadFromFile đọc danh sách sách từ tệp đối tượng")

![BookList — saveToFile method](/images/mang-doi-tuong/39.jpg "Phương thức saveToFile ghi danh sách sách ra tệp đối tượng")

![BookList — printList method](/images/mang-doi-tuong/40.jpg "Phương thức printList in danh sách sách")

![BookManager class — main setup](/images/mang-doi-tuong/41.jpg "Lớp BookManager: khởi tạo danh sách và nạp dữ liệu từ tệp")

![BookManager class — adding and saving books](/images/mang-doi-tuong/42.jpg "Lớp BookManager: thêm sách mới, lưu và nạp lại từ tệp")

The result:

![Book Manager Result](/images/mang-doi-tuong/43.jpg "Kết quả chạy chương trình quản lý sách và cấu trúc tệp books.dat sinh ra")

> **Exercise:** Develop the above demonstration program for managing books with the following specifications:
>
> - `Book <String ID, String title, String author, int edition, int price>`.
> - Filename: `books.dat`.
> - Menu of the program:
>   - Add a book.
>   - Search a book based on ID.
>   - Update a book.
>   - Remove a book.
>   - Print books of an author.
>   - Print books having titles containing a sub-string.
>   - Print books in ascending order of authors then ascending prices.
>   - Save the list to file.

### Summary

- A file is a group of related data which are stored in external memory (disk) for the common use between some programs.
- A thing containing data is called a file. So, a directory is a file, a device (keyboard, monitor, network interface card, disk, …) is a file.
- An I/O Stream represents an input source or an output destination. A stream can represent many different kinds of sources and destinations, including disk files, devices, other programs, and memory arrays.
- The `java.io` package contains interfaces and almost all of the classes for accessing text files and binary files including object files.
- The `java.io.File` class supports methods for accessing basic information of a file or folder.

### Course Slide

- [Array of Objects.pdf](https://pro192web.netlify.app/resource/ArrayOfObjects.pdf)
- [File I/O.pdf](https://pro192web.netlify.app/resource/File%20IO.pdf)
