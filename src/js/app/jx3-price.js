import server_dict from "../module/server_dict.js";
import restapi from '../widget/restapi.js';
const _ = require("lodash");
const moment = require("moment");
const $ = jQuery;
let servers = [];
servers.push({
    server_id: "gate0000",
    server_name: "全服",
    active: true
});
_.each(server_dict, function(v, k) {
    servers.push({
        server_id: k,
        server_name: v,
        active: false
    });
});

import { Scatter, Line, Column } from "@antv/g2plot";
import axios from "axios";
const {JX3BOX} = require('@jx3box/jx3box-common');

const api = JX3BOX.__spider + "jx3price";

//服务器列表
new Vue({
    el: "#jx3price",
    data: {
        servers: servers,
        current_id: "gate0000",
        current_name: "全服",
        price: {},
        fav_id : "gate0000",
        uid : parseInt($('#uid').val())
    },
    computed: {
        isIndex: function() {
            return this.current_id == "gate0000";
        },
        lowest: function() {
            return _.get(this.price, [this.current_id, "lowest"]) || "-";
        },
        yesterday_lowest: function() {
            return (
                _.get(this.price, [this.current_id, "yesterday_lowest"]) || "-"
            );
        },
        lowest_server: function() {
            return (
                server_dict[
                    _.get(this.price, [this.current_id, "lowest_server"])
                ] || "-"
            );
        },
        highest: function() {
            return _.get(this.price, [this.current_id, "highest"]) || "-";
        },
        yesterday_highest: function() {
            return (
                _.get(this.price, [this.current_id, "yesterday_highest"]) || "-"
            );
        },
        highest_server: function() {
            return (
                server_dict[
                    _.get(this.price, [this.current_id, "highest_server"])
                ] || "-"
            );
        },
        average: function() {
            return _.get(this.price, [this.current_id, "average"]) || "-";
        },
        yesterday_average: function() {
            return (
                _.get(this.price, [this.current_id, "yesterday_average"]) || "-"
            );
        },
        total: function() {
            return _.get(this.price, [this.current_id, "total"]) || "-";
        },
        count: function() {
            return _.get(this.price, [this.current_id, "count"]) || "-";
        },
        isFav : function (){
            return this.current_id == this.fav_id
        }
    },
    methods: {
        changeServer: function(index, server_id) {
            if(server_id !== this.current_id){
                //点击时重定义current_id
                this.current_id = servers[index]["server_id"];
                this.current_name = servers[index]["server_name"];

                this.$nextTick(function() {
                    //图表渲染
                    RenderCharts(this.current_id, this.price);
                });
            }
        },
        favMe : function (e,id){
            const vm = this
            if(this.uid){
                e.preventDefault()

                if(id != this.fav_id){
                    //添加
                    restapi.updateUserMeta({
                        data : {
                            uid : this.uid,
                            key : 'jx3price',
                            val : id
                        },
                        callback : function (response){
                            vm.fav_id = id
                        }
                    })
                }else{
                    //取消
                    restapi.updateUserMeta({
                        data : {
                            uid : this.uid,
                            key : 'jx3price',
                            val : ''
                        },
                        callback : function (response){
                            vm.fav_id = 'gate0000'
                        }
                    })
                }
            }
        }
    },
    created: function() {
        //根据路由重定义current_id
        if (location.hash) {
            this.current_name = decodeURIComponent(location.hash.slice(1));
            _.each(servers, (server, i) => {
                if (server.server_name == this.current_name) {
                    this.current_id = server.server_id;
                }
            });
        }
        //console.log('created',this.current_id)

        //加载元数据
        axios.get(api).then(res => {
            let price = res.data;

            //全服平均价
            let avlist = price.gate0000.average_arr.split(",");
            _.each(avlist, function(val, i) {
                avlist[i] = parseInt(val);
            });
            price.gate0000.average = parseInt(_.sum(avlist) / avlist.length);
            this.price = price;

            //图表渲染
            RenderCharts(this.current_id, this.price);
        });
    },
    mounted: function (){
        //加载已关注
        const vm = this
        jQuery(function($){
            if(vm.uid){
                restapi.getUserMeta({
                    data : {
                        uid : vm.uid,
                        key : 'jx3price',
                    },
                    callback : function (response){
                        vm.fav_id = response[0]
                    }
                })
            }
        });
    },
    watch: {
        current_id: function(nval, oval) {
            //console.log('watch',this.current_id)
            _.each(servers, server => {
                if (server.server_id == nval) {
                    server.active = true;
                } else {
                    server.active = false;
                }
            });
        }
    }
});

function RenderCharts(current_id, price) {
    //全服图表
    if (current_id == "gate0000") {
        //全服价格分布图
        let scatter = [];
        _.each(price, function(server, id) {
            if (id !== "gate0000") {
                let dots = server.current.split(",");
                _.each(dots, function(val, i) {
                    scatter.push({
                        服务器: server_dict[id],
                        价格: parseInt(val)
                    });
                });
            }
        });
        RenderScatter(scatter, "price-all2-chart");

        //全服均价柱状图
        let collist = [];
        _.each(price, function(server, id) {
            if (id !== "gate0000") {
                collist.push({
                    服务器: server_dict[id],
                    均价: parseInt(server.average)
                });
            }
        });
        RenderColumn(collist, "price-all1-chart");

        //指定区服走势图
    } else {
        //服务器趋势均价数据
        let linelist = [];
        let curvelist = []

        //7~30日期
        let sevenDatesList = [];
        let thirtyDatesList = [];
        let day = 24 * 60 * 60 * 1000;
        let today = new Date(new Date().setHours(0, 0, 0, 0) - 0 * day);
        for (let i = 1; i <= 7; i++) {
            sevenDatesList.push(
                moment(new Date(today - i * day)).format("MM-DD")
            );
        }
        for (let i = 1; i <= 30; i++) {
            thirtyDatesList.push(
                moment(new Date(today - i * day)).format("DD")
            );
        }

        _.each(price, function(server, id) {
            if (id == current_id) {
                let dots = server.trends.split(",");
                dots.length = 7;
                _.each(dots, function(val, i) {
                    linelist.push({
                        '日期': sevenDatesList[i],
                        '价格': parseInt(val) || 0
                    });
                });
            }
        });
        _.each(price, function(server, id) {
            if (id == current_id) {
                let dots = server.trends.split(",");
                dots.length = 30;
                _.each(dots, function(val, i) {
                    curvelist.push({
                        '日期': thirtyDatesList[i],
                        '价格': parseInt(val) || 0
                    });
                });
            }
        });
        RenderLine(linelist.reverse(), "price-7trend-chart");
        RenderCurve(curvelist.reverse(), "price-30trend-chart")
    }
}

function RenderColumn(data, ele) {
    const columnPlot = new Column(document.getElementById(ele), {
        title: {
            visible: false,
            text: "基础柱状图-滚动条"
        },
        description: {
            visible: false,
            text: "当数据过多时，推荐使用滚动条一次只浏览一部分数据。"
        },
        forceFit: true,
        data,
        padding: "auto",
        data,
        xField: "服务器",
        xAxis: {
            visible: true,
            autoHideLabel: true
        },
        yAxis: {
            visible: true,
            formatter: v =>
                `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, s => `${s},`),
            tickCount: 10,
            min: 400
        },
        yField:
            "均价" /* ,
        interactions: [
            {
                type: "scrollbar"
            }
        ] */
    });
    columnPlot.render();
}

function RenderScatter(data, ele) {
    const scatterPlot = new Scatter(document.getElementById(ele), {
        title: {
            visible: false,
            text: "基础散点图"
        },
        data,
        xField: "价格",
        yField: "服务器",
        xAxis: {
            visible: true
            //min: 500
        }
    });
    scatterPlot.render();
}

function RenderLine(data, ele) {
    const linePlot = new Line(document.getElementById(ele), {
        title: {
            visible: false,
            text: "带数据点的折线图"
        },
        description: {
            visible: false,
            text: "将折线图上的每一个数据点显示出来，作为辅助阅读。"
        },
        forceFit: true,
        padding: "auto",
        data,
        xField: "日期",
        yField: "价格",
        point: {
            visible: true
        },
        label: {
            visible: true,
            type: "point"
        },
        yAxis: {
            visible: true,
            min: 550
        }
    });
    linePlot.render();
}

function RenderCurve(data, ele) {
    const linePlot = new Line(document.getElementById(ele), {
        title: {
            visible: false,
            text: "曲线折线图"
        },
        description: {
            visible: false,
            text: "用平滑的曲线代替折线。"
        },
        padding: "auto",
        forceFit: true,
        data,
        xField: "日期",
        yField: "价格",
        smooth: true,
        yAxis: {
            visible: true,
            min: 500
        }
    });

    linePlot.render();
}
