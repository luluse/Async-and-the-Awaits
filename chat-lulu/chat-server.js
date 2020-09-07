'use Strict';

require('dotenv').config();

const http = require('http').createServererver();
const io = require('socket.io')(server);
const port = process.env.PORT || 3001;

io.on('connection', socket =>{
  console.log('connected');
});

io.on('disconnect', event =>{
  console.log('disconnected');
});

http.listen(port, () => console.log(`server listening on port ${port}`));

