# Beer

Beer is an interpreter for the Beerlang programming language, written in TypeScript.

## Introduction

Beerlang is a dynamically-typed, interpreted programming language designed for simplicity and fun.

### Planned Features

- **Emoji Support**: Beerlang is designed to support emojis as part of its syntax, adding a touch of fun and expressiveness to the language. You will be able to use emojis as variable names, function names, and even as operators.
- **Funny Syntax**: Beerlang embraces a playful and unconventional syntax that encourages creativity and experimentation. It includes elements such as using "🍺" instead of parentheses for function calls and "🍻" instead of curly braces for code blocks.

Stay tuned for these exciting additions to Beerlang!

## Features

- **Easy to Learn**: Beerlang has a simple syntax and minimalistic design, making it easy for beginners to grasp.
- **Dynamic Typing**: Variables in Beerlang are dynamically typed, allowing for flexible programming.
- **Extensible**: Beerlang supports the creation of user-defined functions and encourages code modularity.

## Syntax

### Data types

Beerlang supports the following data types:

- **Number**: Numbers in Beerlang are represented by numeric literals. For example, `var a = 12;` and `var b = 26;` assign the values 12 and 26 to variables `a` and `b`, respectively.
- **String**: Strings are sequences of characters enclosed in double quotes (`"`). For example, `var breakfast = "break";` assigns the string "break" to the variable `breakfast`. You can concatenate strings using the `+` operator, as shown in the example `print "Today's breakfast is " + breakfast + ".";`.
- **Boolean**: Beerlang has two boolean values: `true` and `false`. For example, `var t = true;` assigns the value `true` to the variable `t`, while `var f = false;` assigns `false` to the variable `f`.
- **Nil**: In Beerlang, `nil` represents the absence of a value. For example, `var notExists = nil;` assigns `nil` to the variable `notExists`. When you print `notExists`, it will display `nil`.

```tsx
var a = 12;
var b = 26;
print a + b;

var t = true;
var f = false;
var notExists = nil;

print notExists;

var breakfast = "break";
print "Today's breakfast is " + breakfast + ".";
```

### Operators

Beerlang supports the following arithmetic operators:

- **Addition (+)**: The addition operator is used to add two numbers together. For example, `var sum = 2 + 3;` assigns the value 5 to the variable `sum`.
- **Subtraction (-)**: The subtraction operator is used to subtract one number from another. For example, `var difference = 7 - 4;` assigns the value 3 to the variable `difference`.
- **Multiplication (\*)**: The multiplication operator is used to multiply two numbers. For example, `var product = 5 * 6;` assigns the value 30 to the variable `product`.
- **Division (/)**: The division operator is used to divide one number by another. For example, `var quotient = 10 / 2;` assigns the value 5 to the variable `quotient`.

Here's an example that demonstrates the usage of these operators:

```tsx
var a = 2 + 3; // Addition
var b = 7 - 4; // Subtraction
var c = 5 * 6; // Multiplication
var d = 10 / 2; // Division

print a; // Output: 5
print b; // Output: 3
print c; // Output: 30
print d; // Output: 5

```

These operators can be used with variables, numeric literals, and expressions to perform arithmetic operations in Beerlang.

### Control flows

Beerlang supports the following control flow statements:

### `if` statement

The `if` statement allows you to conditionally execute a block of code based on a Boolean expression.

Here's an example that demonstrates the usage of the `if` statement:

```tsx
var a = -10;
var condition = a > 3;
if (condition) {
  print " I am true...";
} else {
  print " I am false...";
}
```

### `while` loop

The `while` loop allows you to repeatedly execute a block of code as long as a condition is true.

Here's an example that demonstrates the usage of the `while` loop:

```tsx
var i = 1;
while (i < 8) {
  print i;
  i = i + 1;
}
```

### `for` loop

The `for` loop allows you to iterate over a range of values or elements in Beerlang.

```tsx
for (var i =0; i < 10; i= i + 1){
    print i;
}
```

These control flow statements allow you to make decisions, repeat actions, and iterate over values in Beerlang, adding flexibility and control to your programs.

### Functions

In Beerlang, functions are first-class citizens, which means they can be assigned to variables, passed as arguments to other functions, and returned as values from other functions. You can define functions using the `fun` keyword, followed by the function name and a pair of parentheses for the parameter list. The function body is enclosed in curly braces `{}`.

Here's an example of a function that adds two numbers:

```tsx
fun add(a, b) {
  return a + b;
}

var result = add(3, 4);
print(result); // Output: 7

fun fib(n) {
  if (n <= 1) return n;
  return fib(n - 2) + fib(n - 1);
}
for (var i = 0; i < 20; i = i + 1) {
  print fib(i);
}

```

### Closures

Beerlang supports closures, which are functions that have access to variables from their outer (enclosing) scope. This allows functions to "remember" the values of variables even after they have finished executing. Closures can be useful for creating functions with private variables or for implementing callback functions.

Here's an example of a closure in Beerlang:

```tsx
fun counter() {
  var count = 0;

  fun increment() {
    count = count + 1;
    print("Count: " + count);
  }

  return increment;
}

var counterFunc = counter();
counterFunc(); // Output: Count: 1
counterFunc(); // Output: Count: 2

```

In the example above, the `counter` function returns the `increment` function, which has access to the `count` variable in its outer scope. Each time the `increment` function is called, it increments the `count` variable and prints the updated value.

Closures in Beerlang provide a powerful mechanism for creating functions with encapsulated state and behavior.

### Classes

Beerlang supports object-oriented programming through the use of classes. A class is a blueprint for creating objects that share similar properties and behaviors. In Beerlang, you can define classes using the `class` keyword, followed by the class name and a pair of curly braces `{}` to enclose the class body.

In Beerlang, the `init` method is used as a constructor for a class. It is called when a new instance of the class is created. The `init` method initializes the properties of the class and performs any necessary setup.

Here's an example of a class definition in Beerlang:

```tsx
class Breakfast {
  init() {
    this.name = "cake";
    this.number = 2;
    print "Cakes ready!";
  }

  eat() {
    if (this.number > 0) {
      print "Eating " + this.name + "...";
      this.number = this.number - 1;
    } else {
      print "Nothing to eat.";
    }
  }
}
var breakfast = Breakfast();
var quickEat = breakfast.eat;
quickEat();
breakfast.eat();
quickEat();

```

Beerlang's class-based approach allows you to organize your code into reusable and modular components, making it easier to manage and maintain your programs.

### Inheritance

In Beerlang, you can create classes that inherit properties and behaviors from other classes. This is known as inheritance and allows you to create a hierarchy of classes with shared characteristics.

To define a class that inherits from another class, you can use the `<` keyword followed by the name of the parent class. The child class can then access and override the properties and methods of the parent class.

Here's an example that demonstrates inheritance in Beerlang:

```tsx
class Doughnut {
  cook() {
    print "Fry until golden brown.";
  }
}

class BostonCream < Doughnut {
  cook() {
    super.cook();
    print "Pipe full of custard and coat with chocolate.";
  }
}

BostonCream().cook();
```

Inheritance allows you to reuse code and create a more organized and modular class structure in Beerlang.

## Installation

To use Beerlang, ensure that you have Bun.js and npm installed on your system. Then, follow these steps:

1. Clone the Beerlang repository: `git clone https://github.com/Riley1101/Beerlang`>
2. Navigate to the repository: `cd beerlang`
3. Install dependencies: `bun install`
4. Build the project: `bun run build`
5. Run Beerlang: `bun start`

### Running Beerlang Script

To execute a Beerlang script, use the following command:

```
bun beer myscript.beer
```

Replace `myscript.beer` with the path to your Beerlang script file.

## Examples

Checkout examples in `/examples`

## Contributing

Contributions to Beerlang are welcome! If you find any bugs, have feature requests, or want to contribute enhancements, please open an issue or submit a pull request on the

## Roadmap

The next step in the development of Beerlang is to add more fun to it. This will involve introducing some funny syntax to make the language even more playful and unconventional. Stay tuned for these exciting additions to Beerlang!

## Resources

- https://www.edx.org/learn/computer-science/stanford-university-compilers
- https://craftinginterpreters.com/
- https://www.amazon.com/Compilers-Principles-Techniques-Tools-2nd/dp/0321486811

## License

Beerlang is open source and released under the [MIT License](https://www.notion.so/arkardev/LICENSE).
