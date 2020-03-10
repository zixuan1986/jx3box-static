const URI = require('urijs');
import Checkbox from '../widget/checkbox.js';

jQuery(function($){

    $('#archive-subnav-trigger').on('click',function (){
        $(this).toggleClass('on')
        $('.m-archive-subnav').toggleClass('on')
        if($('#m-cj-tabs').length) $('#m-cj-tabs').toggleClass('on')
    })

    //过滤器与主导航
    $('#m-archive-filter li').add($('.m-archive-nav .u-list-primary a')).each(function (i,item){
        //检查默认状态添加样式
        let val = $(item).attr('data-fv')
        let key = $(item).attr('data-fk')
        let query = URI(location.href).query(true)
        if(query[key] == val){
            $(item).addClass('active')
        }
    })

    //过滤器
    $('#m-archive-filter li').on('click',function (){
        let key = $(this).attr('data-fk')
        let val = $(this).attr('data-fv')
        let url = URI(location.href)
        let to = ''

        if($(this).hasClass('active')){
            to = url.setQuery({[key]:'','paged':'1'}).toString()
        }else{
            to = url.setQuery({[key]:val,'paged':'1'}).toString()
        }
        window.location.href = to
    })

    //侧边主导航
    $('.m-archive-nav .u-list-primary').on('click','a',function (e){
        e.preventDefault();
        let key = $(this).attr('data-fk')
        let val = $(this).attr('data-fv')
        let url = URI(location.href)
        let to = url.setQuery({[key]:val,'paged':'1'}).removeQuery('index').toString()
        window.location.href = to
    })

    //新窗口打开
    let openNewWindow = 0
    if(window.localStorage && _ua.isPC){    //手机端不检查
        let local = localStorage.getItem('openNewWindow')
        //console.log('current',local)
        if(local == 1){
            openNewWindow = 1 && $('.w-checkbox').addClass('on')
            $('.m-archive-list .u-title').attr('target','_blank')
        }
    } 
    Checkbox(function (ele){
        //cls操作
        if(openNewWindow){
            openNewWindow = 0
            $('.m-archive-list .u-title').attr('target','_self')
            window.localStorage && localStorage.setItem('openNewWindow',0)
        }else{
            openNewWindow = 1
            $('.m-archive-list .u-title').attr('target','_blank')
            window.localStorage && localStorage.setItem('openNewWindow',1)
        }
        //console.log(openNewWindow)
    })

});