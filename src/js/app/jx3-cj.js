import param from '../utils/param.js'
const {JX3BOX} = require('@jx3box/jx3box-common');

jQuery(function ($) {

    let cj_id = param('id')
    let post_url = 'https://www.jx3box.com/post/?pt=cj&cj_id=' + cj_id
    let view_url = 'https://www.jx3box.com/cj/#page=view&cj_id=' + cj_id

    //发布地址
    $('#m-cj-post').attr('href',post_url)
    $('.m-cj-url').text(view_url)

    $.ajax({
        url: 'https://helper.jx3box.com/api/achievement/' + cj_id + '/posts',
        type:'GET',
        success:function (data){
            var list = data.data.posts

            // 贡献人
            var authors = []
            var author_ids = []
            list.forEach(function (post){
                if (author_ids.indexOf(post.user_id) >= 0){

                } else {
                    authors.push(post.user_nickname)
                    author_ids.push(post.user_id)
                }
            })
            authors = authors.join('、')

            //无攻略
            if(!list.length){
                $('#m-cj-null').show()
                $('#m-cj-content').hide()
                $('#m-cj-msg').hide()
                return
            }

            //遍历
            //for(var i=0;i<list.length;i++){
            //var post = list[i]
                var post = list[0]
                var content = post.content.replace(/oss\.jx3box\.com/g,'console.cnyixun.com')   //优先使用赞助cdn
                //var avatar = post.user_avatar.replace(/oss\.jx3box\.com/g,'console.cnyixun.com')   //优先使用赞助cdn
                var single = `<div class="m-cj-single">`
                    + `<p class="m-cj-info">`
                    //+ `<a class="u-author" href="https://www.jx3box.com/author/` + post.user_id + `">`
                    //+ `<img class="u-avatar" src="` + avatar + `">`
                    + `<span class="u-name">贡献人：` + authors + `</span>`
                    //+ `</a>`
                    + `<span class="u-time">` + post.updated + `</span>`
                    + `<div class="m-cj-article">` + content + `</div>`
                    + `</div>`
                $('#m-cj-content').append(single)
    
                $('.u-cj-title').html(`
                        <i class="u-icon"></i>
                        <span class="title">${post.title}</span>
                    `);
    
                // 获取帖子评论
                $.ajax({
                    url: `https://helper.jx3box.com/api/comments?post_id=${post.id}`,
                    type: 'GET',
                    dataType: 'json',
                    success: function (data) {
                        post.comments = comments_filter(data.data.comments, 0);console.log(14124124,data.data.comments,post.comments);
                        if(post.comments.length){
                            $('#m-cj-comments').append(`
                                    <h4 class="title">
                                        <span>评论</span>
                                    </h4>
                                `).append(output_comments(post.comments));
                        } else {
                            $('#m-cj-comments').remove();
                        }
                    },
                    error: function () {
                        console.error('接口连接异常')
                    }
                });
            //}

            check_img_load()

            //统计
            $.ajax({
                url:'https://spider.jx3box.com/jx3stat/cj',
                type:'POST',
                data:{
                    cjid : cj_id,
                    pid : post.id,
                    title : post.title
                },
                success:function (data){
                    // console.log(data)
                },
                error:function (err){
                    // console.log(err)
                }
            })

        },
        //异常
        error:function (){
            $("#m-cj-error").show()
            $('#m-cj-content').hide()
            $('#m-cj-msg').hide()
        }
    })

});

//赞助cdn异常时使用默认cdn
var $ = jQuery;
function check_img_load(){
    $('.m-cj-content img').one('error',function (e){
        var img_url = $(this).attr('src')
        var fix_url = img_url.replace(/console\.cnyixun\.com/g,'oss.jx3box.com')
        $(this).attr('src',fix_url)
    })
}

function comments_filter(comments, parent) {
    var outputs = [];
    $.each(comments, function (index, item) {
        if (!item) return true;
        if (item.parent === parent) {
            // 置空当前元素
            comments[index] = null;
            // 递归执行
            var children = comments_filter(comments, item.id);
            item.children = children ? children : [];
            outputs.push(item);
        }
    });
    return outputs;
}

// 递归输出评论DOM
function output_comments(comments) {
    if (!comments.length) return '';
    var lis_str = '';
    for (var i = 0; i < comments.length; i++) {
        var comment = comments[i];
        var child_lis_str = comment.children.length ? output_comments(comment.children) : '';
        lis_str += `<li class="c-comment">
                        <div class="comment">
                            <div class="left">
                                <img class="avatar" src="${comment.user_avatar}" alt="">
                            </div>
                            <div class="right">
                                <span class="nickname">${comment.user_nickname}</span>
                                <p class="content">${comment.content}</p>
                            </div>
                        </div>
                        ${child_lis_str}
                    </li>
        `;
    }
    return `<ul class="comments">${lis_str}</ul>`;
}