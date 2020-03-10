var $ = jQuery;
import param from '../utils/param.js'

jQuery(function($){
    opt_img_show()
    sidebar_active()
});

//侧边栏关联
function sidebar_active(){
    let role_type = param('role_type')
    $('#m-share-nav a').each(function (i,item){
        if(role_type == $(item).attr('data-role')){
            $(item).addClass('active')
        }
    })
}

//缩略图
function opt_img_show(){
    $('.u-face img').each(function (i,item){
        const ref = 112   //基准值
        let w = $(item).width()
        let h = $(item).height()
        let offset = 0

        //横版图
        if(w>h){
            $(item).addClass('u-pic-x')
            offset = - ( w*ref/h - ref ) / 2
            $(item).css('left',offset)
        }else if(w<h){
            $(item).addClass('u-pic-y')
            offset =  - (h*ref/w - ref) / 2
            $(item).css('top',offset)
        }else{
            $(item).addClass('u-pic-o')
        }

        //console.log(w,h)
    })
}