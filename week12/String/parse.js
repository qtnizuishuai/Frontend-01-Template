function parse(source) {
    let stack = [];
    for (const s of source) {
      if (s === "(" || s === "[" || s === "{") {
        stack.push(s);
      }
      if (s === ")") {
        if (stack[stack.length - 1] === "(") {
          stack.pop();
        } else {
          return false;
        }
      }
      if (s === "]") {
        if (stack[stack.length - 1] === "[") {
          stack.pop();
        } else {
          return false;
        }
      }
      if (s === "}") {
        if (stack[stack.length - 1] === "{") {
          stack.pop();
        } else {
          return false;
        }
      }
    }

    if (stack.length === 0) {
      return true;
    } else {
      return false;
    }
  }