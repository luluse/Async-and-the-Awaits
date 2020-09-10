/* eslint-disable comma-dangle */
'use strict';

require('dotenv').config();
const http = require('http').createServer();
const io = require('socket.io')(http);
const User = require('../src/models/userSchema');
const Message = require('../src/models/messageSchema.js');

const userPool = {};

io.on('connection', (socket) => {
  socket.on('connected', (username) => {
    socket.emit('connected', username);
  });

  //*************************************************

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
      socket.emit('validated', false);
    } else {
      socket.username = userObj.username; // attaches username to socket from start
      // At this point, username is known all the time
      socket.emit('validated', userObj.username);
      // userPool[socket.username] - tries to FIND a key, and if it doesn't, ADDS one
      userPool[socket.username] = { username: socket.username, id: socket.id };
    }
  });

  // socket.on('chatRequest', request =>{
  //   let room1 = request.from+'_'+request.to;
  //   console.log('chatRequest');
  //   socket.join(room1);
  //   socket.emit('startChat', room1);
  // });

  socket.on('message', (messageFromClient) => {
    console.log('Received: ', messageFromClient);
    Message.create(messageFromClient); // passing in object with a key of messageFromClient and value of whatever it was
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
    const user = await User.find({ username: userProfile });
    socket.emit('profile', user);
  });

  socket.on('resumeChat', async (username) => {
    // needs to have username on it
    // Ideal payload: sender/recipient and/or room
    // Just need to get array of objects from server
    const messagesArr = await Message.find({}); // this will find ALL messages stored - whereas { sender: username } will get own messages ONLY
    // let messagesArr = [
    //   { message: 'Test message', sender: 'TestMan', room: 'lobby' },
    //   { message: 'Test message 2', sender: 'TestMan', room: 'lobby' },
    // ];

    socket.emit('resume-chat-done', {
      messages: messagesArr,
      username: username, // SOON: Require "ROOM" as well (will have to be an object)
    });
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
