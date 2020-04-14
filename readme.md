# Static 

## 构建
@启动：`npm run serve`   
@构建：`npm run build`   

## 存档
@部署 : github master  
@备份 : //OSS/jx3box/static/wp_static/  (push后自动推送)

## 访问
@源站 : https://static.jx3box.com/dist/   
@加速 : https://cdn.jsdelivr.net/gh/iRuxu/jx3box-static@$commit/dist/

## 测试
+ https://static.jx3box.com/dist/js/index.js
+ https://cdn.jsdelivr.net/gh/iRuxu/jx3box-static@4121ae8/dist/js/index.js

## 本地开发环境
1.本地HOST：绑定 **dist** 目录为static.jx3box.com  
2.指定CONFIG文件中`STATIC_ENV`
+ 本地指定为`DEV`
+ 线上指定为`PROD`

3.本地环境需配置允许跨域
```
location / {  
    add_header Access-Control-Allow-Origin *;
    add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS';
    add_header Access-Control-Allow-Headers 'DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization';

    if ($request_method = 'OPTIONS') {
        return 204;
    }
} 
```
