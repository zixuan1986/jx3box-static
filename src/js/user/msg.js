const {JX3BOX} = require('@jx3box/jx3box-common');
const axios = require('axios');
const moment = require('moment');
var $ = jQuery;

const MSG_API = JX3BOX.__helperUrl + 'api/messages'
const MARK_API = JX3BOX.__helperUrl + 'api/messages/read'

//用户信息
new Vue({
    el : '#m-dashboard-msg-list',
    data : {
        uid : $('#uid').val(),
        msgs : [],
        left : 0,
        total : 0,
    },
    mounted : function (){
        let condition = encodeURIComponent('where[user_id]');
        if(Number(this.uid)){
            axios({
                method: 'get',
                url: MSG_API + '?' + condition + '=' + this.uid + '&length=8'//this.uid,
            }).then((res) => {
                this.msgs = res.data.data.messages
                this.left = res.data.data.unread_count
                this.total = res.data.data.total
            })
        }
    },
    filters : {
        formatDatetime : function (timestamp){
            let dt = new Date(timestamp*1000)
            return moment(dt).format('YYYY-MM-DD HH:mm:ss')
        }
    },
    methods:{
        markthis : function (e,msg){
            if(!msg.read){
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
            }
        },
        changePage : function (page){
            let condition = encodeURIComponent('where[user_id]');
            axios({
                method: 'get',
                url: MSG_API + '?' + condition + '=' + this.uid + '&length=8&page=' + page//this.uid,
            }).then((res) => {
                this.msgs = res.data.data.messages
                this.left = res.data.data.unread_count
                this.total = res.data.data.total
            })
        }
    }
})
