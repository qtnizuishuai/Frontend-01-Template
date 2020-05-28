const images = require('images')
 function render(viewpoint, element) {
    if (element.style) {//绘制单个元素
        const img = images(element.style.width, element.style.height) //不一定是css写的宽高，而是layout计算来的
        if (element.style['backgroundColor']) {
            let color = element.style['backgroundColor'] || 'rgba(255,255,255)'
            if(color.match(/^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/)){
                color = changeHexToRgb(color);
            }

            color.match(/rgb\((\d+),(\d+),(\d+)\)/)
            img.fill(Number(RegExp.$1), Number(RegExp.$2), Number(RegExp.$3), 1) //渲染
            viewpoint.draw(img, element.style.left || 0, element.style.top || 0)//绘制
        }
    }
    //绘制dom
    if (element.children) {
        for (const child of element.children) {
            render(viewpoint, child)
        }
    }
}

function changeHexToRgb(str) {  
    const REGCOLOR = /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/;  
    const ISRGBA = REGCOLOR.test(str);  
    if (ISRGBA === false) {    
        throw Error("Not a valid value");  
    }  
    // 去掉#号  
    const colorStr = str.slice(1);  
    const len = colorStr.length;  
    if (len === 3) {   
        const color = colorStr
            .split("")
            .map(ele => parseInt(`0x${ele.repeat(2)}`))
            .join(",");
        return `rgb(${color})`;  
    }
    const color = colorStr
        .match(/[A-z0-9]{2}/g)
        .map(ele => parseInt(`0x${ele}`));  
    if (len === 6) {
        return `rgb(${color.join(",")})`;  
    }  
    if (len === 8) {    
        return `rgb(${color.slice(0, 3).join(",")})`;  
    }
}
module.exports = render;