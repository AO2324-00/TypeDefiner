# TypeJS

This is a typedef module for JavaScript. <br>
Type mismatches can be checked even in environments where TypeScript is not available.

![Sample image](https://github.com/AO2324-00/TypeJS/blob/main/sample.png?raw=true)

# How to use
## Installation
When calling from HTML
```html
<script src="./TypeJS.js"></script>
<script>/* Your scripts */</script>
```

When using import
```js
import TypeJS from "./TypeJS.module.js";
```

## TypeJS.inspect(input, type)
Check the type.
```javascript
TypeJS.inspect(input, type);
// -> true or false
```
#### Example
```javascript
TypeJS.inspect("Message", String);
// -> true

TypeJS.inspect("Message", Number);
// -> false

TypeJS.inspect(["Message", 200], Array);
// -> true

TypeJS.inspect([100, 200], Array(String));
// -> false

TypeJS.inspect("Message", [String, undefined]);
// -> true

TypeJS.inspect(undefined, [String, undefined]);
// -> true

TypeJS.inspect({ str: "Message", func: ()=>console.log("Function") }, {str: String, func: Function});
// -> true

class TestClass {}
const testObject = new TestClass();
TypeJS.inspect(testObject, TestClass);
// -> true

class TestClass {}
const test_class = TestClass;
TypeJS.inspect(class, test_class);
// -> true
```


## TypeJS.define(type)
Defines a type.
```javascript
const typeChecker = TypeJS.define(type);
typeChecker(input);
// -> input (Raise an error in case of type mismatch)
```

#### Example
```javascript
// Type Definition
const nullableString = TypeJS.define([String, null]);

// Type Check
nullableString("test"); // -> The value put in the argument is returned as it is.(In this case, "test")

nullableString(100);
// Outputs an error because the argument is neither a string nor null.(The return value is the value of the argument, 100)

```

## Type Definitions
|  Type  |  Description  |
| ---- | ---- |
|  String  |  Same as normal String  |
|  Number  |  Same as normal Number  |
|  Boolean  |  Same as normal Boolean  |
|  BigInt  |  Same as normal BigInt (e.g. `9007199254740991n`)  |
|  Symbol  |  Same as normal Symbol  |
|  Function  |  Same as normal Function  |
|  Array  |  Array with no argument type specified  |
|  Array(`type`)  |   Array with argument types  |
|  Object  |  Dictionaries and objects that do not specify elements  |
|  { `key`: `type`, ... }  |  Dictionary with key name and type  |
|  [`型`, ...]  |  Allow multiple types(Like Union)  |
|  `Class name`  |  Instance object of that class  |
|  null  |  Same as normal null  |
|  undefined  |  Same as normal undefined  |