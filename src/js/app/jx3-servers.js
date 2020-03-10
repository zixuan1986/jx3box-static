const { JX3BOX } = require('@jx3box/jx3box-common');
import get_server_status from '../widget/jx3server.js';
import restapi from '../widget/restapi.js';
import Dialog from '../widget/dialog.js';
var $ = jQuery;
const _ = require('lodash');
let follows = []
const uid = parseInt($('#uid').val())

jQuery(function($){
    //开服
    get_server_status(function (data){

        //分割数据块
        let follow_data = []
        let unfollow_data = []

        //获取当前的关注数据
        getFollows()

        //数据加工
        $.each(data,function (i,item){

            //重写状态cls
            if(item.connectState){
                item.state = 'isOpen'
            }else{
                item.state = 'isClose'
            }

            //判断是否为主服
            if(item.serverName == item.mainServer){
                item.isUnique = 'isUnique'
            }else{
                item.isUnique = ''
            }

            //如果能找到
            if(follows.includes(item.serverName)){
                follow_data.push(item)
            }else{
                unfollow_data.push(item)
            }

        })

        //console.log(follow_data)
        //console.log(unfollow_data)

        //渲染
        new Vue({
            el : '#jx3-servers',
            data : {
                follow_data : follow_data,
                unfollow_data : unfollow_data,
            }
        })

        //tip
        $('.m-server-list li').tooltip();

        //搜索
        bindSearchEvent()

        //关注事件绑定
        bindFollowEvent()

        //开关事件
        bindSwitchEvent()
    })
});

function getFollows(){

    if(uid){
        //已登录用户
        let current = $('#follows').val()
        if(current){
            follows = current.split(',')
        }
        //console.log('当前值：',follows)
    }else{
        //未登录用户
        if(window.localStorage){
            let current = localStorage.getItem('jx3_servers')
            if(current){
                follows = current.split(',')
            }
            //console.log('当前值：',follows)
        }
    }

}

function bindSearchEvent(){
    $('#jx3-server-search').on('change',function (){
        let q = $(this).val()
        //如果为空显示全部
        if(!q){
            showServers()
        }else{
            let list = []
            $('.m-server-unfollow li').each(function (i,item){
                if($(item).find('.u-name').text().includes(q)){
                    list.push($(item))
                }
            })
            if(list){
                $('.m-server-unfollow li').hide()
                _.each(list,function (item){
                    item.show()
                })
            }
        }
    })
}

function bindFollowEvent(){

    //添加收藏
    $('.m-server-unfollow').on('click','li',function (){
        let server = $(this).attr('data-server')
        addFollow(server,$(this))
    })

    //取消收藏
    $('.m-server-follow').on('click','li',function (){
        let server = $(this).attr('data-server')
        rmFollow(server,$(this))
    })
}

function addFollow(server,jq){

    //即时操作DOM
    $('.m-server-follow').append(jq)

    //添加
    follows.push(server)

    //更新数据
    updateFollows(follows)
    
}
function rmFollow(server,jq){

    //即时操作DOM
    $('.m-server-unfollow').append(jq)

    //移除
    let pos = follows.indexOf(server)
    follows.splice(pos,1)

    //更新数据
    updateFollows(follows)
    
}
function updateFollows(follows){
    
    if(uid){
        //已登录用户
        updateUserMeta(follows)
    }else{
        updateLocalStorage(follows)
    }

    //console.log('变更后：',follows)
}
function updateLocalStorage(follows){
    //未登录用户
    if(window.localStorage){
        localStorage.setItem('jx3_servers',follows.toString())
    }else{
        const dialog = new Dialog()
        dialog.load({
            content : '您的浏览器版本太低，请先登录'
        })
    }
}
function updateUserMeta(follows){
    //更新用户meta
    restapi.update_user_meta({
        uid : uid ,
        key : 'jx3_servers',
        val : follows.toString(),
    }).then(function (data){
        //console.log('操作成功',data)
    })
}

function bindSwitchEvent(){
    //默认只看主服
    $('.m-server-switch').on('click',function (){
        $(this).toggleClass('on')
        showServers()
    })
}

function showServers(){
    if($('.m-server-switch').hasClass('on')){
        $('.m-server-unfollow li').hide()
        $('.m-server-unfollow .isUnique').show()
    }else{
        $('.m-server-unfollow li').show()
    }
}