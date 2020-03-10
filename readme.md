# 前端
即将分离，临时大杂烩  

## 环境
@启动：`npm run serve`  
@构建：`npm run build`  
@部署：阿里云OSS  
@域名：https://static.jx3box.com/css|js    
@本地HOST：绑定 **dist** 目录为static.jx3box.com

## 说明
推送后自动构建至oss

## 注意
本地环境需配置允许跨域
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