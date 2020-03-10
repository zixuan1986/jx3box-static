/*
 * @Description: 发布页
 * @Author: iRuxu
 * @Date: 2019-08-27 16:10:44
 * @LastEditors: iRuxu
 * @LastEditTime: 2019-09-13 05:50:54
 */

const { JX3BOX } = require('@jx3box/jx3box-common');
import JX3_URL from '../module/url.js';
import JX3_XINFA from '../widget/xinfa.js'
import JX3_QIXUE from '../widget/qixue.js'
import JX3_FB from '../widget/fb.js'
import '../module/editor.js';
import JX3_CJ from "../widget/cj";

var $ = jQuery;

jQuery(function ($) {

    //调整内容区位置
    $('.acf-form-fields').append($('.acf-field--post-content'))

    //宏
    render_xf_qx()
    the_macro_help()
    count_macro_char()

    //副本
    if ($('.m-fb-zlp').length) {
        render_fb_selection()
    }

    //成就
    if ($('#f-cj-id').length) {
        render_cj_selection();
    }

    //捏脸
    bind_face_analyze_event()

});

async function render_xf_qx() {
    if ($('#m-post-xf').length) {
        await render_xf_editor()
    }
    if ($('#m-post-qx').length) {
        await render_qx_editor()
    }
}

//心法图标展示
async function render_xf_editor() {

    let XF = new JX3_XINFA;
    await XF.the_xf_list('.m-post-xf-list')

    //缓存选择器
    const $xf_select = $('#m-post-xf').find('input')
    const $xf_list = $('#c-post-xinfa')

    //获取值
    let xf = $xf_select.val()
    window.current_xf = xf

    //编辑页面时已有心法
    if (xf) {
        $xf_list.children('li').each(function (i, ele) {
            if ($(this).attr('data-xf') == xf) $(this).addClass('active')
        })
    } else {
        let $last = $xf_list.children('li').last()
        $last.addClass('active')
        xf = $last.attr('data-xf')
        $xf_select.val(xf)
    }

    //绑定切换事件
    $xf_list.on('click', 'li', function (e) {

        //step.1 修改心法input值
        let val = $(this).attr('data-xf')
        $xf_select.val(val)

        //step.2 修改心法表现样式
        $(this).siblings().removeClass('active')
        $(this).addClass('active')

        //step.3 触发自定义事件
        window.current_xf = val
        $(document).trigger('xf_change', val)
    })

}

//奇穴编辑器
async function render_qx_editor() {

    //缓存选择器
    const $qx_input = $('#m-post-qx').find('input')
    let qx_editor = null    //预注册一个奇穴模拟器

    //获取值
    let qx = $qx_input.val()
    //根据发布页和编辑页区别初始值
    if (qx) {
        let _qx = JSON.parse(qx)
        qx_editor = new JX3_QIXUE({
            xf: _qx.xf,
            sq: _qx.sq,
            editable: true
        })
    } else {
        qx_editor = new JX3_QIXUE({
            editable: true
        })
    }

    //获取默认奇穴数据
    let getDefaultQX = new Promise((resolve, reject) => {
        $.ajax({
            async: true,
            url: JX3BOX.__dataPath + 'qixue_default.json',
            type: 'GET',
            success: function (data) {
                resolve(data)
            },
            error: function () {
                console.error('接口连接异常')
            }
        })
    })

    //就绪后操作
    qx_editor.ready(function (instance) {

        //console.log(instance)

        //当心法更改时重新渲染模拟器数据
        $(document).on('xf_change', function (event, val) {
            instance.load({
                xf: val,
                sq: '1,1,1,1,1,1,1,1,1,1,1,1',
                editable: true
            })
        })

        //加载当前心法默认奇穴方案
        $('#c-post-qx-default').on('click', function (event) {
            getDefaultQX.then(function (data) {
                instance.load({
                    xf: window.current_xf,
                    sq: data[window.current_xf]['sq'],
                    editable: true
                })
            })
        })

        //奇穴发生变更时
        $(document).on('JX3_QIXUE_Change', function (e, ins) {
            let __data = {}
            __data.xf = ins.xf
            __data.sq = ins.sq.join(',')
            $qx_input.val(JSON.stringify(__data))
        })

    })

}

//宏快速帮助
function the_macro_help() {
    if (!$('#m-post-macro-book-switch').length) return;
    $('#m-post-macro-book-switch').on('click', function () {
        $('#m-post-macro-book').slideToggle()
    })
}

//宏字数提醒
function count_macro_char() {
    if (!$('.m-macro-code').length) return

    let checkChars = function (o) {
        let len = $(o).val().length
        let $count = $(o).parents('.m-macro-code-content').next('.m-macro-code-count').find('.w-macro-count')
        $count.children('b').text(len)
        len > 128 ? $count.addClass('isError') : $count.removeClass('isError')
    }
    let bindCheckEvent = function () {
        //修改静态值
        $('.m-macro-code-content textarea').each(function (i, ele) {
            checkChars(this)
        })
        //监听修改
        $('.m-macro-code-content').off('change', 'textarea').on('change', 'textarea', function () {
            checkChars(this)
        })
    }
    bindCheckEvent()
    $('.m-macro-code .button-primary').on('click', function (e) {
        setTimeout(function () {
            bindCheckEvent()
        }, 500)
    })
}

//副本相关选项渲染
async function render_fb_selection() {

    const JX3FB = new JX3_FB();

    let $zlp = $('.m-fb-zlp .acf-input input')
    let zlp = ''
    let zlp_index = 0   //默认资料片

    async function render_zlp() {
        //渲染资料片列表
        await JX3FB.the_zlp_list('.m-fb-zlp');
        let $zlp_list = $('.c-jx3fb-zlp-list')
        //无值时,给第1个添加样式,同时赋值
        if (!$zlp.val()) {
            let $the_first = $zlp_list.children('li').eq(zlp_index)
            $the_first.addClass('active')
            zlp = $the_first.attr('data-zlp')
            $zlp.val(zlp)
            //有值时(编辑状态),给第n个添加样式
        } else {
            let zlp_list = await JX3FB.get_zlp_list()
            zlp = $zlp.val()
            zlp_index = zlp_list.indexOf(zlp)
            $zlp_list.children('li').eq(zlp_index).addClass('active')
        }
        //变更值时,给第n个添加样式,同时修改值
        $zlp_list.children('li').off('click').on('click', function () {
            zlp_index = $(this).index()
            $zlp_list.children('li').removeClass('active')
                .eq(zlp_index).addClass('active')
            zlp = $(this).attr('data-zlp')
            $zlp.val(zlp)
            $(document).trigger('zlpChange', zlp_index)
        })
    }

    await render_zlp()


    let $fb = $('.m-fb-name .acf-input input')
    let fb = ''
    let fb_index = 0    //默认副本

    async function render_fb() {

        //渲染副本列表
        await JX3FB.the_fb_list_with_icon('.m-fb-name');
        let $fb_list = $('.c-jx3fb-fb-list')
        let $active_fb_list = $fb_list.eq(zlp_index)
        $active_fb_list.addClass('on')
        //无值时,给第1个添加样式,同时赋值
        if (!$fb.val()) {
            let $the_first = $active_fb_list.children('li').eq(fb_index)
            $the_first.addClass('active')
            fb = $the_first.attr('data-fb')
            $fb.val(fb)
            //有值时(编辑状态),给第n个添加样式
        } else {
            fb = $fb.val()
            $active_fb_list.children('li').each(function (i, item) {
                if ($(this).attr('data-fb') == fb) {
                    console.log()
                    $(this).addClass('active')
                    fb_index = $(this).index()
                }
            })
        }

        //资料片变更时，显示区块变化
        $(document).on('zlpChange', function (e, zlp_index) {
            $fb_list.removeClass('on').eq(zlp_index).addClass('on')
        })
        //变更值时,给第n个添加样式,同时修改值（不区分区块）
        $fb_list.children('li').off('click').on('click', function () {
            fb_index = $(this).index()
            $fb_list.children('li').removeClass('active')
            $('.c-jx3fb-fb-list.on').children('li').eq(fb_index).addClass('active')
            fb = $(this).attr('data-fb')
            $fb.val(fb)
            let cid = $(this).attr('data-cid')
            $(document).trigger('fbChange', cid)
        })
    }

    await render_fb()

    //添加boss
    let $boss = $('.m-fb-boss .acf-input input')
    let boss = []

    async function render_boss() {

        //加载当前副本的boss
        let current_fb = $('.c-jx3fb-fb-list.on').children('.active').attr('data-cid')
        await JX3FB.the_boss_list('.m-fb-bossbox', current_fb)

        //如果当前boss有值
        if ($boss.val()) {
            boss = $boss.val().split(',')
            $('.c-jx3fb-boss-list.on li').each(function (i, ele) {
                if (boss.indexOf($(this).text()) >= 0) {
                    $(this).addClass('active')
                }
            })
        }

        //当切换副本时显示不同副本的boss
        $(document).on('fbChange', function (e, cid) {
            bindFbRelatedEvent(cid)
        })

        async function bindFbRelatedEvent(cid) {
            await JX3FB.the_boss_list('.m-fb-bossbox', cid);
            $('.c-jx3fb-boss-list').removeClass('on')
            $(`#fb-${cid}`).addClass('on')

            //清空boss值
            clearBossValue()
            //给新的boss项绑定事件
            bindBossCheckEvent()
        }

        //一旦资料片、副本切换时，boss值清空
        $(document).on('zlpChange', function (e, cid) {
            clearBossValue()
        })

        function clearBossValue() {
            $boss.val('')
            boss = []
            $('.c-jx3fb-boss-list li').removeClass('active')
        }

        //当切换boss选择时
        bindBossCheckEvent()

        function bindBossCheckEvent() {
            $('.c-jx3fb-boss-list li').off('click').on('click', function () {

                let val = $(this).text()
                let index = boss.indexOf(val)

                //如果是已经存在的值，则移除
                if (index >= 0) {
                    boss.splice(index, 1)
                    //如果是不存在的值，则加入
                } else {
                    boss.push(val)
                }

                $boss.val(boss.join(','))
                $(this).toggleClass('active')

                $(document).trigger('bossChange', boss)

            })
        }

    }

    render_boss()
}

//成就百科相关选项渲染
async function render_cj_selection() {
    // 加载成就类
    const JX3URL = new JX3_URL();
    const JX3CJ = new JX3_CJ();

    let $cj_field = $('#f-cj-id');
    if ($cj_field.length === 0) return false;

    $cj_field.before(`
        <div class="cj-save-remark" xmlns="http://www.w3.org/1999/html">
            <p style="color:#555555;font-size:16px;line-height:1.6;">各位大佬可通过评论当前成就最新攻略方式通知原贡献者进行更改与署名补充，也可以自行发布成就攻略。</p>
            <p style="opacity:0.5"><span style="font-weight:bold">注意：</span>在发布成就攻略的时候，请尽量确保攻略的真实有效性，避免一些推测、怀疑、未实测等不确定性因素存在，谢谢 (●'◡'●)</p>
        </div>
    `);

    $('#f-cj-remark').after(`
        <div class="cj-save-remark" style="background-color:#D6E9C6" xmlns="http://www.w3.org/1999/html">
            <p>如发现存在恶意覆盖成就攻略行为，管理员有权对您的攻略进行屏蔽或删除哦亲！(o゜▽゜)o☆</p>
        </div>
    `);

    // 隐藏标题栏
    $cj_field.siblings('div[data-name="_post_title"]').hide();
    $cj_field.append('<div class="c-cj-selector"></div>');
    // 成就信息
    $cj_field.find('.c-cj-selector').append(`
        <ul class="cjs">
            <achievement :fold="fold" :achievement="achievement"></achievement>
        </ul>
    `);

    let create_cj_post = new Vue({
        el: '#f-cj-id',
        data: {
            fold: true,
            achievement: {},
            user_id: $('.m-post').data('post_author'),
            newest_post: null,
            search_timeout: null
        },
        mounted: async function () {
            let that = this;

            let $cj_id = $('#f-cj-id');
            if ($cj_id.length === 0) return;

            // 获取成就ID
            let $cj_id_input = $cj_id.children('.acf-input').find('input');
            let cj_id = $cj_id_input.val();
            if (!cj_id) { // 如表单中不存在成就ID则到GET参数中取
                cj_id = JX3URL.getUrlParam('cj_id');
                if (cj_id !== false) $cj_id_input.val(cj_id);
            }

            if (!cj_id) {   // 没有成就ID则显示成就选择框
                $cj_id.find('.c-cj-selector').append(`
                    <div id="f-cj-selector">
                        <div class="acf-input show"> 
                            <div class="acf-input-wrap">
                                <div class="search-kw" placeholder="输入成就名称/成就描述/称号/奖励物品「回车」进行搜索" contenteditable ="true"></div>
                            </div>
                        </div>
                        <ul class="searchs"></ul>
                    </div>
                `);
            } else {    // 存在成就ID则对表单进行赋值
                that.achievement = await JX3CJ.get_achievement(cj_id);
            }

            // 成就搜索框事件注册
            $('#f-cj-selector .search-kw').on('input propertychange', function () {
                if (that.search_timeout) clearTimeout(that.search_timeout);
                that.search_timeout = setTimeout(function () {
                    that.output_search();
                }, 1000);
            }).keydown(function (event) {
                event.stopPropagation();    // 取消冒泡
                if (event.keyCode === 13) {
                    that.output_search();
                    return false;
                }
                // 输入关键词时清空搜索列表
                $('#f-cj-selector .searchs').html('').hide();
            });
        },
        methods: {
            output_search: async function () {
                let that = this;
                let search_text = $('#f-cj-selector .search-kw').text();
                if (!search_text) {
                    // 清空搜索列表
                    $('#f-cj-selector .searchs').html('').hide();
                    return false;
                }

                // 输出搜索结果Html
                let data = await JX3CJ.search_achievements(search_text, 1, 5);
                let achievements = data.achievements;

                let $search_list = $('#f-cj-selector .searchs');
                $search_list.html('');  // 清空搜索列表
                // 成就列表填充
                $.each(achievements, function (index, achievement) {
                    $search_list.append(`
                    <li class="search" index="${index}">
                        <img src="https://oss.jx3box.com/icon/${achievement.IconID}.png" alt="">
                        <span>${achievement.Name}</span>
                    </li>`);
                    $search_list.find('.search[index="' + index + '"]').data(achievement);
                });
                if (achievements.length === 0) $search_list.append(`<li class="no-data">没有找到有关成就哦亲（0.0!</li>`);
                $search_list.show();

                // 搜索框成就点击事件注册
                $('#f-cj-selector .search').click(function () {
                    that.achievement = $(this).data();

                    // 清空搜索框
                    $('#f-cj-selector .search-kw').text('');
                    setTimeout(function () {
                        // 点击完后清空搜索列表
                        $('#f-cj-selector .searchs').html('').hide();
                    });
                });
            }
        },
        watch: {
            achievement: {
                deep: true,
                handler: async function () {
                    let that = this;
                    if ($('.m-post-cj').length) {
                        /*let post = await JX3CJ.get_achievement_user_post(that.achievement.ID, that.user_id);
                        if (post) {
                            location.href = `/edit/?pid=${post.id}`;
                        } else {*/
                        let old_content = tinymce.activeEditor.getContent();
                        // 获取成就最新攻略
                        that.newest_post = await JX3CJ.get_achievement_post(that.achievement.ID);
                        if (that.newest_post) {
                            let t = setInterval(function () {
                                if (that.newest_post.content) {
                                    tinymce.activeEditor.setContent(that.newest_post.content);
                                    if (tinymce.activeEditor.getContent() !== old_content) {
                                        clearInterval(t);
                                        setTimeout(function () {
                                            tinymce.activeEditor.setContent(that.newest_post.content);
                                        }, 500);
                                    }
                                }
                            }, 100);
                        }
                        /*}*/
                    }

                    let $cj_id = $('#f-cj-id');
                    $cj_id.children('.acf-input').find('input').val(that.achievement.ID);
                    $cj_id.siblings('div[data-name="_post_title"]').find('.acf-input input').val(that.achievement.Name);
                    $cj_id.siblings('.m-cj-icon-id').find('.acf-input input').val(that.achievement.IconID);
                }
            }
        }
    });
}

//捏脸数据分析
function bind_face_analyze_event() {
    if (!$('#m-face-post-analyzer').length) return;

    $('#m-face-post-analyzer').on('click', function () {
        //1.取值
        let face_url = $('#m-post-face-file .file-wrap a').attr('href')

        //2.检测
        if (!face_url) {
            return
        }

        //3.请求接口
        let filepath = face_url.replace(JX3BOX.__ossRoot, '')
        new Promise((resolve, reject) => {
            $.ajax({
                url: JX3BOX.__node + 'faceurl/' + filepath,
                type: 'GET',
                success: function (data) {
                    resolve(data)
                },
                error: function (err) {
                    reject(err)
                }
            })
        }).then(function (data) {
            //自动填写标题+选择体型
            let role = data.data.misc[0]['desc']
            $('#acf-_post_title').val(role)
            $('.m-post-share-role input').val(role)

            //填写数据
            let result = JSON.stringify(data)
            $("#m-post-face-result").find('textarea').val(result)

        }).catch(function (err) {
            console.error(err)
        })
    })
}