const io = require('const.io-client');
const socket = io('http://localhost:3000');

socket.on('connection', ()=>{
    console.log('socket.io is connected');
})

module.exports = socket;