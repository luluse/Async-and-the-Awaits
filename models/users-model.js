'use strict';

require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

// This creates a "Users" Model/Schema with Mongoose in Auth system
const users = new mongoose.Schema({
  username: { type: String, require: true, unique: true },
  password: { type: String, require: true },
  role: {
    type: String,
    default: 'user',
    enum: ['admin', 'editor', 'writer', 'user'],
  },
});

users.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }

  let role = this.role;
  role = 'admin'; // WARNING: ONLY for TESTING!
});

users.statics.authenticateBasic = async function (username, password) {
  let query = { username };
  const user = await this.findOne(query);
  return user && (await user.comparePassword(password));
};

users.methods.comparePassword = async function (password) {
  const passwordMatch = await bcrypt.comparePassword(password, this.password);
  return passwordMatch ? this : null;
};

module.exports = mongoose.model('users', users);
