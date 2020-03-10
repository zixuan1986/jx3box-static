/*
 * @Description: 单页
 * @Author: iRuxu
 * @Date: 2019-08-31 23:43:19
 * @LastEditors: iRuxu
 * @LastEditTime: 2019-09-10 06:29:15
 */

import '../module/comment.js';  //评论
import article from '../module/article.js';  //文章
import Fav from '../widget/fav.js';           //收藏

import Dialog from '../widget/dialog.js';
import restapi from '../widget/restapi.js';
//import Screenshot from '../widget/screenshot.js';

const $ = jQuery;
const $area = $('.m-single-primary')
const header_height = $('.c-header').height()

jQuery(function($){

    //收藏
    new Fav();

    if($('.p-single').length){

        //日期
        bind_date_tipshow();
        //分享
        build_share();

        //文章内容
        article();

        //自动给文章创建分页+目录导航
        build_article_directory()

        //锚点相关
        bind_anchor_event()
        analyze_anchor()

        //管理操作
        if(!$('.p-help').length){
            bind_copy_event()
            bind_admin_panel()
            //Screenshot()
        }

        //小屏修改收藏位置
        if($(window).width() < 767){
            $('.m-single-interact').append($('.w-share'))
            $('.m-single-interact').append($('.w-fav'))
        }

    }
});


//时间tip
function bind_date_tipshow(){
    $('.u-modate,.u-podate').tooltip();
}

//分享按钮
function build_share(){
    let api = `https://service.weibo.com/share/share.php?`
    //链接
    let url = location.href
    api += `url=${url}`
    //标题
    let title = document.title
    api += `&title=${title}`
    //基本图片
    let pic = 'https://cdn.jx3box.com/img/common/qqgroup.png'
    api +=  `&pic=${pic}`
    /* //原文图片
    let arr = []
    if($area.find('img').length){
        $area.find('img').each(function (i,item){
            if($(item).attr('data-src')){
                arr.push($(item).attr('data-src'))
            }
        })
    }
    //TODO:添加水印后缀  去除原附加查询
    arr.slice(0,7)
    $.each(arr,function (i,item){
        api += `||${item}`
    }) */
    $('.w-share').attr('href',api)
}


const cheerio = require('cheerio');
//创建目录
function build_article_directory(){
    const $dbox = $('#m-single-directory')

    //自动创建分页导航
    const $minipagebox = $('#m-single-minipages')
    let hasPages = $('.m-single-pages').length
    if(hasPages){

        let pageTitleArr = []
        let raw = $('#m-single-raw').text()
        let arr = raw.split('<!--nextpage-->');
        arr.forEach(function (part,i){
            let R = cheerio.load(part)
            //let hasPageTitle = R('h1').length
            let pageTitle = ''
            pageTitle = R('h1').eq(0).text() || `第${i+1}页`
            pageTitleArr.push(pageTitle)
        })

        let permalink = $('#m-single-permalink').val()
        $minipagebox.append(function (){
            let temp = []
            pageTitleArr.forEach(function (str,i){
                temp.push(`<a href="${permalink}?page=${i+1}">${str}</a>`)
            })
            let pageNav = temp.join('')
            return pageNav
        })

    }

    //自动创建目录
    let directories = $area.find('h1,h2,h3')
    if(directories.length > 1){
        //目录树相关预备
        const header_height = $('.c-header').height()

        //遍历捕获的目录项
        directories.each(function (i,item){
            //进行克隆
            let _item = $(item).clone()
            //过滤行内样式
            _item.attr('style','')
            _item.html($(item).text())
            //设置原始元素所在的位置
            //_item.attr('data-skip',$(this).offset().top - header_height)
            _item.data('raw',$(item))
            
            if(i<directories.length - 1){
                let current = $(item)[0].tagName
                let next = directories.eq(i+1)[0].tagName
                //设置是否存在子集
                if(current == 'H1' && next != 'H1'){
                    _item.addClass('hasChild')
                }else if(current == 'H2' && next == 'H3'){
                    _item.addClass('hasChild')
                }
            }
            //追加到目录盒中
            $dbox.append(_item)
        })

        //进行事件委托
        $dbox.on('click','h1,h2,h3',function (){
            //$(document).scrollTop($(this).attr('data-skip'))
            let raw_pos = $(this).data('raw').offset().top - header_height
            $(document).scrollTop(raw_pos)
            $(this).data('raw').addClass('isScrollFocus')
            setTimeout(function (){
                $(this).data('raw').removeClass('isScrollFocus')
            },3500)
        })

    }

    if( hasPages && directories.length > 1 ){
        $('#m-single-directory-hr-1').show()
    }

    if( hasPages || directories.length > 1){

        //准备就绪后展示
        $dbox.show()
        position_directory()

        $dbox.on('click','.u-top',function (e){
            e.preventDefault()
            $(document).scrollTop(0)
        })

        $dbox.on('click','.u-nav',function (e){
            $dbox.toggleClass('isHidden')
        })

    }
}
//定位分析
function position_directory(){
    const $dbox = $('#m-single-directory')
    const $content = $('.m-single-content-inner')
    const $article = $('.m-single-primary')
    let w = $(window).width()

    //垂直计算任务
        //计算距顶位置
        if(w>767){
            let MT = $content.offset().top
            $dbox.css({'top':MT})
        }

        //仅在右侧时响应隐藏事件
        if(w<1600 && w>767){
            let content_height = $content.height()
            let directory_height = $dbox.height()
            $(document).on('scroll',function (){
                let section = content_height - directory_height
                let scrollPos = $(document).scrollTop()
                if(scrollPos > section){
                    $dbox.addClass('isHidden')
                }
            })
        }

    //水平计算任务
        //计算水平偏移位置
        const calcPos = function (){
            if($(window).width() > 1600){
                let ML = $article.offset().left - 20
                $dbox.css({'left':ML})
            }else{
                //拖动窗口会影响水平整体窗口大小
                let MR = ($(window).width() - $article.width()) / 2
                $dbox.css({'right':MR})
            }
        }
        calcPos()

        //活动窗口重计算
        var resizeTimer = null;
        $(window).on('resize',function (){
            if(resizeTimer) clearTimeout(resizeTimer)
            resizeTimer = setTimeout(calcPos,280)
        })
    
}

//管理推荐
function bind_admin_panel(){

    //如果没有权限，则退出
    if(!$('.c-dialog-rec').length) return

    //方法
    const get_post_recmode = function (){
        return $('#post_recmode').val()
    }
    const get_post_highlight = function (){
        return $('#post_highlight').val()
    }
    const get_post_status = function (){
        return $('#post_status').val()
    }

    //初始化样式状态
    $('.u-rec-list li').each(function (i,item){
        if($(this).attr('data-val') == get_post_recmode()){
            $(this).addClass('active')
        }
    })
    $('.u-highlight-list li').each(function (i,item){
        if($(this).attr('data-val') == get_post_highlight()){
            $(this).addClass('active')
        }
    })
    $('.u-status-list li').each(function (i,item){
        if($(this).attr('data-val') == get_post_status()){
            $(this).addClass('active')
        }
    })
    

    //实例化面板对象
    const RecPanel = new Dialog('.c-dialog-rec','rec')
    $('.m-single-header-meta .u-admin').on('click',function (){
        RecPanel.open()
    })

    //绑定面板事件
    $('.u-admin-list').on('click','li',function (){
        let val = $(this).attr('data-val')
        $(this).addClass('active').siblings('li').removeClass('active')
        let rel = $(this).attr('data-rel')
        $(`#${rel}`).val(val)
    })

    //rest api 处理请求
    let pt = $('.m-single-header').attr('data-api')
    let pid = $('.m-single-header').attr('data-pid')
 
    const updateMeta = function (key,val){
        restapi.updatePostMeta({
            data : {
                'id' : pid,
                'key' : key,
                'val' : val
            },
            callback : function (){
                //location.reload();
            }
        })
    }
    const updateStatus = function (status){
        restapi.updatePost({
            pt : pt,
            pid : pid,
            data : {
                'status' : status
            },
            callback : function (){
                location.reload();
            }
        })
    }
    $(document).on('dialog_ok',function (e,type){
        if(type=='rec'){
            updateMeta('rec_mode',get_post_recmode())
            updateMeta('highlight',get_post_highlight())
            updateStatus(get_post_status())
        }
    })


}

//复制源码
function bind_copy_event(){

    //等待懒加载完成
    $('#w-copy-source').on('click',function (){
        let source = $('.m-single-primary').html()
        source = source.replace(/<hr class="e-spaceline">/g,'<br/>')  //移除自定义的保留空行
        let sign = `<div style="padding:10px 0;border-top:1px dashed #ddd"><a href="${location.origin}">【JX3BOX】</a>更新地址：<a href="${location.href}">${location.href}</a></div>`
        let output = source + sign

        let copySource = new ClipboardJS('#w-copy-source', {
            text: function() {
                return output
            }
        });
        copySource.on('success', function(e) {
            $('#w-copy-source').addClass('on')
            e.clearSelection();
            setTimeout(function (){
                $('#w-copy-source').removeClass('on')
            },500)
        });

    })
}

//锚点点击
function bind_anchor_event(){
    $area.on('click','a',function (e){
        let to = $(this).attr('href')
        //如果为外页则不处理
        if(!to.startsWith('#')) return

        let $target =  $area.find($(to))
        //当锚点确定存在时
        if($target.length){
            //需要阻止默认事件
            e.preventDefault()
            scroll_to_endpoint($target)
        }
        
    })
}

//分析链接中的锚点，滚动至对应正确位置
function analyze_anchor(){
    //取出链接中的Hash
    let to = window.location.hash
    //如果存在hash值才执行
    if(!to) return

    let $target =  $area.find($(to))
    //当锚点确定存在时
    if($target.length) {
        //需要延迟执行
        setTimeout(scroll_to_endpoint,600,$target)
    }
}

//跳转事件
function scroll_to_endpoint($target){
    $(document).scrollTop($target.offset().top - header_height)
    $target.parent().addClass('isScrollFocus')
    setTimeout(function (){
        $target.parent().removeClass('isScrollFocus')
    },3500)
}