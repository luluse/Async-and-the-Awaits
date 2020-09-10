/* eslint-disable comma-dangle */
'use strict';

require('dotenv').config();
const inquirer = require('inquirer');
const io = require('socket.io-client');
const { Socket } = require('socket.io-client');
const ui = new inquirer.ui.BottomBar();

const serverChannel = io.connect(
  'https://command-love-interface.herokuapp.com'
);
// const serverChannel = io.connect('http://localhost:3001');

async function loginOrCreate() {
  let input = await inquirer.prompt([
    {
      type: 'rawlist',
      name: 'loginChoice',
      message: 'Welcome to the Command-Love-Interface!',
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
  console.log(Date.now(), '1');
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

  ui.log.write('NEW USER: ', newUser);
  ui.log.write(
    `Welcome to the Command-Love-Interface, ${newUser.username}! Please log in to get started.`
  );
  login();
}

async function validateMe(username) {
  console.log(Date.now(), '2');

  // This is where we'll need to change
  if (username) {
    serverChannel.emit('connected', username);
  } else {
    ui.log.write('Invalid login. Please try again.');
    loginOrCreate();
  }
}
console.log(Date.now(), '3');

async function getInput(username) {
  let input;
  while (true) {
    input = null;
    input = await inquirer.prompt([{ name: 'text', message: ' ' }]);

    // ui.log.write('inside of while loop')
    let message = `[${username}]: ${input.text}`;
    await serverChannel.broadcast.emit('messag', message);
  }
}

async function discover(username) {
  ui.log.write('You chose: DISCOVER');
}

async function chat(username) {
  getInput(username);
}

async function updateProfile(username) {
  ui.log.write('You chose: PROFILE');
}

async function logout(username) {
  ui.log.write('You chose: LOGOUT');
}

async function menu(username) {
  let input = await inquirer.prompt([
    {
      name: 'menuChoice',
      message:
        "Welcome to Command Love Interface \n What would you like to do? \n Discover: other coders \n Chat: with hot bots like you \n Profile: update your profile \n Logout: don't go... ",
      choices: ['Discover', 'Chat', 'Profile', 'Logout'],
    },
  ]);
  if (input.menuChoice === 'Discover') {
    discover(username);
  } else if (input.menuChoice === 'Chat') {
    return chat(username);
  } else if (input.menuChoice === 'Profile') {
    return updateProfile(username);
  } else if (input.menuChoice === 'Logout') {
    return logout(username);
  } else {
    ui.log.write(
      "Oops! That didn't work! Please try again using the methods provided"
    );
  }
}

module.exports = {
  login,
  createUser,
  loginOrCreate,
  validateMe,
  getInput,
  menu,
  // sendMessage,
  serverChannel,
  ui,
};
