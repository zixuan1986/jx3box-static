const { JX3BOX } = require('@jx3box/jx3box-common');
import Dialog from '../widget/dialog.js';
import Apptab from '../widget/apptab.js';
import restapi from '../widget/restapi.js';

var $ = jQuery
let uid = parseInt($("#uid").val())

//图标库
jQuery(function($){
    //tab映射
    Apptab({
        "icon":0,
        "favicon":1,
        "emotion":2
    })

    //每次加载限制
    let limit = 500

    //加载默认列表
    let default_list = [13,316,109,245,889,2178,2179,2180,2588,2589,2646,2647,2648,2789,3089,3111,3112,3113,3114,3115,3116,3117,3118,3119,3120,3121,3122,3123,3137,3138,3139,3140,3321,4704,4707,4708,4709,4710,4835,4853,5389,8848,10451,10452,10909]
    load_icons(default_list)
    
    //搜索查询时
    $('#jx3-icon-search').on('change',function (){
        let query = $(this).val()
        let list = []

        //如果出现全角逗号、顿号、斜杠、飘键进行替换
        query = query.replace(/，|、|\/|\|/g,',')
        query = query.replace(/~/g,'-')

        //指定若干个
        if(query.includes(',')){
            list = query.split(',')
        //指定范围
        }else if(query.includes('-')){
            let range = query.split('-')
            let min = parseInt(range[0])
            let max = parseInt(range[range.length-1])
            if((max-min) > limit){
                console.warn('超出最大限制')
                max = min + limit
            }
            for (let i = min;i <= max; i++) {
                list.push(i)
            }
        //指定单个
        }else{
            list.push(Number(query))
        }
        //console.log(list)

        load_icons(list)
        $('.m-icon-preview').hide()

    })

    //统计图标
    //renderStat()
});
function load_icons(arr){
    //模板
    let html = ''
    $.each(arr,function (i,iconid){
        html += `<li data-iconid="${iconid}">
                    <i class="u-pic">
                        <img class="u-img" src="${JX3BOX.__iconPath}${iconid}.png" alt="JX3BOX剑三图标库">
                        <span class="u-love"><i class="w-heart"></i></span>
                    </i>
                    <span class="u-iconid">${iconid}</span>
                </li>`
    })
    //加载图片
    $('#m-icon-list').html(html)
}
async function renderStat(){
    let get_stat = async function (){
        return new Promise((resolve,reject)=>{
            $.ajax({
                async:true,
                url:JX3BOX.__node + 'stat',
                type:'GET',
                success:function (data){
                    resolve(data)
                },
                error:function (error){
                    reject(error)
                }
            })
        })
    }
    let stat = await get_stat()
    $(`#jx3-icon-count`).text(stat.icon)
}

//图标收藏
jQuery(async function ($){
    //加载收藏列表
    let favicons = []

    //如果未登录为0，读取localstorage
    if(!uid){
        let storage = localStorage.getItem('favicons')
        if(storage){
            favicons = JSON.parse(storage)
        }
    //如果已登录，读取user meta
    }else{
        let exist = $('#favicons').val()
        if(exist){
            favicons = JSON.parse(exist)
        }
    }
    load_favicons(favicons)

    //如果当前登录，但以前未登录时有数据，显示同步按钮，并绑定事件
    if(uid && localStorage.getItem('favicons')){
        $('#m-icon-sync').show()
        bind_sync_event(favicons)
    }

    //添加收藏事件
    $('#m-icon-list').off('click','li').on('click','li',function (){

        //style
        let $heart = $(this).find('.w-heart')
        $heart.addClass('w-heart-animation')
        setTimeout(function (){
            $heart.removeClass('w-heart-animation')
        },1000)

        //xhr
        let iconid = $(this).attr('data-iconid')
        add_favicon(iconid,favicons)
    })

    //移除收藏事件
    $('#m-icon-favlist').off('click','.u-remove').on('click','.u-remove',function (){
        //xhr
        let deleteItem = $(this).parents('li')
        let iconid = deleteItem.attr('data-iconid')
        remove_favicon(iconid,favicons,deleteItem)
    })
})
function load_favicons(arr){
    //如果数组为空
    if(!arr) return

    //模板
    let html = ''
    $.each(arr,function (i,iconid){
        html += `<li data-iconid="${iconid}">
                    <i class="u-pic">
                        <img class="u-img" src="${JX3BOX.__iconPath}${iconid}.png" alt="JX3BOX剑三图标库">
                        <span class="u-remove"></span>
                    </i>
                    <span class="u-iconid">${iconid}</span>
                </li>`
    })
    //加载图片
    $('#m-icon-favlist').html(html)
}
async function add_favicon(iconid,favicons){
    //取出当前数组
    let data = ''

    //如果已经收藏过
    if(favicons.includes(iconid)){
        return
    //如果没有，推入数组，得到新数组
    }else{
        favicons.push(iconid)
        data = JSON.stringify(favicons)
    }

    //如果未登录为0，存储到localstorage
    if(!uid){
        update_localstorage(data)
    //如果已登录，存储到user meta
    }else{
        update_user_meta(data)
    }

    //无论成功与否都要即时更新favlist dom
    append_new_favicon(iconid)

}
async function remove_favicon(iconid,favicons,deleteItem){
    //取出当前数组
    let data = ''

    let pos = favicons.indexOf(iconid)
    favicons.splice(pos,1)
    data = JSON.stringify(favicons)

    //如果未登录为0，更改到localstorage
    if(!uid){
        update_localstorage(data)
    //如果已登录，更新到user meta
    }else{
        update_user_meta(data)
    }

    //无论成功与否都要即时更新favlist dom
    deleteItem.remove()

}
function append_new_favicon(iconid){
    let newItem = `<li data-id="${iconid}">
                    <i class="u-pic">
                        <img class="u-img" src="${JX3BOX.__iconPath}${iconid}.png" alt="JX3BOX剑三图标库">
                        <span class="u-remove"></span>
                    </i>
                    <span class="u-iconid">${iconid}</span>
                </li>`
    $('#m-icon-favlist').append(newItem)
}
async function get_user_meta(){
    let cur_favs = await restapi.get_user_meta({
        uid : uid,
        key : 'favicons'
    })
    return cur_favs
}
function update_user_meta(val){
    restapi.updateUserMeta({
        data : {
            uid : uid,
            key : 'favicons',
            val : val
        },
        callback : function (response){
            if(response){
                console.info('【JX3BOX】收藏更新成功')
            }
        }
    })
}
function update_localstorage(val){
    localStorage.setItem('favicons',val)
}
function bind_sync_event(favicons){
    
    //storage值仍然取本地
    let storage = JSON.parse(localStorage.getItem('favicons'))
    $('#m-icon-sync').on('click',function (){

        //创建一个交集
        let union = favicons.concat(storage)    //此时基础取值，必须取实时的点击事件更改后可能的值，并不是原始值，只有在点击时取的favicons才是即时值
        union = new Set(union)
        favicons = Array.from(union)

        Promise.try(function (){
            //基于交集重载全部收藏图标
            load_favicons(favicons)
            //更新meta值
            update_user_meta(JSON.stringify(favicons))
            //清空localstorage值
            localStorage.setItem('favicons','')
        }).then(function (val){
            const dialog = new Dialog()
            dialog.load({
                title:'消息',
                content:'同步成功',
                type:'sync'
            })
            $('#m-icon-sync').hide()
        })
    })
}

//表情包
jQuery(async function($){
    let list = await get_emotion()
    
    //输出导航
    build_emotion_nav(list)

    //输出默认表情
    build_emotion_list(list[0]['name'],list[0]['total'])
    build_emtion_down(list[0]['name'])
    $('.m-emotion-nav').children('li').first().addClass('active')

    //绑定切换事件
    $('.m-emotion-nav').on('click','li',function (){
        $(this).addClass('active').siblings('li').removeClass('active')
        build_emotion_list($(this).attr('data-name'),$(this).attr('data-total'))
        build_emtion_down($(this).attr('data-name'))
    })
    $('.m-emotion-selection').on('change',function (){
        let val = $(this).val()
        let _temp = val.split('(')
        let name = _temp[0]
        let total = _temp[1].split(')')[0]
        build_emotion_list(name,total)
        build_emtion_down(name)
    })

});
function get_emotion(){
    return new Promise((resolve,reject)=>{
        $.ajax({
            url:JX3BOX.__dataPath + 'emotion.json',
            type:'GET',
            success:function (data){
                resolve(data)
            },
            error:function (error){
                reject(error)
            }
        })
    })
}
function build_emotion_nav(list){
    let count = 0

    //PC端
    let nav_html = ''
    $.each(list,function (i,item){
        nav_html += `<li data-name="${item.name}" data-total="${item.total}">${item.name}<span>(${item.total})</span></li>`
        count += parseInt(item.total)
    })
    $('.m-emotion-nav').html(nav_html)

    //手机端
    let selection = ''
    $.each(list,function (i,item){
        selection += `<option data-name="${item.name}" data-total="${item.total}">${item.name}(${item.total})</li>`
    })
    $('.m-emotion-selection').html(selection)

    $('#jx3-emotion-count').text(count)

}
function build_emotion_list(name,len){
    let list_html = ''
    for(let i=0;i<len;i++){
        list_html += `
            <li><img src="${JX3BOX.__emtionPath}official_mini/${name}/${i}.gif" /></li>
        `
    }
    $(".m-emotion-list").html(list_html)
}
function build_emtion_down(name){
    $('.m-emotion-down').attr('href',`${JX3BOX.__emtionPath}official_mini/${name}.zip`)
}