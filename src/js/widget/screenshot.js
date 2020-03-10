import domtoimage from 'dom-to-image';
var $ = jQuery;
//需自定 #w-screenshot-handler 作为触发器
//需自定 #screenshot 作为内容源

function Screenshot(callback,errback,selector = 'screenshot'){

    //1.模板中设置相关的css为crossorigin="anonymous"
    //如为本地css可忽略

    //2.创建最终渲染盒
    let buildScreenbox = function (){
        const tpl = `<div class="w-screenshot-mask" id="w-screenshot-mask"></div>
        <div class="w-screenshot-box" id="w-screenshot-box">
            <p class="w-screenshot-msg w-screenshot-loading" id="w-screenshot-loading">
                <i class="u-icon u-icon-loading"></i>
                <span>正在生成中...</span>
            </p>
            <p class="w-screenshot-msg w-screenshot-success" id="w-screenshot-success">生成成功，右键即可保存。</p>
            <p class="w-screenshot-msg w-screenshot-failed" id="w-screenshot-failed"></p>
            <div class="w-screenshot-img" id="w-screenshot-img"></div>
            <div class="w-screenshot-close" id="w-screenshot-close"></div>
        </div>`
        $('body').append(tpl)
    }
    buildScreenbox()

    //step.1 生成处理后的dom放至#screenshot中，由于primary不同栏目在single下有不同样式表现
    //本业务需要单独生成至w-screen-raw中
    let buildRAW = function (){
        let $box = $(`#${selector}`)
        //单页头
        let $header = $('.m-single-header').clone()
        $box.append($header)
        //单页扩展字段
        let $extend = $('.m-single-extend').clone()
        $box.append($extend)
        //宏盒子需单独追加
        let $macro = $('.m-macro-box')
        if($macro.length) $box.append($macro.clone())
        //正文区
        let $primary = $('.m-single-primary').clone()
        $box.append($primary)
    }
    
    //step.2 处理跨域图片=>背景图方式
    let corsRAW = function (){
        $(`#${selector} img`).each(function (i,img){
            let src = $(img).attr('src')
            let w = $(img).attr('width')
            let h = $(img).attr('height')
            let temp = $(img).after('<div class="s-cloneimg"><div></div></div>')
            temp.next('div').css({
                'width' : w,
                'height' : h
            })
            temp.next('div').children('div').css({
                'background-image':`url(${src})`,
            })
            //隐藏原图像
            $(img).hide()
        })
    }

    //step.3 生成图片
    let buildScreenshot = function (){
        domtoimage.toPng(document.getElementById(selector),{
            bgcolor:'#ffffff',
            //cacheBust : true
        })
        .then(function (dataUrl){
            //输出图片
            var img = new Image();
            img.src = dataUrl;
            $('#w-screenshot-img').html(img)
    
            //成功信息
            $('#w-screenshot-success').show()
    
            //成功回调
            callback && callback(img);
        })
        .catch(function (error) {
            //失败信息
            $('#w-screenshot-failed').show()
            $('#w-screenshot-failed').text(error)
    
            //失败回调
            errback && errback(error);
        }).finally(function (){
            $('#w-screenshot-loading').hide()
        })
    }

    //3.绑定事件触发
    $('#w-screenshot-handler').on('click',function (){

        //预备渲染
        $('html').addClass('w-screenshot-fixed')
        $('#w-screenshot-mask').fadeIn()
        $('#w-screenshot-box').fadeIn()

        //如果已经生成过了，只做展示
        if(!$('#w-screenshot-img').find('img').length){
            $('#w-screenshot-loading').show()

            //执行step.1
            buildRAW()
            //执行step.2
            corsRAW()
            //执行step.3
            buildScreenshot()
        }

    })

    //4.关闭窗口
    $('#w-screenshot-close').on('click',function (){
        $('html').removeClass('w-screenshot-fixed')
        $('#w-screenshot-mask').fadeOut()
        $('#w-screenshot-box').fadeOut()
        $('.w-screenshot-msg').hide()
    })

}

export default Screenshot