const path = require("path");
const fs = require("fs");
const CONF = require('./kaci.config.js');

let files = {};
const JSpath = path.resolve(process.cwd(), "./src/js");
const JSignore = CONF.js.ignore;
getEntries(JSpath, JSignore);

module.exports = {
    mode: "production",
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
};

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