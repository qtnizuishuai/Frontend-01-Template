// 找出字符串中的a

function match(string, matchStr){
    for(let c of string){
        if(c === matchStr) 
            return true;
    }
}

console.log(match('222abc', 'a'))