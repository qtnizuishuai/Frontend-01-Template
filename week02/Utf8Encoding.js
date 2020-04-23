let stringFromCharCode = String.fromCharCode;

/**
 * @desc 创建一个包含传入字符串
 * @param {string} Unicode字符串
 */
function utf8_encode(string) {
  string = string.replace(/\r\n/g, "\n");

  let utftext = "";

  for (let n = 0; n < string.length; n++) {
    let c = string.charCodeAt(n);
    // 判断unicode范围
    if (c < 128) {
      // 匹配ascill码
      utftext += String.fromCharCode(c);
    } else if (c > 127 && c < 2048) {
      // 2个字节
      utftext += String.fromCharCode((c >> 6) | 192);

      utftext += String.fromCharCode((c & 63) | 128);
    } else {
      // 更大的编码范围
      utftext += String.fromCharCode((c >> 12) | 224);

      utftext += String.fromCharCode(((c >> 6) & 63) | 128);

      utftext += String.fromCharCode((c & 63) | 128);
    }
  }

  return utftext;
}

function utf8_decode(utftext) {
  let string = "";

  let i = 0;

  let c = (c1 = c2 = 0);

  while (i < utftext.length) {
    c = utftext.charCodeAt(i);

    if (c < 128) {
      string += String.fromCharCode(c);

      i++;
    } else if (c > 191 && c < 224) {
      c2 = utftext.charCodeAt(i + 1);

      string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));

      i += 2;
    } else {
      c2 = utftext.charCodeAt(i + 1);

      c3 = utftext.charCodeAt(i + 2);

      string += String.fromCharCode(
        ((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63)
      );

      i += 3;
    }
  }

  return string;
}

let a = "A",
  b = "极客",
  c = "时间";

console.log(utf8_encode("A")); // A
console.log(utf8_encode("极客")); // æå®¢
console.log(utf8_encode("时间")); // æ¶é´

console.log(utf8_decode(utf8_encode("A"))); // A
console.log(utf8_decode(utf8_encode("极客"))); // 极客
console.log(utf8_decode(utf8_encode("时间"))); // 时间
