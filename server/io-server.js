'use strict';

require('dotenv').config();
const express = require('express');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
const User = require('../basicSchema');
// console.log(process.env.PORT, 'this is the port');
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex:true
};
const PORT = process.env.PORT || 3001;
console.log(PORT);
// const INDEX = '../client/chat.js';

// weird alternate mongo connection method
// let MongoClient = require('mongodb').MongoClient;
// let url = 'mongodb://localhost:27017/';

mongoose.connect('mongodb://localhost:27017/userz', mongooseOptions);

const server = express()
  // .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server);
// const ioServer = io.of('/server');

io.on('connection', socket => {
  console.log('Client connected on: ', socket.id);


  // socket.on('signup',  async userObj =>{
  //   const user = await User.create(userObj);
  // })
  
  socket.on('signin', async username => { // "user" is from chat client username input
    let firstUser = {
      username: 'lulu',
      password: 'lulu',
    };
    console.log(`username is ${username}`);
    if(username === firstUser.username){
      io.emit('validated', true);
    } else {

        const user = await User.create({username});
        io.emit('validated', false);  
    
    }

    // user === firstUser.username ? true : false
    // MongoClient.connect(url, function(err, db) {
    //   let dbo = db.db('userz');
    //   let myObj = { username: 'Beasley', password: 'beasley' };
    //   dbo.collection('myCollection').insertOne(myObj, function(err, res){
    //     if (err) throw err;
    //     console.log('1 document inserted');
    //     db.close();
    //   });
    // })
  });

  socket.on('message', messageFromClient => {
    console.log('Received: ', messageFromClient);
    io.emit('received', messageFromClient);
  });

  // socket.on('disconnect', () => console.log('Client disconnected.'));
});

io.on('disconnect', () => console.log('Client disconnected.'));
