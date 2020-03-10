const {JX3BOX} = require('@jx3box/jx3box-common');

import get_server_status from "./widget/jx3server.js";
import get_jx3_news from "./widget/jx3news.js";
import restapi from './widget/restapi.js';

import axios from "axios";
import server_dict from './module/server_dict.js'
var $ = jQuery;
const _ = require("lodash");

jQuery(function($) {
    //轮播
    $("#m-home-slider").slick({
        infinite: true,
        autoplay: true,
        dots: true
    });

    //官方新闻
    get_jx3_news(5, function(data) {
        //console.log(data)
        //渲染
        new Vue({
            el: "#m-home-gamenews",
            data: {
                gamenews: data
            }
        });
    });

    //开服
    get_server_status(function(data) {
        //console.log(data)
        let __data = [];
        //数据加工
        $.each(data, function(i, item) {
            //只显示主服
            if (item.serverName == item.mainServer) {
                //开服的状态
                if (item.connectState) {
                    item.state = "open";
                } else {
                    item.state = "close";
                }

                __data.push(item);
            }
        });
        //渲染
        new Vue({
            el: "#m-home-servers",
            data: {
                servers: __data
            }
        });
        //停留状态优化
        $(".m-home-server-item").tooltip();
    });

    //金价走势
    const api = JX3BOX.__spider + "jx3price";
    axios.get(api).then(res => {
        let price = res.data;
        new Vue({
            el: "#m-home-price",
            data: {
                price: price,
                lowest : price.gate0000.lowest,
                lowest_server : server_dict[price.gate0000.lowest_server],
                highest : price.gate0000.highest,
                highest_server : server_dict[price.gate0000.highest_server],
                fav_id : 'gate0000'
            },
            computed : {
                yesterday : function (){
                    let t = 0
                    _.each(price,function (server,id){
                        if(id !== 'gate0000'){
                            t += parseInt(server.yesterday_average)
                        }
                    })
                    let a = parseInt( t / (price.gate0000.average_arr.split(',').length) )
                    return a
                },
                today : function (){
                    let avlist = price.gate0000.average_arr.split(",");
                    _.each(avlist, function(val, i) {
                        avlist[i] = parseInt(val);
                    });
                    let a = parseInt(_.sum(avlist) / avlist.length);
                    return a
                },
                result : function (){
                    let s = '';
                    let today = this.fav_id=='gate0000' ? this.today : this.price[this.fav_id].average
                    let yesterday = this.fav_id=='gate0000' ? this.yesterday : this.price[this.fav_id].yesterday_average

                    if(today > yesterday){
                        s = '跌'
                    }else if(today < yesterday){
                        s ='涨';
                    }else{
                        s = '平'
                    }
                    return s
                },
                lowest_to_sale : function (){
                    return price[price.gate0000.lowest_server].total
                },
                highest_to_sale : function (){
                    return price[price.gate0000.highest_server].total
                },
                fav : function (){
                    return this.price[this.fav_id]
                },
                fav_name : function (){
                    return server_dict[this.fav_id] || '全服'
                }
            },
            mounted : function (){
                const vm = this
                let uid = parseInt($('#uid').val())
                if(uid){
                    restapi.getUserMeta({
                        data : {
                            uid : uid,
                            key : 'jx3price',
                        },
                        callback : function (response){
                            vm.fav_id = response[0]
                        }
                    })
                }
            }
        });
    });

    //移动端位置调整
    if(window.innerWidth < 1025){
        $('.m-home-list').after($('.m-home-contact'))
        $('.m-home-list').before($('.m-home-gamenews'))
        $('.m-home-channel').after($('.m-home-server'))
        $('.m-home-server').after($('.m-home-price'))
    }

});
