import restapi from './restapi';
var $ = jQuery;

class Fav{
    constructor(){

        //已登录用户会响应操作，否则无
        this.uid = parseInt($('#uid').val())
        if(this.uid){
            this.init()
        }
    }

    //初始化
    init(){

        //1.获取实例与id
        const __ins = this
        const pid = $('#w-fave-post-id').val()

        //2.获取用户当前收藏列表
        let favs = $('#w-fav-user-favs').val()
        favs = favs ? favs.split(',') : []

        //3.检测状态，是否添加active
        let status = this.check_status(favs,pid)

        //4.绑定事件
        $('.w-fav').on('click',function (){

            //等待期间禁止操作
            if($(this).hasClass('disabled')) return

            //如果已经收藏，点击则取消收藏
            if(status){
                __ins.rm(pid,favs)
                status = false

            //如果没有收藏，点击则添加收藏
            }else{
                __ins.add(pid,favs)
                status = true
            }
        })

    }

    //检查是否已收藏
    check_status(favs,pid){
        let status = favs.includes(pid)
        if(status){
            $('.w-fav').addClass('active')
            $('.w-fav .w-star-status').text('取消收藏')
        }
        return status
    }

    //添加收藏
    add(pid,favs){

        //更改favs
        favs.push(pid)

        //等待异步执行
        $('.w-fav').addClass('disabled')

        //更新用户meta
        restapi.update_user_meta({
            uid : this.uid ,
            key : 'favs',
            val : favs.toString(),
        }).then(function (data){
            //console.log('收藏成功',data)

            //收藏成功后
            $('.w-fav').addClass('active')
            $('.w-fav .w-star-status').text('取消收藏')
            $('.w-fav').removeClass('disabled')

        })

        //更改计数器
        let count = parseInt($('.w-fav .w-star-count').text())
        count = count + 1
        $('.w-fav .w-star-count').text(count)

        //更新作品meta
        restapi.update_post_meta({
            id : pid ,
            key : 'favs',
            val : count,      //减少请求以加快渲染，此处不查询，故数据并不准确，后期可扩展重写接口fix
        }).then(function (data){
            //console.log('收藏成功',data)
        })
    }
    rm(pid,favs){

        //更改favs
        let pos = favs.indexOf(pid)
        favs.splice(pos,1)

        //等待异步执行
        $('.w-fav').addClass('disabled')

        //更新用户meta
        restapi.update_user_meta({
            uid : this.uid ,
            key : 'favs',
            val : favs.toString(),
        }).then(function (data){
            //操作成功后
            $('.w-fav').removeClass('active')
            $('.w-fav .w-star-status').text('收藏')
            $('.w-fav').removeClass('disabled')
        })


        //更改计数器
        let count = parseInt($('.w-fav .w-star-count').text())
        count = count - 1
        $('.w-fav .w-star-count').text(count)

        //更新作品meta
        restapi.update_post_meta({
            id : pid ,
            key : 'favs',
            val : count,      //减少请求以加快渲染，此处不查询，故数据并不准确，后期可扩展重写接口fix
        }).then(function (data){
            //console.log('收藏成功',data)
        })


    }
    
}

export default Fav