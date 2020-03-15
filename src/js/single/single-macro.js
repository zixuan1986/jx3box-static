/*
 * @Description: 宏单页
 * @Author: iRuxu
 * @Date: 2019-09-07 17:53:02
 * @LastEditors: iRuxu
 * @LastEditTime: 2019-09-10 07:36:41
 */
import JX3_MACRO from '../widget/macro.js'
import JX3_QIXUE from '../widget/qixue.js'
import JX3_XINFA from '../widget/xinfa.js'

var $ = jQuery;
jQuery(function($){
    format_xinfa()
    format_qixue()
    format_macro()
    bind_copyEvent()
    bind_translateEvent()
});


//添加心法图标
function format_xinfa(){
    let XF = new JX3_XINFA;
    XF.the_xf('.c-jx3-xf');
}

//奇穴展示
function format_qixue(){
    let qx = $('#m-single-jx3-qx-raw').text()
    if(qx) new JX3_QIXUE(JSON.parse(qx))
}

//宏语法高亮
function format_macro(){

    if(!$('.m-macro-code-data').text()){
        $('.m-macro-box').hide()
        return
    }

    $('.m-macro-code-data').each(function (i,ele){
        let $macro = $(this).next('.m-macro-code-format')
        let macro = new JX3_MACRO($(this).text())
        $macro.html(macro.code);
    })
}

//宏复制
function bind_copyEvent(){

    let macro = $('.m-macro-code-data').eq(0).text()

    $('#w-copy-macro').on('click',function (e){
        macro = $('.nav-content.active').children('.m-macro-code-data').text()
    })
    
    let clipboard = new ClipboardJS('#w-copy-macro', {
        text: function() {
            return macro
        }
    });
    clipboard.on('success', function(e) {
        $('#w-copy-macro').addClass('on')
        e.clearSelection();
        setTimeout(function (){
            $('#w-copy-macro').removeClass('on')
        },800)
    });
}

//繁简切换 TODO:以后根据整站语言预设模式自动翻译原文
const axios = require('axios');
import translator from'../widget/translator';
console.log(111)
function bind_translateEvent(){
    let $translator = $('#w-translator-macro')
    new Promise((resolve,reject)=>{
        axios.get(`https://cdn.jsdelivr.net/npm/@jx3box/jx3box-dict/dict.json?v=${Date.now()}`).then((res) => {
            resolve(res.data)
        }).catch(function (err){
            console.error('[jx3box/app/translator] axios exception')
            reject(err)
        })
    }).then((dict) => {
        $translator.one('click',function (){
            $('.m-macro-box .m-macro-code-format').each(function (){
                $(this).find('.jx3macro-condition,.jx3macro-skill-name').each(function (i,val){
                    $(this).text(translator($(this).text(),dict))
                })
            })
            $translator.addClass('on')
            setTimeout(function (){
                $translator.removeClass('on')
                $translator.addClass('resolved')
            },800)
        })
    })
}