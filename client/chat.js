'use strict';

require('dotenv').config();
const inquirer = require('inquirer');

const io = require('socket.io-client');
const { get } = require('http');
const serverChannel = io.connect('http://localhost:3001/server');

serverChannel.emit('join', 'I just joined!');

let username = '';

function sendMessage(text) {
  console.log('sending: ', text);

  let message = `[${username}]: ${text}`;
  serverChannel.emit('message', message);
}

async function getInput() {
  // inquirer grabs input from the CLI
  let input = await inquirer.prompt([{ name: 'text', message: ' ' }]);
  sendMessage(input.text);
  getInput();
}

async function getName() {
  console.clear();
  let input = await inquirer.prompt([
    { name: 'name', message: 'Please enter your name.' },
  ]);
  username = input.name;
}

getName();
getInput();
