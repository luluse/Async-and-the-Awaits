/* eslint-disable comma-dangle */
'use strict';

require('dotenv').config();
const http = require('http').createServer();
const io = require('socket.io')(http);
const User = require('../basicSchema');

// const ioServer = io.of('/server');

io.on('connection', (socket) => {
  console.log('Client connected on: ', socket.id);

  socket.on('signup', async (userObj) => {
    const user = await User.create(userObj);
    console.log(user, ' Has Been Saved!');
  });

  socket.on('signin', async (userObj) => {
    const validUser = await User.authenticateBasic(
      userObj.username,
      userObj.password
    );
    console.log('result from authenticate basic', validUser);
    if (!validUser) {
      console.log('inside of valid user');
      io.emit('validated', false);
    } else io.emit('validated', true);
  });

  socket.on('message', (messageFromClient) => {
    console.log('Received: ', messageFromClient);
    io.emit('received', messageFromClient);
  });

  socket.on('disconnect', () => console.log('Client disconnected.'));
});

module.exports = {
  server: http,
  start: (PORT) => {
    http.listen(PORT, () => {
      console.log(`Listening on ${PORT}`);
    });
  },
};
