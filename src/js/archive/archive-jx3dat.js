var $ = jQuery;
const axios = require('axios');
const _ = require('lodash');
const {JX3BOX} = require('@jx3box/jx3box-common');

jQuery(function($){

    //渲染订阅号列表
    if($('#m-jx3dat-feedlist').length){

        axios.get(JX3BOX.__helperUrl + 'api/posts/subscribe').then(function (res){

            //加工数据
            let feedlist = res.data.data.posts
            _.each(feedlist,function (feed,i){
                feed.url = JX3BOX.__Root + 'jx3data/' + feed.post_id
                feed.avatar = feed.user_avatar + '?x-oss-process=image/auto-orient,1/resize,m_fill,w_68,h_68'
                feed.userlink = JX3BOX.__Root + 'author/' + feed.user_id
            })

            //渲染模板
            new Vue({
                el : '#m-jx3dat-feedlist',
                data : {
                    feedlist : feedlist,
                }
            })

            //优化字体大小
            opt_font_size()
            
        }).catch(function (err){
            //提示错误消息
            if(err){
                $('#m-jx3data-feedlist-error').show()
            }
        }).finally(function () {
            //隐藏加载中
            $('#m-jx3dat-feedlist-loading').hide()
        }); 
    }

});

function opt_font_size(){
    //字体大小处理
    $('#m-jx3dat-feedlist .u-feed').each(function (i,item){
        let len = $(item).text().length
        if(len>17){
            $(item).addClass('isVeryLong')
        }else if(len>15){
            $(item).addClass('isLong')
        }
    })
}
