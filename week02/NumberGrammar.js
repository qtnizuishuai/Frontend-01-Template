// 写一个正则，匹配所有的Number直接量

let reg = /^[-+]?(?:(?:(?:(?:0|[1-9][0-9]*)|(?:(?:0|[1-9][0-9]*)\.[0-9]*|(?:0|[1-9][0-9]*)?\.[0-9]+))(?:[eE][-+]?[0-9]+)?$)|(?:0[bB][01]+$)|(?:0(?!0)[oO]?[0-7]+$)|(?:0[xX][0-9a-fA-F]+$))/;

console.log(reg.test("00")); // false
console.log(reg.test("00.")); // false
console.log(reg.test("0.")); // true
console.log(reg.test(".23")); // true
console.log(reg.test("23.45")); // true
console.log(reg.test("12")); // true
console.log(reg.test("0b000010")); // true
console.log(reg.test("0o212")); // true
console.log(reg.test("0xeff")); // true
console.log(reg.test("9")); // true
console.log(reg.test(".")); // false
console.log(reg.test("34e+3")); // true
console.log(reg.test("23.23e-3")); // true
