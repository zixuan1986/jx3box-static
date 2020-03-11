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

gulp.task("js", function(done) {
    //独立处理lib文件，lib文件不再压缩，否则可能出现2次压缩问题
    gulp.src("./src/js/lib/**/*.js").pipe(gulp.dest("./dist/js/lib/"));
    webpack().run();

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

