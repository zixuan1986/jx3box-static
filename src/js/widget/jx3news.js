const { JX3BOX } = require("@jx3box/jx3box-common");
const axios = require("axios");
const _ = require("lodash");
const jx3URI = "https://jx3.xoyo.com";

//const url = 'http://localhost:3000/jx3news'
const url = JX3BOX.__spider + "jx3news";

function get_jx3_news(count, callback) {
    axios.get(url).then(function(res) {
        let data = res.data.slice(0, count);

        //相对地址处理
        _.each(data, function(item) {
            if (!item.url.includes("http")) {
                item.url = jx3URI + item.url;
            }
        });

        callback && callback(data);
    });
}

export default get_jx3_news;
