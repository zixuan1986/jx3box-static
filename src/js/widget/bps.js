const { JX3BOX } = require('@jx3box/jx3box-common');
import param from '../utils/param.js'
const axios = require('axios');
const _ = require('lodash');
const $ = jQuery

class BPS{
    constructor(){
        this.api = JX3BOX.__dataPath + 'bps.json'
        this.imgPath = JX3BOX.__imgPath + 'xinfa2/'
        this.ready = this.init()
    }
    init(){
        return new Promise((resolve,reject)=>{
            axios.get(this.api).then((res) => {
                let data = res.data
                _.each(data,(kf)=>{
                    kf['img'] = this.imgPath + kf['icon']
                    kf.active = false
                })
                resolve(data)
            })
        })
    }
    the_bps_nav(ele){
        this.ready.then((data) => {
            new Vue({
                el : ele,
                data : {
                    bps : data
                },
                computed : {
                    current : function (){
                        return param('xf')
                    }
                }
            })
        })
    }
    the_bps_icon(ele){
        this.ready.then((data) => {
            let xf = $(ele).attr('data-xf')
            let img = data[xf]['img']

            $(ele).append(`
                <img src="${img}" alt="${xf}"/>
            `)
        })
    }
}

export default BPS