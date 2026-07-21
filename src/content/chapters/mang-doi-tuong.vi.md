## Array of Objects

Một kỹ thuật có hệ thống để truy cập các object có dynamic type khác nhau trong cùng một hierarchy là sử dụng một array các con trỏ có cùng static type. Code thực thi sẽ dereference từng con trỏ tại runtime dựa trên dynamic type của object đó.

Ở chủ đề trước, một cửa hàng đồ cổ bán các item cổ, cụ thể là vase (bình), statue (tượng) và painting (tranh). Bây giờ, ta muốn quản lý danh sách các object như vase, statue, painting trong một array. Các object mà các phần tử array trỏ tới có thể khác nhau về dynamic type, nhưng đều có cùng static type (type của superclass).

Ví dụ, ta tạo file tên `ItemList.java`, chứa một array như sau:

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

Sau đây là các thao tác cơ bản mà một array hỗ trợ.

- In lần lượt tất cả các phần tử (object) trong array.
- Thêm một object vào vị trí (index) cho trước.
- Xoá một object tại vị trí cho trước.
- Tìm kiếm một object theo index hoặc theo giá trị.
- Cập nhật một object tại vị trí cho trước.

Ta sẽ hiện thực các thao tác này sau. Trước mắt, đây là method main để test một số chức năng cơ bản trong cửa hàng đồ cổ.

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

Để hiểu rõ hơn đoạn instruction vừa nêu, xem hình bên dưới:

![Empty Array of Objects](/images/mang-doi-tuong/1.jpg "Trạng thái ban đầu: mảng list rỗng, toàn bộ phần tử là null")

Sau khi khởi động, biến `obj` trỏ tới address 1000, block này chứa reference variable `list` đang trỏ tới address 2000. Đây là một array các con trỏ. Tất cả các phần tử đều được khởi tạo là `null`.

Để hoàn thiện chương trình, ta thêm method `addItem` vào class `ItemList`.

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

Chỉnh sửa case 1 trong method main:

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

Nếu choice là 1, các bước sau được thực hiện:

- Một object `Vase` được tạo tại address 300.
- State của nó giống như mẫu sau khi input.
- Address 300 được truyền vào method `addItem`.
- Thêm address này vào array tại vị trí index là `numOfItem`.
- Tăng `numOfItem` lên 1.

![Adding the First Item](/images/mang-doi-tuong/2.jpg "Sau khi thêm đối tượng Vase đầu tiên vào mảng (tmp trỏ tới địa chỉ 300)")

Ta thêm một số method nữa vào class `ItemList`:

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

Để hiểu rõ hơn điều gì đang diễn ra, ta xem hình sau:

![Removing an Item](/images/mang-doi-tuong/3.jpg "Sau khi xoá phần tử tại index 1, các phần tử phía sau dịch trái")

Method `findItemIndex` tìm item trong list và trả về vị trí xuất hiện đầu tiên trong list. Ví dụ, nếu bạn muốn lấy vị trí của item có value là 100 thì method trả về 0.

Method `findItem` tìm item trong list và trả về address của item xuất hiện đầu tiên trong list. Ví dụ, nếu bạn muốn lấy item có creator là Paris thì method trả về 300.

Nếu bạn muốn xoá item tại index 1, method `removeItem(index)` sẽ dịch các phần tử phía sau lên trên. Sau khi dịch, item cũ tại vị trí 1 trở thành garbage và Java sẽ giải phóng nó.

Trong method `sortItems`, ta hiện thực thuật toán bubble sort.

## File I/O

Nguồn dữ liệu vào/ra của một chương trình có thể là bàn phím, màn hình, file trên đĩa ngoài. Trong bài học này, các khái niệm cơ bản và công cụ để xử lý mọi loại dữ liệu, từ giá trị primitive đến object phức tạp, sẽ được giới thiệu.

Một file là một nhóm dữ liệu liên quan được lưu trữ trong bộ nhớ ngoài (đĩa) để dùng chung giữa các chương trình. Người thiết kế file sẽ quyết định định dạng dữ liệu được lưu. Nói chung, bất cứ thứ gì chứa dữ liệu được gọi là một file. Vì vậy, một thư mục (directory) là một file, một thiết bị (bàn phím, màn hình, card mạng, ổ đĩa, …) cũng là một file. Dữ liệu trong một file thông thường có thể bao gồm text, hình ảnh, âm thanh. Thông tin lưu trong file phải có tính persistent (bền vững). Nghĩa là dữ liệu trong file phải tồn tại ngay cả khi process đã tạo ra nó kết thúc.

- **Định dạng text:** một đơn vị dữ liệu là một ký tự hoặc chữ số (mã ASCII). Vì vậy, tất cả các con số trong chương trình (biến kiểu số) phải được chuyển thành một chuỗi chữ số trước khi ghi ra file.
- **Định dạng binary:** dữ liệu trong file là hình ảnh bitmap của vùng nhớ (memory) của biến trong chương trình.

Định dạng text linh hoạt hơn định dạng binary nhưng phải trả giá cho việc chuyển đổi kiểu (type conversion). File ở định dạng text có thể xem và chỉnh sửa bằng bất kỳ trình soạn thảo thông thường nào như Notepad, MS Word, …

Định dạng binary hiệu quả hơn vì không cần chuyển đổi kiểu dữ liệu, nhưng dữ liệu trong file chỉ có thể được truy cập bởi chương trình phù hợp.

Các bước để truy cập một file:

1. Mở file.
2. Đọc dữ liệu từ file vào biến của chương trình, hoặc ghi giá trị của biến trong chương trình ra file.
3. Đóng file.

### Stream

Một I/O Stream đại diện cho một nguồn dữ liệu vào (input source) hoặc một đích dữ liệu ra (output destination). Một stream có thể đại diện cho nhiều loại nguồn và đích khác nhau, bao gồm file trên đĩa, thiết bị, chương trình khác và mảng trong bộ nhớ.

Một I/O Stream chứa một reference tới nguồn dữ liệu, các method để truy cập dữ liệu trong nguồn đó, và các method để chuyển đổi kiểu dữ liệu.

Stream hỗ trợ nhiều loại dữ liệu khác nhau, bao gồm byte đơn giản, kiểu dữ liệu primitive, ký tự theo locale, và object. Một số stream chỉ đơn thuần truyền dữ liệu; số khác thao tác và biến đổi dữ liệu theo những cách hữu ích (có thể cần chuyển đổi kiểu).

Dù hoạt động bên trong như thế nào, tất cả các stream đều thể hiện cùng một mô hình đơn giản cho chương trình sử dụng chúng: một stream là một chuỗi dữ liệu tuần tự. Chương trình dùng input stream để đọc dữ liệu từ một nguồn, từng phần tử một, và dùng output stream để ghi dữ liệu ra một đích, từng phần tử một.

![Input Stream Diagram](/images/mang-doi-tuong/4.jpg "Luồng dữ liệu đi vào chương trình (Data Source → Stream → Program)")

![Output Stream Diagram](/images/mang-doi-tuong/5.jpg "Luồng dữ liệu đi ra từ chương trình (Program → Stream → Data Source)")

### Hiển thị thông tin tệp tin

Trong chương trình sau, người dùng sẽ nhập một pathname, chương trình sẽ hiển thị thông tin về pathname đó trong hệ thống file.

![FileDemo — showFolder method](/images/mang-doi-tuong/6.jpg "Phương thức showFolder hiển thị thông tin thư mục")

![FileDemo — showFile method](/images/mang-doi-tuong/7.jpg "Phương thức showFile hiển thị thông tin tệp tin thường")

![FileDemo — showChildren method](/images/mang-doi-tuong/8.jpg "Phương thức showChildren hiển thị các thư mục con và tệp tin bên trong")

![FileDemo — main method](/images/mang-doi-tuong/9.jpg "Phương thức main để kiểm thử chương trình FileDemo")

Kết quả trong 3 trường hợp:

![FileDemo Result](/images/mang-doi-tuong/10.jpg "Kết quả chạy chương trình với 3 trường hợp: đường dẫn không tồn tại, là tệp tin, là thư mục")

### Truy cập tệp văn bản ASCII

Khi sử dụng một text file, người thiết kế file sẽ quyết định cách tổ chức text (ý nghĩa dữ liệu) trong file. Vì vậy, mọi thao tác đọc/ghi phải được thực hiện phù hợp.

Các hình sau mô tả các cách ta có thể dùng để truy cập một text file:

![Reading a Text File Model](/images/mang-doi-tuong/11.jpg "Mô hình các lớp dùng để đọc dữ liệu từ tệp văn bản")

![Writing a Text File Model](/images/mang-doi-tuong/12.jpg "Mô hình các lớp dùng để ghi dữ liệu ra tệp văn bản")

### Xây dựng chương trình hoàn chỉnh

Xây dựng một chương trình cần thiết để giúp người dùng quản lý danh sách sản phẩm (product).

- Chi tiết một product bao gồm `String ID`, `String name`, `int price`.
- Danh sách sản phẩm ban đầu được lưu trong một text file, tên `products.txt`.
- Dữ liệu ban đầu trong file như sau:

```
P001, Sony TV 65, 850
P006, Sharp TV 40, 210
P003, TCL TV 55, 310
P007, Bose sounddock 30 III, 500
P002, Bose soundbar 230 I, 800
P004, Denon soundbar S330, 1100
```

Người dùng có thể chọn một thao tác tại một thời điểm bằng một menu đơn giản. Các thao tác cần có:

- Thêm một product.
- Tìm một product theo ID.
- In các product theo một phần của tên. Ví dụ, "TV" hoặc "soundbar".
- In tất cả product theo thứ tự giảm dần của giá.
- Lưu danh sách hiện tại ra file, tên `Products.txt`.

Ràng buộc (Constraints):

- ID của product phải theo định dạng "P000".
- Tên product không được rỗng và không có khoảng trắng thừa.
- Giá của product phải > 0.
- ID của product là duy nhất.

Thiết kế class:

- Class `Inputter` để nhập dữ liệu, đảm bảo dữ liệu thoả các ràng buộc của bài toán.
- Class `Menu` cho menu của chương trình.
- Class `Product` cho một product.
- Class `ProductList` cho danh sách product.
- Class `ProductManager` cho chương trình.

Cấu trúc phần mềm và menu:

![Product Manager — Project Structure and Menu](/images/mang-doi-tuong/13.jpg "Cấu trúc thư mục dự án và menu chương trình quản lý sản phẩm")

> **Lưu ý:** Một class sử dụng các class trong một package thì nên đặt ngoài package đó. Class `ProductManager` được đặt bên ngoài package `products`.

![Products.txt and ProductManager.bat](/images/mang-doi-tuong/14.jpg "Nội dung tệp Products.txt (dữ liệu ban đầu) và tệp thực thi ProductManager.bat")

**Hiện thực (Implementations)**

Class `Inputter` là công cụ để nhập dữ liệu dựa trên các ràng buộc của chương trình.

![Inputter class — normalize method](/images/mang-doi-tuong/15.jpg "Lớp Inputter: phương thức normalize chuẩn hoá chuỗi nhập vào")

![Inputter class — getNonBlankStr method](/images/mang-doi-tuong/16.jpg "Lớp Inputter: phương thức getNonBlankStr lấy chuỗi không rỗng")

**Regular Expression**

Regular Expression là một cách, hay một ngôn ngữ, giúp ta mô tả các chuỗi theo một pattern (khuôn mẫu) xác định trước.

Ví dụ: `"[pP][\\d]{3}"` — pattern cho "p000", "P001", "P909".

Ý nghĩa từng phần:

- `[pP]`: một ký tự, phải là 'p' hoặc 'P'.
- `[\\d]{3}`: 3 chữ số.

Trong class `String`, ta có thể dùng method `boolean matches(String regEx)` để kiểm tra một chuỗi có khớp với regular expression đã cho hay không.

![Inputter class — getPatternStr method](/images/mang-doi-tuong/17.jpg "Lớp Inputter: phương thức getPatternStr kiểm tra chuỗi theo Regular Expression")

![Inputter class — getIntGreater method](/images/mang-doi-tuong/18.jpg "Lớp Inputter: phương thức getIntGreater lấy số nguyên lớn hơn giá trị cho trước")

> **Bài tập:** Nâng cấp chương trình Product Manager ở trên. Thêm các thao tác sau vào chương trình:
>
> - In các product có giá nằm giữa min price và max price.
> - Cập nhật tên và giá của một product theo ID.
> - Xoá một product theo ID.

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

### Truy cập tệp đối tượng (Object Files)

Serialization là quá trình mà các byte dữ liệu binary của một object được chuyển vào một stream.

De-serialization là quá trình mà các byte dữ liệu binary trong một stream được chuyển vào các field của một object.

Mỗi ngôn ngữ lập trình chọn một cách riêng để serialize một object. Sau đây là một số vấn đề cần quan tâm:

- Thông tin class của object có được lưu trong file hay không.
- Thứ tự các field sẽ được lưu là gì? Thứ tự xuôi (field 1, field 2, …) được áp dụng, hay thứ tự ngược nên được dùng?

**Làm sao để serialize một Java object vào một stream?**

Để serialize dữ liệu của object vào một stream, class của object đó phải implement interface `java.io.Serializable`. Interface này không có method nào cả. Java compiler sẽ tự thêm code cần thiết để serialize và de-serialize giữa object và một binary stream.

Vì file object là binary, người dùng không thể dùng trình soạn thảo text để xem hay chỉnh sửa dữ liệu. Mọi thao tác đọc và ghi phải được thực hiện bởi chương trình phù hợp.

**Field nào sẽ được serialize?**

Không phải tất cả dữ liệu của một object đều được serialize vào stream. Field `static` và `transient` sẽ không được serialize.

> **Lưu ý:**
>
> - Modifier `static` được dùng khi một field là field chung của class.
> - Modifier `transient` được dùng khi một field có giá trị là kết quả tính toán từ các field khác.

Mô hình đọc object từ và ghi object vào một object stream.

![Object Serialization Model](/images/mang-doi-tuong/33.jpg "Mô hình serialization/de-serialization đối tượng qua ObjectInputStream/ObjectOutputStream")

Hình sau giúp ta khám phá cấu trúc của một object file trong Java.

![Object File Structure](/images/mang-doi-tuong/34.jpg "Cấu trúc tệp đối tượng: thông tin package, class và tên field được lưu ở đầu tệp")

- Thông tin package và class, bao gồm tên field và kiểu field (I: int), được đặt ở đầu file.
- Các field được ghi vào file theo thứ tự ngược.
- Mỗi lần object được ghi vào file, thông tin về package và class sẽ được ghi kèm.

Ta cần lưu ý một số tính chất khi thao tác với object file như sau:

- Tất cả object trong file nên được nạp vào bộ nhớ.
- Dùng override mode để ghi object vào file.

**Bài toán:** ví dụ sau sẽ mô tả cách truy cập một object file chứa một số cuốn sách (book).

Cấu trúc phần mềm của chương trình quản lý sách (Book Managing Program):

![Book Manager — Project Structure](/images/mang-doi-tuong/35.jpg "Cấu trúc dự án ObjectFileDemo quản lý sách")

![Book class](/images/mang-doi-tuong/36.jpg "Lớp Book implements Serializable")

![BookList class — imports and constructor](/images/mang-doi-tuong/37.jpg "Lớp BookList kế thừa ArrayList<Book>: import và constructor")

![BookList — loadFromFile method](/images/mang-doi-tuong/38.jpg "Phương thức loadFromFile đọc danh sách sách từ tệp đối tượng")

![BookList — saveToFile method](/images/mang-doi-tuong/39.jpg "Phương thức saveToFile ghi danh sách sách ra tệp đối tượng")

![BookList — printList method](/images/mang-doi-tuong/40.jpg "Phương thức printList in danh sách sách")

![BookManager class — main setup](/images/mang-doi-tuong/41.jpg "Lớp BookManager: khởi tạo danh sách và nạp dữ liệu từ tệp")

![BookManager class — adding and saving books](/images/mang-doi-tuong/42.jpg "Lớp BookManager: thêm sách mới, lưu và nạp lại từ tệp")

Kết quả:

![Book Manager Result](/images/mang-doi-tuong/43.jpg "Kết quả chạy chương trình quản lý sách và cấu trúc tệp books.dat sinh ra")

> **Bài tập:** Phát triển chương trình demo trên để quản lý sách với các yêu cầu sau:
>
> - `Book <String ID, String title, String author, int edition, int price>`.
> - Tên file: `books.dat`.
> - Menu của chương trình:
>   - Thêm một sách.
>   - Tìm một sách theo ID.
>   - Cập nhật một sách.
>   - Xoá một sách.
>   - In các sách của một tác giả (author).
>   - In các sách có title chứa một sub-string.
>   - In các sách theo thứ tự tăng dần của author rồi tăng dần của giá.
>   - Lưu danh sách ra file.

### Tóm tắt

- Một file là một nhóm dữ liệu liên quan được lưu trữ trong bộ nhớ ngoài (đĩa) để dùng chung giữa các chương trình.
- Bất cứ thứ gì chứa dữ liệu được gọi là một file. Vì vậy, một thư mục là một file, một thiết bị (bàn phím, màn hình, card mạng, ổ đĩa, …) cũng là một file.
- Một I/O Stream đại diện cho một nguồn dữ liệu vào hoặc một đích dữ liệu ra. Một stream có thể đại diện cho nhiều loại nguồn và đích khác nhau, bao gồm file trên đĩa, thiết bị, chương trình khác và mảng trong bộ nhớ.
- Package `java.io` chứa các interface và hầu hết class dùng để truy cập text file và binary file, bao gồm cả object file.
- Class `java.io.File` hỗ trợ các method để truy cập thông tin cơ bản của một file hoặc folder.

### Course Slide

- [Array of Objects.pdf](https://pro192web.netlify.app/resource/ArrayOfObjects.pdf)
- [File I/O.pdf](https://pro192web.netlify.app/resource/File%20IO.pdf)
