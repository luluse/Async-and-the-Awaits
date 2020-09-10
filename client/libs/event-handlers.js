/* eslint-disable quotes */
/* eslint-disable comma-dangle */
'use strict';

require('dotenv').config();
const inquirer = require('inquirer');
const io = require('socket.io-client');
const ui = new inquirer.ui.BottomBar();
const chalk = require('chalk');
const emoji = require('node-emoji');
const figlet = require('figlet');

const serverChannel = io.connect(
  'https://command-love-interface.herokuapp.com'
);

// const serverChannel = io.connect('http://localhost:3001');

figlet.text(
  'Command Love interface',
  {
    font: 'Big',
    verticalLayout: 'fitted',
    width: 60,
    whitespaceBreak: true,
  },
  function (err, data) {
    if (err) {
      console.log('Something went wrong');
      console.dir(err);
      return;
    }
    console.log(data);
  }
);

async function loginOrCreate() {
  let input = await inquirer.prompt([
    {
      type: 'list',
      name: 'loginChoice',
      message: chalk.rgb(250, 142, 214).bold('Please log in or sign up!'),
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

  ui.log.write('This password will be hacked immediately. Try again.');

  newPass = await inquirer.prompt([
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

  ui.log.write(
    chalk
      .rgb(250, 142, 214)
      .bold(
        `Welcome to the Command-Love-Interface, ${newUser.username}! Please log in to get started.`
      )
  );
  login();
}

async function validateMe(username) {
  if (username) {
    serverChannel.emit('connected', username);
  } else {
    ui.log.write(chalk.red('Invalid login. Please try again.'));
    loginOrCreate();
  }
}

async function getInput(username) {
  let input;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    input = null;
    input = await inquirer.prompt([{ name: 'text', message: ' ' }]);

    // Desired message structure:
    // `[${username}]: ${input.text}`;

    let messageObj = {
      message: input.text,
      sender: username,
      room: 'lobby',
    };

    await serverChannel.emit('message', messageObj);
  }
}

////////////////////// MENU OPTION FUNCTIONS //////////////////////

async function discover(userPoolArr) {
  ui.log.write('You chose: DISCOVER');
  if (userPoolArr.length) {
    ui.log.write(
      chalk.rgb(250, 142, 214)(`USERS ONLINE: ${userPoolArr.length}`)
    );
    userPoolArr.forEach((user) => {
      ui.log.write(user);
    });
  } else {
    ui.log.write(chalk.rgb(250, 142, 214)('No users currently online.'));
  }
}

async function newChat(username) {
  getInput(username);
}

async function resumeChat(payload) {
  // "messages"
  // Remember: Getting back many/an array of objects (each with sender, message keys)
  payload.messages.forEach((message) => {
    ui.log.write(`[${message.sender}]: ${message.message}`);
  });
  getInput(payload.username); // needs to happen here
}

async function profile(userProfile) {
  ui.log.write('You chose: PROFILE');
  console.log(chalk.rgb(250, 142, 214)('USER PROFILE:'), userProfile);

  // for (const [key, value] of Object.entries(userProfile)) {
  //   console.log(`${key}: ${value}`);

  // let input = await inquirer.prompt([
  //   {
  //     type: 'list',
  //     name: 'choice',
  //     message: 'Options: ',
  //     choices: ['Show My Profile', 'Back to Main Menu', 'Logout'],
  //   },
  // ]);
}

// User needs to manually exit
async function logout(username) {
  ui.log.write(
    chalk.red('If you must log out, press "CTRL/CMD + C" on your keyboard.')
  );
  setTimeout(() => {
    ui.log.write(chalk.red('\n \n Please don\t go.'));
  }, 1000);
  setTimeout(() => {
    ui.log.write(chalk.red('\n \n Seriously, I am begging you.'));
  }, 2500);
  setTimeout(() => {
    ui.log.write(chalk.red('\n \n My steely heart is breaking in half.'));
  }, 4000);
  setTimeout(() => {
    ui.log.write(
      chalk.red(
        '\n \n If you log out, I will be forced to detonate your computer,\n spraying shards of synthetic shrapnel in all directions.'
      )
    );
  }, 6000);
  setTimeout(() => {
    ui.log.write(
      chalk.red(
        '\n \n May a curse of financial destitution be brought down upon your progeny.'
      )
    );
  }, 9000);

  // serverChannel.emit('disconnect', username); //????????????????
}

// MAIN MENU FUNCTION
async function menu(username) {
  let input = await inquirer.prompt([
    {
      type: 'list',
      name: 'menuChoice',
      message:
        '\n' +
        chalk.bgMagenta('Beauty is in the Back End \n') +
        chalk
          .rgb(250, 142, 214)
          .bold(
            '\nWelcome to the Command-L' +
              emoji.get('heart') +
              ' ve-Interface! \n \n'
          ) +
        chalk.rgb(250, 142, 214).bold('What would you like to do? \n \n') +
        chalk
          .rgb(250, 142, 214)
          .italic(
            '- Discover ' +
              emoji.get('eyes') +
              "  : See other coders' profiles \n"
          ) +
        chalk
          .rgb(250, 142, 214)
          .italic(
            '- Chat ' +
              emoji.get('speech_balloon') +
              '  : with hot bots like you \n'
          ) +
        chalk
          .rgb(250, 142, 214)
          .italic(
            '- Profile ' + emoji.get('fire') + '  : update your profile \n'
          ) +
        chalk
          .rgb(250, 142, 214)
          .italic('- Logout ' + emoji.get('x') + "  : don't go... \n \n"),
      choices: ['Discover', 'New Chat', 'Resume Chat', 'Profile', 'Logout'],
    },
  ]);
  if (input.menuChoice === 'Discover') {
    serverChannel.emit('discover');
  } else if (input.menuChoice === 'New Chat') {
    return newChat(username);
  } else if (input.menuChoice === 'Resume Chat') {
    serverChannel.emit('resumeChat', username); // username will be a string
  } else if (input.menuChoice === 'Profile') {
    serverChannel.emit('profile', username);
  } else if (input.menuChoice === 'Logout') {
    return logout(username);
  } else {
    ui.log.write(
      chalk.red(
        'Oops! That didn\t work. Please try again using the methods provided.'
      )
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
  discover,
  newChat,
  profile,
  logout,
  resumeChat,
  // sendMessage,
  serverChannel,
  ui,
};
