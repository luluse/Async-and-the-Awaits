'use strict';

const error404 = (req, res, next) => {
  console.log('ERROR: UNKNOWN ROUTE!');
  res.status(404);
  res.send('THIS ROUTE DOES NOT EXIST.');
  res.end();
};

module.exports = error404;
