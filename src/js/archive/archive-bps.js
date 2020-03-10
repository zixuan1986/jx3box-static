const {JX3BOX} = require('@jx3box/jx3box-common');
import BPS from '../widget/bps.js'
import param from '../utils/param.js'
import xff from '../utils/xff.js'
import article from '../module/article.js'
import Tab from '../widget/tab.js';
const axios = require('axios');
const _ = require('lodash');
//关于页PID
const aboutPageID = 64 
//展示作品ID
const map = {
    "凌雪":5469,
    "蓬莱":5468,
    "霸刀":5467,
    "丐帮":5466,
    "藏剑":5465,
    "惊羽诀":5464,
    "天罗诡道":5463,
    "太虚剑意":5462,
    "紫霞功":5461,
    "铁骨衣":5460,
    "分山劲":5459,
    "明尊琉璃体":5458,
    "焚影圣诀":5457,
    "洗髓经":5456,
    "易筋经":5455,
    "铁牢律":5454,
    "傲血战意":5453,
    "相知":5452,
    "莫问":5451,
    "补天诀":5450,
    "毒经":5449,
    "离经易道":5448,
    "花间游":5447,
    "云裳心经":5446,
    "冰心诀":5445, //323
    "治疗":5444,
    "坦克":5443,
    "输出":5442,
    "通用":5441
}
//心法特性MAP
const feature = {
    "太虚剑意" : 342,
    "紫霞功" : 345,
    "花间游" : 487,
    "离经易道" : 492,
    "傲血战意" : 520,
    "铁牢律" : 531,
    "云裳心经" : 536,
    "冰心诀" : 542,
    "洗髓经" : 578,
    "易筋经" : 583,
    "毒经" : 2236,
    "补天诀" : 2244,
    "藏剑" : 1720,
    "惊羽诀" : 3204,
    "天罗诡道" : 3211,
    "焚影圣诀" : 4258,
    "明尊琉璃体" : 4260,
    "丐帮" : 5308,
    "分山劲" : 13149,
    "铁骨衣" : 13150,
    "莫问" : 14087,
    "相知" : 14088,
    "霸刀" : 16023,
    "蓬莱" : 19706,
    "凌雪" : 22049
}
//特殊武功
const spkf = ['通用','输出','坦克','治疗']
//首页ID
const indexPageID = 58  //100
jQuery(function($){

    //侧边栏
    //const bps = new BPS()
    //bps.the_bps_nav('#m-bps-nav')

    //正文调用
    const xf = param('xf')
    
    //API
    const overview = JX3BOX.__apiRoot + 'acfmeta/?id=' + indexPageID + '&key=bps_index'
    const content = JX3BOX.__apiRoot + 'acfmeta/?id=' + map[xf] + '&key=bps_content'
    const author = JX3BOX.__apiRoot + 'acfmeta/?id=' + aboutPageID + '&key=team_bps'
    //const baseinfo = JX3BOX.__node + 'skill/' + feature[xf]

    /* if(xf){

        //渲染基本信息
        axios.get(content).then((res) => {
            $('#m-bps-info').html(res.data)
            article()
            Tab()
        })

        //渲染编辑按钮
        $('.m-bps-title').append(`<a class="u-edit" href="${JX3BOX.__Root}edit/?pid=${map[xf]}">[ 编辑 ]</a>`)

        //渲染主编
        axios.get(author).then((res) => {
            let data = '' + res.data
            if(!data || data=='null') return
            let authors = JSON.parse(data)
            _.each(authors[xf],function (a){
                a.link = JX3BOX.__Root + 'author/' + a.id
            })
            new Vue({
                el : '#m-bps-author',
                data : {
                    authors : authors[xf]
                }
            })
        })

        //渲染特性
        if(!spkf.includes(xf)){
            axios.get(baseinfo).then((res) => {
                let data = xff(res.data)
                let output = data.extra.join('<br/>')
                $('#m-bps-feature').html(output)
            })
        }

    }else{
        //渲染基本信息
        axios.get(overview).then((res) => {
            $('#m-bps-overview').html(res.data)
            article()
        })
    } */

    axios.get(overview).then((res) => {
        $('#m-bps-overview').html(res.data)
        article()
    })

});
