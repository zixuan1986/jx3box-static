/*
 * @Description: 公共底
 * @Author: iRuxu
 * @Date: 2019-08-30 23:39:48
 * @LastEditors: iRuxu
 * @LastEditTime: 2019-09-07 23:46:03
 */
jQuery(function($){

    $('body').delegate('.cjs .cj-expand','click',function() {
        $(this).parents('.cj-container').toggleClass('fold');
    });

    $('.c-warning .u-close').on('click',function (){
        $('.c-warning').hide()
    })

    if(console){
        console.info(
            '%cJoin us : rx6@qq.com !',
            'color: #0cf; background: #333; font-size: 24px;'
        )
        // console.table()
    }

});