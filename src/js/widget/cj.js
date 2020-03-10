const { JX3BOX } = require('@jx3box/jx3box-common');
import JX3_URL from '../module/url.js';
import JX3_WUPIN from './wupin.js';

const JX3URL = new JX3_URL();
const JX3WUPIN = new JX3_WUPIN();
var $ = jQuery;

class JX3_CJ {
    constructor() {
        this.menus_url = JX3BOX.__helperUrl + 'api/achievement/menus';
        this.list_url = JX3BOX.__helperUrl + 'api/achievements';
        this.view_url = JX3BOX.__helperUrl + 'api/achievement';
        this.search_url = JX3BOX.__helperUrl + 'api/achievement/search';
        this.total_count_url = JX3BOX.__helperUrl + 'api/achievements/count';
        this.users_ranking_url = JX3BOX.__helperUrl + 'api/achievement/users/ranking';
        this.newest_url = JX3BOX.__helperUrl + 'api/achievements/newest';
        this.posts_newest_url = JX3BOX.__helperUrl + 'api/achievement/posts/newest';
        this.out_print_url = JX3BOX.__helperUrl + 'api/achievements/out_print';
        this.waiting_url = JX3BOX.__helperUrl + 'api/achievements/waiting';
        this.comments_url = JX3BOX.__helperUrl + 'api/comments';

        // 定义成就模板
        Vue.component('achievement', {
            template: `#achievement-template`,
            props: ['achievement', 'fold', 'target', 'jump', 'toggle_load_url'],
            filters: {
                // 描述过滤
                description: function (value) {
                    let matchs = /text="(.*?)(\\\\\\n)?"/.exec(value);
                    if (matchs && matchs.length > 1) value = matchs[1].trim();
                    if (value) value = value.replace(/\\n/g, "<br>");
                    return value;
                }
            }
        });

        // 定义成就攻略评论模板
        Vue.component('cj-post-comments', {
            template: `#cj-post-comments-template`,
            props: ['comments']
        });
    }


    // 输出成就菜单
    get_menus(general) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: this.menus_url,
                type: 'GET',
                dataType: 'json',
                data: {general: general},
                success: function (data) {
                    resolve(data.data.menus)
                },
                error: function () {
                    console.error('接口连接异常')
                }
            })
        })
    }

    // 输出成就列表
    get_achievements(menu, submenu) {
        if (!menu) return [];
        let list_url = this.list_url + '/' + menu;
        if (submenu) list_url = list_url + '/' + submenu;
        return new Promise((resolve, reject) => {
            $.ajax({
                url: list_url,
                type: 'GET',
                dataType: 'json',
                success: function (data) {
                    resolve(data.data.achievements)
                },
                error: function () {
                    console.error('接口连接异常')
                }
            })
        })
    }

    // 输出指定成就
    get_achievement(achievement_id) {
        if (!achievement_id) return [];
        return new Promise((resolve, reject) => {
            $.ajax({
                url: this.view_url + '/' + achievement_id,
                type: 'GET',
                dataType: 'json',
                success: function (data) {
                    resolve(data.data.achievement)
                },
                error: function () {
                    console.error('接口连接异常')
                }
            })
        })
    }

    // 获取指定成就最新攻略
    get_achievement_post(achievement_id) {
        if (!achievement_id) return [];
        return new Promise((resolve, reject) => {
            $.ajax({
                url: this.view_url + '/' + achievement_id + '/post',
                type: 'GET',
                dataType: 'json',
                success: function (data) {
                    resolve(data.data.post)
                },
                error: function () {
                    console.error('接口连接异常')
                }
            })
        })
    }

    // 获取指定成就文章列表
    get_achievement_posts(achievement_id) {
        if (!achievement_id) return [];
        return new Promise((resolve, reject) => {
            $.ajax({
                url: this.view_url + '/' + achievement_id + '/posts',
                type: 'GET',
                dataType: 'json',
                success: function (data) {
                    resolve(data.data.posts)
                },
                error: function () {
                    console.error('接口连接异常')
                }
            })
        })
    }

    // 输出指定成就指定用户文章
    get_achievement_user_post(achievement_id, user_id) {
        if (!achievement_id || !user_id) return [];
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `${this.view_url}/${achievement_id}/${user_id}/post`,
                type: 'GET',
                dataType: 'json',
                success: function (data) {
                    resolve(data.data.post)
                },
                error: function () {
                    console.error('接口连接异常')
                }
            })
        })
    }

    // 获取成就搜索列表
    search_achievements(keyword, page, length) {
        if (!keyword) return [];
        let data = {keyword: keyword, page: page};
        if (typeof length !== 'undefined') data['limit'] = length;
        return new Promise((resolve, reject) => {
            $.ajax({
                url: this.search_url,
                type: 'GET',
                dataType: 'json',
                data: data,
                success: function (data) {
                    resolve(data.data)
                },
                error: function () {
                    console.error('接口连接异常')
                }
            })
        })
    }

    // 输出成就总数统计
    get_total_count() {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: this.total_count_url,
                type: 'GET',
                dataType: 'json',
                success: function (data) {
                    resolve(data.data.count)
                },
                error: function () {
                    console.error('接口连接异常')
                }
            })
        });
    }

    // 获取成就贡献排名列表
    get_achievement_users_ranking() {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: this.users_ranking_url,
                type: 'GET',
                dataType: 'json',
                success: function (data) {
                    resolve(data.data.ranking)
                },
                error: function () {
                    console.error('接口连接异常')
                }
            });
        });
    }

    // 获取最新成就攻略列表
    get_newest_achievement_posts() {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: this.posts_newest_url,
                type: 'GET',
                dataType: 'json',
                success: function (data) {
                    resolve(data.data.newest)
                },
                error: function () {
                    console.error('接口连接异常')
                }
            });
        });
    }

    // 获取绝版成就列表
    get_out_print_achievements(page) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: this.out_print_url,
                type: 'GET',
                dataType: 'json',
                data: {page: page},
                success: function (data) {
                    resolve(data.data)
                },
                error: function () {
                    console.error('接口连接异常')
                }
            });
        });
    }

    // 获取待攻略成就列表
    get_waiting_achievements(page) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: this.waiting_url,
                type: 'GET',
                dataType: 'json',
                data: {page: page},
                success: function (data) {
                    resolve(data.data)
                },
                error: function () {
                    console.error('接口连接异常')
                }
            });
        });
    }

    // 获取最新成就列表
    get_newest_achievements(page) {
        page = typeof page === 'undefined' ? 1 : page;
        return new Promise((resolve, reject) => {
            $.ajax({
                url: this.newest_url,
                type: 'GET',
                dataType: 'json',
                data: {page: page},
                success: function (data) {
                    resolve(data.data)
                },
                error: function () {
                    console.error('接口连接异常')
                }
            });
        });
    }

    // 获取帖子评论
    get_post_comments(post_id) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: this.comments_url + `?post_id=${post_id}`,
                type: 'GET',
                dataType: 'json',
                success: function (data) {
                    resolve(data.data.comments)
                },
                error: function () {
                    console.error('接口连接异常')
                }
            });
        });
    }
}

export default JX3_CJ;