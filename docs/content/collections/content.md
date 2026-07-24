Bộ sưu tập

Java Collections Framework: danh sách, tập hợp, bản đồ và các lớp liên quan.
Collection Framework in Java

In almost all real problems, data related to a problem are groups, each group contains many objects. A group of objects is called a collection. In Java, a collection framework is introduced to support tools for managing collections more easily.

Overview of Abstract Data Types

An abstract data type (ADT) is a mathematical model for a data type, defined by its behaviors from the user's point of view. In Java, ADTs are often declared as interfaces. Collections, sets, and maps are all ADTs.

Add new element
Search an element
Remove an element
Traverse (access all elements one-by-one)
Sort elements
ADT (mathematical model, user view) contrasts with data structure, which is a concrete representation of data (implementer view, physical view).

Java Collections Framework

The Java Collections Framework provides a unified architecture for representing and manipulating collections. It includes interfaces, implementations, and algorithms for working with groups of objects.

Reduces programming effort by providing data structures and algorithms so you don't have to write them yourself.
Increases performance by providing high-performance implementations of data structures and algorithms.
Provides interoperability between unrelated APIs by establishing a common language to pass collections back and forth.
Reduces the effort required to learn APIs by requiring you to learn multiple ad hoc collection APIs.
Reduces the effort required to design and implement APIs by not requiring you to produce ad hoc collections APIs.
Fosters software reuse by providing a standard interface for collections and algorithms with which to manipulate them.
Collections framework interface structureCollection Implementations
For more details, see the Javadoc.

List and ArrayList

All references to elements are stored in a one-dimensional array, called an array list. This organization can be used to store arbitrary elements and they can be duplicated.

ArrayList demonstrationArrayList characteristics
If objects in a collection do not belong to the same class, references in a collection will behave as references to objects of the Object class. Based on OOP inheritance, the following assignment is valid: Father_reference = Son_reference;

When using generics, you can specify the element type for type safety and to avoid casting.


ArrayList<Rectangle> list = new ArrayList<>();
list.add(new Rectangle(2, 3));
Rectangle r = list.get(0); // No cast needed
Demonstrations
Demonstration 1: Using an ArrayList of arbitrary elements.ArrayList arbitrary elementsObjects of Rectangle in ArrayList
Experiment: If you want to call a method specific to a subclass, you must cast.
Demonstration 2: Using an ArrayList for storing the same-type elements.ArrayList same-type elements
Demonstration 3: Managing a list of students with ArrayList.Class DesignAlgorithm 1Algorithm 2Algorithm 3Algorithm 4Algorithm 5Algorithm 6Algorithm 7Algorithm 8Algorithm 9Algorithm 10Algorithm 11
Test cases:

Student managing Program
1-Add new student
2-Search a student
3-Update name and mark
4-Remove a student
5-List all
6-Quit
Choose 1..6:
Student managing menu
Set and TreeSet

A Set is a group of distinct objects. The TreeSet class stores elements in a sorted, self-balancing tree structure. Duplicates are not allowed.

TreeSet structure
TreeSet is implemented as a self-balanced ordered tree. It guarantees log(n) time cost for the basic operations (add, remove, and contains).

A sorted group must be maintained.
Search operation must have high performance.
Elements must implement Comparable or a Comparator must be provided. The ordering maintained by a set must be consistent with equals if it is to correctly implement the Set interface.

Demonstrations
Demonstration 1: The Student class does not implement any comparison method, so a compile-time error occurs.TreeSet error
Demonstration 2: TreeSet of integers (Integer implements Comparable, no duplicates allowed).TreeSet of integers
Demonstration 3: TreeSet of user-defined objects (Student), with add, search, remove, ascending and descending traversal.TreeSet students aTreeSet students bTreeSet students cTreeSet students dTreeSet students eTreeSet students output
Map and HashMap

A Map associates unique keys with values. The HashMap class provides a hash-table-based implementation of the Map interface, allowing fast access to values by key.

Map structure
A Map is like a dictionary. Maps check for key uniqueness based on the equals() method, not the == operator. The key can be a number or a string (such as Student ID, product ID).

Hash function and hash-table
A hash-table is a set of subsets but the position index is determined by a function, called a hash function (h). The mathematical operation, modulo (or mod/ % in programming languages), is commonly used in hash functions.

This implementation provides constant-time performance for the basic operations (get and put), assuming the hash function disperses the elements properly among the buckets.

For more details, see the Javadoc.

Demonstration
Demonstration 1: An empty hashmap is initiated, then some persons (nickName, person) are put and some basic operations on hashmap are performed.HashMap demo 1HashMap demo 2HashMap demo 3HashMap demo 4HashMap demo 5HashMap demo 6HashMap output
Supporting Classes

Along with the Collections framework, the java.util package also contains supporting classes in which many operations on collections and arrays are implemented. Almost all of these methods are public static. Actions such as sorting, shuffling, copying, searching, composition, finding extreme values (min, max), etc. are implemented.

Supporting class	Parameter of methods
Java.util.Collections	Collection
Java.util.Arrays	Array
Read more Collections in Javadoc
Read more Arrays in Javadoc

Demonstration: An ArrayList of employees will be sorted with two mechanisms: (1) sorting by ascending ID; (2) Sorting by descending order by salary.Sorting ArrayList of employeesSorting by salarySorting outputSorting output 2
Summary

Abstract data type (ADT) is a mathematical model for a data type that is determined based on generalization in which data structure is omitted. In programming languages, an ADT is commonly declared as an interface
Collection, Set, Map are ADTs
Java Collections framework, in the java.util package, supports all basic common manipulations on collections, maps, and basic algorithms on collections, arrays are implemented in two supporting classes Collections, Arrays.
Suggestions for choosing a class for managing a group of elements:
Group characteristics	The class should be chosen
Elements can be duplicated	Java.util.ArrayList
Elements must be distinct and sorted and each operation needs high performance.	Java.util.TreeSet
Each element contains a unique key and operations must have very high performance	Java.util.HashMap
For extra operations on collections and arrays such as sorting, copying, etc., refer to classes: java.util.Collections and java.util.Arrays.

Course Slide

Collections.pdf
Reading

Support Classes.pdf