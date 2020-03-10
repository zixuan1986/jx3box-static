import JX3_FB from '../widget/fb.js'
import param from '../utils/param.js';
const URI = require('urijs');

const JX3FB = new JX3_FB();
var $=jQuery;

jQuery(function($){
    renderFB()
    formatBossList()

    //过滤器搜索
    $('#m-archive-filter').on('click','button',function (){
        let boss = $('#filter-meta-boss').val()
        let fb = $('#filter-meta-fb').val()
        let url = URI(location.href)
        let to = url.setQuery({'fb_name':fb,'boss':boss}).toString()
        window.location.href = to
        
    })

    //boss名字高亮mark
    let query = URI(location.href).query(true)
    if(query.boss){
        $('.m-fb-list').addClass('isBossFilter')
        $('.u-boss-list b').each(function (i,item){
            if($(item).text().includes(query.boss)){
                $(item).addClass('isFocus')
            }
        })
    }

});

async function renderFB(){

    //加载侧边栏
    await JX3FB.the_combine_list('#m-fb-sidebar')

    //侧边栏样式
    $('#m-fb-sidebar .u-category').on('click',function (){
        $(this).toggleClass('active')
        $(this).children('u-switch').toggleClass('on');
        $(this).next('.u-list').slideToggle()
    })

    //根据查询字符串子项添加active
    let query = decodeURIComponent(param('fb_name'))
    let searchStatus = URI(location.href).hasQuery('boss')
    let cid = 0
    let icon = ''
    if(query && query!= 'undefined' && !searchStatus){
        $('.m-fb-info').addClass('on')
        $('#m-fb-sidebar .u-item').each(function (i,ele){
            if($(this).attr('data-fb') == query){
                $(this).addClass('active')
                $(this).parent('.u-list').css('display','block')
                $(this).parent('.u-list').prev('.u-category').addClass('active')

                //获取当前副本集信息
                cid = $(this).attr('data-cid')
                icon = $(this).attr('data-icon')
            }
        })
    //如果没有查询字符串，展示第一个
    }else{
        $('#m-fb-sidebar .u-category').first().addClass('active')
        $('#m-fb-sidebar .u-list').first().css('display','block')
    }

    //加载副本信息
    if(cid) {await JX3FB.the_fb_info(cid,icon)}
    $('.u-boss-name li').off('click').on('click',function (){
        let i = $(this).index()
        $('.u-boss-name li').removeClass('on')
        $(this).addClass('on')
        $('.u-boss-detail li').hide()
        $('.u-boss-detail li').eq(i).slideDown()
    })
    
    
}

//列表Boss列表
function formatBossList(){
    $('.u-boss-list em').each(function (i,ele){
        let list = $(this).text().split(',')
        let html = ''
        $.each(list,function (i,val){
            let _val = $.trim(val)
            html +=`<b>${_val}</b>`
        })
        $(this).html(html)
    })

}
