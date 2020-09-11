'use strict';
let client = require('../__mocks__/socket.io-client');
let serverChannel = client.connect();

let {
  // login,
  // createUser,
  // loginOrCreate,
  // validateMe,
  getInput,
  // menu,
  discover,
  chat,
  // profile,
  // logout,
  // sendMessage,
  // serverChannel,
  ui,
  validateMe,
  logout,
  profile,
} = require('../client/libs/event-handlers.js');

let client = require('../__mocks__/socket.io-client');
let serverChannel = client.connect();

let username = 'beasleydotcom';
jest.useFakeTimers();
it('should write "Invalid login. Please try again." when validateMe is called with bad username', async () => {
  ui.log.write = jest.fn();
  let username = null;
  let jake = await validateMe(username);
  expect(ui.log.write).toHaveBeenCalled();
});
it('should write same number of items called with discover()', () => {
  ui.log.write = jest.fn()
  let testArr = ['omg', 'ttyl', 'totes'];
  discover(testArr);
  expect(ui.log.write).toHaveBeenCalledTimes(5);
});

it.skip('calling chat should call getInput() with username as an argument', async () => {
  getInput = jest.fn();
  let username = 'beasleydotcom';
  
  chat(username);
 
  // let thomas = await getInput;
  expect(getInput()).toHaveBeenCalled();
  // you might need to do a __mocks__ thingy
});

it('should call ui.log.write 6 times when logout is called', () => {
  ui.log.write = jest.fn();
  logout(username);
  expect(ui.log.write).toHaveBeenCalledTimes(1);
  jest.advanceTimersByTime(1001);
  expect(ui.log.write).toHaveBeenCalledTimes(2);
  jest.advanceTimersByTime(9001);
  expect(ui.log.write).toHaveBeenCalledTimes(6);
});

it('should console.log inside of profile', () => {
  console.log = jest.fn();

  profile({username});
  expect(console.log).toHaveBeenCalled()
  //change this to calledWith once you know what we are going to say for this.
});

