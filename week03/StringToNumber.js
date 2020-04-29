function converStringToNumber(string, x = 10) {
  var chars = string.split("");
  var number = 0;
  var i = 0;
  // 计算整数位
  while (i < chars.length && chars[i] !== ".") {
    number = number * x;
    number += chars[i].codePointAt(0) - "0".codePointAt(0);
    i++;
  }
  if (chars[i] === ".") {
    i++;
  }
  // 计算小数位
  var fraction = 1;
  while (i < chars.length) {
    fraction = fraction / x;
    number += (chars[i].codePointAt(0) - "0".codePointAt(0)) * fraction;
    i++;
  }
  return number;
}

console.log(converStringToNumber("1043.56"));
console.log(converStringToNumber("1043.56", 8));
