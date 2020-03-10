const {JX3BOX} = require('@jx3box/jx3box-common');
import query from './utils/param.js';
var $ = jQuery;

jQuery(function($){

    //跳转进来的搜索
    let q = query('q') ? encodeURIComponent(query('q')) : ''
    if(q) ins_search(q)

    //热词点击的搜索
    $('.m-hotlist').on('click','li',function (){
        let q = encodeURIComponent($(this).text())
        ins_search(q)
    })

    //输出框的搜索
    $('.m-search .u-text').on('change',function (e){
        e.preventDefault();
        let q = encodeURIComponent($(this).val())
        ins_search(q)
    })
    
});

function google_search(query){
    return new Promise((resolve,reject)=>{
        $.ajax({
            url:JX3BOX.__sg + 'search/' + query,
            //url:JX3BOX.__cdnRoot + 'temp/test.json',
            type:'GET',
            success:function (data){
                resolve(data)
            },
            error:function (err){
                reject(err)
            }
        })
    })
}

function ins_search(q){

    location.href=`https://search.jx3box.com`

    $('.m-result').show()
    $('#search-loading').show()

    // google_search(q).then(function (data){

    //     //console.log(data)

    //     //如果没有搜索结果
    //     if(!data.items){
    //         $('.u-null').show()
    //         $('#search-loading').hide()
    //         return
    //     }

    //     new Vue({
    //         el : '#search-result',
    //         data : {
    //             items : data.items
    //         }
    //     })

    //     $('#search-loading').hide()

    // }).catch(function (err){
    //     console.error('谷歌搜索失败，跳转至百度搜索');
    //     location.href=`http://zhannei.baidu.com/cse/site?q=${q}&cc=jx3box.com`
    // })
}