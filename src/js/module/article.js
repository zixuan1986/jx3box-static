import JX3_MACRO from '../widget/macro.js'
import JX3_QIXUE from '../widget/qixue.js'
import Lightbox from '../widget/lightbox.js'

//此模块用于文章内容的特殊处理，默认情况下single模板有引入该模块，所以单页模板都会自动应用
//如在其他模板或异步调用接口返回文章内容或数据库直接查内容，则要在渲染完文章内容DOM后调用此模块执行下方方法以应用各个功能效果
/* 
1.图片懒加载
2.折叠文本块
3.站外链接自动新建窗口
4.表格移动端自动创建包裹层用于横向滚动
5.图片灯箱
6.文章内宏代码
7.文章内奇穴
*/

function article(){

    const $ = jQuery ;
    const $area = $('.m-single-primary')

    //图片延迟加载
    /* let images = document.querySelectorAll(".m-single-primary img");
    new LazyLoad(images); */
    $('.m-single-primary img').one('error',function (e){
        var img_url = $(this).attr('src')
        var fix_url = img_url.replace(/console\.cnyixun\.com/g,'oss.jx3box.com')  
        $(this).attr('src',fix_url)
    })

    //折叠文本区
    $('.e-summary').on('click',function (){
        $(this).next('.e-details').slideToggle()
        $(this).toggleClass('on')
    });

    //正文站外链接
    $('.m-single-primary a').each(function (i,ele){
        let link = $(this).attr('href')
        //除开锚点型链接、void类型
        if(link && link.startsWith('http') && !link.startsWith('https://www.jx3box.com')) $(this).attr('target','_blank')
    })

    //表格横向滚动
    let $tables = $('.m-single-primary table');
    if($tables.length){
        //let article_padding = parseInt($('.w-wrapper').css('padding-left'))*2;
        $('.m-single-primary table').each(function (i,e){
            let table_w = $(this).get(0).offsetWidth
            //let win_w = $('window').width() - article_padding
            let win_w = $('.m-single-primary').width()
            if(table_w > win_w){
                $(this).wrap(`<div class="u-mobile-table-wrapper"></div>`)
            }
        })
    }

    //灯箱
    const lightbox = new Lightbox()
    lightbox.add('.m-single-primary img')
    lightbox.add('.m-face-album img')

    //奇穴
    try{
        $('.e-jx3qixue-area').each(function (i,ele){
            $(this).after('<div class="e-jx3qixue-temp-container"></div>')
            let container = $(this).next('.e-jx3qixue-temp-container')
            let qixue = JSON.parse($(this).val())
            let _qixue = Object.assign({container:container},qixue)
            new JX3_QIXUE(_qixue)
        })
    }catch(e){
        console.error(e)
    }

    //宏
    try{
        $('.e-jx3macro-area').each(function (i,ele){
            let $macro = $(this)
            let macro = new JX3_MACRO($macro.text())
            $macro.html(macro.code);
        })
    }catch(e){
        console.error(e)
    }

}
export default article