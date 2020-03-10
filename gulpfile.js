//base modules
const path = require("path");
const fs = require("fs");

//gulp modules
const gulp = require("gulp");
const cache = require("gulp-cached");
const remember = require("gulp-remember");
const plumber = require("gulp-plumber");
const watch = require("gulp-watch");

//config settings
//----------------------------------
const CONF = require("./kaci.config.js");

//style task
//----------------------------------
const less = require("gulp-less");
const autoprefixer = require("gulp-autoprefixer");
const cleancss = require("gulp-clean-css");

gulp.task("css", function(done) {
    gulp.src("./src/css/**/*.less",{ignore : CONF.css.ignore})
        .pipe(plumber())
        .pipe(less())
        .pipe(cache("less"))
        .pipe(autoprefixer())
        .pipe(cleancss(CONF.css.clean))
        .pipe(remember("less"))
        .pipe(gulp.dest("./dist/css/"));

    gulp.src("./src/css/**/*.css")
        .pipe(plumber())
        .pipe(cache("css"))
        .pipe(autoprefixer())
        .pipe(cleancss(CONF.css.clean))
        .pipe(remember("css"))
        .pipe(gulp.dest("./dist/css/"));

    done();
});

//javascript task
//----------------------------------
const webpack = require("webpack");
const MinifyPlugin = require("babel-minify-webpack-plugin");
let files = {};
const JSpath = path.resolve(process.cwd(), "./src/js");
const JSignore = CONF.js.ignore;
getEntries(JSpath, JSignore);
const webpackConfig = {
    entry: files,
    output: {
        filename: "[name]",
        path: path.resolve(__dirname, CONF.path.build, "js")
    },
    mode: "production",
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: "babel-loader"
                }
            }
        ]
    },
    externals: {
        jquery: "jQuery"
    },
    plugins: [new MinifyPlugin()]
};

gulp.task("js", function(done) {
    //独立处理lib文件，lib文件不再压缩，否则可能出现2次压缩问题
    gulp.src("./src/js/lib/**/*.js").pipe(gulp.dest("./dist/js/lib/"));
    webpack(webpackConfig).run();

    done();
});

//build task
//----------------------------------
const del = require("del");
gulp.task("clean", function(done) {
    del.sync(CONF.path.build + "/**");
    done();
});
gulp.task("build", gulp.series("clean", gulp.parallel("css", "js")));

//server task
//----------------------------------
const browserSync = require("browser-sync").create();

gulp.task("server", function(done) {
    //添加本地服务
    let server_config = {
        notify: false,
        open: CONF.server.open,
        server: {
            baseDir: CONF.path.local,
            directory: true
        },
        port: CONF.server.port
    };
    browserSync.init(server_config);
    done();
});

gulp.task("reload", function(done) {
    browserSync.reload();
    done();
});

gulp.task("update", function(done) {
    watch(["./src/**/*"], function() {
        gulp.parallel("css", "js")();
        if (CONF.server.reload) gulp.series("reload")();
    });

    done();
});

gulp.task("start", gulp.series(gulp.parallel("css", "js"), "server", "update"));

gulp.task("default", gulp.parallel("css", "js"));
// 获取多页面的每个入口文件，用于配置中的entry
function getEntries(filePath, ignorePath) {
    //根据文件路径读取文件，返回文件列表
    let rootFiles = fs.readdirSync(filePath);
    //排除ignore
    let targetFiles = [];
    rootFiles.forEach(function(filename) {
        if (!ignorePath.includes(filename)) {
            targetFiles.push(filename);
        }
    });
    //遍历读取到的文件列表
    targetFiles.forEach(function(filename) {
        //获取当前文件的绝对路径
        let filedir = path.join(filePath, filename);
        //根据文件路径获取文件信息，返回一个fs.Stats对象
        let fileStat = fs.statSync(filedir);
        //判断文件状态
        let isFile = fileStat.isFile(); //是文件
        let isDir = fileStat.isDirectory(); //是文件夹
        //如果是文件
        if (isFile) {
            files[filename] = filedir;
        }
        //如果是文件夹
        if (isDir) {
            getEntries(filedir, ignorePath); //递归，如果是文件夹，就继续遍历该文件夹下面的文件
        }
    });
}
