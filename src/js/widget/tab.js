var $ = jQuery;
function Tab(){
    //Tab
    $('.nav-tabs').each(function (i,ele){
        $(this).children('li').first().addClass('active');
        $(this).siblings('.nav-content').first().addClass('active');
    })
    $('.nav-tabs').on('click','li',function (e){
        let i = $(this).index()
        $(this).addClass('active').siblings('li').removeClass('active')
        let $ct = $(this).parent('.nav-tabs').siblings('.nav-content')
        $ct.removeClass('active').eq(i).addClass('active')
    })
}

export default Tab