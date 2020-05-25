

// 表示匹配结束
function end() {
    return end
}

/** 
 * 在目标字符串str 中匹配pattern
 * @param {string} pattern
 * @param {string} str
*/

function match(pattern, str) {
    const functions = [] // 存储状态机
    const charList = pattern.split('') // 将字符串分割成数组
    let lastIndex = charList.length - 1;
    let index = -1;
    let tmp;
    let j = 0;
    let start; // 初始状态机
    let res;
    charList.forEach((c, i, list) => {
        if (i === 0) {
            tmp = c;
            start = function (input) {
                if (input === c) {
                    if (i === lastIndex) {
                        return end
                    } else {
                        return i + 1; // 返回下一个状态机的索引
                    }

                } else {
                    return start
                }
            }
        }


        functions.push(i === 0 ? start : function next(input) {
            if (input === c) {
                if(index === -1){
                    if(input === tmp) {
                        index = 0;
                    }
                } else if(input === list[index + 1]){
                    index++;
                } else {
                    index = -1;
                }
                if (i === lastIndex) {
                    return end
                } else {
                    return i + 1; // 返回下一个索引。用于缓存下一个状态机
                }
            } else {
                if(index > -1){
                    let tmp = index + 1;
                    index = -1;
                    return functions[tmp](input)  // 加入最大匹配子串的状态机
                } else {
                    return start(input)  // 将input加入初始状态机
                }
              
            }
        })
    })
   
    void function(str){
        let state = start;

        for (let c of str) {
            j = state(c);
            state = typeof j === 'number' ? functions[j ] : j 
        }
        res = state === end;
    }(str)
    return res;
}


console.log(match('ab', 'abbax')) // true
console.log(match('cas', 'cscas')) // true
console.log(match('ab','aab')) // true
console.log(match('ssd', 'ssdssdx')) // true
console.log(match("abcaba", "abcabsab"))