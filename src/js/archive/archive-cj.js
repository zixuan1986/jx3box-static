const { JX3BOX } = require('@jx3box/jx3box-common');
import JX3_URL from '../module/url.js'
import JX3_CJ from '../widget/cj.js'

const JX3URL = new JX3_URL();
const JX3CJ = new JX3_CJ();
var $ = jQuery;

jQuery(function ($) {
    var init = {
        fold: true,
        other_list: {},
        home: {
            total_count: {},
            users_ranking: [],
            newest: [],
            newest_posts: [],
        },
        list: {
            menu: '',
            submenu: '',
            achievements: [],
        },
        view: {
            cj_id: '',
            achievement: {},
            posts: [],
            current_post: {},
            current_post_comments: []
        },
        search: {
            keyword: '',
            achievements: []
        },
        other: {
            achievements: [],
            total: 0
        }
    };

    var app = new Vue({
        el: '#cj-module-container',
        data: $.extend(true, {
            old_scroll: 0,
            old_url: '',
            can_scroll: true,
            page: '',
            pagination: '',
            general: '',
            menus: []
        }, init),
        mounted: async function () {
            let that = this;
            that.load_url();
            setTimeout(function () {
                $('#cj-module-container').css('opacity', 1);
            });

            // 设置侧边栏高度
            $(window).resize(function () {
                that.handle_scroll();
            }).resize();

            // 固定顶部栏容器高度
            $('#m-cj-topbar-container').css({height: $('#m-cj-topbar').height()});
            window.addEventListener('scroll', this.handle_scroll)

            // Hash改变重新加载页面
            window.addEventListener('hashchange', function (e) {
                that.load_url();
            });
        },
        methods: {
            load_url: function () {
                let that = this;
                let page = JX3URL.getHashParam('page');
                if (page === 'search' || page === 'other') {
                    that.old_scroll = $(window).scrollTop();
                    that.old_url = location.href;
                }

                setTimeout(function () {
                    // 参数重置
                    $.each(init, function (key, value) {
                        if (key !== 'search' && key !== 'other') that[key] = $.extend(true, {}, value);
                    });

                    setTimeout(async function () {
                        // 页面类型
                        that.page = JX3URL.getHashParam('page');
                        if (!that.page) that.page = 'home';
                        // 页码
                        that.pagination = JX3URL.getHashParam('pagination');
                        if (!that.pagination) that.pagination = 1;
                        // 成就类型
                        let old_general = that.general;
                        that.general = JX3URL.getHashParam('general');
                        if (!that.general) {
                            that.general = 1;
                            let view_cj_id = JX3URL.getHashParam('cj_id');
                            if (that.page === 'view' && view_cj_id) {
                                // 获取成就信息
                                that.view.achievement = await JX3CJ.get_achievement(view_cj_id);
                                that.general = that.view.achievement.General;
                            }
                        }

                        // 获取菜单信息
                        if (old_general !== that.general) {
                            that.menus = [];
                            that.menus = await JX3CJ.get_menus(that.general);
                        }

                        switch (that.page) {
                            case 'home':
                                that.home.total_count = await JX3CJ.get_total_count();
                                that.home.newest = (await JX3CJ.get_newest_achievements()).achievements;
                                that.home.newest_posts = await JX3CJ.get_newest_achievement_posts();
                                that.home.users_ranking = await JX3CJ.get_achievement_users_ranking();
                                break;
                            case 'list':
                                that.list.menu = JX3URL.getHashParam('menu');
                                that.list.submenu = JX3URL.getHashParam('submenu');
                                // 获取成就列表
                                if (that.list.menu) {
                                    that.list.achievements = await JX3CJ.get_achievements(that.list.menu, that.list.submenu ? that.list.submenu : '');
                                } else {
                                    if (that.menus) {
                                        $.each(that.menus, function (key, menu) {
                                            // 无菜单信息时默认点击第一个主菜单
                                            location.href = '/cj/#page=list&general=' + that.general + '&menu=' + menu.id + (menu.own_achievements_count !== 0 ? '' : ('&submenu=' + menu.children[0].id));
                                            that.load_url();
                                            return false;
                                        });
                                    }
                                }
                                // 激活菜单
                                that.active_menu(that.list.menu, that.list.submenu);
                                break;
                            case 'view':
                                that.fold = false;
                                that.view.cj_id = JX3URL.getHashParam('cj_id');
                                if (that.view.cj_id) {
                                    if (!that.view.achievement || that.view.achievement.ID !== that.view.cj_id) {
                                        // 获取成就信息
                                        that.view.achievement = await JX3CJ.get_achievement(that.view.cj_id);
                                    }
                                    // 获取成就攻略列表
                                    that.view.posts = await JX3CJ.get_achievement_posts(that.view.cj_id);
                                    if (that.view.posts.length) {
                                        that.view.current_post = that.view.posts[0];
                                        // 获取文章评论
                                        that.view.current_post_comments = comments_filter(await JX3CJ.get_post_comments(that.view.current_post.id), 0);
                                    }
                                    // 激活菜单
                                    that.active_menu(that.view.achievement.Sub, that.view.achievement.Detail);
                                }
                                break;
                            case 'search':
                                that.search.keyword = JX3URL.getHashParam('keyword');
                                if (that.search.keyword) {
                                    // 获取成就搜索结果
                                    let data = await JX3CJ.search_achievements(that.search.keyword, that.pagination);
                                    that.search.achievements = data.achievements;
                                    that.search.total = data.total;
                                    // 恢复滚动条
                                    that.revert_scroll();
                                }
                                break;
                            case 'other':
                                that.general = -1;
                                that.menus = [
                                    {name: "newest", title: "最新成就", href: "/cj/#page=other&other_page=newest"},
                                    {name: "waiting", title: "待攻略成就", href: "/cj/#page=other&other_page=waiting"},
                                    {name: "out_print", title: "绝版成就", href: "/cj/#page=other&other_page=out_print"},
                                    {name: "designation", title: "称号收集", href: "javascript:void(0)", wait: true},
                                    {name: "reward", title: "成就奖励", href: "javascript:void(0)", wait: true}
                                ];

                                that.other_page = JX3URL.getHashParam('other_page');
                                if (!that.other_page) that.other_page = 'newest';

                                // 加载Other分页
                                let other_data = {};
                                console.log(4433, that.pagination);
                                switch (that.other_page) {
                                    case "newest":
                                        other_data = await JX3CJ.get_newest_achievements(that.pagination);
                                        break;
                                    case "waiting":
                                        other_data = await JX3CJ.get_waiting_achievements(that.pagination);
                                        break;
                                    case "out_print":
                                        other_data = await JX3CJ.get_out_print_achievements(that.pagination);
                                        break;
                                }
                                that.other.achievements = other_data.achievements;
                                that.other.total = other_data.total;

                                // 恢复滚动条
                                that.revert_scroll();
                                break;
                        }
                    });
                })
            },
            // 恢复滚动条
            revert_scroll: function () {
                let that = this;
                setTimeout(function () {
                    if (that.old_url === location.href && that.old_scroll) $(window).scrollTop(that.old_scroll);
                });
            },
            // 滚动触发事件
            handle_scroll: function () {
                // #m-cj-menus
                let $this = $('#m-cj-menus');
                let st = $(window).scrollTop();
                let wh = $(window).height();
                let ww = $(window).width();
                let top_offset = 20 + $('.c-header').outerHeight();
                let bottom_offset = 12;
                let h = wh - top_offset - bottom_offset;
                let ph = $this.parent().outerHeight();
                let pot = $this.parent().offset().top;
                if (pot - top_offset <= st && ph >= h && ww > 1024) {
                    let t = pot + ph - st - bottom_offset - h;
                    $this.css({
                        'position': 'fixed',
                        'top': st >= pot + ph - wh ? t : top_offset,
                        'height': h
                    });

                } else {
                    $this.css({
                        'position': '',
                        'top': '',
                        'height': ww > 1024 ? wh - $('.m-header').outerHeight() - top_offset - bottom_offset : ''
                    });
                }

                // #m-cj-topbar
                $this = $('#m-cj-topbar');
                pot = $this.parent().offset().top;
                $this.css({width: $this.parent().width()});
                if (pot - top_offset <= st && ww > 1024) {
                    $this.css({
                        'position': 'fixed',
                        'top': top_offset
                    }).addClass('active');
                } else {
                    $this.css({
                        'position': '',
                        'top': ''
                    }).removeClass('active');
                }
            },
            // 侧边栏样式 #m-cj-sidebar .u-category
            toggle_menu: function (event) {
                let that = this;
                let $this = $(event.currentTarget);
                let is_last_click = $this.hasClass('last-click');
                // 样式更变
                $('.u-category').removeClass('last-click');
                $('.u-list .u-item').removeClass('active');
                $this.parent().siblings('div').find('.u-category').removeClass('active');
                if ($this.data('show') === 'on') {
                    if (!is_last_click) {
                        // 获取成就列表
                        toggle_get_achievements();
                    } else {
                        $this.data('show', 'off').removeClass('active').find('.u-switch').removeClass('on');
                        $this.next('.u-list').slideToggle();
                    }
                } else {
                    $this.data('show', 'on').addClass('active').find('.u-switch').addClass('on');
                    $this.next('.u-list').slideToggle();
                    // 获取成就列表
                    toggle_get_achievements();
                }
                $this.addClass('last-click');

                // 获取成就列表
                function toggle_get_achievements() {
                    if (!$this.data('own-count')) $this.next('.u-list').find('.u-item').eq(0).click();
                    that.load_url();
                }
            },
            // 点击子菜单 #m-cj-sidebar .u-item
            toggle_submenu: function (event) {
                let $this = $(event.currentTarget);
                $('.u-list .u-item').removeClass('active');
                $this.addClass('active');
                this.load_url();
            },
            toggle_load_url: function () {
                //this.load_url();
            },
            // 返回按钮
            return_btn: function (event) {
                event.stopPropagation();    // 取消冒泡
                let that = this;
                //if (that.view.achievement) {
                //    let url = '/cj/#page=list&menu=' + that.view.achievement.Sub;
                //    if (that.view.achievement.Detail) url += '&submenu=' + that.view.achievement.Detail;
                //    location.href = url;
                //    that.load_url();
                //} else {
                history.back();
                that.load_url();
                //}
                return false;
            },
            // 激活菜单
            active_menu: function (Sub, Detail) {
                if (Sub) {
                    $('#m-cj-sidebar .u-category[data-menu=' + Sub + ']').addClass('active').data('show', 'on');
                    $('#m-cj-sidebar .u-list[data-menu=' + Sub + ']').addClass('on');
                }
                if (Detail) {
                    $('#m-cj-sidebar .u-list[data-menu=' + Sub + '] .u-item[data-submenu=' + Detail + ']').addClass('active')
                }
            },
            search_enter: function (event) {
                event.stopPropagation();    // 取消冒泡
                if (!this.search.keyword) return false;
                location.href = '/cj/#page=search&keyword=' + this.search.keyword;
                this.load_url();
                return false;
            },
            other_page_change: async function (page) {
                // 加载Other分页
                location.href = `/cj/#page=other&other_page=${this.other_page}&pagination=${page}`;
            },
            search_page_change: async function (page) {
                location.href = `/cj/#page=search&keyword=${this.search.keyword}&pagination=${page}`;
            }
        }
    });

    function comments_filter(comments, parent) {
        let outputs = [];
        $.each(comments, function (index, item) {
            if (!item) return true;
            if (item.parent === parent) {
                // 置空当前元素
                comments[index] = null;
                // 递归执行
                let children = comments_filter(comments, item.id);
                item.children = children ? children : [];
                outputs.push(item);
            }
        });
        return outputs;
    }
});
