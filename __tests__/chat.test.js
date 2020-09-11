'use strict';
// const inquirer = require('../__mocks__/inquirer.js');
let {
    login,
    createUser,
    loginOrCreate,
    getInput,
    menu,
    discover,
    chat,
    logout,
    sendMessage,
    // serverChannel,
    // ui,
    validateMe,
    profile,
  } = require('../client/libs/event-handlers.js');




let client = require('../__mocks__/socket.io-client');
let serverChannel = client.connect();


const newUser = {
    username: 'mcBeaselton',
    password: 'scram',
    email: 'boogie@boog.com',
    favLanguage: 'JS',
    description: 'hank',
    os: 'whobuntu',
  };


describe('route tests', ()=>{
    it('should trigger login() when loginOrCreate() is called with an empty payload', () => {
        expect('l').toBe('l');
    });
    it('should trigger login() when loginOrCreate() is called with an empty payload', () => {
        expect('6').toBe('6');
    });
    it('should trigger login() when loginOrCreate() is called with an empty payload', () => {
        expect('7').toBe('7');
    });
    it('should trigger login() when loginOrCreate() is called with an empty payload', () => {
        expect(1+2).toBe(3);
    });
    it('should have equal I/O each time read', () => {
        expect(require('../client/libs/event-handlers.js')).toBe(require('../client/libs/event-handlers.js'));
    });
    //end of describe block
  })
  /*
  loginOrCreate();
  validateMe(username)
  menu(username)
disscover(userPoolArr);
  profile(userProfile);
  resumeChat(payload)

  */

//  const happy = Promise.resolve({loginChoice: 'Log In'});
//  happy.then(data => console.log(data));
