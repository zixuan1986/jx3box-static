const axios = require('axios');

//标准简体->台湾正体
function cn2tr(str,Dict){
    let arr = new Array(str.length)
    let i = -1
    for(let char of str){
        i = Dict['zh-cn'].indexOf(char)
        i > -1 ? arr.push(Dict['zh-tr'][i]) : arr.push(char)
    }
    return arr.join('')
}

//台湾正体->剑三词汇
function tr2j3(str,Dict){
    let x = -1  //匹配位置
    Dict['jx3box-cn'].forEach((word,i) => {
        x = str.indexOf(word);
        if(x > -1){
            let re = new RegExp(word,'g');
            str = str.replace(re,Dict['jx3box-tr'][i])
        }else{
        }
    })
    return str
}

export default function (str){
    return new Promise((resolve,reject)=>{
        axios.get(`https://cdn.jx3box.com/data/dict/dict.json?v=${Date.now()}`).then((res) => {
            let dict = res.data
            resolve(tr2j3(cn2tr(str,dict),dict))
        }).catch(function (err){
            console.error('[jx3box/app/translator] axios exception')
            reject(err)
        })
    })
}
