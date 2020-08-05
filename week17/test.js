let y = g => 
    (f => f(f))(
      self =>
        // 当y(g) 被调用之后
        // self(self) 等同于f(f) 也就是函数g(f) 
        g( (...args) => self(self).apply(this, args))
    )

    
// f通过y包裹函数调用之后返回的是参数cb()返回的函数

let f = y(self => {
  return n => {
     // self 调用的是当前匿名函数 这里self 等于f
      const val = n > 0 ? self(n - 1)  + n : 0;
      return val;
  }
})
console.log(f(100))