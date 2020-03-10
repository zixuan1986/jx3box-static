const { JX3BOX } = require('@jx3box/jx3box-common');


jQuery(function($){

    //浏览器特性支持检测
    if(!FileReader){
        $('#facedat-browser-check').show()
        $('#facedat-file').attr('disabled','disabled')
        $('.m-facedat-analyzer').addClass('disabled')
    }

    //预览区
    /* $('.m-facedat-group .u-title').on('click',function (){
        $(this).next('.u-list').slideToggle()
    }) */

    //用户状态
    //let status = parseInt($('#user-login-status').text())

    $('#facedat-analyzer-starter').on('click',async function (){

        if(!FileReader) return

        //登录状态
        /* if(status){
            //1.取值
            let face_url = $('.file-wrap a').attr('href')

            //2.检测
            if(!face_url){
                show_warning('文件名不能为空')
                return
            }

            //3.请求接口
            let filepath = face_url.replace(JX3BOX.__ossRoot,'') 
            get_result(filepath).then(function (data){

                //4.渲染预览
                render_data(data)
                show_success('分析成功!')

            }).catch(function (err){
                show_warning('文件分析异常')
            })

        //匿名状态
        }else{ */
            //1.取值
            let face_file = document.getElementById("facedat-file").files[0]

            //2.检测
            if(!face_file){
                show_warning('未检测到文件')
                return
            }else{
                msg_empty()
            }
            //console.log(face_file)

            //3.请求接口
            let fr = new FileReader()
            fr.readAsText(face_file)
            fr.onload = function (e){

                //console.log(e.target.result)
                show_success('读取成功...开始执行分析...')
                
                send_facedat(e.target.result).then(function (data){

                    //4.渲染预览
                    render_data(data)

                }).catch(function (err){
                    show_warning('文件分析异常')
                })
                
            }
            fr.onerror = function (e){
                show_warning('文件读取异常')
            }

        //}
    })
});

var $ = jQuery;
function show_warning(str){
    $('.m-facedat-result').html(`<p class="u-msg-red">${str}</p>`)
}
function show_success(str){
    $('.m-facedat-result').html(`<p class="u-msg-green">${str}</p>`)
}
function msg_empty(){
    $('.m-facedat-result').html('')
}

let API = JX3BOX.__node
//let API = 'http://localhost:3000/'

function get_result(faceurl){
    return new Promise((resolve,reject)=>{
        $.ajax({
            url:API + 'faceurl/' + faceurl,
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
function send_facedat(facefile){
    return new Promise((resolve,reject)=>{
        $.ajax({
            url:API + 'facedat/',
            data : {'raw':facefile},
            type:'POST',
            success:function (data){
                resolve(data)
            },
            error:function (err){
                reject(err)
            }
        })
    })
}
function get_decalmap(){
    return new Promise((resolve,reject)=>{
        $.ajax({
            url:JX3BOX.__dataPath + 'face_decal.json',
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
async function render_data(data){

    let _data = data.data
    //console.log(data)
    if(!_data.status){
        show_warning('数据异常，无法分析')
        return
    }

    //基础数据
    let basic = new Vue({
        el : '#basic',
        data : {
            rolename : _data.misc[0]['desc'],
            roletype : _data.misc[0]['value']
        }
    })

    //骨骼数据
    let bones = new Vue({
        el : '#bones',
        data : {
            eyes : _data.eye,
            mouthes : _data.mouth,
            noses : _data.nose,
            faces : _data.face,
            rolename : _data.misc[0]['desc'],
            roletype : _data.misc[0]['value'],
        },
        methods : {
            toggleSubArea : function (e){
                if($(e.target).hasClass('on')) return

                $('.m-facedat-group .u-title').removeClass('on')
                $(e.target).addClass('on')
                $('.m-facedat-group .u-list').slideUp()
                $(e.target).next('.u-list').slideDown()
            }
        }
    })

    //装饰数据
    //let decalmap = await get_decalmap()
    let decallist = new Vue({
        el : '#decals',
        data : {
            decals : _data.decal
        }
    })
    


    show_success('分析成功!')
}