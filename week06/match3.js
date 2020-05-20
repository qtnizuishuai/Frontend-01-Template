// 找出字符串中的ab

function match(string){
    let flagA = false;
    let flagB = false;
    let flagC = false;
    let flagD = false;
    let flagE = false;
    for(let c of string){
        if(c === 'a') {
            flagA = true;
        } else if(flagA && c === 'b'){
            flagB = true;
        } else if(flagB && c === 'c'){
            flagC = true;
        }else if(flagC && c === 'd'){
            flagD = true;
        }else if(flagD && c === 'e'){
            flagE = true;
        } else if(flagE && c === 'f'){
            return true;
        } else {
            flagA = false; 
            flagB = false;
            flagC = false;
            flagD = false;
            flagE = false;
        }
    }
}

console.log(match('222abcdef', 'abcdef'))