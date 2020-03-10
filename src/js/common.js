/*
 * @Description: JX3BOX依赖脚本
 * @Author: iRuxu
 * @Date: 2019-08-19 09:38:17
 * @LastEditors: iRuxu
 * @LastEditTime: 2019-09-10 07:47:56
 */

import ua from './utils/ua.js';
import './module/header.js';
import './module/footer.js';
import Tab from './widget/tab.js';

jQuery(function($){

    //User Agent
    ua();
    if(_ua.isSD) $('body').addClass('isSDbrowser')          //QQ&搜狗浏览器的sd bug
    if(_ua.browser == 'ie') $('.m-error-browser').show()    //去除IE浏览器警告

    //列表类链接在pc端新窗口打开
    if(_ua.platform == 'pc'){
        $('.s-link').each(function (i,item){
            $(this).attr('target','_blank')
        })
    }

    //Tab
    Tab()

    //Switch
    $('.w-switch').on('click',function (){
        $(this).toggleClass('on');
    })

});

