'use strict';

require('dotenv').config();
const inquirer = require('inquirer');
const chalk = require('chalk');

const serverChannel = require('socket.io-client').connect('http://localhost:3001/server');

serverChannel.emit('join', 'I just joined');

serverChannel.on('received', messageBackFromServer =>{
  console.log('Message Receipt from SERVER: ', messageBackFromServer);
});

let username = '';

function sendMessage(text){
  console.log('sending: ', text);

  let message = `[${username}]: ${text}`;
  serverChannel.emit('message', message);
}

async function getInput(){
  let input = await inquirer.prompt([{ name: 'text', message: ' ' }]);
  sendMessage(input.text);
  getInput();
}

async function getName(){
  console.clear();
  let input = await inquirer.prompt([{name: 'name', message: 'Please enter your name'}]);
  username = input.name;
}

getName();
getInput();