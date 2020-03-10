const { JX3BOX } = require('@jx3box/jx3box-common');
const axios = require('axios');
var $ = jQuery;

const API = JX3BOX.__helperUrl + 'api/posts/user/' + parseInt($('#authorID').val()) + '?page='

new Vue({
    el : '#m-user-posts',
    data : {
        list : [],
        current_page : 1,
        total : 0
    },
    methods:{
        changePage : function (page){
            axios.get(API + page).then((res) => {
                this.list = formatCPT(res.data.data.posts)
            })
        }
    },
    created : function (){
        axios.get(API + '1').then((res) => {
            this.list = formatCPT(res.data.data.posts)
            this.total = res.data.data.total
        })
    }
})

function formatCPT(list){
    list.forEach(function (item,i){
        item.post_type_name = JX3BOX.__postType[item.post_type]
    })
    return list
}