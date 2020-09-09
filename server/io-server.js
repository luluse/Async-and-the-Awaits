'use strict';

require('dotenv').config();
const express = require('express');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
const User = require('../basicSchema');

const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex:true,
};

const PORT = process.env.PORT || 3001;
console.log(PORT);

// weird alternate mongo connection method
// let MongoClient = require('mongodb').MongoClient;
// let url = 'mongodb://localhost:27017/';

mongoose.connect('mongodb://localhost:27017/userz', mongooseOptions);

const server = express()
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server);
// const ioServer = io.of('/server');

io.on('connection', socket => {
  console.log('Client connected on: ', socket.id);


  socket.on('signup',  async userObj =>{
    try{
      const user = await User.create(userObj);
      io.emit('signupSuccess', user.username);
    } catch(error){
      throw new Error('We were unable to sign you up! Please try again.', error)
    }
    
  });
  
  socket.on('signin', async userObj => { // "user" is from chat client username input 
  const validUser = await User.authenticateBasic(userObj.username, userObj.password);
  console.log('result from authenticate basic', validUser);
  if(!validUser){
    console.log('inside of valid user')
    io.emit('invalidated', userObj);
  }
  else io.emit('validated', userObj.username);
  
    // if(username === firstUser.username){
    //   io.emit('validated', true);
    // } else {
    //   io.emit('validated', false);    
    // }

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
