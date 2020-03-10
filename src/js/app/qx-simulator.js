const { JX3BOX } = require('@jx3box/jx3box-common');
import JX3_XINFA from '../widget/xinfa.js';
import JX3_QIXUE from '../widget/qixue.js';

var $ = jQuery;

jQuery(function($){
    render_xf_qx()
});

async function render_xf_qx(){
    await render_xf_editor()
    await render_qx_editor()
}
//心法图标展示
async function render_xf_editor(){

    let XF = new JX3_XINFA;
    await XF.the_xf_list('.m-post-xf-list')

    //缓存选择器
    const $xf_select = $('#m-post-xf').find('input')
    const $xf_list = $('#c-post-xinfa')

    //获取值
    let xf = $xf_select.val()
    window.current_xf = xf
    
    //编辑页面时已有心法
    if(xf){
        $xf_list.children('li').each(function (i,ele){
            if($(this).attr('data-xf') == xf) $(this).addClass('active')
        })
    }else{
        let $last = $xf_list.children('li').last()
        $last.addClass('active')
        xf = $last.attr('data-xf')
        $xf_select.val(xf)
    }
    
    //绑定切换事件
    $xf_list.on('click','li',function (e){

        //step.1 修改心法input值
        let val = $(this).attr('data-xf')
        $xf_select.val(val)
        
        //step.2 修改心法表现样式
        $(this).siblings().removeClass('active')
        $(this).addClass('active')

        //step.3 触发自定义事件
        window.current_xf = val
        $(document).trigger('xf_change',val)
    })
    
}
//奇穴编辑器
async function render_qx_editor(){
    
    //获取预设版本
    let ver = $('#qixue-version').val()

    //本地临时对象
    let temp = {
        version : ver,
        editable : true,
        sq : '1,1,1,1,1,1,1,1,1,1,1,1'
    }

    //创建默认实例
    let qx_editor = new JX3_QIXUE(temp)


    //就绪后操作
    qx_editor.ready(function (instance){

        //当版本变更时
        $('#qixue-version').on('change',function (e){
            let ver = $(this).val()
            temp.version = ver
        })

        //当心法更改时重新渲染模拟器数据
        $(document).on('xf_change',function (event,val){
            temp.xf = val
            instance.load(temp)
        })

        //奇穴发生变更时
        const $qx_input = $('#m-post-qx').find('input')
        $(document).on('JX3_QIXUE_Change',function (e,ins){
            let __data = {}
            //console.log(ins)
            __data.version = ins.version
            __data.xf = ins.xf
            __data.sq = ins.sq.join(',')
            $qx_input.val(JSON.stringify(__data))
        })

    })

}