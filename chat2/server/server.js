'use strict';

require('dotenv').config();
const PORT = process.env.PORT;
const io = require('socket.io')(process.env.PORT || 3001);
const server = io.of('/server');

server.on('connection', (socket) =>{
  console.log('connected on: ', PORT, socket.id);
  socket.on('join', room =>{
    console.log('joined room: ', room);
    socket.join(room);
  });
  socket.on('message', messageFromClient =>{
    console.log('Received: ', messageFromClient);
  });
});