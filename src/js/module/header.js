const {JX3BOX} = require('@jx3box/jx3box-common');
const axios = require('axios');
const moment = require('moment');

const MSG_API = JX3BOX.__helperUrl + 'api/messages'
const MARK_API = JX3BOX.__helperUrl + 'api/messages/read'

jQuery(function($){
    /* @desc : 头部模块左侧导航*/
    $('#c-header-menu').on('click',function (e){
        e.stopPropagation();
        $('#c-header-primary').toggleClass('on')
    })
    $('body').on('click',function (){
        $('#c-header-primary').removeClass('on')
    })


    //搜索禁止冒泡
    $('#c-header-search').on('click',function (e){
        e.stopPropagation()
    })
    //搜索嵌入
    if(window != window.top){
        $('html').addClass('isFramed')
    }

    //用户信息
    new Vue({
        el : '#c-header-user',
        data : {
            uid : $('#uid').val(),
            msgs : [],
            pop : false,
            fold : {
                msg : true,
                panel : true,
                info: true
            }
        },
        mounted : function (){
            let condition = encodeURIComponent('where[user_id]');
            if(Number(this.uid)){
                axios({
                    method: 'get',
                    url: MSG_API + '?' + condition + '=' + this.uid + '&length=3'//this.uid,
                }).then((res) => {
                    this.msgs = res.data.data.messages
                    if(res.data.data.unread_count){
                        this.pop = true
                    }
                })
            }
            const vm = this;
            $('body').on('click',function (e){
                for (let _key in vm.fold) {
                    vm.fold[_key] = true
                }
            })
        },
        filters : {
            formatDatetime : function (timestamp){
                let dt = new Date(timestamp*1000)
                return moment(dt).format('YYYY-MM-DD HH:mm:ss')
            }
        },
        methods:{
            expandList : function (e,current){
                
                if(current == 'msg'){
                    if($(window).width() < 720){
                        return
                    }else{
                        console.log(111)
                        e.preventDefault()
                    }
                }

                e.stopPropagation();

                for (let _key in this.fold) {
                    if(_key == current){
                        this.fold[current] = !this.fold[current]
                    }else{
                        this.fold[_key] = true
                    }
                }
            },
            markthis : function (e,msg){
                e.stopPropagation();
                axios({
                    method: 'put',
                    url: MARK_API,
                    data : {
                        user_id : this.uid,
                        ids : [msg.ID]
                    }
                }).then((res) => {
                    msg.read = 1
                })
            },
            markall : function (e){
                e.stopPropagation();
                axios({
                    method: 'put',
                    url: MARK_API,
                    data : {
                        user_id : this.uid,
                        ids : []
                    }
                }).then((res) => {
                    this.pop = false
                    this.msgs.forEach(function (msg){
                        msg.read = 1
                    })
                })
            }
        }
    })

});

