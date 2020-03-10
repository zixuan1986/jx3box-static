jQuery(function($){

    //替换首领,为、
    //$('.u-boss-list').text($('.u-boss-list').text().replace(',','、'))
   
    //检测副本模式添加自定义模式cls
    $('.m-fb-mode').children('.u-mode-custom').each(function (i,ele){
        if($(this).text().includes('单刷')){
            $(this).addClass('u-mode-single')
        }
        if($(this).text().includes('成就')){
            $(this).addClass('u-mode-archivement')
        }
    })


    
});