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
  sendMessage,
  serverChannel,
  ui,
} = require('./libs/event-handlers');

serverChannel.on('connect', () => {
  ui.log.write('Im here!', serverChannel.id);
  loginOrCreate();
});

serverChannel.on('validated', validateMe);

serverChannel.on('connected', (username) => {
  menu(username);
});

serverChannel.on('received', (messageBackFromServer) => {
  ui.log.write(messageBackFromServer);
});

serverChannel.on('disconnect', () => {
  serverChannel.emit('disconnect');
});
