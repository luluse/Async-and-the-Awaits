'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

let usersObject = {
  username: { type: String, required: true, unique: true },
  password: { type: String, unique: true },
  email: { type: String, unique: true },
  favLanguage: { type: String },
  description: { type: String },
  os: { type: String },
};
const users = new mongoose.Schema(usersObject);

users.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

users.statics.authenticateBasic = async function (username, password) {
  try {
    let query = { username };
    const user = await this.findOne(query);
    return user && (await user.comparePassword(password));
  } catch (error) {
    throw new Error('You\ve encountered an error', error);
  }
};

users.methods.comparePassword = async function (plainPassword) {
  try {
    const passwordMatch = await bcrypt.compare(plainPassword, this.password);
    return passwordMatch ? this : null;
  } catch (error) {
    throw new Error('You\ve encountered an error', error);
  }
};

module.exports = mongoose.model('users', users);
