import translator from'../widget/translator';
const axios = require('axios');

new Promise((resolve,reject)=>{
    axios.get(`https://cdn.jsdelivr.net/npm/@jx3box/jx3box-dict/dict.json?v=${Date.now()}`).then((res) => {
        resolve(res.data)
    }).catch(function (err){
        console.error('[jx3box/app/translator] axios exception')
        reject(err)
    })
}).then((dict) => {
    new Vue({
        el : '#jx3-translator',
        data : {
            from : "",
            to : "",
        },
        computed : {
            len : function (){
                return this.from.length
            }
        },
        methods : {
            translate : function (){
                if(!this.len) return
                this.to = translator(this.from,dict)
            }
        }
    })
})

