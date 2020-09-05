'use strict';

require('dotenv').config();

const PORT = process.env.PORT;

const io = require('socket.io')(process.env.PORT || 3000);
const server = io.of('/server');

const messageQueue = {};

server.on('connection', socket => {
  console.log('Connected on: ', PORT, socket.id);

  socket.on('join', room => {
    console.log('Joined room: ', room);
    socket.join(room);
  });

  socket.on('message', messageFromClient => {
    console.log('Received: ', messageFromClient);
    server.emit('received', `Got this message: ${messageFromClient}`);
  });
});

// server.listen(PORT, () => console.log(`Server up on ${PORT}`));
