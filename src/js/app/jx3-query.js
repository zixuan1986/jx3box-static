const { JX3BOX } = require('@jx3box/jx3box-common');
const _ = require('lodash');
import Apptab from '../widget/apptab.js';
import load_resource from '../widget/resource.js';

var $ = jQuery

//资源查询
jQuery(function($){
    //tab映射
    Apptab({
        "skill":0,
        "buff":1,
        "npc":2,
        "fb":3,
        "skill2":4,
        "buff2":5,
        "npc2":6,
        "equip":7
    })

    //搜索指定值
    $('.jx3-resource-search').on('change',function (){
        let query = $(this).val()
        let type = $(this).attr('data-type')

        $(`#m-${type}-tip`).hide()
        load_resource(`#m-${type}-list`,type,query)
    })
});


//统计信息
jQuery(async function($){
    //渲染统计信息
    /* let stat = await get_stat()
    let stat_map = ['skill','buff','equip','unpack','npc']
    $.each(stat_map,function (i,val){
        $(`#jx3-${val}-count`).text(stat[val])
    }) */

    //指定新资料片
    /* $('#m-skill-tip').on('click',function (){
        load_resources('skill',22285,stat['skill'])
        $(this).hide()
    })
    $('#m-buff-tip').on('click',function (){
        load_resources('buff',15552,stat['buff'])
        $(this).hide()
    }) */

});
async function get_stat(){
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
function load_resources(type,start,end){
    let list = []
    for (let i = start;i <= end; i++) {
        list.push(i)
    }
    $.each(list,function (i,val){
        load_resource(`#m-${type}-list`,type,val,true)
    })
}

//副本解包
jQuery(async function($){

    let keymap = await get_unpack_keymap()

    //默认显示
    let default_fb = $('#jx3-fb-select').val()
    let default_boss = $('#m-unpack-bosslist').children('li').eq(0).text()
    render_unpack_info(default_fb,default_boss,keymap)

    //修改副本
    $('#jx3-fb-select').on('change',function (){
        let fb = $(this).val()
        render_fb_info(fb)

        $('#m-unpack-list').html('')    //清空
        $('#m-unpack-tip').hide()   //隐藏，以免过分占视野
    })

    //提取boss内容
    $("#m-unpack-bosslist").on('click','li',async function (){
        let boss = $(this).text()
        let fb = $(this).attr('data-fb')
        $(this).addClass('on').siblings('li').removeClass('on')

        render_unpack_info(fb,boss,keymap)
    })

    //raw的显示
    $('#m-unpack-list').off('click','.u-item').on('click','.u-item',function (){
        $(this).toggleClass('on')
    })

});
async function get_fb_list(){
    return new Promise((resolve,reject)=>{
        $.ajax({
            url:JX3BOX.__dataPath + 'fb_unpack.json',
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
async function render_fb_info(fb){
    let fb_list = await get_fb_list()
    let boss_list = fb_list[fb]['data']
    //$('.m-unpack-info').find('.u-fbname').text(fb)

    let html = ''
    $.each(boss_list,function (i,boss){
        html += `<li class="u-bossname" data-fb="${fb}">${boss.name}</li>`
    })
    $('#m-unpack-bosslist').html(html)
}
async function get_boss_unpack(fb,boss){
    return new Promise((resolve,reject)=>{
        $.ajax({
            url:`${JX3BOX.__dataPath}fb_unpack/${fb}/${boss}.json`,
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
async function get_unpack_keymap(){
    return new Promise((resolve,reject)=>{
        $.ajax({
            url:JX3BOX.__dataPath + 'fb_unpack_keymap.json',
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
async function render_unpack_info(fb,boss,keymap){

    //获取数据
    let data = await get_boss_unpack(fb,boss)
    let _data = {}
    if(data.data){
        _data = data.data   //1120后新版
    }else{
        _data = data        //旧版
    }
    

    let html = ''
    $.each(_data,function (i,skill){
        
        //开始
        html += '<li class="u-item">'

        //图标
        let iconid = skill.SkillBaseInfo.IconID ? skill.SkillBaseInfo.IconID : 316
        html += `<img class="u-pic" title="IconID:${iconid}" src="${JX3BOX.__iconPath}${iconid}.png">`
        
        //名称
        let skillid = skill.SkillBaseInfo.SkillID
        if(skillid){
            let display_name = skill.SkillBaseInfo.Name ? skill.SkillBaseInfo.Name : skill.Name
            html += `<span class="u-name">${display_name} <em>( ID:${skillid} - ${skill.Name} )</em></span>`
        }else{
            html += `<span class="u-name">${skill.Name}</span>`
        }
        
        //释放距离
        let min_radius = skill.MinRadius ? skill.MinRadius : 0
        let max_radius = skill.MaxRadius ? skill.MaxRadius : '∞'
        html += `<span class="u-desc">
        <em>释放距离</em>
        <b><strong>${min_radius}</strong> - <strong>${max_radius}</strong></b>尺</span>`

        //作用范围
        let radius = skill.AreaRadius// ? skill.AreaRadius : ''
        let angle = skill.AngleRange ? (parseInt(skill.AngleRange)/256*360 + '°') : ''
        let rect = skill.RectWidth// ? skill.RectWidth : radius
        //如果是矩形
        if(rect){
            html += `<span class="u-desc">
                <em>作用范围</em>
                <b>[ 矩形 ] 宽度:<strong>${rect}</strong>尺 长度:<strong>${radius}</strong>尺</b>
                </span>
                `
        }else if(radius){
            html += `<span class="u-desc">
                <em>作用范围</em>
                <b>[ 扇形 ] 半径:<strong>${radius}</strong>尺 角度:<strong>${angle}</strong></b>
                </span>
                `
        }

        //AOE高度
        if(skill.Height){
            let height = skill.Height ? parseInt(skill.Height)/2 : radius/2 //实际圆柱体应为2倍
            let h_tip = ''
            if(height <=3){
                h_tip = '二段跳可规避'
            }else if(height <= 12.8){
                h_tip = '扶摇可规避'
            }else if(height < 14.2){
                h_tip = '扶摇+二段跳可规避'
            }
            html += `<span class="u-desc">
            <em>AOE高度</em>
            <b>
            <strong>${height}</strong>尺
            <small>${h_tip}</small>
            </b>
            </span>`
        }

        //保护距离
        if(skill.ProtectRadius){
            let protect = skill.ProtectRadius
            html += `<span class="u-desc" title="范围内不受伤害">
            <em>保护范围</em>
            <b>
            <strong>${protect}</strong>尺
            </b>
            </span>`
        }

        //目标上限
        if(skill.TargetCountLimit){
            let limit = []
            $.each(skill.TargetCountLimit,function (i,val){
                let _val = val
                if(val.includes('-')){
                    _val = '∞'
                }
                limit.push(_val)
            })
            html += `<span class="u-desc">
            <em>目标上限</em>
            <b>
            <strong>${limit}</strong>
            </b>
            </span>`
        }

        //读条
        if(skill.PrepareFrames){
            let sing = ''
            $.each(skill.PrepareFrames,function (i,val){
                let _val = parseInt(val) / 16
                sing += `<span class="u-subitem">${_val}</span>`
            })

            html += `<span class="u-desc">
            <em>读条时间</em>
            <b>
            <strong>${sing}</strong>秒
            </b>
            </span>`
        }

        //引导
        if(skill.ChannelFrame){
            let sing = parseInt(skill.ChannelFrame) / 16
            html += `<span class="u-desc">
            <em>引导读条</em>
            <b>
            <strong>${sing}</strong>秒
            </b>
            </span>`
        }

        //打断
        if(skill.BrokenRate){
            let can = ''
            if(!parseInt(skill.BrokenRate)){
                can = '不可打断'
            }else{
                can = `可打断`
            }
            html += `<span class="u-desc">
            <em>打断概率</em>
            <b>
            <strong>${can}</strong>
            </b>
            </span>`
        }

        //打退
        if(skill.BeatBackRate){
            let can = ''
            if(!parseInt(skill.BeatBackRate)){
                can = '不可打退'
            }else{
                can = `可打退`
            }
            html += `<span class="u-desc">
            <em>打退概率</em>
            <b>
            <strong>${can}</strong>
            </b>
            </span>`
        }

        //基础伤害
        if(skill.DamageBase){
            html += `<span class="u-desc">
            <em>技能伤害</em>
            <b>
            <strong>${skill.DamageBase}</strong>
            </b>
            </span>`
        }

        //拖拽效果
        if(skill.PULL){
            let speed = parseInt(skill.PULL) * 16 / 64
            html += `<span class="u-desc">
            <em>拉拽效果</em>
            <b>
            <strong>${speed}</strong>米/秒
            </b>
            </span>`
        }

         //附加buff
         if(skill.BindBuff){
            let bufflist = skill.BindBuffDetail
            let subhtml = ''
            $.each(bufflist,function (i,buff){
                subhtml += `
                <span class="u-buff">
                    <img src="${JX3BOX.__iconPath}${buff.IconID}.png" title="${buff.Name} (ID:${buff.BuffID}) ${buff.Desc}"/>
                </span>
                `
            })

            html += `<span class="u-desc">
            <em>附加Buff</em>
            <b>
            <strong>${subhtml}</strong>
            </b>
            </span>`
        }

        //免疫效果
        if(skill.Immune){
            let bufflist = skill.ImmuneDetail
            let subhtml = ''
            $.each(bufflist,function (i,buff){
                subhtml += `
                <span class="u-buff">
                    <img src="${JX3BOX.__iconPath}${buff.IconID}.png" title="${buff.Name} (ID:${buff.BuffID}) ${buff.Desc}"/>
                </span>
                `
            })

            html += `<span class="u-desc">
            <em>移除Buff</em>
            <b>
            <strong>${subhtml}</strong>
            </b>
            </span>`
        }

        let raw = ''
        let hidden_keys = ['SkillBaseInfo','BindBuffDetail','ImmuneDetail']
        //源码
        $.each(skill,function (key,val){
            if(hidden_keys.includes(key)) return
            let remark = keymap[key]['remark']
            raw += `<span class="u-raw-line">${key} : ${_.toString(val)} <em>(${remark})</em></span>`
        })
        html += '<span class="u-view">View RAW</span>'
        html += `<span class="u-raw">${raw}</span>`
        
        //结束
        html += '</li>'
    })

    //加载数据
    $('#m-unpack-list').html(html)
}