/* eslint-disable comma-dangle */
'use strict';

require('dotenv').config();
const inquirer = require('inquirer');

const io = require('socket.io-client');
// const serverChannel = io.connect('http://localhost:3001/server');
const serverChannel = io.connect(
  'https://command-love-interface.herokuapp.com'
);

serverChannel.emit('join', 'I just joined!');

// Server should send the message back to the sender as confirmation (for testing purposes only until we get it working)

serverChannel.on('received', messageBackFromServer => {
  console.log('Message Receipt from SERVER: ', messageBackFromServer);
});

serverChannel.on('disconnect', () => {
  serverChannel.emit('disconnect');
});

let username = '';

function sendMessage(text) {
  console.log('sending: ', text);

  let message = `[${username}]: ${text}`;
  serverChannel.emit('message', message);
}
let firstUser = {
  username: 'lulu',
  // password: 'password',
};

async function loginOrCreate(){
  // console.log('Please enter username');
  // console.log('Please enter password');
  let input = await inquirer.prompt([
    { name: 'username', message: 'Please enter username *********' },
  ]);
  // sendMessage(input.text);
  // getInputLogin();
  if(input.username === firstUser.username){
    username = input.username;
    console.log(`Welcome to the chat, ${username}!`);
    getInput();
  } else {
    console.log('wrong!');
    loginOrCreate();
  }
}

async function getInputLogin() {
  // inquirer grabs input from the CLI
  let input = await inquirer.prompt([{name: 'username', message: 'enter your username' }]);
  sendMessage(input.username);
}

async function getInput() {
  // inquirer grabs input from the CLI
  let input = await inquirer.prompt([{ name: 'text', message: ' ' }]);
  sendMessage(input.text);
  getInput();
}

async function getName() {
  // console.clear();
  let input = await inquirer.prompt([
    { name: 'name', message: 'Please provide username' },
  ]);
  // let nameCheck = await inquirer.prompt([
  //   { name: 'name', message: 'What do you want to' },
  // ]);

  username = input.name;
}

loginOrCreate();
// getName();
// getInput();
