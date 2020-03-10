const { JX3BOX } = require('@jx3box/jx3box-common');

var $ = jQuery;
class JX3_FB{
    constructor(){
        //副本列表
        this.list_url = JX3BOX.__dataPath+'fb.json'
        this.detail_url = JX3BOX.__dataPath+'fb_detail/'
        this.data = null
        this.__init()
    }
    async __init(){
        let data = await this.__getList();
        this.data = data
    }
    __getList(){
        return new Promise((resolve,reject)=>{
            $.ajax({
                url:this.list_url,
                type:'GET',
                dataType:'json',
                success:function (data){
                    resolve(data)
                },
                error:function (){
                    console.error('接口连接异常')
                }
            })
        })
    }
    __getFb(cid){
        return new Promise((resolve,reject)=>{
            $.ajax({
                url:this.detail_url + cid + '.json',
                type:'GET',
                dataType:'json',
                success:function (data){
                    resolve(data)
                },
                error:function (){
                    console.error('接口连接异常')
                }
            })
        })
    }

    //获取资料片数组
    async get_zlp_list(){
        let data = await this.__getList()
        let list = []
        $.each(data,function (i,zlp){
            list.push(zlp.devide_name)
        })
        return list
    }

    //输出资料片列表
    async the_zlp_list(ele){
        let data = await this.__getList()
        let __html = '<ul class="c-jx3fb-zlp-list">'
        $.each(data,function (i,zlp){
            __html += `<li data-zlp="${zlp.devide_name}"><span>${zlp.devide_name}</span><em>(${zlp.devide_level})</em></li>`
        })
        __html += '</ul>'
        $(ele).append(__html)
    }

    //获取副本数组
    async get_fb_list(){
        await this.__init()
        return this.data
    }

    //输出副本列表
    async the_fb_list_with_icon(ele){
        let data = await this.__getList()

        let __html = ''
        $.each(data,function (i,zlp){
            __html += '<ul class="c-jx3fb-fb-list">'

            $.each(zlp['dungeon_infos'],function (i,fb){
                __html += `
                <li data-type="${fb.type}" 
                    data-fb="${fb.name}" 
                    data-cid="${fb.cat_id}" 
                    data-level="${fb.devide_level}" 
                    data-dvname="${fb.devide_name}">
                    <i><img src="${fb.icon}" alt="${fb.name}"/></i>
                    <span>${fb.name}</span>
                </li>`
            })

            __html += '</ul>'
        })
        
        $(ele).append(__html)
    }

    //输出指定副本boss
    async the_boss_list(ele,cid){
        //如果已经存在则不再加载
        if($(`#fb-${cid}`).length) return;

        let __html = `<ul class="c-jx3fb-boss-list on" id="fb-${cid}">`
        let fb = await this.__getFb(cid)
        let boss_list = fb.data.info.boss_infos

        $.each(boss_list,function (i,boss){
            __html += `<li>${boss.name}</li>`
        })

        __html += `</ul>`
        $(ele).append(__html)

    }

    //输出资料片+副本联级菜单
    async the_combine_list(ele){
        let data = await this.__getList()

        let __html = ''
        $.each(data,function (i,zlp){
            //资料片分区
            __html += `
                <h2 class="u-category">
                    <span class="u-title">${zlp.devide_name}</span>
                    <em class="u-level">(${zlp.devide_level})</em>
                    <span class="u-switch">
                        <i class="u-icon u-icon-unfold"></i>
                    </span>
                </h2>`;

            //资料片所属副本列表
            __html += `<ul class="u-list">`

            let path = JX3BOX.__Root + 'fb/'    //fix
            //副本单项
            $.each(zlp.dungeon_infos,function (i,fb){
                __html += `
                    <li class="u-item" 
                    data-type="${fb.type}"
                    data-fb="${fb.name}"
                    data-cid="${fb.cat_id}"
                    data-icon="${fb.icon}"
                    data-level="${fb.devide_level}"
                    data-devide="${fb.devide_name}">
                    <a href="${path}?fb_name=${fb.name}">${fb.name}</a>
                    </li>`
            })
            
            __html += '</ul>'
        })
        $(ele).append(__html)
    }

    //输出副本详细信息
    async the_fb_info(cid,icon){

        let data = await this.__getFb(cid)
        let fb = data.data.info
        $('#m-archive-fb-pic').attr('src',icon)
        $('#m-archive-fb-name').text(fb.name)
        let fbInfo = fb.introduce.replace(/\\n/g,'')
        $('#m-archive-fb-intro').html(fbInfo)

        let mode = ''
        $.each(fb.maps,function (i,val){
            mode += `<li>${val.mode}</li>`
        })
        $('#m-archive-fb-mode').append(mode)

        let boss = '<ul class="u-boss-name">'
        $.each(fb.boss_infos,function (i,val){
            boss += `<li><i class="u-icon u-icon-skull"></i>${val.name}</li>`
        })
        boss += '</ul>'
        boss += '<ul class="u-boss-detail">'
        $.each(fb.boss_infos,function (i,val){
            boss += `<li>${val.summary}</li>`
        })
        boss += '</ul>'

        $('#m-archive-fb-boss').append(boss)
    }
    
}
export default JX3_FB;