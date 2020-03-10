const { JX3BOX } = require('@jx3box/jx3box-common');

const default_rest = JX3BOX.__restRoot + 'wp/v2/'
const postmeta_rest = JX3BOX.__restRoot + 'api/postmeta/'
const usermeta_rest = JX3BOX.__restRoot + 'api/usermeta/'
const acfmeta_rest = JX3BOX.__restRoot + 'api/acfmeta/'

const $ = jQuery
const restapi = {

    //默认rest api接口，修改常驻字段
    //{pt,pid,data,callback}
    //https://developer.wordpress.org/rest-api/reference/
    updatePost : function (opt){
        //rest api 处理请求
        $.ajax( {
            url: default_rest + opt.pt + '/' + opt.pid,
            method: 'POST',
            beforeSend: function ( xhr ) {
                xhr.setRequestHeader( 'X-WP-Nonce', wpApiSettings.nonce );
            },
            data:opt.data
        } ).done( function ( response ) {
            //console.log( response );
            opt.callback && opt.callback(response)
        } );
    },

    //post meta操作
    getPostMeta : function (opt){
        $.ajax( {
            url: postmeta_rest,
            method: 'GET',
            beforeSend: function ( xhr ) {
                xhr.setRequestHeader( 'X-WP-Nonce', wpApiSettings.nonce );
            },
            data:opt.data
        } ).done( function ( response ) {
            opt.callback && opt.callback(response)
        } );
    },
    get_acf_meta : function (data){
        return new Promise((resolve,reject)=>{
            $.ajax({
                url:acfmeta_rest,
                type:'GET',
                beforeSend: function ( xhr ) {
                    xhr.setRequestHeader( 'X-WP-Nonce', wpApiSettings.nonce );
                },
                data:data,
                success:function (response){
                    resolve(response)
                },
                error:function (err){
                    reject(err)
                }
            })
        })
    },
    updatePostMeta : function (opt){
        $.ajax( {
            url: postmeta_rest,
            method: 'POST',
            beforeSend: function ( xhr ) {
                xhr.setRequestHeader( 'X-WP-Nonce', wpApiSettings.nonce );
            },
            data:opt.data
        } ).done( function ( response ) {
            opt.callback && opt.callback(response)
        } );
    },
    update_post_meta : function (data){
        return new Promise((resolve,reject)=>{
            $.ajax({
                url:postmeta_rest,
                type:'POST',
                beforeSend: function ( xhr ) {
                    xhr.setRequestHeader( 'X-WP-Nonce', wpApiSettings.nonce );
                },
                data:data,
                success:function (response){
                    resolve(response)
                },
                error:function (err){
                    reject(err)
                }
            })
        })
    },
    
    //user meta操作
    getUserMeta : function (opt){
        $.ajax( {
            url: usermeta_rest,
            method: 'GET',
            beforeSend: function ( xhr ) {
                xhr.setRequestHeader( 'X-WP-Nonce', wpApiSettings.nonce );
            },
            data:opt.data
        } ).done( function ( response ) {
            //console.log( response );
            opt.callback && opt.callback(response)
        } );
    },
    get_user_meta : function (data){
        return new Promise((resolve,reject)=>{
            $.ajax({
                url:usermeta_rest,
                type:'GET',
                beforeSend: function ( xhr ) {
                    xhr.setRequestHeader( 'X-WP-Nonce', wpApiSettings.nonce );
                },
                data:data,
                success:function (response){
                    resolve(response)
                },
                error:function (err){
                    reject(err)
                }
            })
        })
    },
    updateUserMeta : function (opt){
        $.ajax( {
            url: usermeta_rest,
            method: 'POST',
            beforeSend: function ( xhr ) {
                xhr.setRequestHeader( 'X-WP-Nonce', wpApiSettings.nonce );
            },
            data:opt.data
        } ).done( function ( response ) {
            //console.log( response );
            opt.callback && opt.callback(response)
        } );
    },
    update_user_meta : function (data){
        return new Promise((resolve,reject)=>{
            $.ajax({
                url:usermeta_rest,
                type:'POST',
                beforeSend: function ( xhr ) {
                    xhr.setRequestHeader( 'X-WP-Nonce', wpApiSettings.nonce );
                },
                data:data,
                success:function (response){
                    resolve(response)
                },
                error:function (err){
                    reject(err)
                }
            })
        })
    }


}






export default restapi