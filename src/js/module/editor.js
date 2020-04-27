const {JX3BOX} = require('@jx3box/jx3box-common');
import JX3 from "../module/jx3.js";
import restapi from "../widget/restapi.js";
import Filter from "../utils/filter2.js";

const axios = require("axios");

jQuery(function($) {
    //可拖动界面
    $(".c-dialog-jx3").draggable();

    //编辑器帮助按钮
    let $btnGroup3 = $(".acf-editor-wrap").eq(0);
    $btnGroup3.append(
        `<a class="e-editor-help" href="${JX3BOX.__Root}help" target="_blank"><i class="u-icon u-icon-help"></i>编辑器帮助</a>`
    );

    //资源插入区
    new Vue({
        el: "#jx3-resource",
        data: {
            //导航
            nav: ["图标", "技能", "Buff", "物品", "秘籍"],
            currentIndex: 0,

            //图标
            icon: {
                list: [],
                activeIndex: null,
                currentID: "",
                favicons: []
            },

            //技能
            skill : {
                list : [],
                activeIndex : null,
                search : "",
                empty : false
            },

            //buff
            buff : {
                list : [],
                activeIndex : null,
                search : "",
                empty : false
            },

            //物品
            item : {
                list : [],
                activeIndex : null,
                search : "",
                empty : false
            },

            //秘籍
            miji : {
                list : [],
                activeIndex : null,
                search : "",
                empty : false
            },

            iconpath: JX3BOX.__iconPath,
            insertHTML: "",
            tempHTML : ""
        },
        computed: {
            insertIcon: function() {
                return `<img class="e-jx3-icon" title="IconID:${this.icon.currentID}" src="${this.iconpath}${this.icon.currentID}.png"/>`;
            },
            insertResource : function (){
                return `<pre class="e-jx3-resource">${this.tempHTML}</pre>`
            }
        },
        methods: {
            navChange: function(i) {
                this.currentIndex = i;
                this.showContent(i);
            },
            showContent: function(i) {
                $(".c-dialog-jx3-content .nav-content").removeClass("active");
                $(".c-dialog-jx3-content .nav-content")
                    .eq(i)
                    .addClass("active");
            },
            chooseIcon: function(i, id) {
                this.icon.activeIndex = i;
                this.icon.currentID = id;
                this.insertHTML = this.insertIcon;
            },
            changeIcon: function() {
                //复位
                this.icon.activeIndex = null;
                this.insertHTML = "";

                if (Boolean(this.icon.currentID)) {
                    this.icon.list = [this.icon.currentID];
                } else {
                    this.icon.list = this.icon.favicons;
                }
            },
            querySkill: function() {
                let query = this.skill.search;
                if (isNaN(query)) {
                    loadResource(this, {
                        type: "skill",
                        condition: "name",
                        query: query
                    });
                } else {
                    query = parseInt(query);
                    loadResource(this, {
                        type: "skill",
                        condition: "id",
                        query: query
                    });
                }
            },
            chooseSkill : function (i){
                this.skill.activeIndex = i;
                this.tempHTML = $('#u-jx3-skill-list li').eq(i).html()
                this.insertHTML = this.insertResource;
            },
            queryBuff : function (){
                let query = this.buff.search
                if(isNaN(query)){
                    loadResource(this,{
                        type : 'buff',
                        condition : 'name',
                        query : query
                    })
                }else{
                    query = parseInt(query)
                    loadResource(this,{
                        type : 'buff',
                        condition : 'id',
                        query : query
                    })
                }
            },
            chooseBuff : function (i){
                this.buff.activeIndex = i;
                this.tempHTML = $('#u-jx3-buff-list li').eq(i).html()
                this.insertHTML = this.insertResource;
            },
            queryItem : function (){
                let query = this.item.search
                if(isNaN(query)){
                    loadResource(this,{
                        type : 'item',
                        condition : 'name',
                        query : query
                    })
                }else{
                    query = parseInt(query)
                    loadResource(this,{
                        type : 'item',
                        condition : 'id',
                        query : query
                    })
                }
            },
            chooseItem : function (i){
                this.item.activeIndex = i;
                this.tempHTML = $('#u-jx3-item-list li').eq(i).html()
                this.insertHTML = this.insertResource;
            },
            queryMiji : function (){
                let query = this.miji.search
                //门派
                if(Object.keys(JX3.school).includes(query)){
                    loadResource(this,{
                        type : 'miji',
                        condition : 'school',
                        query : query
                    })
                }else{
                    loadResource(this,{
                        type : 'miji',
                        condition : 'name',
                        query : query
                    })
                }
            },
            chooseMiji : function (i){
                this.miji.activeIndex = i;
                this.tempHTML = $('#u-jx3-miji-list li').eq(i).html()
                this.insertHTML = this.insertResource;
            },
        },
        mounted: function() {
            const vm = this;
            jQuery(function($) {
                let uid = parseInt($("#uid").val());
                if (uid) {
                    restapi
                        .get_user_meta({
                            uid: uid,
                            key: "favicons"
                        })
                        .then(res => {
                            vm.icon.favicons = (res && res[0] && JSON.parse(res[0])) || [];
                            vm.icon.list = vm.icon.favicons;
                        });
                }
            });
        }
    });
});
function loadResource(vm, opt) {
    return new Promise((resolve, reject) => {
        axios
            .get(
                JX3BOX.__node + `${opt.type}/${opt.condition}/` + opt.query
            )
            .then(res => {

                if(res.data){
                    let tasklist = []

                    res.data.forEach(function (item,i){
                        if(item.Desc){
                            tasklist.push(Filter[opt.type](item.Desc).then((result) => {
                                item.filter = result
                            }))
                        }else{
                            item.filter = ''
                        }
                    })

                    Promise.all(tasklist).then((val) => {
                        vm[opt.type]['list'] = res.data;
                        vm[opt.type]['empty'] = res.data.length ? false : true;
                    })
                }
                
            });
    });
}
