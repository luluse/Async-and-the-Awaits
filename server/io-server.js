/* eslint-disable comma-dangle */
'use strict';

require('dotenv').config();
const http = require('http').createServer();
const io = require('socket.io')(http);
const User = require('../src/models/userSchema');
const Message = require('../src/models/messageSchema.js');

// const ioServer = io.of('/server');

const userPool = {};

io.on('connection', (socket) => {
  socket.on('connected', (username) => {
    socket.emit('connected', username);
  });

  //*************************************************

  console.log('i am into connection');
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

    if (!validUser) {
      console.log('inside of valid user');
      socket.emit('validated', false);
    } else {
      socket.username = userObj.username; // attaches username to socket from start
      // At this point, username is known all the time
      socket.emit('validated', userObj.username);
      // userPool[socket.username] - tries to FIND a key, and if it doesn't, ADDS one
      userPool[socket.username] = { username: socket.username, id: socket.id };
      console.log(userPool);
    }
  });

  // socket.on('chatRequest', request =>{
  //   let room1 = request.from+'_'+request.to;
  //   console.log('chatRequest');
  //   socket.join(room1);
  //   socket.emit('startChat', room1);
  // });

  // Try saving message here
  socket.on('message', (messageFromClient) => {
    console.log('Received: ', messageFromClient);
    io.emit('received', messageFromClient);
  });

  socket.on('disconnect', (socket) => {
    delete userPool[socket.username]; // knows disconnect happens and removes it from pool
    console.log('USER POOL: ', userPool);
    console.log('Client disconnected.');
  });

  /////////////////// MENU OPTION LISTENERS ////////////////////
  socket.on('discover', () => {
    let onlineUsers = Object.keys(userPool);
    socket.emit('discover', onlineUsers);
  });

  socket.on('profile', async (userProfile) => {
    console.log('USER PROF:', userProfile);
    const user = await User.find({ username: userProfile });
    console.log('my user from DB?:', user);
    socket.emit('profile', user);
  });

  socket.on('error', (error) => {
    socket.emit('error', error);
  });
});

module.exports = {
  server: http,
  start: (PORT) => {
    http.listen(PORT, () => {
      console.log(`Listening on ${PORT}`);
    });
  },
};
