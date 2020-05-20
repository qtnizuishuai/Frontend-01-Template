function match(element, selector) {
    if (!selector || !element.attributes) {
      return false
    }
  
    if (selector.charAt(0) === '#') {
      var attr = element.attributes.filter((attr) => attr.name === 'id')[0]
      if (attr && attr.value === selector.replace('#', '')) {
        return true
      }
    } else if (selector.charAt(0) === '.') {
      var attr = element.attributes.filter((attr) => attr.name === 'class')[0]
      // if (attr && attr.value === selector.replace('.', '')) {
      //   return true
      // }
      // 选做homework
      // 😈测试通过
      if (
        attr &&
        attr.value
          .split(/\s+/)
          .some((className) => className === selector.replace('.', ''))
      ) {
        return true
      }
    } else {
      if (element.tagName === selector) {
        return true
      }
    }
  
    return false
  }
  
  function computeCSS(element, stack, rules) {
    // 获取父元素
    var parent = stack.slice().reverse()
    if (!element.computedStyle) {
      element.computedStyle = {}
    }
  
    for (let rule of rules) {
      var selectorParts = rule.selectors[0].split(' ').reverse()
      if (!match(element, selectorParts[0])) {
        continue
      }
  
      let matched = false
      let j = 1
  
      for (let i = 0; i < parent.length; i++) {
        if (match(parent[i], selectorParts[j])) {
          j++
        }
      }
  
      if (j >= selectorParts.length) {
        matched = true
      }
  
      if (matched) {
        console.log('Element', element, 'matched rule', rule)
      }
    }
  }
  
  module.exports = computeCSS