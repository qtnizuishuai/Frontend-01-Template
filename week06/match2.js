// 找出字符串中的ab

function match(string){
    let flag = false;
    for(let c of string){
        if(c === 'a') {
            flag = true;
        } else if(flag && c === 'b'){
            return true;
        } else {
            flag = false;
        }
    }
}

console.log(match('222abc', 'ab'))