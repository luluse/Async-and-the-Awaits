'use strict';

const http = require('http'); // Built-in Node feature
require('dotenv').config();
const PORT = process.env.PORT;

// const server = io.of('/server');

const express = require('express');
const app = express();
const server = http.createServer(app);
const io = require('socket.io').listen(server); // what about (process.env.PORT || 3000)? Can it be same PORT for Socket.io/Express?
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const messageQueue = {};

io.on('connection', socket => {
  console.log('Connected on: ', PORT, socket.id);

  socket.on('join', room => {
    console.log('Joined room: ', room);
    socket.join(room);
  });

  socket.on('message', messageFromClient => {
    console.log('Received: ', messageFromClient);
    io.emit('received', messageFromClient);
  });
});

app.listen(PORT, () => {
  console.log(`Listening on Express Server on ${PORT}`);
});
