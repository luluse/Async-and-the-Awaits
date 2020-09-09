/* eslint-disable comma-dangle */
'use strict';

require('dotenv').config();
const inquirer = require('inquirer');
const io = require('socket.io-client');

const serverChannel = io.connect(
  'https://command-love-interface.herokuapp.com'
);
// const serverChannel = io.connect('http://localhost:3001');

module.exports = {
  serverChannel,
};
