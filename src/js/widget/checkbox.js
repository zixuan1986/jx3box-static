var $ = jQuery;
//列表页新窗功能
function Checkbox(callback){
    $('.w-checkbox').on('click',function (){
        $(this).toggleClass('on');
        callback && callback($(this))
    })
}
export default Checkbox