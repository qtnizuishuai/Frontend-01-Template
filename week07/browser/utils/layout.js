function getStyle(element) {
    if (!element.style) {
        element.style = {}
    }

    for (let prop in element.computedStyle) {
        element.style[prop] = element.computedStyle[prop].value
        //{
        // width: { value: '100px', specificity: [ 0, 1, 0, 2 ] },
        // 'background-color': { value: '#232323', specificity: [ 0, 1, 0, 2 ] }
        // }
        //处理单位，有其他的非px的单位也是这样的处理
        let val = element.style[prop].toString();
        if (val.match(/px$/) || val.match(/^[0-9]+$/)) {
            element.style[prop] = parseInt(element.style[prop])//去掉px | 确保转换成int
        }
    }
    return element.style
}



function layout(element) {
    if (!element.computedStyle) { //没有style的元素不作处理
        return
    }
    const elementStyle = getStyle(element)
    if (elementStyle.display !== 'flex') { //不是flex display的元素就不去处理 了
        return
    }

    //只排列element
    const items = element.children.filter(e => e.type === 'element')
    items.sort((a, b) => {
        return (a.order || 0) - (b.order || 0)
    })

    let style = elementStyle;//拿到element的style
    //初始化宽高
    ['width', 'height'].forEach(size => {
        if (style[size] === 'auto' || style[size] == '') {
            style[size] = null
        }
    })
    //给flex style的属性设置默认值
    if (!style.flexDirection || style.flexDirection === 'auto') {
        style.flexDirection = 'row'
    }
    if (!style.alignItems || style.alignItems === 'auto') {
        style.alignItems = 'stretch'
    }
    if (!style.justifyContent || style.justifyContent === 'auto') {
        style.justifyContent = 'flex-start'
    }
    if (!style.flexWrap || style.flexWrap === 'auto') {
        style.flexWrap = 'nowrap'
    }
    if (!style.alignContent || style.alignContent === 'auto') {
        style.alignContent = 'stretch'
    }

    //重点：抽象主轴和交叉轴.要理解以下10个属性变量的抽象
    /**
     * size代表width/height (无论主轴排列方向)
     * start 代表 left/right rowreverse right/left
     * base 代表 排版的起点位置，rowreverse🕖就是width/height
     * mainSign 代表正负返回,eg row :1 rowreverse - 1
     */
    let mainSize, mainStart, mainEnd, mainSign, mainBase,
        crossSize, crossStart, crossEnd, crossSign, crossBase;
    if (style.flexDirection == 'row') {
        mainSize = 'width';
        mainStart = 'left';
        mainEnd = 'right';
        mainSign = +1;
        mainBase = 0;

        crossSize = 'height';
        crossStart = 'top';
        crossEnd = 'bottom';
    }
    if (style.flexDirection == 'row-reverse') {
        mainSize = 'width';
        mainStart = 'right';
        mainEnd = 'left';
        mainSign = -1;
        mainBase = style[mainSize];//container的宽度

        crossSize = 'height';
        crossStart = 'top';
        crossEnd = 'bottom';
    }
    if (style.flexDirection == 'column') {
        mainSize = 'height';
        mainStart = 'top';
        mainEnd = 'bottom';
        mainSign = +1;
        mainBase = 0;

        crossSize = 'width';
        crossStart = 'left';
        crossEnd = 'right';
    }
    if (style.flexDirection == 'column-reverse') {
        mainSize = 'height';
        mainStart = 'bottom';
        mainEnd = 'top';
        mainSign = -1;
        mainBase = style[mainSize];

        crossSize = 'width';
        crossStart = 'left';
        crossEnd = 'right';
    }
    if (style.flexWrap == 'wrap-reverse') {//会影响交叉轴,cross不再是从left->right/top->bottom
        //互换交叉轴的start呢end
        [crossStart,crossEnd] = [crossEnd, crossStart]
        crossSign = -1
        crossBase = style[crossSize]
    } else {
        crossBase = 0;
        crossSign = +1
    }
    //以上处理掉了flexDriction 和flexWrap的两个属性

    //处理特例
    let isAutoMainSize = false
    if (!style[mainSize]) { 
        //说明是auto sizing，子元素的mainSize相加
        elementStyle[mainSize] = 0
        for (let index = 0; index < items.length; index++) {
            const item = items[index];
            const itemStyle = getStyle(item)
            if (itemStyle[mainSize] !== null && itemStyle[mainSize] !== (void 0)) {
                elementStyle[mainSize] = elementStyle[mainSize] + itemStyle[mainSize];
            }
        }
        isAutoMainSize = true
    }

    //分元素进行
    let flexLine = []
    const flexLines = [flexLine]

    let mainSpace = elementStyle[mainSize] //行中的剩余空间
    let crossSpace = 0 //交叉轴上每一行的空间(y)
    //遍历行中的每一个元素
    for (let index = 0; index < items.length; index++) {
        const item = items[index];
        const itemStyle = getStyle(item)
        if (itemStyle[mainSize] === null || itemStyle[mainSize] === (void 0)) {
            itemStyle[mainSize] = 0
        }
        if (itemStyle.flex) {//如果元素是flex，说明元素可伸缩，
            flexLine.push(item)
        } else if (elementStyle.flexWrap == 'nowrap' && isAutoMainSize) {//如果是autosize
            //强行塞入flexline
            mainSpace -= itemStyle[mainSize] // 主轴余留空间减小
            if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) { //一行的高度取决于最高的item的高度
                crossSpace = Math.max(crossSpace, itemStyle[crossSize])
            }
            flexLine.push(item)
        } else {
            if (itemStyle[mainSize] > elementStyle[mainSize]) { //如果item宽度超过container宽度，要把item缩到跟container一样宽
                itemStyle[mainSize] = elementStyle[mainSize]
            }
            if (mainSpace < itemStyle[mainSize]) {
                //放不下当前元素
                //把当前flexline的mainSpance和crossSpace存起来
                flexLine.mainSpace = mainSpace;
                flexLine.crossSpace = crossSpace;
                //开一个新的flexline，把新行塞进flexlines
                flexLine = [item]
                flexLines.push(flexLine)
                //reset新的flexline的mainspace和crossspace
                mainSpace = elementStyle[mainSize]
                crossSize = 0
            } else {
                flexLine.push(item)
            }
            if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) {
                crossSpace = Math.max(crossSpace, itemStyle[crossSize])
            }
            mainSpace -= itemStyle[mainSize]
        }
    }

    flexLine.mainSpace = mainSpace // 更新mainSPace

    //计算crossSpace
    if (elementStyle.flexWrap == 'nowrap' || isAutoMainSize) {//nowrap的元素或者是未设置mainsize的元素
        //交叉轴的crosssize如果在元素的style上有设置，就取它（父元素的高度），没有就是最“大‘crosssize的item的crosssize
        flexLine.crossSpace = style[crossSize] !== (void 0) ? style[crossSize] : crossSpace
    } else {
        flexLine.crossSpace = crossSpace // 更新最大item crossSpace
    }
    //计算主轴
    if (mainSpace < 0) {
        // nowrap
        let scale = style[mainSize] / (style[mainSize] - mainSpace)
        let currentMain = mainBase;
        for (let index = 0; index < items.length; index++) {
            const item = items[index];
            const itemStyle = getStyle(item)
            if (itemStyle.flex) {//弹性盒子可以缩放
                itemStyle[mainSize] = 0
            }
            itemStyle[mainSize] = scale * itemStyle[mainSize]
            //第一个元素的mainStart就是mainbase
            //每循环一次，都把currentmain变成上一个元素的mainend
            //所有元素的主轴尺寸都是这么算
            itemStyle[mainStart] = currentMain
            itemStyle[mainEnd] = itemStyle[mainStart] + (itemStyle[mainSize] * itemStyle[mainSign])
            currentMain = itemStyle[mainEnd]
        }
    } else {
        //wrap
        //process each flex line
        flexLines.forEach((flexline) => {
            let mainSpace = flexline.mainSpace //上一行flexline剩余的space
            //剩余的space按flex分配
            //找flex的总值:这一行里全部flex的item的
            let flexTotal = 0;
            for (let index = 0; index < flexline.length; index++) {
                const item = flexline[index];
                const itemStyle = getStyle(item)
                if (itemStyle.flex !== null && itemStyle.flex !== (void 0)) {
                    flexTotal += itemStyle.flex
                }
            }
            if (flexTotal > 0) {//说明有flexible的flex items,用flex元素去填满剩下的‘宽度’/mainspace
                let currentMain = mainBase;
                for (let index = 0; index < flexline.length; index++) {
                    const item = flexline[index];
                    const itemStyle = getStyle(item)
                    if (itemStyle.flex) {//这里没有拆flex，就是默认这个item的flex：1；
                        itemStyle[mainSize] = (mainSpace / flexTotal) * itemStyle.flex
                    }
                    itemStyle[mainStart] = currentMain;
                    itemStyle[mainEnd] = itemStyle[mainStart] + (itemStyle[mainSize] * mainSign)
                    currentMain = itemStyle[mainEnd]
                }
            } else {
                //没有flex元素用justificontent填满剩下的‘宽度’/mainspace
                //有flexible 的item（item：flex：1），justifycintent是不生效的.
               
                let currentMain, step
                if (style.justifyContent == 'flex-start') {
                    currentMain = mainBase;
                    step = 0 //元素间距以及元素和边界的空间
                }
                if (style.justifyContent == 'flex-end') {//第一个元素是从mainbase +/- 剩余空间 开始的
                    currentMain = mainSpace * mainSign + mainBase;
                    step = 0
                }

                if (style.justifyContent == 'center') {
                    currentMain = (mainSpace / 2) * mainSign + mainBase;
                    step = 0
                }
                if (style.justifyContent == 'space-between') {
                    //要把元素均匀分步在mainspace“之间”，所以是length-1
                    step = mainSpace / (flexline.length - 1) * mainSign
                    currentMain = mainBase;
                }
                if (style.justifyContent == 'space-around') {
                    //一行的头和尾都占用半个step，元素之间是一个step，step的数量跟元素的数量是相等的
                    step = mainSpace / flexline.length * mainSign
                    currentMain = step / 2 + mainBase;
                }
                for (let index = 0; index < flexline.length; index++) {
                    const item = flexline[index];
                    const itemStyle = getStyle(item)

                    itemStyle[mainStart] = currentMain;
                    itemStyle[mainEnd] = itemStyle[mainStart] + (itemStyle[mainSize] * mainSign)
                    currentMain = itemStyle[mainEnd] + step //因为中间是留空的，所以要加上step
                }
            }

        })
    }

    //计算交叉轴
    //align-items , align-self
    //let crossSpace;//交叉轴剩余空间
    if (!style[crossSize]) { //auto sizing，父元素没有在crossSize上设置尺寸,没有总高度那就是把它撑开,没有剩余空间
        crossSpace = 0;
        style[crossSize] = 0;
        for (let index = 0; index < flexLines.length; index++) {
            const flexline = flexLines[index]
            style[crossSize] = style[crossSize] + flexline.crossSpace;
        }
    } else {
        crossSpace = style[crossSize]//style[crossSize]是元素的总高
        //所有的行不一定能填满元素的总高
        for (let index = 0; index < flexLines.length; index++) {
            const flexline = flexLines[index]
            crossSpace -= flexline.crossSpace;
        }
    }

    if (style.flexWrap === 'wrap-reverse') {
        crossBase = style[crossSize] //用新计算的元素总高再给crossbase赋值
    } else {
        crossBase = 0
    }

    // let lineSize = style[crossSize] / flexLines.length //每一行的高
    let step;
    if (style.alignContent === 'flex-start') {
        crossBase += 0
        step = 0
    }
    if (style.alignContent === 'flex-end') {
        crossBase += crossSpace * crossSign
        step = 0
    }
    if (style.alignContent === 'center') {
        crossBase = (crossSpace / 2) * crossSign + crossBase;
        step = 0
    }
    if (style.alignContent === 'space-between') {
        step = crossSpace / (flexLines.length - 1) * crossSign
        crossBase += 0
    }
    if (style.alignContent === 'space-around') {
        step = (crossSpace / flexLines.length) * crossSign
        crossBase = crossBase + step / 2
    }
    if (style.alignContent === 'stretch') {
        crossBase += 0
        step = 0
    }
    //每一行里面的item交叉轴位置和尺寸计算
    flexLines.forEach((flexline) => {
        //先得到这一行的实际尺寸
        let lineCrossSize = style.alignContent === 'stretch' ?//strech会把每行撑开，正好填满整个父元素
            flexline.crossSpace + crossSpace / flexLines.length ://flexline.crossSpace（这一行交叉轴的高度）+ 加上父元素的剩余空间平均分配给每一个flexline
            flexline.crossSpace //不然就是当前flexline的剩余空间
        for (let index = 0; index < flexline.length; index++) {
            const item = flexline[index];
            const itemStyle = getStyle(item)

            const align = itemStyle.alignSelf || style.alignItems
            if (itemStyle[crossSize] === null || itemStyle[crossSize] === (void 0)) {//该子元素没有在crossSize上设置尺寸，eg没设高度
                itemStyle[crossSize] = (align == 'stretch') ? lineCrossSize : 0
            }
            if (align === 'flex-start') {
                itemStyle[crossStart] = crossBase
                itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize]
            }
            if (align === 'flex-end') {
                itemStyle[crossEnd] = crossBase + (crossSign * lineCrossSize)
                itemStyle[crossStart] = itemStyle[crossEnd] - crossSign * itemStyle[crossSize]
            }
            if (align === 'center') {
                itemStyle[crossStart] = crossBase + (crossSign * (lineCrossSize - itemStyle[crossSize]) / 2)
                itemStyle[crossEnd] = itemStyle[crossStart] - crossSign * itemStyle[crossSize]
            }
            if (align === 'stretch') {//stretch会改变item本身的crosssize
                itemStyle[crossStart] = crossBase
                itemStyle[crossEnd] = crossBase + crossSign * (itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0) ? itemStyle[crossSize] : lineCrossSize)
                itemStyle[crossSize] = crossSign * (itemStyle[crossEnd] - itemStyle[crossStart])
            }
        }
        //每循环一行就把这一行的高度和行间距给crossbase加上去
        crossBase += crossSign * (lineCrossSize + step)
    })
    //console.log(items)
}

module.exports = layout