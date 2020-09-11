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
      // every username in userpool will be equal to an OBJECT
      userPool[socket.username] = {
        username: socket.username,
        id: socket.id,
        favLanguage: validUser.favLanguage,
        description: validUser.description,
        os: validUser.os,
      };
    }
  });

  socket.on('message', (messageFromClient) => {
    console.log('Received: ', messageFromClient);
    Message.create(messageFromClient);
    socket.broadcast.emit('received', messageFromClient);
  });

  socket.on('disconnect', (socket) => {
    delete userPool[socket.username]; // knows disconnect happens and removes it from pool
    console.log('Client disconnected.');
  });

  /////////////////// MENU OPTION LISTENERS ////////////////////

  socket.on('discover', async () => {
    let onlineUsers = Object.values(userPool);
    socket.emit('discovered', onlineUsers);
  });

  socket.on('profile', async (userProfile) => {
    const user = await User.find({ username: userProfile }, { password: 0 });
    socket.emit('profile', user);
  });

  socket.on('private-message-sent', (privateMessageObj) => {
    const { targetUser, privateMessage } = privateMessageObj;

    if (userPool[targetUser]) {
      let privateMessageToSend = {
        from: socket.username,
        message: privateMessage,
      };

      socket
        .to(userPool[targetUser].id)
        .emit('private-message-received', privateMessageToSend);
    } else {
      socket.emit('private-message-failed');
    }
  });

  socket.on('resumeChat', async (username) => {
    const messagesArr = await Message.find({});
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
