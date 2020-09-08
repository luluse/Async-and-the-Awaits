'use strict';

require('dotenv').config();
const express = require('express');
const socketIO = require('socket.io');

const PORT = process.env.PORT || 3001;
// const INDEX = '../client/chat.js';

const server = express()
  // .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server);
// const ioServer = io.of('/server');

io.on('connection', socket => {
  console.log('Client connected on: ', socket.id);

  
  

  // socket.on('delivered', (payload) => {
  //   logIt('deliverd', payload);
  //   caps.to(process.env.STORE_NAME).emit('delivered', payload);
  //   console.log('DELIVERED', payload);
  // });

  socket.on('signin', username => { // "user" is from chat client username input
    let firstUser = {
      username: 'lulu',
      password: 'lulu',
    };
    console.log(`username is ${username}`);
    if(username === firstUser.username){
      io.emit('validated', true);
    } else {
      io.emit('validated', false);
    }

    // user === firstUser.username ? true : false
  });

  socket.on('message', messageFromClient => {
    console.log('Received: ', messageFromClient);
    io.emit('received', messageFromClient);
  });

  // socket.on('disconnect', () => console.log('Client disconnected.'));
});

io.on('disconnect', () => console.log('Client disconnected.'));
