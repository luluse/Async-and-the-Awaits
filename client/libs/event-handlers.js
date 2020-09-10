/* eslint-disable comma-dangle */
'use strict';

require('dotenv').config();
const inquirer = require('inquirer');
const io = require('socket.io-client');
const ui = new inquirer.ui.BottomBar();

const serverChannel = io.connect(
  'https://command-love-interface.herokuapp.com'
);
// const serverChannel = io.connect('http://localhost:3001');
serverChannel.on('validated', validateMe);
async function loginOrCreate() {
  let input = await inquirer.prompt([
    {
      type: 'rawlist',
      name: 'loginChoice',
      message:
        'Welcome to the Command-Love-Interface! What would you like to do?',
      choices: ['Log In', 'Sign Up'],
    },
  ]);

  if (input.loginChoice === 'Log In') {
    login();
  } else createUser();
}

async function login() {
  let input = await inquirer.prompt([
    { name: 'username', message: 'Please enter your username:' },
  ]);

  let pass = await inquirer.prompt([
    {
      type: 'password',
      mask: ['default'],
      name: 'password',
      message: 'Please enter your password:',
    },
  ]);

  const signupObject = {
    username: input.username,
    password: pass.password,
  };

  serverChannel.emit('signin', signupObject);
console.log(Date.now(), '1')

 
}
async function validateMe (username) {
  console.log(Date.now(), '2')
  
      if (username) {
        // ui.log.write(`Welcome to the chat, ${input.username}!`);
        ui.log.write(`Welcome to the chat, ${username}!`)
        setTimeout(()=>{
          getInput(username);
        },0);
      } else {
        ui.log.write('Invalid login. Please try again.')
        loginOrCreate();
      }
    };
    console.log(Date.now(), '3');


async function createUser() {
  let newUsername = await inquirer.prompt([
    { name: 'username', message: 'Choose a username:' },
  ]);

  let newPass = await inquirer.prompt([
    {
      type: 'password',
      mask: ['default'],
      name: 'password',
      message: 'Please choose a password:',
    },
  ]);

  let newEmail = await inquirer.prompt([
    { name: 'email', message: 'Enter your email:' },
  ]);

  let newFav = await inquirer.prompt([
    {
      name: 'favLanguage',
      message: 'What is your favorite development language?',
    },
  ]);

  let newDesc = await inquirer.prompt([
    {
      name: 'description',
      message: 'Tell us about yourself in one sentence:',
    },
  ]);

  let newOs = await inquirer.prompt([
    { name: 'os', message: 'What operating system do you use?' },
  ]);

  const newUser = {
    username: newUsername.username,
    password: newPass.password,
    email: newEmail.email,
    favLanguage: newFav.favLanguage,
    description: newDesc.description,
    os: newOs.os,
  };

  serverChannel.emit('signup', newUser);

  ui.log.write('NEW USER: ', newUser);
  ui.log.write(
    `Welcome to the Command-Love-Interface, ${newUser.username}! Please log in to get started.`
  );
  login();
}

async function getInput(username) {
  let input;
  while(true){
    input=null;
     input = await inquirer.prompt([{ name: 'text', message: ' ' }]);

    ui.log.write('inside of while loop')
    let message = `[${username}]: ${input.text}`;
    await serverChannel.emit('messag', message);
  }
  // getInput(username);
}

// async function sendMessage(username, text) {

//   ui.log.write('inside of send message')
// }

module.exports = {
  login,
  createUser,
  loginOrCreate,
  getInput,
  // sendMessage,
  serverChannel,
  ui,
};
