## Abstraction

### What Is Abstraction?

Abstraction is one of the four pillars of Object-Oriented Programming, alongside Encapsulation, Inheritance and Polymorphism. It means exposing only the essential features of an object — what it does — while hiding the internal details of how it does it.

A useful analogy: when you drive a car, you interact with a small, well-defined set of controls — the steering wheel, the pedals, the gear stick. You don't need to know how fuel injection, combustion or the transmission actually work internally. The car's designer has abstracted a complex machine down to a simple driving interface.

In Java, abstraction is achieved through two language features:

- **Abstract classes** — a class that cannot be instantiated on its own, used as a common base that defines *what* subclasses must do, while optionally providing some shared implementation.
- **Interfaces** — a pure contract that defines *what* a class can do, without dictating *how*, and without any shared state.

It's easy to confuse abstraction with encapsulation, since both are about "hiding" something:

| | Encapsulation | Abstraction |
|---|---|---|
| Hides | Internal **state** (fields) | Internal **implementation** (how a behaviour works) |
| Mechanism | Access modifiers (`private`, `protected`) | Abstract classes, interfaces |
| Question it answers | "Can you touch my data directly?" | "Do you need to know how this works?" |
| Example | A `BankAccount`'s `balance` field is `private` | A `Shape`'s `calculateArea()` method has no implementation in the base type |

### Abstract Classes

#### Declaring an Abstract Class

An abstract class is declared with the `abstract` keyword. It can contain abstract methods (no body) as well as regular, fully-implemented methods, fields, and constructors — but it can never be instantiated directly with `new`.

```java
public abstract class Shape {
    protected String name;

    public Shape(String name) {
        this.name = name;
    }

    public abstract double calculateArea();

    public void displayInfo() {
        System.out.printf("%s has an area of %.2f%n", name, calculateArea());
    }
}
```

```java
Shape shape = new Shape("Generic"); 
```

A subclass must implement every abstract method it inherits, or it must itself be declared `abstract`:

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

circle.displayInfo();    
rectangle.displayInfo(); 
```

Notice that `circle` and `rectangle` are declared as `Shape` references — this is polymorphism at work — but it's abstraction that makes it possible to write `displayInfo()` *once*, in the base class, without knowing which concrete shape it will run on.

#### Abstract Classes Can Have Constructors

A common misconception is that abstract classes can't have constructors, since you can never call `new` directly on one. In fact, they can — and they run whenever a subclass is constructed, via an implicit or explicit `super()` call:

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
        super(name, id);
        this.baseSalary = baseSalary;
        this.bonus = bonus;
    }

    @Override
    public double calculateSalary() {
        return baseSalary + bonus;
    }
}
```

#### Abstract Classes Can Mix Abstract and Concrete Methods

An abstract class doesn't have to be 100% abstract. It's common — and often the whole point — to mix methods that must vary per subclass with methods that are shared as-is:

```java
public abstract class Employee {
    protected String name;
    protected String id;

    public Employee(String name, String id) {
        this.name = name;
        this.id = id;
    }

    public abstract double calculateSalary(); 

    public void printPaySlip() {
        System.out.printf("Pay slip for %s (%s): $%.2f%n", name, id, calculateSalary());
    }
}
```

### Interfaces

#### Declaring an Interface

An interface defines a contract: a set of method signatures that any implementing class must provide. Unlike an abstract class, an interface has no state (instance fields) and, traditionally, no implementation at all.

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

Any field declared in an interface is implicitly `public static final` — a constant, not per-instance state:

```java
public interface Config {
    int MAX_RETRIES = 3;
}
```

#### A Class Can Implement Multiple Interfaces

Java doesn't allow a class to `extends` more than one class, but it *can* `implements` as many interfaces as it needs. This is how Java achieves multiple inheritance of **type** without the ambiguity of multiple inheritance of **state**:

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

#### Default and Static Methods (Java 8+)

Since Java 8, interfaces are no longer purely abstract — they can provide `default` methods (a body that implementing classes inherit automatically, and may optionally override) and `static` methods (utility methods called on the interface itself, not on an instance):

```java
public interface Payable {
    double calculatePayment();

    default void printPaymentSlip() {
        System.out.printf("Payment due: $%.2f%n", calculatePayment());
    }

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

Default methods exist mainly so an interface can evolve — adding a new method to an interface used to break every existing implementation; a `default` method with a sensible fallback implementation doesn't. If a class implements two interfaces that both declare the *same* default method, Java forces you to resolve the conflict explicitly by overriding it yourself — it will not guess which one you meant.

An interface can also extend one or more other interfaces:

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

### Abstract Class vs Interface — Which One to Use?

| | Abstract Class | Interface |
|---|---|---|
| Keyword | `extends` (single) | `implements` (multiple allowed) |
| Instance fields (state) | Yes | No — only `public static final` constants |
| Constructors | Yes | No |
| Constant methods with a body | Any number, freely | Only via `default`/`static`/`private` (Java 8+/9+) |
| Relationship it models | "**is-a**" — a strong, single hierarchy | "**can-do**" — a capability, mixable across unrelated classes |
| When to reach for it | Subclasses share meaningful state or behaviour, and clearly belong to one family | Unrelated classes need to guarantee the same capability (e.g. `Comparable`, `Runnable`, `Payable`) |

A practical rule of thumb: start with an interface, since it's the more flexible, less committing choice. Reach for an abstract class only when subclasses need to share actual state or non-trivial default behaviour that goes beyond what a `default` method comfortably expresses.

### Putting It All Together

The two mechanisms are often combined in the same design. Here, `Employee` is an abstract class that models a strong "is-a" hierarchy with shared state, while `Payable` is an interface that any payable entity can plug into — including things that aren't `Employee`s at all, like the `Contractor` from earlier:

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

`Manager` belongs to the `Employee` family (abstraction via an abstract class), and it also happens to be `Payable` (abstraction via an interface) — two independent contracts, satisfied by one class, without either mechanism getting in the other's way.

### Summary

- Abstraction hides **implementation complexity**, exposing only what an object can do — not how it does it. It answers "do you need to know how this works?", while encapsulation answers "can you touch my data directly?".
- An **abstract class** cannot be instantiated, may contain both abstract and concrete methods, fields, and constructors, and models a strong "is-a" relationship through single inheritance.
- An **interface** defines a pure contract with no instance state. A class may implement any number of interfaces, modelling independent "can-do" capabilities.
- Since Java 8, interfaces may provide `default` and `static` methods with real implementations, letting an interface evolve without breaking existing implementers.
- Abstract classes and interfaces are not competitors — real designs frequently combine both, using each for what it does best.
