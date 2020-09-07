'use strict';

require('dotenv').config();
const express = require('express');
const socketIO = require('socket.io');

const PORT = process.env.PORT || 3001;
// const INDEX = '../client/chat.js';

const server = express()
  // .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server);
// const ioServer = io.of('/server');

io.on('connection', socket => {
  console.log('Client connected on: ', socket.id);

  socket.on('join', room => {
    console.log('Joined room: ', room);
    socket.join(room);
  });

  socket.on('message', messageFromClient => {
    console.log('Received: ', messageFromClient);
    io.emit('received', messageFromClient);
  });

  socket.on('disconnect', () => console.log('Client disconnected.'));
});
