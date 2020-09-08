'use strict';

const express = require('express');
const router = express.Router();
const User = require('../models/users-model');
const basic = require('./middleware/basic');

router.post('/signup', async (req, res, next) => {
  const user = await User.create(req.body);
  const token = await user.generateToken();

  const responseBody = {
    token,
    user,
  };

  res.send(responseBody);
});

router.post('/signin', basic, async (req, res, next) => {
  res.cookie('basic', req.token);
  res.set('token', req.token);

  res.send({
    token: await req.token, // may need to remove await
    user: req.user,
  });
});

module.exports = router;
