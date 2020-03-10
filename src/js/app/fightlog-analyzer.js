const { JX3BOX } = require('@jx3box/jx3box-common');

jQuery(function($){

    //浏览器特性支持检测
    if(!FileReader){
        $('#browser-check').show()
        $('.m-file-uploader').addClass('disabled')
    }

    $('#analyzer-starter').on('click',async function (){

        if(!FileReader) return

        //1.取值
        let file_content = document.getElementById("file-uploader").files[0]

        //2.检测
        if(!file_content){
            msg_warning('未检测到文件')
            return
        }else{
            msg_empty()
        }
        //console.log(face_file)

        //3.请求接口
        let fr = new FileReader()
        fr.readAsText(file_content,'gb2312')
        fr.onload = function (e){

            //console.log(e.target.result)
            msg_success('读取成功...开始执行分析...')
            let raw = e.target.result.replace(/\s/g,'')
            raw = e.target.result.replace(/\n/g,'')
            //console.log(raw)

            send_data(raw).then(function (data){

                //4.检测数据可用性
                if(!parseInt(data.status)){
                    msg_warning('数据异常，无法分析')
                    return
                }

                //5.关闭上传
                $('.m-file-uploader').addClass('hide')

                //6.数据处理
                render_data(data)

                //7.表格美化
                $('#result-table').DataTable({
                    "lengthMenu": [[50, 100, 200, -1], [50, 100, 200, "全部"]],
                    "language":{
                        "sProcessing":   "处理中...",
                        "sLengthMenu":   "显示 _MENU_ 项结果",
                        "sZeroRecords":  "没有匹配结果",
                        "sInfo":         "显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项",
                        "sInfoEmpty":    "显示第 0 至 0 项结果，共 0 项",
                        "sInfoFiltered": "(由 _MAX_ 项结果过滤)",
                        "sInfoPostFix":  "",
                        "sSearch":       "搜索:",
                        "sUrl":          "",
                        "sEmptyTable":     "表中数据为空",
                        "sLoadingRecords": "载入中...",
                        "sInfoThousands":  ",",
                        "oPaginate": {
                            "sFirst":    "首页",
                            "sPrevious": "上页",
                            "sNext":     "下页",
                            "sLast":     "末页"
                        },
                        "oAria": {
                            "sSortAscending":  ": 以升序排列此列",
                            "sSortDescending": ": 以降序排列此列"
                        }
                    }
                });

                //8.清空消息
                msg_empty()

            }).catch(function (err){
                msg_warning('文件大小超出限制（5MB）')
            })
            
        }
        fr.onerror = function (e){
            msg_warning('本地文件读取异常')
        }

    })
});


var $ = jQuery;
function msg_warning(str){
    $('#error-msg').html(`<p class="u-msg-red">${str}</p>`)
}
function msg_success(str){
    $('#error-msg').html(`<p class="u-msg-green">${str}</p>`)
}
function msg_empty(){
    $('#error-msg').html('')
}

let API = JX3BOX.__node
//let API = 'http://localhost:3000/'

function send_data(data){
    return new Promise((resolve,reject)=>{
        $.ajax({
            url:API + 'fightlog/',
            data : {'raw':data},
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

async function render_data(data){

    //console.log(data)

    msg_success('原始数据分析成功..开始结构化数据..')

    let _data = data.data
    let filter = []
    $.each(_data,function (i,item){
        let _item = {}
        if(!item.caster){
            item.caster = {
                szName : '',
                dwTemplateID : '',
                blood_fp : ''
            }
        }
        _item.npc_name = item.caster.szName ? item.caster.szName : ''
        _item.npc_id = item.caster.dwTemplateID ? item.caster.dwTemplateID : ''
        _item.npc_blood = item.caster.blood_fp ? formatBlood(item.caster.blood_fp) : ''
        _item.skill_name = item.szSkillName ? item.szSkillName : ''
        _item.skill_id = item.dwSkillID ? item.dwSkillID : ''
        _item.skill_level = item.nLevel ? item.nLevel : ''
        _item.time = item.nTime ? formatTime(item.nTime) : ''
        _item.type = item.nType ? item.nType : ''
        _item.text = item.szText ? item.szText : ''

        if(_item.time){
            filter.push(_item)
        }
        
    })

    msg_success('开始执行智能分析..预备渲染..')
    //console.log(filter)
    let SK = []
    let SKT = []
    $.each(filter,function (i,item){
        buildMap(item.skill_name,item,SK,SKT)
        buildMap(item.skill_id,item,SK,SKT)
        buildMap(item.text,item,SK,SKT)
    })
    //console.log(SK,SKT)
    let ais = []
    $.each(SK,function (i,sk){
        let ai = {}
        ai.name = sk
        ai.time = SKT[i].toFixed(2)
        ais.push(ai)
    })
    //console.log(ais)

    //前端渲染
    let items = new Vue({
        el : '#result',
        data : {
            items : filter,
            ais : ais
        }
    })
    

}


function formatBlood(num){
    let _num = Number(num)
    _num = _num*100
    _num = _num.toFixed(2)
    _num += '%'
    return _num
}

function formatTime(time){
    let _time = Number(time)
    _time = _time/1000
    _time = _time.toFixed(1)
    return _time
}

function buildMap(key,item,SK,SKT){
    if(key){
        //如果不存在，则推入
        if(!SK.includes(key)){
            SK.push(key)
        }
        let i = SK.indexOf(key)
        let time = parseFloat(item.time)
        //如果第一次推入，默认值取当前值
        if(SKT[i] == undefined){
            SKT[i] = time
        }
        SKT[i] = ( SKT[i] + time ) / 2
    }
}
