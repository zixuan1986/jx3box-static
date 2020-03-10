//import Valine from '../plugin/Valine.min.js';

jQuery(function($){
    /* new Valine({
        el: '#vcomments',
        appId: 'PmEnje0G8t2NPJtRmuWs0MXQ-gzGzoHsz',
        appKey: 'mXL70K73pptkdn1v68FPULym',
        placeholder:'想说点什么..'
    }) */

    $('.m-comment-title li').on('click',function (){
        
        $('.m-comment-title li').removeClass('active')
        $(this).toggleClass('active')

        let i = $(this).index()
        $('.m-comment-subblock').hide().eq(i).show()

    })

});