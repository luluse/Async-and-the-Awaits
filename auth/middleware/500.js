'use strict';

const error500 = (req, res, next) => {
  console.log('ERROR: SERVER ERROR!');
  res.status(500);
  res.send('SOMETHING WENT WRONG.');
  res.end();
};

module.exports = error500;
