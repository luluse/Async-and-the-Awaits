'use strict';
require('dotenv').config();

const PORT = process.env.PORT || 3001;

const io = require('socket.io')(process.env.PORT || 3001);
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
  });
});
