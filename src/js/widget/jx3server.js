const {JX3BOX} = require('@jx3box/jx3box-common');
const axios = require('axios');
//const url = 'http://localhost:3000/jx3servers'
const url = JX3BOX.__spider + 'jx3servers'

function get_server_status(callback){
    axios.get(url).then(function (res){
        let data = res.data.data
        callback && callback(data)
    })
}

export default get_server_status