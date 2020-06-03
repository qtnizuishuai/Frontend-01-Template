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