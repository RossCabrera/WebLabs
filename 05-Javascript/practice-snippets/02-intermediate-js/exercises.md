# 💻 JavaScript Coding Exercises - Solutions

---

## 🏥 Exercise 1:  BMI Calculator Advanced

### 📋 Challenge Description

Create a function that calculates BMI and returns an interpretation message based on the result.

### ✅ Requirements

- **BMI < 18.5**: "Your BMI is \<bmi>, so you are underweight."
- **BMI 18.5-24.9**: "Your BMI is \<bmi>, so you have a normal weight."
- **BMI > 24.9**: "Your BMI is \<bmi>, so you are overweight."

### 💡 Solution

```javascript
function bmiCalculator(weight, height) {
    let bmi = weight / (height * height);
    let roundedBmi = Math.round(bmi);
    let interpretation;

    if (roundedBmi < 18.5) {
        interpretation = `Your BMI is ${roundedBmi}, so you are underweight.`;
    } else if (roundedBmi <= 24.9) {
        interpretation = `Your BMI is ${roundedBmi}, so you have a normal weight.`;
    } else {
        interpretation = `Your BMI is ${roundedBmi}, so you are overweight.`;
    }

    return interpretation;
}
```

### 🎯 Example Usage

```javascript
console.log(bmiCalculator(65, 1.75)); // Your BMI is 21, so you have a normal weight.
console.log(bmiCalculator(50, 1.75)); // Your BMI is 16, so you are underweight.
console.log(bmiCalculator(90, 1.75)); // Your BMI is 29, so you are overweight.
```

---

## 📅 Exercise 2: Leap Year Challenge

### 📋 Challenge Description

💪 **Difficult Challenge** - Determine if a given year is a leap year.

### 📖 Leap Year Rules

1. A year is a leap year if it is evenly divisible by **4**
2. **EXCEPT** if that year is also evenly divisible by **100**
3. **UNLESS** that year is also evenly divisible by **400**

### 📝 Examples

- **2000**: 2000 ÷ 4 = 500 ✓, 2000 ÷ 100 = 20 ✓, 2000 ÷ 400 = 5 ✓ → **Leap year**
- **2100**: 2100 ÷ 4 = 525 ✓, 2100 ÷ 100 = 21 ✓, 2100 ÷ 400 = 5.25 ✗ → **Not leap year**

### 💡 Solution

```javascript
function isLeapYear(year) {
    if (year % 4 === 0) {
        if (year % 100 === 0) {
            if (year % 400 === 0) {
                return "Leap year.";
            } else {
                return "Not leap year.";
            }
        } else {
            return "Leap year.";
        }
    } else {
        return "Not leap year.";
    }
}
```

### 🎯 Example Usage

```javascript
console.log(isLeapYear(2400)); // Leap year.
console.log(isLeapYear(1989)); // Not leap year.
console.log(isLeapYear(2000)); // Leap year.
console.log(isLeapYear(2100)); // Not leap year.
```

---

## 🍽️ Exercise 3: Who's Buying Lunch?

### 📋 Challenge Description

Write a function that randomly selects a name from an array. That person will pay for everyone's lunch!

### ✅ Requirements

- Output format: "\<Name> is going to buy lunch today!"
- Must match exact capitalization and punctuation

### 💡 Solution

```javascript
function whosPaying(names) {
    let randomIndex = Math.floor(Math.random() * names.length);
    return `${names[randomIndex]} is going to buy lunch today!`;
}
```

### 🎯 Example Usage

```javascript
let names = ["Angela", "Ben", "Jenny", "Michael", "Chloe"];
console.log(whosPaying(names)); // Example: Michael is going to buy lunch today!
```

### 🔑 Key Concepts

- `Math.random()` generates a number between 0 and 1
- `Math.floor()` rounds down to the nearest integer
- `names.length` gives the array size
- Arrays start at index 0

---

## 🔢 Exercise 4: Fibonacci Generator

### 📋 Challenge Description

Generate the Fibonacci sequence up to n numbers.

### 🌟 Fibonacci Sequence

0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144...

Each number is the sum of the two previous numbers:

- 0 + 1 = 1
- 1 + 1 = 2
- 1 + 2 = 3
- 2 + 3 = 5

### 💡 Solution (Corrected)

```javascript
function fibonacciGenerator(n) {
    let output = [];
    
    if (n === 1) {
        return [0];
    } else if (n === 2) {  // Fixed: was "n +== 2"
        return [0, 1];
    } else {
        output = [0, 1];
        for (var i = 2; i < n; i++) {
            let newNumber = output[i - 1] + output[i - 2];
            output.push(newNumber);
        }
    }
    
    return output;
}
```

### 🎯 Example Usage

```javascript
console.log(fibonacciGenerator(1));  // [0]
console.log(fibonacciGenerator(2));  // [0, 1]
console.log(fibonacciGenerator(3));  // [0, 1, 1]
console.log(fibonacciGenerator(8));  // [0, 1, 1, 2, 3, 5, 8, 13]
```

### 🐛 Bug Fix

**Original error**: `n +== 2` should be `n === 2`

---

## 📚 Summary of Concepts Covered

1. 🔀 **Conditionals (if/else statements)** - Decision making and nested logic
2. ➗ **Mathematical operations** - Division, multiplication, and BMI formulas
3. 🔢 **Modulo operator (%)** - Checking divisibility for leap year logic
4. 🧮 **Math object** - `Math.round()`, `Math.random()`, `Math.floor()`
5. 🎲 **Random number generation** - Selecting random array elements
6. 📊 **Arrays** - Indexing, `length` property, `push()` method
7. 🔄 **Loops (for)** - Iteration and building sequences
8. ⚙️ **Functions** - Parameters, return values, and pure functions
9. 📝 **Template literals** - String interpolation with backticks
10. 🎯 **Array indexing** - Accessing elements starting at position 0

---
