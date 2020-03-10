jQuery(function($){
    $('.m-archive-filter .u-category').add($('#m-bbs-nav .u-item')).each(function (i,item){
        let ct = $(item).attr('data-ct')
        let a = $(item).children('a')
        if(location.href.includes(ct)){
            $(this).addClass('on')
            a.addClass('active')
        }
    })

});