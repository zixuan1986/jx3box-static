const { JX3BOX } = require('@jx3box/jx3box-common');

jQuery(function($){

    //如果是捏脸
    let $facedat = $('#facedat')
    if($facedat.length && $facedat.text()){

        let str = $facedat.text().slice(0)
        const _data = JSON.parse(str).data
        
        if(!_data.status){
            console.error('数据异常，无法分析')
            return
        }

        //骨骼数据
        let bones = new Vue({
            el : '#bones',
            data : {
                eyes : _data.eye,
                mouthes : _data.mouth,
                noses : _data.nose,
                faces : _data.face,
                rolename : _data.misc[0]['desc'],
                roletype : _data.misc[0]['value'],
            },
            methods : {
                toggleSubArea : function (e){
                    if($(e.target).hasClass('on')) return

                    $('.m-facedat-group .u-title').removeClass('on')
                    $(e.target).addClass('on')
                    $('.m-facedat-group .u-list').slideUp()
                    $(e.target).next('.u-list').slideDown()
                }
            }
        })

        //装饰数据
        let decallist = new Vue({
            el : '#decals',
            data : {
                decals : _data.decal
            }
        })
    

    }

    /* //手机端不在新窗打开图片
    if(window._ua.isMobile){
        $('.m-face-album a').each(function (i,item){
            $(item).attr('target','_self')
        })
    } */

});
