import restapi from '../widget/restapi';

jQuery(function($){

    $('.u-rmfav').tooltip();

    //用户的列表
    const uid = $('#uid').val()
    let favs = $('#user-favs').val()
    favs = favs ? favs.split(',') : []

    $('.m-dashboard-list').on('click','.u-rmfav',function (){

        //取消的作品id
        let pid = $(this).attr('data-pid')
        
        //更改favs
        let pos = favs.indexOf(pid)
        favs.splice(pos,1)

        //更新用户meta
        restapi.update_user_meta({
            uid : uid ,
            key : 'favs',
            val : favs.toString(),
        }).then(function (data){
            location.reload();
        })

    })
});