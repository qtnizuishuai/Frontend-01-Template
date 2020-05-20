/**
 * @desc 匹配字符串
 * @param {string} string
 */
function match(string){
 var state = start; // 初始化start状态
 for(let c of string){
     state = state(c);
 }
 return state === end;
}

function start(c){
    if(c === 'a'){
        return foundA;
    } else {
        return start;
    }
}
// 表示固定的状态
function end(c){
    return end;
}

function foundA(c){
    if(c === "b") {
        return foundB
    } else {
        return start(c)
    }
}

function foundB(c){
    if(c === "c") {
        return foundC
    } else {
        return start(c)
    }
}

function foundC(c){
    if(c === "d") {
        return foundD
    } else {
        return start(c)
    }
}

function foundD(c){
    if(c === "e") {
        return foundE
    } else {
        return start(c)
    }
}

function foundE(c){
    if(c === "f") {
        return end;
    } else {
        return start(c)
    }
}

let string = 'aabcdef';

console.log(match(string))