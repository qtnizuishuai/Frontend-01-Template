# 每周总结可以写在这里

# 每周总结可以写在这里

## 字符串分析与模式匹配

- 字典树(Hash 树的一种)
  - 大量字符串的完整模式匹配
- [KMP(Knuth-Morris-Pratt)](https://zh.wikipedia.org/wiki/%E5%85%8B%E5%8A%AA%E6%96%AF-%E8%8E%AB%E9%87%8C%E6%96%AF-%E6%99%AE%E6%8B%89%E7%89%B9%E7%AE%97%E6%B3%95)
  - 长字符串中找子串 O(m+n)
- WildCard 通配符算法
  - 长字符串中找子串升级版
- 正则
  - 字符串通用模式匹配
- 状态机
  - 通用的字符串分析
- LL LR
  - 字符串多层级结构分析

> KMP 算法

    Knuth-Morris-Pratt 字符串查找算法，简称为 “KMP 算法”，常用于在一个文本串S内查找一个模式串P的出现位置，这个算法由Donald Knuth、Vaughan Pratt、James H. Morris三人于1977年联合发表，故取这三人的姓氏命名此算法。

    算法流程：
    1. 核心算法
    KMP 算法的不同之处在于，它会花费空间来记录一些信息，
    再比如类似的 source = "aaaaaaab" pattern = "aaab"，暴力解法还会和上面那个例子一样蠢蠢地回退指针 i，而 KMP 算法又会耍聪明
    KMP 算法永不回退 txt 的指针 i，不走回头路（不会重复扫描 txt），而是借助 dp 数组中储存的信息把 pat 移到正确的位置继续匹配，时间复杂度只需 O(N)，用空间换时间，所以我认为它是一种动态规划算法。
    2. 构建next表(如何构建)
        01. 构建有限状态机
        02. 匹配对应状态，匹配准确的状态
```
/**
* 01 暴力匹配算法
// 时间复杂度为O(m*n) 
// 双层for循环
*/

function find(source, pattern) {
  if (!source || !pattern) {
    return false;
  }
  for (let i = 0; i < source.length; i++) {
    let matched = true;
    for (let j = 0; j < pattern.length; j++) {
      if (source[i + j] !== pattern[j]) {
        matched = false;
        break;
      }
    }
    if (matched) {
      return true;
    }
  }
  return false;
}
```

```
function find(source, pattern) {
  let table = new Array(pattern.length).fill(0);
  let k = 0;

  for (let j = 1; j < pattern.length; j++) {
    if (pattern[j] === pattern[k]) {
      k++;
    } else {
      k = 0;
    }
    table[j] = k;
  }

  let j = 0;

  for (let i = 0; i < source.length; i++) {
    console.log(source[i], pattern[j], j);

    if (source[i] === pattern[j]) {
      j++;
    } else {
      j = 0;
      if (source[i] === pattern[j]) {
        j++;
      }
    }

    if (j === pattern.length) {
      return true;
    }
  }
  return false;
}
```

- LR： LR 分析器是一种自底向上（bottom-up）的上下文无关语法分析器。LR 意指由左（Left）至右处理输入字符串，并以最右边优先派生（Right derivation）的推导顺序（相对于 LL 分析器）建构语法树。能以此方式分析的语法称为 LR 语法。而在 LR(k) 这样的名称中，k 代表的是分析时所需前瞻符号（lookahead symbol）的数量，也就是除了目前处理到的输入符号之外，还得再向右引用几个符号之意；省略 （k）时即视为 LR(1)，而非 LR(0)。

* LL： LL 分析器是一种处理某些上下文无关文法的自顶向下分析器。因为它从左（Left）到右处理输入，再对句型执行最左推导出语法树（Left derivation，相对于 LR 分析器）。能以此方法分析的文法称为 LL 文法。