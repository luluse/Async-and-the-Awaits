'use strict';

require('dotenv').config();
const PORT = process.env.PORT;

const io = require('socket.io')(3000); // what about (process.env.PORT || 3000)? Can it be same PORT for Socket.io/Express?
const server = io.of('/server');

const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
  console.log(`Listening on Express Server on ${PORT}`);
});

const messageQueue = {};

// Express server needs to be listening before anything below this happens

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

// Make an express server
// LISTEN on express server (app.listen) - needs to be BEFORE the io/server.on
// AFTER that, do server.on in the code with socket.io
