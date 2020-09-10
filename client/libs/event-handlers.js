/* eslint-disable comma-dangle */
'use strict';

require('dotenv').config();
const inquirer = require('inquirer');
const io = require('socket.io-client');

// const serverChannel = io.connect(
//   'https://command-love-interface.herokuapp.com'
// );
const serverChannel = io.connect('http://localhost:3001');

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

  serverChannel.on('validated', (answer) => {
    if (answer === true) {
      console.log(`Welcome to the chat, ${input.username}!`);
      setTimeout(()=>{
        getInput(input.username);

      },0);
    } else {
      console.log('Invalid login. Please try again.');
      loginOrCreate();
    }
  });
}

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

  console.log('NEW USER: ', newUser);
  console.log(
    `Welcome to the Command-Love-Interface, ${newUser.username}! Please log in to get started.`
  );
  login();
}

async function getInput(username) {
  while(true){
    let input = await inquirer.prompt([{ name: 'text', message: ' ' }]);

    console.log('inside of while loop')
    let message = `[${username}]: ${input.text}`;
    await serverChannel.emit('messag', message);
  }
  // getInput(username);
}

// async function sendMessage(username, text) {

//   console.log('inside of send message')
// }

module.exports = {
  login,
  createUser,
  loginOrCreate,
  getInput,
  // sendMessage,
  serverChannel,
};
