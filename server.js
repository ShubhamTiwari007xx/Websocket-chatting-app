<<<<<<< HEAD
import { WebSocketServer , WebSocket } from "ws";

const wss = new WebSocketServer({ port : 8080})

 
 wss.on('connection', (socket, request) =>{
    const ip = request.socket.remoteAddress;

    socket.on('message', (rawData)=>{
        const message = rawData.toString()
        console.log({rawData});

        wss.clients.forEach((client) => {
            if(client.readyState === WebSocket.OPEN ) client.send(`server broadcast : ${message}`)
        });
    })
 

 socket.on('error', (err)=>{
    console.error( `ERROR: ${err.message}`)
 })

 socket.on('close', ()=>{
    console.log('client disconnected')
 })
})

console.log("wss server is live on ws://localhost:8080")
=======
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
const socketToUser = {}

app.use(express.static(path.join(__dirname)));

io.on('connection', (socket) => {
  socket.on('new-user-joined', async (username) => {
    users[username] = socket.id;
    socketToUser[socket.id] = username
    socket.broadcast.emit('user-joined', username);

io.emit("online-users", Object.keys(users)); 

    try {
      const history = await prisma.message.findMany({
        orderBy: { createdAt: 'asc' },
        take: 50,
      })
      socket.emit('mess-history', history)
    } catch (err) {
      console.error("Failed to load message history:", err.message);
      socket.emit('mess-history',history)
    }
  });

  socket.on("private-mess", (data) => {
    const targetSocketId = users[data.to];

    io.to(targetSocketId).emit("private-mess", {
      from: socketToUser[socket.id],
      message: data.message
    })
  })

  socket.on("send", async (data) => {
    try {
      await prisma.message.create({
        data: {
          username: data.username,
          text: data.message,
        }
      })
    } catch (err) {
      console.error("Failed to save message:", err.message);
    }
    socket.broadcast.emit("receive", data);
  });

  socket.on('typing', (username) => {
    socket.broadcast.emit('user-typing', username);
  });

  socket.on('stop-typing', (username) => {
    socket.broadcast.emit('user-stop-typing', username);
  });


  socket.on("disconnect", () => {
    const username = socketToUser[socket.id];

    if (username) {
      delete users[username];
      delete socketToUser[socket.id];

      socket.broadcast.emit("left", username);

      io.emit("online-users", Object.keys(users));

    }
  });
});


app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

server.listen(port, () => {
  console.log(`Chat server running at http://localhost:${port}`);
});
>>>>>>> 801397021266716ae2dbf225471dde2e8fd6de72
