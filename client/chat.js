/* eslint-disable comma-dangle */
'use strict';

require('dotenv').config();
const inquirer = require('inquirer');

const io = require('socket.io-client');

const serverChannel = io.connect(
  'https://command-love-interface.herokuapp.com'
);
// const serverChannel = io.connect('http://localhost:3001');

serverChannel.emit('join', 'I just joined!');

// Server should send the message back to the sender as confirmation (for testing purposes only until we get it working)
serverChannel.on('received', (messageBackFromServer) => {
  // console.log('Message Receipt from SERVER: ', messageBackFromServer);
  console.log(messageBackFromServer);
});

serverChannel.on('disconnect', () => {
  serverChannel.emit('disconnect');
});

// let username = '';

async function getInput(username) {
  // inquirer grabs input from the CLI
  let input = await inquirer.prompt([{ name: 'text', message: ' ' }]);
  sendMessage(username, input.text);
  getInput(username);
}

function sendMessage(username, text) {
  let message = `[${username}]: ${text}`;
  serverChannel.emit('message', message);
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
      // console.log(`Welcome to the chat, ${input.username}!`);
      // // username = input.username;
      // getInput(input.username);
      chatWithOneUser(input.username);
    } else {
      console.log('Invalid login. Please try again.');
      loginOrCreate();
    }
  });
}
function chatWithOneUser(user, targetUser){
  console.log('invite to chat', user);
  // we can assume that we have a username of someone we want to chat with.
  //setup a room for the two to chat in
  //send copies of each message to the database
  //I want to chat with one person
  //does other username exist?
  //does chat with that username exist? if so, load that chat
  //I want to chat with targetUser and receive confirmation that you have a joined a room with just the two of you.
  //the switchboard has connected

  //event payload {to: lulu, from: beasley}
  //switchboard responds with "room ready" and roomlocation payload lulu_beasley


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

async function loginOrCreate() {
  // let input = await inquirer.prompt([
  //   { name: 'isMember', message: 'Are you a member? (y/n)' },
  // ]);

  let input = await inquirer.prompt([
    {
      type: 'rawlist',
      name: 'loginChoice',
      message:
        'Welcome to the Command-Love-Interface! What would you like to do?',
      choices: ['Log In', 'Sign Up'],
      // console.log(input.isMember) will log out actual "choice" as { isMember: 'Log In' }
    },
  ]);

  if (input.loginChoice === 'Log In') {
    login();
  } else createUser();
  // if no, new prompt for signup
}

// async function getInputLogin() {
//   // inquirer grabs input from the CLI
//   let input = await inquirer.prompt([
//     { name: 'username', message: 'enter your username' },
//   ]);
//   sendMessage(input.username);
// }

// async function getName() {
//   // console.clear();
//   let input = await inquirer.prompt([
//     { name: 'name', message: 'Please enter your username:' },
//   ]);
//   // let nameCheck = await inquirer.prompt([
//   //   { name: 'name', message: 'What do you want to' },
//   // ]);

//   username = input.name;
// }

loginOrCreate();
