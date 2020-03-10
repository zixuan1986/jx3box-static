const { JX3BOX } = require('@jx3box/jx3box-common');
import param from '../utils/param.js'

var $ = jQuery;
class JX3_XINFA{
    constructor(){
        this.api = JX3BOX.__dataPath+'xinfa.json'
        this.img = JX3BOX.__imgPath+'xinfa2/'
    }
    getData(){
        return new Promise((resolve,reject)=>{
            $.ajax({
                url:this.api,
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
    async the_xf(ele){
        let data = await this.getData()
        let instance = this

        $(ele).each(function (i,o){
            let xf = $(this).attr('data-xf')
            let icon = data[xf]['icon']

            $(this).append(`
                <img src="${instance.img}${icon}.png" alt="${xf}"/>
            `)
        })
    }
    async the_xf_color(ele){
        let data = await this.getData()
        let instance = this

        $(ele).each(function (i,o){
            let xf = $(this).attr('data-xf')
            let color = data[xf]['color']

            $(this).css('background',`rgb(${color})`)
        })
    }
    async the_xf_nav(ele){
        let data = await this.getData()
        let instance = this
        let html = ''
        let query = param('xf')
        $.each(data,function (i,o){
            let active = query==o.name ? 'active' : ''
            html += `<li class="u-item">
                <a class="${active}" href="/macro?xf=${o['name']}" data-xf="${o['name']}">
                    <i class="u-icon"><img src="${instance.img}${o['icon']}.png" alt="${o['name']}"/></i>
                    <span>${o['name']}</span>
                </a>
            </li>`
        })
        $(ele).append(html)
    }
    async the_xf_list(ele){
        let data = await this.getData()
        let instance = this
        let html = '<ul class="c-post-xinfa" id="c-post-xinfa">'
        $.each(data,function (i,o){
            html += `<li data-xf="${o['name']}">
                <i><img src="${instance.img}${o['icon']}.png" alt="${o['name']}"/></i>
                <span>${o['name']}</span>
            </li>`
        })
        html += '</ul>'
        $(ele).append(html)
    }
}
export default JX3_XINFA;