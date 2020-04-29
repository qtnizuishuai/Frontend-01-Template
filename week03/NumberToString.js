/**
 * @param {number} number
 * @param {number} x
 * @return {string}
 */
function convertNumberToString(number, x = 10) {
  let isInvalid = /2|8|16|32/.test(x);
  if (typeof number !== "number") {
    throw new Error("number must be a number");
    return false;
  }
  if (!isInvalid) {
    throw new Error("x must be 2|8|16|32");
    return false;
  }
  let integer = Math.floor(number); // 整数部分
  let decimal = number - integer; // 小数部分
  let string = !integer ? "0" : "";
  while (integer > 0) {
    string = `${integer % x}${string}`;
    integer = Math.floor(integer / x);
  }

  if (decimal) {
    string += ".";
    while (decimal && !/\.\d{20}$/.test(string)) {
      decimal *= x;
      string += `${Math.floor(decimal)}`;
      decimal -= Math.floor(decimal);
    }
  }
  return string;
}

console.log(convertNumberToString(3442.233));

console.log(convertNumberToString(3442.233, 8));
