/* eslint-disable comma-dangle */
'use strict';

require('dotenv').config();
const inquirer = require('inquirer');

const io = require('socket.io-client');
// const serverChannel = io.connect('http://localhost:3001');
const serverChannel = io.connect(
  'https://command-love-interface.herokuapp.com/server'
);

serverChannel.emit('join', 'I just joined!');

// Server should send the message back to the sender as confirmation (for testing purposes only until we get it working)

serverChannel.on('received', messageBackFromServer => {
  console.log('Message Receipt from SERVER: ', messageBackFromServer);
});

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
getInput(); // Calling these here works locally - but as far as can tell NOT the same way in Heroku
