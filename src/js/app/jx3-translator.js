import translator from'../widget/translator';

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
            translator(this.from).then((data) => {
                this.to = data
            })
        }
    }
})