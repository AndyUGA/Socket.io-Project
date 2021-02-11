const path = require('path');
const express = require('express');
const http = require('http');
const socketio = require('socket.io')

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//set static folder
app.use(express.static(path.join(__dirname, 'public')))

let totalAmount = 3000;

io.on('connection', socket => {

    //Emits to a new client
    socket.emit('message', `The total amount is ${totalAmount}`);

    //Emits to all existing clients besdies current client
    socket.broadcast.emit('message', 'A user has joined the chat');

    //Emits to all existing clients and current client
    socket.on('disconnect', () => {
        io.emit('message', 'A user has left the chat');
    })

    socket.on('chatMessage', (msg) => {

        totalAmount -= msg;
        console.log(`Total amount is ${totalAmount}`);
    });

});  



const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 