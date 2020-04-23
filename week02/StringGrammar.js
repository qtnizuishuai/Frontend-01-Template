// 用正则，匹配所有字符串直接量

/** 
 * @desc 根据 https://www.ecma-international.org/publications/files/ECMA-ST/ECMA-262.pdf 
 *  关于单引号的描述 (SingleStringCharacter)

    * SourceCharacter but not one of ' or \ or LineTerminator
    <LS>
    <PS>
    \ EscapeSequence
    LineContinuation
    双引号的描述：(DoubleStringCharacter )

    SourceCharacter but not one of " or \ or LineTerminator
    <LS>
    <PS>
    \ EscapeSequence
    LineContinuation

    - 第一个规则 SourceCharacter but not one of ' or \ or LineTerminator。
    处理合法的字符；其中SourceCharacter代表任何Unicode单位；LineTerminator是换行<LF>（\u000A或\n），回车<CR>（\u000D或\r），行分隔符<LS>（\u2028）或段落分隔符<PS>（\u2029）。对应 [^'\\\n\r\u2028\u2029]
    - 第二个规则 处理转移序列 \ EscapeSequence,下面是它的语法(严格模式)
        EscapeSequence ::
        CharacterEscapeSequence
        0 [lookahead ∉ DecimalDigit]
        HexEscapeSequence
        UnicodeEscapeSequence
        
        对应的CharacterEscapeSequence正则表达式为：['"\\bfnrtv]|[^\n\r\u2028\u2029'"\\bfnrtvxu0-9]，可以简写为 [^\n\r\u2028\u2029xu0-9]

        第一部分是SingleEscapeCharacter，它包括'，"，\，和用于控制字符b，f，n，r，t，v。

        第二部分NonEscapeCharacter是SourceCharacter but not one of EscapeCharacter or LineTerminator。EscapeCharacter被定义为SingleEscapeCharacter，DecimalDigit或 x（对于十六进制转义序列）或u（对于Unicode转义序列）。

        0(?![0-9])是的第二个规则的正则表达式EscapeSequence。这是用于指定空字符\0。

        x[0-9a-fA-F]{2} 是正则表达式 HexEscapeSequence (16进制转义)

        u[0-9a-fA-F]{4} 是正则表达式 UnicodeEscapeSequence (Unicode转义)

    - 第三个规则处理跨多行的字符串：LineContunuation相关的语法为

    LineContinuation ::
        \ LineTerminatorSequence

    LineTerminatorSequence :: 
        <LF> 
        <CR> [lookahead ∉ <LF> ]
        <LS>
        <PS>
        <CR> <LF>
    对应的正则是：\\(?:\n|\r\n|\r(?!\n)|[\u2028\u2029])
*/

// 匹配单引号的值
let reg1 = /'(?:[^'\\\n\r\u2028\u2029]|\\(?:[^\n\rxu0-9]|0(?![0-9])|x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4}|\n|\r\n?))*'/

// 匹配双引号的值
let reg2 = /"(?:[^"\\\n\r\u2028\u2029]|\\(?:[^\n\rxu0-9]|0(?![0-9])|x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4}|\n|\r\n?))*"/

let str = "'abcdefg'"
let str1 = "'abc\'de'"
let str2 = "'abc\'de\"fg'"

console.log(reg1.test(str))
console.log(reg1.test(str1))
console.log(reg1.test(str2))

let bar = '"abcdefg"'
let bar1 = '"abc\"de"'
let bar2 = '"abc\"de\'fg"'

console.log(reg2.test(bar))
console.log(reg2.test(bar1))
console.log(reg2.test(bar2))