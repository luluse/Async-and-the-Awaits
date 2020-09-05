'use strict';

require('dotenv').config();

const PORT = process.env.PORT;

const io = require('socket.io')(process.env.PORT || 3000);
const server = io.of('/server');

console.log('Is this thing on?');

const messageQueue = {};

server.on('connection', socket => {
  console.log('Connected on: ', PORT, socket.id);

  socket.on('join', room => {
    console.log('Joined room: ', room);
    socket.join(room);
  });

  socket.on('message', messageFromClient => {
    console.log('Received: ', messageFromClient);
    server.emit('received', messageFromClient);
  });
});

// io.listen(PORT, () => {
//   console.log(`Listening on ${PORT}`);
// });

// server.listen(PORT, () => console.log(`Server up on ${PORT}`));
