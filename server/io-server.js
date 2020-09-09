/* eslint-disable comma-dangle */
'use strict';

require('dotenv').config();
const express = require('express');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
const User = require('../basicSchema');

const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
};

const PORT = process.env.PORT || 3001;
console.log(PORT);

// weird alternate mongo connection method
// let MongoClient = require('mongodb').MongoClient;
// let url = 'mongodb://localhost:27017/';
const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI, mongooseOptions);

const server = express().listen(PORT, () =>
  console.log(`Listening on ${PORT}`)
);

const io = socketIO(server);
// const ioServer = io.of('/server');

io.on('connection', (socket) => {
  console.log('Client connected on: ', socket.id);

  socket.on('signup', async (userObj) => {
    const user = await User.create(userObj);
    console.log(user, ' Has Been Saved!');
  });

  socket.on('signin', async (userObj) => {
    const validUser = await User.authenticateBasic(
      userObj.username,
      userObj.password
    );
    console.log('result from authenticate basic', validUser);
    if (!validUser) {
      console.log('inside of valid user');
      io.emit('validated', false);
    } else io.emit('validated', true);
  });

  socket.on('message', (messageFromClient) => {
    console.log('Received: ', messageFromClient);
    io.emit('received', messageFromClient);
  });

  // socket.on('disconnect', () => console.log('Client disconnected.'));
});

io.on('disconnect', () => console.log('Client disconnected.'));
