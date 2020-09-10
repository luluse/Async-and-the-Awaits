'use strict';

require('../libs/event-handlers.js');

// let io = require('socket.io-client');
let {
    login,
    createUser,
    loginOrCreate,
    validateMe,
    getInput,
    menu,
    discover,
    chat,
    profile,
    logout,
    // sendMessage,
    serverChannel,
    ui,
  }=require('../libs/event-handlers.js');
// let serverChannel = io.connect();


it('should write same number of items called with discover()', () => {
let ui = jest.fn()
let testArr = ['omg', 'ttyl', 'totes'];
   discover(testArr);
   expect(ui).toHaveBeenCalledTimes(3);
});