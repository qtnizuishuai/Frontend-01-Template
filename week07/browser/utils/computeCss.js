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
function specificity(selector) {
    const p = [0, 0, 0, 0];
    const selectorParts = selector.split(" ");
    for (const part of selectorParts) {
        if (part.charAt(0) === "#") {
            p[1] += 1;
        } else if (part.charAt(0) === ".") {
            p[2] += 1;
        } else {
            p[3] += 1;
        }
    }
    return p;
}

function compare(sp1, sp2) {
    if (sp1[0] - sp2[0]) {
        return sp1[0] - sp2[0];
    }
    if (sp1[1] - sp2[1]) {
        return sp1[1] - sp2[1];
    }
    if (sp1[2] - sp2[2]) {
        return sp1[2] - sp2[2];
    }
    return sp1[3] - sp2[3];
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
            // console.log('Element', element, 'matched rule', rule)
            var sp = specificity(rule.selectors[0]);
            var computedStyle = element.computedStyle;
            for (const declaration of rule.declarations) {
                declaration.property = toHump(declaration.property)
                if (!computedStyle[declaration.property]) {
                    computedStyle[declaration.property] = {};
                }
                if (!computedStyle[declaration.property].specificity) {
                    computedStyle[declaration.property].value = declaration.value;
                    computedStyle[declaration.property].specificity = sp;
                } else if (
                    compare(computedStyle[declaration.property].specificity, sp) < 0
                ) {
                    computedStyle[declaration.property].value = declaration.value;
                    computedStyle[declaration.property].specificity = sp;
                }
            }
        }
    }
}
// 转驼峰

function toHump(name) {
    return name.replace(/\-(\w)/g, function(all, letter){
        return letter.toUpperCase();
    });
}

module.exports = computeCSS