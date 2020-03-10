//对数据库查询的desc字段进行数据加工
const { JX3BOX } = require('@jx3box/jx3box-common');
let $ = jQuery

//技能过滤器
async function skillFilter(desc){
    //处理sub
    desc = await filterBySub(desc)

    //处理buff描述
    desc = await filterByBuffDesc(desc)

    //处理buff时间
    desc = await filterByBuffTime(desc)

    //处理额外附加攻击   -- 基于skill@22635改进,2019/11/8
    desc = filterByAdd(desc)

    //过滤其它<>
    desc = desc.replace(/\<.*?\>/g,'')

    //替换undefined
    desc = desc.replace(/undefined/g,'')

    //替换回车符
    desc = filterByLF(desc)

    return desc
}

//skill - <SUB 22792 0> 子技能
async function filterBySub(desc){
    let reg = new RegExp(/\<SUB (\d+?) (\d)\>/g)
    let subreg = new RegExp(/\<SUB (\d+?) (\d)\>/)
    let hasMatched = reg.test(desc)
    
    if(hasMatched){
        let arr = desc.match(reg)
        for(let i=0;i<arr.length;i++){
            let capture = subreg.exec(arr[i])
            let id = capture[1]
            let level = capture[2]

            let result = await get_resource('skill',id)
            let skill = {}
            $.each(result,function (i,obj){
                if(obj.Level == level) {
                    skill = obj
                    return
                }
            })

            desc = desc.replace(arr[i],skill.Desc)
        }
    }
    return desc
}

//skill - <BUFF 112 0 desc> buff描述
async function filterByBuffDesc(desc){
    let reg = new RegExp(/\<BUFF (\d+?) \d?\ desc>/)
    let hasMatched = reg.test(desc)
    if(hasMatched){
        let capture = reg.exec(desc)
        let id = capture[1]
        //let level = capture[2]

        let result = await get_resource('buff',id)
        let buff = result[0]
        desc = desc.replace(reg,buff.Desc)
    }
    return desc
}

//skill - <BUFF 126 0 time> buff时间
async function filterByBuffTime(desc){
    let reg = new RegExp(/\<BUFF (\d+?) \d?\ time>/)
    let hasMatched = reg.test(desc)
    if(hasMatched){
        let capture = reg.exec(desc)
        let id = capture[1]

        let result = await get_resource('advbuff',id)
        let buff = result[0]
        let time = parseInt(buff.Interval1) / 16 * parseInt(buff.Count) + '秒'
        desc = desc.replace(reg,time)
    }
    return desc
}

//skill - (+<SKILLEx {D0} {TotalPhysicsAP 0.3906}>)
function filterByAdd(desc){
    let reg = new RegExp(/\(\+\<SKILLEx.*?\>\)/g)
    let hasMatched = reg.test(desc)

    if(hasMatched){
        desc = desc.replace(reg,'')
    }
    return desc
}

//buff过滤器
async function buffFilter(desc){

    //处理其他类型的buff -- 基于skill@22635改进,2019/11/8
    desc = filterByBuffAt(desc)

    //过滤其它<>
    desc = desc.replace(/\<.*?\>/g,'')      //<Skill 5798 0 4%>

    //替换undefined
    desc = desc.replace(/undefined/g,'')

    //替换回车符
    desc = filterByLF(desc)

    return desc
}

//buff - <BUFF atCallPhysicsDamage>
function filterByBuffAt(desc){
    let reg = new RegExp(/<BUFF at.*?>/g)
    let hasMatched = reg.test(desc)

    if(hasMatched){
        desc = desc.replace(reg,'')
    }
    return desc
}

//item过滤器
async function itemFilter(desc){

    desc = desc.replace(/<Text>text=/g,'')
    desc = desc.replace(/<\/text>/g,'')
    desc = desc.replace(/font=\d+/g,'')
    desc = desc.replace(/"/g,'')
    
    //处理buff描述
    desc = await filterByBuffDesc(desc)

    //处理buff时间
    desc = await filterByBuffTime(desc)

    //处理buff属性
    desc = filterByBuffAt(desc)

    desc = filterByLF(desc)
    desc = desc.replace(/\\\\/g,'')

    return desc
}

//秘籍过滤器
async function mijiFilter(desc){
    return desc
}

//回车
function filterByLF(desc){
    desc = desc.replace(/\\n/g,'\n')
    return desc
}

//查询数据库
function get_resource(type,query){
    return new Promise((resolve,reject)=>{
        $.ajax({
                url:JX3BOX.__node + `${type}/id/` + query,
                type:'GET',
                success:function (data){
                    resolve(data)
                },
                error:function (err){
                    reject(err)
                }
        })
    })
}

export default {
    skill : skillFilter,
    buff : buffFilter,
    item : itemFilter,
    miji : mijiFilter
}
