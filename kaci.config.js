module.exports = {
    //本地服务配置
    server: {
        port: 1024, //端口
        reload: false, //是否自动刷新
        open: false //是否自动打开
    },

    path: {
        local: "./localserver/",
        build: "./dist/"
    },

    css: {
        ignore: [
            "./src/css/module/**/*.less",
            "./src/css/include/**/*.less",
            "./src/css/widget/**/*.less",
            "./src/css/plugin/**/*.less"
        ], //忽略被编译（子模块）
        clean: {
            compatibility: "ie8"
        }
    },

    js: {
        ignore: ["lib", "module", "include", "widget", "utils"] //忽略被编译（子模块）
    }
};
