/* eslint-disable comma-dangle */
'use strict';

require('dotenv').config();
const inquirer = require('inquirer');

const io = require('socket.io-client');


const serverChannel = io.connect('http://localhost:3001');

serverChannel.emit('join', 'I just joined!');

// Server should send the message back to the sender as confirmation (for testing purposes only until we get it working)

serverChannel.on('received', messageBackFromServer => {
  // console.log('Message Receipt from SERVER: ', messageBackFromServer);
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
serverChannel.on('invalidated', userObj => {
  console.log("I'm sorry, we were unable to validate", userObj, 'with the password you entered.');
  setTimeout(()=>{
    console.log('Please Try again');
    setTimeout(()=>{
      login();
    }, 1500);
  }, 1000);
  
})

async function login(){
  let input = await inquirer.prompt([
    { name: 'username', message: 'Please enter username'},
  ]);
  let pass = await inquirer.prompt([
    { name: 'password', message: 'Please enter your Password'}
  ]);
  let signupObject = {
    username: input.username,
    password: pass.password,
  };
  serverChannel.emit('signin', signupObject);
  serverChannel.on('validated', answer => {
    if(answer === true){
      console.log(`Welcome to the chat, ${username}!`);
      getInput();
    } else {
      console.log('Invalid username. Please try again.');
      loginOrCreate();
    }
  });
}
async function createUser(){
  let newUsername = await inquirer.prompt([
    { name: 'username', message: 'Choose a username'},
  ]);

  let newPass = await inquirer.prompt([
    { name: 'password', message: 'Please choose a password'},
  ]);
  
  let newEmail = await inquirer.prompt([
    { name: 'email', message: 'Enter your email'},
  ]);

  let newFav = await inquirer.prompt([
    { name: 'favLanguage', message: 'What is your favorite development language?'},
  ]);

  let newDesc = await inquirer.prompt([
    { name: 'description', message: 'Tell us about yourself in one sentence'},
  ]);

  let newOs = await inquirer.prompt([
    { name: 'os', message: 'What operating system do you use?'},
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
}

serverChannel.on('signupSuccess', username =>{
  console.clear();
  console.log(username, 'Thank you for signing up!');
  setTimeout(()=>{
    login();
  }, 1500)
});


async function loginOrCreate(){
  let input = await inquirer.prompt([
    { name: 'isMember', message: 'Are you a member? (y/n)' },
  ]);
  let regex = /y|yes/i;
  // if yes, please enter username / password
  if(regex.test(input.isMember)) {
    login();
  } else createUser();
  // if no, new prompt for signup 
  
}

// async function loginOrCreate(){
//   // console.log('Please enter username');
//   // console.log('Please enter password');
//   let input = await inquirer.prompt([
//     { name: 'username', message: 'Please enter username *********' },
//   ]);
//   // sendMessage(input.text);
//   // getInputLogin();
//   if(input.username === firstUser.username){
//     username = input.username;
//     console.log(`Welcome to the chat, ${username}!`);
//     getInput();
//   } else {
//     console.log('wrong!');
//     loginOrCreate();
//   }
// }


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
