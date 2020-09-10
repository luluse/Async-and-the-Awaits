/* eslint-disable comma-dangle */
'use strict';

require('dotenv').config();
const inquirer = require('inquirer');
const io = require('socket.io-client');
const {
  login,
  createUser,
  loginOrCreate,
  validateMe,
  getInput,
  menu,
  discover,
  chat,
  profile,
  logout,
  resumeChat,
  sendMessage,
  serverChannel,
  ui,
} = require('./libs/event-handlers');

serverChannel.on('connect', () => {
  loginOrCreate();
});

serverChannel.on('validated', (username) => {
  validateMe(username);
});

serverChannel.on('connected', (username) => {
  menu(username);
});

serverChannel.on('received', (messageBackFromServer) => {
  ui.log.write(
    `[${messageBackFromServer.sender}]: ${messageBackFromServer.message}`
  );
});

/////////////////// MENU OPTION LISTENERS ////////////////////
serverChannel.on('discover', (userPoolArr) => {
  discover(userPoolArr);
});

serverChannel.on('profile', (userProfile) => {
  profile(userProfile);
});

serverChannel.on('resume-chat-done', (payload) => {
  // need an array from whatever emits 'resume-chat-done'
  resumeChat(payload);
});

// serverChannel.on('disconnect', () => {
//   serverChannel.emit('disconnect');
// });
