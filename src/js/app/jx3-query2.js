const axios = require('axios');
const _ = require('lodash');
const {JX3BOX} = require('@jx3box/jx3box-common');
import JX3 from "../module/jx3.js";
const $ = jQuery;

new Vue({
    el : '#jx3-query-stat',
    data : {
        stat : {}
    },
    methods : {
        getStat(){
            axios.get(JX3BOX.__node).then((res) => {
                this.stat = res.data
            })
        }
    },
    created : function (){
        this.getStat()
    }
})

//侧边栏
const nav = [
    {path:'skill',icon:'skill4',name:'技能'},
    {path:'advskill',icon:'skill4',name:'技能属性'},
    {path:'buff',icon:'buff2',name:'Buff'},
    {path:'advbuff',icon:'buff2',name:'Buff属性'},
    {path:'npc',icon:'npc',name:'NPC'},
    {path:'advnpc',icon:'map',name:'地图NPC'},
    //{path:'equip',icon:'equip',name:'装备'},
    {path:'item',icon:'item',name:'物品/装备'},
    {path:'miji',icon:'miji',name:'秘籍'},
    {path:'bps',icon:'skill3',name:'职业'},
    {path:'fb',icon:'skull',name:'副本'}
]

new Vue({
    el : '#jx3-query',
    data : {
        nav : nav,
        currentIndex : 0,
        type : 'skill',
        subtype : '',

        search : {
            skill : '',
            advskill : '',
            buff:'',
            advbuff:'',
            npc : '',
            advnpc : '',
            equip : '',
            item : '',
            miji : '',
            bps : '',
        },
        result : {
            skill : [],
            advskill : [],
            buff:[],
            advbuff:[],
            npc:[],
            advnpc:[],
            equip:[],
            item:[],
            miji:[],
            bps:[],
        },
        nullflag : {
            skill : false,
            advskill : false,
            buff:false,
            advbuff:false,
            npc:false,
            advnpc:false,
            equip:false,
            item:false,
            miji:false,
            bps:false,
        },
        iconpath : JX3BOX.__iconPath,
        fb:{
            nav : {},
            c_zlp : '',
            c_fb : '',
            c_boss : '',
            keymap : {},
            ignore : ['SkillBaseInfo','BindBuffDetail','ImmuneDetail','isOpen'],
            unpack : {}
        }
    },
    computed:{
        c_zlplist : function (){
            return Object.keys(this.fb.nav) || []
        },
        c_fblist : function (){
            return _.get(this.fb.nav,this.fb.c_zlp) ? Object.keys(_.get(this.fb.nav,this.fb.c_zlp)) : []
        },
        c_bosslist : function (){
            return _.get(this.fb.nav,[this.fb.c_zlp,this.fb.c_fb]) || []
        }
    },
    methods : {
        navChange : function (i){
            this.currentIndex = i
            this.showContent(i)
            this.type = nav[i]['path']
        },
        showContent : function (i){
            $('.m-app-module').removeClass('active')
            $('.m-app-module').eq(i).addClass('active')
        },
        querySkill : function (){
            let query = this.search.skill
            if(isNaN(query)){
                loadResource(this,{
                    type : 'skill',
                    condition : 'name',
                    query : query
                })
            }else{
                query = parseInt(query)
                loadResource(this,{
                    type : 'skill',
                    condition : 'id',
                    query : query
                })
            }
        },
        queryAdvSkill : function (){
            let query = this.search.advskill
            if(isNaN(query)){
                //门派
                if(Object.keys(JX3.school).includes(query)){
                    loadResource(this,{
                        type : 'advskill',
                        condition : 'school',
                        query : JX3.school[query]
                    })
                //功夫
                }else if(Object.keys(JX3.kungfu).includes(query)){
                    loadResource(this,{
                        type : 'advskill',
                        condition : 'kungfu',
                        query : JX3.kungfu[query]
                    })
                //名字或描述
                }else{
                    loadResource(this,{
                        type : 'advskill',
                        condition : 'name',
                        query : query
                    })
                }
            }else{
                //ID
                query = parseInt(query)
                loadResource(this,{
                    type : 'advskill',
                    condition : 'id',
                    query : query
                })
            }
        },
        queryBuff : function (){
            let query = this.search.buff
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
        queryAdvBuff : function (){
            let query = this.search.advbuff
            if(isNaN(query)){
                loadResource(this,{
                    type : 'advbuff',
                    condition : 'name',
                    query : query
                })
            }else{
                query = parseInt(query)
                loadResource(this,{
                    type : 'advbuff',
                    condition : 'id',
                    query : query
                })
            }
        },
        queryNPC : function (){
            let query = this.search.npc
            if(isNaN(query)){
                loadResource(this,{
                    type : 'npc',
                    condition : 'name',
                    query : query
                })
            }else{
                query = parseInt(query)
                loadResource(this,{
                    type : 'npc',
                    condition : 'id',
                    query : query
                })
            }
        },
        queryAdvNPC : function (){
            let query = this.search.advnpc
            axios.get(JX3BOX.__node + `npc/map/` + query).then((res) => {
                this.result['advnpc'] = res.data
                this.nullflag['advnpc'] = res.data.length ? false : true
            })
        },
        queryItem : function (){
            let query = this.search.item
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
        queryMiji : function (){
            let query = this.search.miji
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
        queryBps : function (){
            let query = this.search.bps
            if(Object.keys(JX3.force).includes(query)){
                requestDaily(this,JX3.force[query])
            }
        },
        zlpChange : function (){
            this.fb.c_fb = Object.keys(this.fb.nav[this.fb.c_zlp])[0]
            this.fb.c_boss = this.fb.nav[this.fb.c_zlp][this.fb.c_fb][0]
            loadUnpack(this,{
                fb : this.fb.c_fb,
                boss : this.fb.c_boss
            })
        },
        fbChange : function (){
            this.fb.c_boss = this.fb.nav[this.fb.c_zlp][this.fb.c_fb][0]

            loadUnpack(this,{
                fb : this.fb.c_fb,
                boss : this.fb.c_boss
            })
        },
        bossChange : function (){
            loadUnpack(this,{
                fb : this.fb.c_fb,
                boss : this.fb.c_boss
            })
        },
        toggleRaw : function (o){
            o.isOpen = !o.isOpen
        }
    },
    filters : {
        filterRaw : function (str){
            return str.replace(/\\n/g,'\n')
        }
    },
    created : function (){
        //侧边栏
        let hash = location.hash.slice(1)
        for(let i = 0; i < nav.length; i++) {
            if(nav[i]['path'] == hash){
                this.currentIndex = i
                this.type = nav[i]['path']
                this.showContent(i)
                break;
            }
        }

        //副本字段
        axios.get(JX3BOX.__dataPath + 'fb_unpack_keymap.json').then((res) => {
            this.fb.keymap = res.data
        })

        //副本导航
        axios.get(JX3BOX.__dataPath + 'fb_unpack_list.json').then((res) => {
            this.fb.nav = res.data

            this.fb.c_zlp = Object.keys(this.fb.nav)[0]
            this.fb.c_fb = Object.keys(this.fb.nav[this.fb.c_zlp])[0]
            this.fb.c_boss = this.fb.nav[this.fb.c_zlp][this.fb.c_fb][0]

            //加载默认解包内容
            loadUnpack(this,{
                fb : this.fb.c_fb,
                boss : this.fb.c_boss
            })
        })

    }
})

function loadResource(vm,opt){
    return new Promise((resolve,reject)=>{
        axios.get(JX3BOX.__node + `${opt.type}/${opt.condition}/` + opt.query).then((res) => {
            vm.result[opt.type] = res.data
            vm.nullflag[opt.type] = res.data.length ? false : true
            resolve(res.data)
        })
    })
}

function requestDaily(vm,id){
    return new Promise((resolve,reject)=>{
        axios.get(JX3BOX.__node + `bps/` + id).then((res) => {

            //每个心法-主技能
            res.data.skill.data.forEach(function (xf,i){
                //技能组
                xf.remarks.forEach(function (kungfu,i){
                    //武功套路
                    kungfu.forceSkills.forEach(function (skill,i){
                        //技能
                        vm.result.bps.push(skill)
                    })
                })

                let zfdesc = ''
                xf.zhenFa.descs.forEach(function (zf,i){
                    zfdesc += zf.name + ':' + zf.desc + '\n'
                })

                //阵法
                vm.result.bps.push({
                    skillName : xf.zhenFa.skillName,
                    icon : xf.zhenFa.icon,
                    desc : zfdesc
                })
            })

            //每个心法-奇穴技能
            res.data.talent.data.forEach(function (qx,i){
                //位置组
                qx.kungfuLevel.forEach(function (pos,i){
                    vm.result.bps = _.concat(vm.result.bps,pos.forceSkills,pos.kungfuSkills)
                })
            })

            vm.nullflag.bps = vm.result.bps.length ? false : true
        })
    })
}

function loadUnpack(vm,opt){
    return new Promise((resolve,reject)=>{
        axios.get(JX3BOX.__dataPath + `fb_unpack/${opt.fb}/${opt.boss}.json`).then((res) => {

            res.data.data.forEach(function (item,i){
                item.isOpen = false
            })

            vm.fb.unpack = res.data
        })
    })
}
