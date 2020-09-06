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
  // This connection does not appear to be triggering even locally at this time - nothing logged
  console.log('Connected on: ', PORT, socket.id);

  socket.on('join', room => {
    console.log('Joined room: ', room);
    socket.join(room);
  });

  // something like:
  // response = await function call of getInput or something similar
  // Once you get their response, THEN do something like 'io.emit' - like, we recevied the message, and then we EMIT it to the socket
  // Send RESPONSE back with the 'received' emit

  // This code block is essentially for testing - the intention here is to log a message as "received" in the server (which should show up in Heroku logs) and THEN bounce that message BACK to the sender, as well (to see that it's actually been received by the server, at least)
  socket.on('message', messageFromClient => {
    console.log('Received: ', messageFromClient);
    io.emit('received', messageFromClient);
  });
});

app.listen(PORT, () => {
  console.log(`Listening on Express Server on ${PORT}`);
});
