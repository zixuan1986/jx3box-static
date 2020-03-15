//标准简体->台湾正体
function cn2tr(str,dict){
    let arr = new Array(str.length)
    let i = -1
    for(let char of str){
        i = dict['zh-cn'].indexOf(char)
        i > -1 ? arr.push(dict['zh-tr'][i]) : arr.push(char)
    }
    return arr.join('')
}

//台湾正体->剑三词汇
function tr2j3(str,dict){
    let x = -1  //匹配位置
    dict['jx3box-cn'].forEach((word,i) => {
        x = str.indexOf(word);
        if(x > -1){
            let re = new RegExp(word,'g');
            str = str.replace(re,dict['jx3box-tr'][i])
        }else{
        }
    })
    return str
}

export default function (str,dict){
    return tr2j3(cn2tr(str,dict),dict)
}
