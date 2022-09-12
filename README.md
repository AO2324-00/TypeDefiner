# TypeJS

JavaScript用の型定義モジュールです。<br>
TypeScriptが使えない環境下でも、型の不一致を確認することができます。


![サンプル画像](https://github.com/AO2324-00/TypeJS/blob/main/sample.png?raw=true)

# 使用方法
## 導入
HTMLから呼び出す場合
```html
<!-- ローカルファイルをダウンロードして設置する -->
<script src="./TypeJS.js"></script>
<script>/* Your scripts */</script>

<!-- もしくは -->

<!-- ネットワークを介して読み込む -->
<script src="https://github.com/AO2324-00/TypeJS/raw/latest/TypeJS.js"></script>
<script>/* Your scripts */</script>
```

importを使う場合
```js
/* ローカルファイルをダウンロードして設置する */
import TypeJS from "./TypeJS.module.js";

/*  もしくは  */

/* ネットワークを介して読み込む */
import TypeJS from "https://github.com/AO2324-00/TypeJS/raw/latest/TypeJS.module.js";
```

## TypeJS.inspect(input, type)
型をチェックします。
```javascript
TypeJS.inspect(入力, 型);
// -> true or false
```
#### 例
```javascript
TypeJS.inspect("文字列", String);
// -> true

TypeJS.inspect("文字列", Number);
// -> false

TypeJS.inspect(["文字列", 200], Array);
// -> true

TypeJS.inspect([100, 200], Array(String));
// -> false

TypeJS.inspect("文字列", [String, undefined]);
// -> true

TypeJS.inspect(undefined, [String, undefined]);
// -> true

TypeJS.inspect({ str: "文字列", func: ()=>console.log("関数") }, {str: String, func: Function});
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
型を定義します。
```javascript
const typeChecker = TypeJS.define(型);
typeChecker(入力);
// -> 入力 (型が不一致の場合はエラーを発生させる)
```

#### 例
```javascript
// 型の定義
const nullableString = TypeJS.define([String, null]);

// 型のチェック
nullableString("test"); // -> 引数に入れた値をそのまま返す。(この場合は"test")

nullableString(100);
// 引数が文字列でもnullでもない為エラーを出力する。(戻り値は引数の値である100)

```

## 型の定義
|  型  |  説明  |
| ---- | ---- |
|  String  |  文字列  |
|  Number  |  数値  |
|  Boolean  |  真偽値(`true` or `false`)  |
|  BigInt  |  Numberで表せない大きな数値(`9007199254740991n`など)  |
|  Symbol  |  シンボル  |
|  Function  |  関数  |
|  Array  |  引数の型がanyの配列  |
|  Array(`型`)  |  引数の型を指定した配列  |
|  Object  |  要素を指定しない連想配列やオブジェクト  |
|  { `キー`: `型`, ... }  |  キーの名前と型を指定した連想配列  |
|  [`型`, ...]  |  複数の型を許容させる(Union型)  |
|  `クラス名`  |  そのクラスのインスタンスイブジェクト  |
|  null  |  存在しない状態  |
|  undefined  |  未定義  |