'use strict';

const mongoose = require('mongoose');

let messageObject = {
  message: { type: String},
};
const messages = new mongoose.Schema(messageObject);

module.exports = mongoose.model('messages', messages);