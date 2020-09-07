'use Strict';

require('dotenv').config();

const http = require('http').createServer();
const io = require('socket.io')(server);
const port = 3001;

io.on('connection', (socket) =>{
  console.log('connected');
  socket.on('message', (event) =>{
    console.log(event);
    socket.broadcast.emit('message', event);
  });
});

io.on('disconnect', (event) =>{
  console.log('disconnected');
});

http.listen(port, () => console.log(`server listening on port ${port}`));

