'use strict';

const base64 = require('base-64');
const User = require('../../models/users-model');

module.exports = async (req, res, next) => {
  const errorObj = {
    message: 'Invalid User ID/Password',
    status: 401,
    statusMessage: 'Unauthorized user.',
  };

  if (!req.headers.authorization) {
    next(errorObj);
    return;
  }

  let encodedPair = req.headers.authorization.split(' ').pop();

  const decoded = base64.decode(encodedPair);
  let [user, pass] = decoded.split(':');

  try {
    const validUser = await User.authenticateBasic(user, pass);
    // req.token = validUser.generateToken();
    req.user = user;
    next();
  } catch (err) {
    next(errorObj);
  }
};
