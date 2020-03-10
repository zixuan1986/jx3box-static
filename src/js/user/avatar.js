var $=jQuery;
const { JX3BOX } = require('@jx3box/jx3box-common');
import restapi from '../widget/restapi.js';

jQuery(function($){
    upload_avatar()
});
function upload_avatar(){
    let upload_frame;   
    //上传
    $('#m-setting-avatar-upload').on('click',function(event){  
        event.preventDefault();   
        if( upload_frame ){   
            upload_frame.open();   
            return;   
        }   
        upload_frame = wp.media({   
            title: '上传',   
            button: {   
                text: '选择',   
            },   
            multiple: true   
        });
        upload_frame.on('select',function(){   
            let attachment = upload_frame.state().get('selection').first().toJSON(); 
            let url = attachment.url;
            $('#m-setting-avatar-value').val(url)
            $('#m-setting-avatar-pic').attr('src',url)
        });	   
        upload_frame.open();   
    })
    //更新
    $('#m-setting-avatar-update').on('click',function (){
        let avatar_url = $('#m-setting-avatar-value').val();
        let uid = $('#uid').val()

        restapi.updateUserMeta({
            data : {
                uid : uid,
                key : 'avatar',
                val : avatar_url
            },
            callback : function (response){
                //console.log(response)
                if(response){
                    location.reload();
                }
            }
        })

    })
}