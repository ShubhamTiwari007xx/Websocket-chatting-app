const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = 5000;

const users = {};

app.use(express.static(path.join(__dirname)));

io.on('connection', (socket) => {
  socket.on('new-user-joined', (name) => {
    console.log("user joined",name)
    users[socket.id] = name;
    socket.broadcast.emit('user-joined', name);
  });

  socket.on('send', (message) => {
    socket.broadcast.emit('receive', {
      message : message,
      name: users[socket.id] || 'Guest'
    });
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('left', users[socket.id])
    delete users[socket.id];
  });
});

server.listen(port, () => {
  console.log(`Chat server running at http://localhost:${port}`);
});
