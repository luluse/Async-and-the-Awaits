'use strict';

require('dotenv').config();
const http = require('http'); // Built-in Node feature
const express = require('express');
const socketIO = require('socket.io');
const authRouter = require('../auth/router');
const notFound = require('../auth/middleware/404');
const errorHandler = require('../auth/middleware/500');
const User = require('../models/users-model');

const PORT = process.env.PORT || 3001;
// const INDEX = '../client/chat.js';

// Initializes express server
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// .listen(PORT, () => console.log(`Listening on ${PORT}`));
const server = http.createServer(app);

// Routes
app.use(authRouter);

// You are trying to attach socket.io to an express request handler function. Please pass a http.Server instance.
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

  socket.on('disconnect', () => {
    console.log('Client disconnected.');
  });
});

// app.use('*', notFound);
// app.use(errorHandler);

module.exports = {
  server: app,
  start: port => {
    app.listen(PORT, () => {
      console.log(`Listening on ${PORT}`);
    });
  },
};
