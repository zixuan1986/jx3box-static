import param from '../utils/param.js'

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