const EOF = Symbol('EOF') // EOF end of file
const css = require('css')
const layout = require('./layout.js')
const computeCSS = require('./computeCSS')
const tagNameReg = /^!|[a-zA-Z]$/;
const spaceReg = /^[\t\n\f ]$/;
let currentToken = null
let currentAttribute = null
let currentTextNode = null

let stack = [{ type: 'document', children: [] }]

let rules = []

function addCSSRules(text) {
  var ast = css.parse(text)
  // console.log(JSON.stringify(ast, null, '       '))
  rules.push(...ast.stylesheet.rules)
}

function emit(token) {
  let top = stack[stack.length - 1];
  if (token.type === 'startTag') {
      // 我们抽象一个element对象用来表示dom元素，tag是语义化的称呼
    let element = {
      type: 'element',
      children: [],
      attributes: [], 
      parent:top // 记录父元素 便于css计算
    }

    element.tagName = token.tagName

    for (let p in token) {
      if (p !== 'type' && p !== 'tagName') {
        element.attributes.push({
          name: p,
          value: token[p]
        })
      }
    }
    // 创建了元素就去做css computing
    // 跟style的添加不一样，我们希望尽可能的早计算css，如果也像style一样在出栈的时候才去计算css，会造成页面渲染延迟
    computeCSS(element, stack, rules)

    top.children.push(element) // 自封闭标签到这一步就已完成，不必入栈

    if (!token.isSelfClosing) { // 不是自封闭标签，入栈
      stack.push(element)
    }

    currentTextNode = null
  } else if (token.type === 'endTag') {
      // 要遍历完元素的子元素进行layout，实际浏览器需要根据元素的属性做判断，更加复杂
    if (top.tagName !== token.tagName) {
      throw new Error("Tag start end doesn't match!")
    } else {
        // 检测到style元素，收集样式
      if (top.tagName === 'style') {
        addCSSRules(top.children[0].content) // 样式对象收集
      }
      // 遍历子元素结束 layout 元素
      layout(top)
      stack.pop()
    }

    currentTextNode = null
  } else if (token.type === 'text') {
    if (currentTextNode === null) {
      currentTextNode = {
        type: 'text',
        content: ''
      }
      top.children.push(currentTextNode)
    }
    currentTextNode.content += token.content
  }
}

function data(c) {
  if (c === '<') { 
    // stater state
    return tagOpen
  } else if (c === EOF) {
    //Emit an end-of-file token.
    emit({
      type: 'EOF'
    })
    return
  } else {
    //Emit the current inputText  as a character token.
    emit({
      type: 'text',
      content: c
    })
    return data
  }
}

function tagOpen(c) {
  if (c === '/') {
    // 
    return endTagOpen
  } else if (c.match(tagNameReg)) {
    //Create a new start tag token, that sets its `tagname` to the empty string. Reconsume in the tag name state.
    currentToken = {
      type: 'startTag',
      tagName: ''
    }
    return tagName(c) // Reconsume in the tag name state (将参数注入状态机)
  } else if(c === EOF) {
       //This is an eof-before-tag-name parse error. Emit a U+003C LESS-THAN SIGN character token and an end-of-file token.
    emit({
        type:'text',
        content:'\u003c'
    })
    emit({
        type:'EOF'
    })
  }else {
    // This is an eof-before-tag-name parse error. Emit a U+003C LESS-THAN SIGN character token and an end-of-file token.
    emit({
      type: 'text',
      content: '\u003c'
    })
    return data(c)
  }
}

function endTagOpen(c) {
  if (c.match(tagNameReg)) {
      //Create a new end tag token, set its tag name to the empty string. Reconsume in the tag name state.
    // <html/
    currentToken = {
      type: 'endTag',
      tagName: ''
    }
    return tagName(c)
  } else if (c === '>') {
    //This is a missing-end-tag-name parse error. Switch to the data state.
    // <>
    return data
  } else if (c === EOF) {
       //This is an eof-before-tag-name parse error. Emit a U+003C LESS-THAN SIGN character token, a U+002F SOLIDUS character token and an end-of-file token.
  } else {
      //This is an invalid-first-character-of-tag-name parse error. Create a comment token whose data is the empty string. Reconsume in the bogus comment state.
         //return data(c)
  }
}

function tagName(c) {
  if (c.match(spaceReg)) {
    // <html
    return beforeAttributeName
  } else if (c === '/') {
    // <html/
    return selfClosingStartTag
  } else if (c.match(tagNameReg)) {
    // <h <ht ... (Append the lowercase version of the current input character (add 0x0020 to the character's code point) to the current tag token's tag name.)
    currentToken.tagName += c.toLowerCase()
    return tagName
  } else if (c === '>') {
    // <html/> (Switch to the data state. Emit the current tag token.)
    emit(currentToken)
    return data
  }else if(c == EOF){
    //This is an eof-in-tag parse error. Emit an end-of-file token.
    emit({
        type:"EOF"
    }) 
}else {
    currentToken.tagName += c.toLowerCase()
    return tagName
  }
}

function beforeAttributeName(c) {
  if (c.match(spaceReg)) {
    //Ignore the character.
        //return beforAttributeName
    return beforeAttributeName
  } else if (c === '/' || c === '>' || c === EOF) {
    // <html   /
    return afterAttributeName(c)
  } else if (c === '=') {
    // <html =
  } else {
    // <html m
    currentAttribute = {
      name: '',
      value: ''
    }

    return attributeName(c)
  }
}

function attributeName(c) {
  if (c.match(spaceReg) || c === '/' || c === '>' || c === EOF) {
    // <html m
    return afterAttributeName(c)
  } else if (c === '=') {
    // <html m =
    return beforeAttributeValue
  } else if (c === '\u0000') {
  } else if (c === '"' || c === "'" || c === '<') {
    // <html m"
  } else {
    currentAttribute.name += c
    return attributeName
  }
}

function beforeAttributeValue(c) {
  if (c.match(spaceReg) || c === '/' || c === '>' || c === EOF) {
    return beforeAttributeValue
  } else if (c === '"') {
    // <html m="
    return doubleQuotedAttributeValue
  } else if (c === "'") {
    // <html m='
    return singleQuotedAttributeValue
  } else if (c === '>') {
    // // <html m=>
  } else {
    //Reconsume in the attribute value (unquoted) state.
    return UnquotedAttributeValue(c)
  }
}

function UnquotedAttributeValue(c) {
  if (c.match(spaceReg)) {
    // <html maaa=a
    currentToken[currentAttribute.name] = currentAttribute.value
    return beforeAttributeName
  } else if (c === '/') {
    // <html maaa=a/
    currentToken[currentAttribute.name] = currentAttribute.value
    return selfClosingStartTag
  } else if (c === '>') {
    // <html maaa=a>
    currentAttribute[currentAttribute.name] = currentAttribute.value
    emit(currentToken)
    return data
  } else if (c === '\u0000') {
  } else if (c === '"' || c === "'" || c === '<' || c === '=' || c === '`') {
  } else if (c === 'EOF') {
  } else {
    currentAttribute.value += c
    return UnquotedAttributeValue
  }
}

function doubleQuotedAttributeValue(c) {
  if (c === '"') {
    currentToken[currentAttribute.name] = currentAttribute.value
    return afterDoubleQuotedAttributeName
  } else if (c === '\u0000') {
  } else if (c === 'EOF') {
  } else {
    currentAttribute.value += c
    return doubleQuotedAttributeValue
  }
}

function singleQuotedAttributeValue(c) {
  if (c === "'") {
    currentToken[currentAttribute.name] = currentAttribute.value
    return afterSingleQuotedAttributeName
  } else if (c === '\u0000') {
  } else if (c === 'EOF') {
  } else {
    currentAttribute.value += c
    return singleQuotedAttributeValue
  }
}

function afterDoubleQuotedAttributeName(c) {
  if (c.match(spaceReg)) {
    return beforeAttributeName
  } else if (c === '/') {
    return selfClosingStartTag
  } else if (c === '>') {
    currentToken[currentAttribute.name] = currentAttribute.value
    emit(currentToken)
    return data
  } else if (c === EOF) {
    return data
  } else {
    currentAttribute.value += c
    return doubleQuotedAttributeValue
  }
}

function afterSingleQuotedAttributeName(c) {
  if (c.match(spaceReg)) {
    return beforeAttributeName
  } else if (c === '/') {
    return selfClosingStartTag
  } else if (c === '>') {
    currentToken[currentAttribute.name] = currentAttribute.value
    emit(currentToken)
    return data
  } else if (c === EOF) {
  } else {
    currentAttribute.value += c
    return singleQuotedAttributeValue
  }
}

function afterAttributeName(c) {
  if (c.match(spaceReg)) {
    return afterAttributeName
  } else if (c === '/') {
    return selfClosingStartTag
  } else if (c === '=') {
    return beforeAttributeValue
  } else if (c === '>') {
    currentToken[currentAttribute.name] = currentAttribute.value
    emit(currentToken)
    return data
  } else {
    currentToken[currentAttribute.name] = currentAttribute.value
    currentAttribute = {
      name: '',
      value: ''
    }
    return attributeName(c)
  }
}

function selfClosingStartTag(c) {
  if (c === '>') {
    //Set the self-closing flag of the current tag token. Switch to the data state. Emit the current tag token.
    currentToken.isSelfClosing = true
    emit(currentToken)
    return data
  } else if (c === 'EOF') {
      //This is an eof-in-tag parse error. Emit an end-of-file token.
    emit({
        type:"EOF"
    })
  } else {
    //This is an unexpected-solidus-in-tag parse error. Reconsume in the before attribute name state.
    return beforAttributeName(c)
  }
}

function parseHTML(html) {
  let state = data

  for (let c of html) {
    state = state(c)
  }

  state = state(EOF) //只有找完全部字符，state才会等于end
  return stack[0]
}

module.exports.parseHTML = parseHTML