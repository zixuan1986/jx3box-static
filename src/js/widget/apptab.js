var $ = jQuery
function Apptab(hashmap){
    let hash = location.hash.slice(1)
    $('.nav-tabs li').eq(hashmap[hash]).addClass('active').siblings('li').removeClass('active')
    $('.nav-content').eq(hashmap[hash]).addClass('active').siblings('.nav-content').removeClass('active')
}
export default Apptab