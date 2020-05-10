// 寻找所有可访问的对象

let set = new Set(); // 来去重
let globalProperties = [
  "eval",
  "isFinite",
  "isNaN",
  "parseFloat",
  "parseInt",
  "decodeURI",
  "decodeURIComponent",
  "encodeURI",
  "encodeURIComponent",
  "Array",
  "Date",
  "RegExp",
  "Promise",
  "Proxy",
  "Map",
  "WeakMap",
  "Set",
  "WeakSet",
  "Function",
  "Boolean",
  "String",
  "Number",
  "Symbol",
  "Object",
  "Error",
  "EvalError",
  "RangeError",
  "ReferenceError",
  "SyntaxError",
  "TypeError",
  "URIError",
  "ArrayBuffer",
  "SharedArrayBuffer",
  "DataView",
  "Float32Array",
  "Float64Array",
  "Int8Array",
  "Int16Array",
  "Int32Array",
  "Uint8Array",
  "Uint16Array",
  "Uint32Array",
  "Uint8ClampedArray",
  "Atomics",
  "JSON",
  "Math",
  "Reflect",
];

let current;
let queue = [];
for (let p of globalProperties) {
  queue.push({
    path: [p],
    object: this[p],
  });
}
while (queue.length) {
  current = queue.shift(); // 依次从头部取出对象
  console.log(current.path.join("."));
  if (set.has(current.object)) continue;

  set.add(current.object); // 将其添加到

  for (let p of Object.getOwnPropertyNames(current.object)) {
    var descriptor = Object.getOwnPropertyDescriptor(current.object, p);
    if (
      descriptor.hasOwnProperty("value") &&
      typeof descriptor.value === "object" &&
      descriptor.value !== null &&
      descriptor.value instanceof Object
    ) {
      queue.push({
        path: current.path.concat([p]),
        object: descriptor.value,
      }); // 将子对象添加到队列的末尾
    }

    if (
      descriptor.hasOwnProperty("get") &&
      typeof descriptor.get === "function"
    ) {
      queue.push({
        path: current.path.concat([p]),
        object: descriptor.get,
      });
    }
    if (
      descriptor.hasOwnProperty("set") &&
      typeof descriptor.set === "function"
    ) {
      queue.push({
        path: current.path.concat([p]),
        object: descriptor.set,
      });
    }
  }
}
