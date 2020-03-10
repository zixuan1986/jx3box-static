var $ = jQuery
class Lightbox{
    constructor(){
        this.init()
    }
    add(img){
        $(img).on('click',function (e){
            e.stopPropagation()
            let src = $(this).attr('src')
            $('#w-imgbox-mask').add('#w-imgbox').fadeIn()
            //$('#w-imgbox-pic').attr('href',src)
            $('#w-imgbox-img').attr('src',src)
        })
    }
    init(){
        $('#w-imgbox-close').add('#w-imgbox-mask').add('#w-imgbox').on('click',function (){
            $('#w-imgbox-mask').add('#w-imgbox').fadeOut()
        })
    }
}

export default Lightbox

/* let pic_w = $(this).attr('width')
        let win_w = $(window).width() - article_padding
        let url = $(this).attr('src')
        if(pic_w > win_w){
            if(!$(this).parent('a').length){
                $(this).wrap(`<a class="u-mobile-img-link" href="${url}"></a>`)
            }else{
                $(this).parent('a').attr('target','_self').addClass("u-mobile-img-link")
            }
        } */