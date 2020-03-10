import JX3_CJ from "../widget/cj";

jQuery(function ($) {
    render_cj();

    // 成就渲染
    async function render_cj() {
        // 加载成就类
        const JX3CJ = new JX3_CJ();

        let single_cj = new Vue({
            el: '#single-cjs',
            data: {
                fold: false,
                achievement: {},
            }
        });

        single_cj.achievement = await JX3CJ.get_achievement(cj_id);
    }

    //转载提醒
    let author = $('.m-single-header-meta .u-author .u-name').text();
    if(author == '天字工具人'){
        $('.m-cj-robot-tips').show()
    }

});