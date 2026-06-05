# Websocket-chatting-app
# Realtime Chat Application

A real-time chat application built using Socket.IO, Node.js, Express, Prisma, and PostgreSQL. The application supports public messaging, private messaging, online user tracking, typing indicators, and persistent chat history.

## Features

- Real-time public chat
- Private messaging between online users
- Live online users list
- Typing indicators
- Message history persistence
- Automatic user join/leave notifications
- Responsive modern UI
- PostgreSQL database integration using Prisma ORM

## Tech Stack

### Frontend
- HTML
- CSS
- JavaScript

### Backend
- Node.js
- Express.js
- Socket.IO

### Database
- PostgreSQL
- Prisma ORM

## How It Works

### Public Messaging
Messages are broadcast to all connected users in real time using Socket.IO events.

### Private Messaging
Each connected user is mapped to a unique Socket ID.

```js
users[username] = socket.id;
socketToUser[socket.id] = username;