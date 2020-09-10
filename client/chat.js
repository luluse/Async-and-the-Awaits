/* eslint-disable comma-dangle */
'use strict';

require('dotenv').config();
const inquirer = require('inquirer');
const io = require('socket.io-client');
const {
  login,
  createUser,
  loginOrCreate,
  getInput,
  sendMessage,
} = require('./libs/event-handlers');

// const serverChannel = io.connect(
//   'https://command-love-interface.herokuapp.com'
// );
const serverChannel = io.connect('http://localhost:3001');

// serverChannel.emit('join', 'I just joined!');

// Server should send the message back to the sender as confirmation (for testing purposes only until we get it working)
serverChannel.on('received', (messageBackFromServer) => {
  console.log(messageBackFromServer);
});

serverChannel.on('disconnect', () => {
  serverChannel.emit('disconnect');
});

loginOrCreate();
