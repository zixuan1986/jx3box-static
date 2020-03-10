class JX3_WUPIN {
    constructor() {
        // 定义成就模板
        Vue.component('jx3-item', {
            template: '#jx3-item-template',
            props: ['item'],
            filters: {
                // 描述过滤
                description: function (value) {
                    var matchs = /text="(.*?)(\\\\\\n)?"/.exec(value);
                    if (matchs && matchs.length > 1) value = matchs[1].trim();
                    if (value) value = value.replace(/\\n/g, "<br>");
                    return value;
                }
            }
        });

        // // 描述过滤
        // Vue.filter("jx3_item_description", function (value) {
        //     var matchs = /text="(.*?)(\\\\\\n)?"/.exec(value);
        //     if (matchs && matchs.length > 1) value = matchs[1].trim();
        //     if (value) value = value.replace(/\\n/g, "<br>");
        //     return value;
        // });
    }
}

export default JX3_WUPIN;