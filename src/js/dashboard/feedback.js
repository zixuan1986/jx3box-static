import param from '../utils/param.js';

jQuery(function($){
    let email = $('#feedback-email').val()
    if(email){
        $('.your-email').children('input').val(email)
    }

    let uid = parseInt($('#uid').val())
    if(uid){
        $('.wpcf7 .uid').children('input').val(uid)
    }
    //console.log(uid)

    let pid = param('pid')
    if(pid){
        $('.wpcf7 .pid').children('input').val(pid)
    }
    //console.log(pid)

});