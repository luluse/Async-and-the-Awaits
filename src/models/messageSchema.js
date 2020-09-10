'use strict';

const mongoose = require('mongoose');

let messageObject = {
  message: { type: String, required: true },
  sender: { type: String, required: true },
  room: { type: String, default: 'lobby' },
};

const messages = new mongoose.Schema(messageObject);

module.exports = mongoose.model('messages', messages);
