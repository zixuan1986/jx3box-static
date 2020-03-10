const _ = require('lodash');

const kp = ['外功防御','内功防御','御劲','化劲','闪躲','命中','招架','拆招']
const _kp = ['df1','df2','pvp1','pvp2','miss','hit','k1','k2']
function extract(str){
    let matches = {status:0,key:null,val:null}
    _.each(kp,function (k,i){
        if(str.includes(k)){
            let result = /(\d+)/.exec(str)
            matches.status = 1
            matches.key = i
            matches.val = result[1]
        }
    })
    return matches
}

//心法特征序列器
export default function(result){
    //取最高level
    let data = result[result.length - 1]['Desc']
    //console.log(data)
    //根据换行分组
    data = data.split('\\n')
    //坑爹的铁牢有bug
    /* _.each(data,function (item,i){
        if(item.includes('\\')){
            let temp = item.split('\\')
            data[i] = temp[0]
            data.push(temp[1])
        }
    }) */
    //过滤后收留数据
    let output = {
        extra : [],
    }

    //把每一条根据“提高”再次打散
    _.each(data,function (l){
        if(l.includes('额外')){
            output.extra.push(l)
        }else{
            /* let o = extract(l)
            if(o.status){
                output[_kp[o.key]] = o.val
            } */
        }
    })

    //console.log(output)
    return output

}
