'use strict';

const server = require('./server/io-server');
const mongoose = require('mongoose');

const mongooseOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
};

const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI, mongooseOptions);

const PORT = process.env.PORT || 3001;
server.start(PORT);
