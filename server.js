import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { Server } from 'socket.io';
import { prisma } from './db.js';
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = 5000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const users = {};

app.use(express.static(path.join(__dirname)));

io.on('connection', (socket) => {
  socket.on('new-user-joined', (username) => {
    users[socket.id] = username;
    socket.broadcast.emit('user-joined', username);
  });

socket.on("send", async (data) => {
   await prisma.message.create({
      data: {
         username: data.username,
         text: data.message
      }
   });
   socket.broadcast.emit("receive", data);
});

socket.on('disconnect', () => {
      socket.broadcast.emit('left', users[socket.id])
      delete users[socket.id];
    });
  });

  server.listen(port, () => {
    console.log(`Chat server running at http://localhost:${port}`);
  });
