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
  sendMessage,
  serverChannel,
  ui,
} = require('./libs/event-handlers');

serverChannel.on('connect', () => {
  ui.log.write('', serverChannel.id);
  loginOrCreate();
});

serverChannel.on('validated', (username) => {
  validateMe(username);
});

serverChannel.on('connected', (username) => {
  menu(username);
});

serverChannel.on('received', (messageBackFromServer) => {
  ui.log.write(messageBackFromServer);
});

/////////////////// MENU OPTION LISTENERS ////////////////////
serverChannel.on('discover', (userPoolArr) => {
  discover(userPoolArr);
});

serverChannel.on('profile', (userProfile) => {
  profile(userProfile);
});

serverChannel.on('disconnect', () => {
  serverChannel.emit('disconnect');
});
