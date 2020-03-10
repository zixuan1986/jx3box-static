var $ = jQuery;

class Dialog{
    constructor(ele,type){
        this.$dialog = ele ? $(ele) : $('.c-dialog-default')
        this.$ok = this.$dialog.find('.u-ok')
        this.$cancel = this.$dialog.find('.u-cancel')
        this.$close = this.$dialog.find('.u-close')
        this.$title = this.$dialog.find('.u-title')
        this.$content = this.$dialog.find('.u-content')
        this.type = type ? type : 'default'
        this.init()
    }

    init(){
        let __instance = this
        this.$dialog.on('click','.u-ok',function (){
            __instance.$dialog.hide()
            $(document).trigger('dialog_ok',__instance.type)
        })
        this.$dialog.on('click','.u-cancel',function (){
            __instance.$dialog.hide()
            $(document).trigger('dialog_no',__instance.type)
        })
        this.$dialog.on('click','.u-close',function (){
            __instance.$dialog.hide()
        })
    }

    static clone(cls){
        let $clone = $('.c-dialog-default').clone(true)
        $('body').append($clone)
        return $clone.removeClass('c-dialog-default').addClass(cls)
    }

    empty(){
        this.$title.html('')
        this.$content.html('')
    }

    load(opt = {
        title : '',
        content : '',
        class : '',
        type : ''
    }){
        if(opt.title){
            this.title = opt.title
            this.$title.html(this.title)
        }

        if(opt.content){
            this.content = opt.content
            this.$content.html(this.content)
        }

        if(opt.class){
            this.$dialog.addClass(this.class)
        }

        if(opt.type){
            this.type = opt.type
        }
        
        this.$dialog.show()
    }

    open(){
        this.$dialog.show()
    }

    close(){
        this.$dialog.hide()
    }
}
export default Dialog;