# 💻 JavaScript Coding Exercises

## 🔄 Exercise 1: Variable Swapping

### 🎯 Problem

Given two variables with values, swap their contents without changing the existing code or using numbers.

### 📋 Initial Code

```javascript
var a = "3";
var b = "8";
```

### ✅ Requirements

- ❌ Do NOT change the existing code
- ❌ Do NOT type any numbers
- ❌ Do NOT redeclare variables a and b
- ✨ Solution should be exactly 3 lines

### 💡 Solution

```javascript
var newVariable = b;
b = a;
a = newVariable;
```

### 📤 Expected Output

```plaintext
a is 8
b is 3
```

### 🧠 Concept

This demonstrates the **temporary variable pattern** for swapping values, a fundamental programming technique.

---

## ✨ Exercise 2: Name Capitalizer

### 🎯 Problem

Convert any user input into proper name formatting, regardless of the original case.

### 📝 Examples

- Input: `"aNgElA"` → Output: `"Angela"`
- Input: `"angela"` → Output: `"Angela"`
- Input: `"ANGELA"` → Output: `"Angela"`

### 🔢 Logic Breakdown

1. Get the user's name
2. Isolate the first character and convert to uppercase
3. Isolate the rest of the name and convert to lowercase
4. Concatenate the two parts together
5. Display the result

### 💡 Solution (Detailed)

```javascript
var name = prompt("What is your name?");

// Isolate the first character
var firstChar = name.slice(0, 1);

// Convert first character to uppercase
var upperCaseFirstChar = firstChar.toUpperCase();

// Isolate the rest of the name
var restOfName = name.slice(1, name.length);

// Convert rest to lowercase
restOfName = restOfName.toLowerCase();

// Concatenate together
var capitalisedName = upperCaseFirstChar + restOfName;

alert("Hello, " + capitalisedName);
```

### ⚡ Solution (Condensed)

```javascript
var name = prompt("What is your name?");
var capitalisedName = name.slice(0, 1).toUpperCase() + 
                      name.slice(1).toLowerCase();
alert("Hello, " + capitalisedName);
```

### 🔑 Key Methods

- `slice()` - Extract portions of a string
- `toUpperCase()` - Convert to uppercase
- `toLowerCase()` - Convert to lowercase

---

## 🐶 Exercise 3: Dog Age Calculator

### 🎯 Problem

Convert a dog's age into equivalent "human years" using a specific formula.

### 📐 Formula

$$humanAge = (dogAge - 2) \times 4 + 21$$

This formula accounts for the fact that dogs mature faster in their first two years.

### 💡 Solution

```javascript
var dogAge = prompt("How old is your dog?");
var humanAge = ((dogAge - 2) * 4) + 21;
alert("Your dog is " + humanAge + " years old in human years.");
```

### 📊 Example

- **Input:** Dog is 5 years old
- **Calculation:** (5 - 2) × 4 + 21 = 33
- **Output:** "Your dog is 33 years old in human years."

---

## ⏰ Exercise 4: Life in Weeks Calculator

### 🎯 Problem

Calculate remaining days, weeks, and months if you live until 90 years old.

**Inspired by:** [Your Life in Weeks](https://waitbutwhy.com/2014/05/life-weeks.html) by Tim Urban 📖

### 📌 Assumptions

- 365 days per year
- 52 weeks per year
- 12 months per year
- Life expectancy: 90 years

### ✅ Requirements

- Function takes current age as input
- Outputs time remaining in **exact format** (commas, spaces, punctuation matter!)
- Use console.log for output

### 💡 Solution

```javascript
function lifeInWeeks(age) {
    let yearsLeft = 90 - age;
    let days = yearsLeft * 365;
    let weeks = yearsLeft * 52;
    let months = yearsLeft * 12;
    
    console.log(`You have ${days} days, ${weeks} weeks, and ${months} months left.`);
}

// Example usage
let myAge = prompt("Enter your age:");
lifeInWeeks(Number(myAge));
```

### 📊 Example

**Input:** `lifeInWeeks(56)`

**Output:**

```bash
You have 12410 days, 1768 weeks, and 408 months left.
```

---

## ⚖️ Exercise 5: BMI Calculator

### 🎯 Problem

Create a function that calculates Body Mass Index (BMI), used in medicine to estimate body fat and calculate heart disease risk.

### 📐 Formula

$$BMI = \frac{weight}{height^2}$$

### ✅ Requirements

- First parameter: weight (kg)
- Second parameter: height (meters)
- Return BMI rounded to nearest whole number
- **No** alerts, prompts, or console.logs
- Function should only return the calculated value

### 💡 Solution

```javascript
function bmiCalculator(weight, height) {
    let squaredHeight = Math.pow(height, 2);
    let bmi = weight / squaredHeight;
    return Math.round(bmi);
}
```

### 📊 Example Usage

```javascript
// Example: 70kg person who is 1.75m tall
bmiCalculator(70, 1.75); // Returns: 23

// Example: 85kg person who is 1.80m tall
bmiCalculator(85, 1.80); // Returns: 26
```

### 🔑 Key Methods

- `Math.pow(base, exponent)` - Calculate power
- `Math.round()` - Round to nearest integer

### 📈 BMI Categories (Reference)

- 💙 **Underweight:** BMI < 18.5
- 💚 **Normal weight:** BMI 18.5–24.9
- 💛 **Overweight:** BMI 25–29.9
- ❤️ **Obese:** BMI ≥ 30

---

## 📚 Summary of Concepts Covered

1. 🔄 **Variable manipulation** - Swapping values
2. 🔤 **String methods** - `slice()`, `toUpperCase()`, `toLowerCase()`
3. ➕ **Mathematical operations** - Formulas and calculations
4. 🎯 **Functions** - Parameters, return values, scope
5. 📝 **Template literals** - String interpolation with backticks
6. 🔢 **Type conversion** - `Number()` for converting strings to numbers
7. 🧮 **Math object** - `Math.pow()`, `Math.round()`

---
