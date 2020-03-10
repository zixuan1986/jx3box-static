import Dialog from '../widget/dialog.js';
import restapi from '../widget/restapi.js';

jQuery(function($){

    //给切换status添加tooltips
    $('.u-change-status').tooltip();

    $('.u-change-status').on('click',function (e){

        //操作信息判定
        let pt = $(this).attr('data-pt')
        let pid = $(this).attr('data-pid')
        let action = $(this).attr('data-action')

        const change_status = function (){
            restapi.updatePost({
                pt : pt,
                pid : pid,
                data : {
                    'status' : action
                },
                callback : function (){
                    location.reload();
                }
            })
        }
        
        //如果要删除，进行二次确认
        const dialog = new Dialog()
        if(action == 'dustbin'){
            dialog.load({
                title:'消息',
                content:'确定要删除吗？',
                type:'delete'
            })
            $(document).on('dialog_ok',function (e,type){
                if(type=='delete') change_status()
            })
        }else{
            change_status()
        }

    })

});