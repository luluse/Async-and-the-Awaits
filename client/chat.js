#!/usr/bin/env node
'use strict';

require('dotenv').config();
const inquirer = require('inquirer');
const io = require('socket.io-client');
const chalk = require('chalk');
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
  ui.log.write('', serverChannel.id); // DANGER: Without this, we get double logs
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

serverChannel.on('private-message-received', (privateMessageObj) => {
  ui.log.write(
    chalk.green(
      `New private message from: [${privateMessageObj.from}]: ${privateMessageObj.message}`
    )
  );
});

serverChannel.on('private-message-failed', () => {
  ui.log.write('Private message failed to send.');
});

/////////////////// MENU OPTION LISTENERS ////////////////////
serverChannel.on('discovered', (onlineUsers) => {
  discover(onlineUsers);
});

serverChannel.on('profile', (userProfile) => {
  profile(userProfile);
});

serverChannel.on('resume-chat-done', (payload) => {
  resumeChat(payload);
});
