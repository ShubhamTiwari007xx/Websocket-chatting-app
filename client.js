import { io } from '/socket.io/socket.io.esm.min.js';
const socket = io();


const messageContainer = document.querySelector("#messages");
const form = document.querySelector("#messageForm");
const messageInput = document.querySelector("#messageInput");
var audio = new Audio('noti.mp3')
let typingTimeout;
const typingIndicator = document.querySelector('#typing-indicator');
const append = (message, position) => {
  const messageElement = document.createElement("div");
  messageElement.innerText = message;
  messageElement.classList.add('message');
  messageElement.classList.add(position);
  messageContainer.append(messageElement);
  messageContainer.parentElement.scrollTop = messageContainer.parentElement.scrollHeight;
  if (position == 'left') {
    audio.play();
  }
};
const name = prompt("Enter your name to join") || "Guest";
socket.emit("new-user-joined", name);


form.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = messageInput.value
  append(`You: ${message}`, "right")
  socket.emit('send', ({
    username: name,
    message: message,
  }))
  messageInput.value = ''
  typingIndicator.innerText = ''
})

messageInput.addEventListener('input', () => {
  socket.emit('typing', name)
  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    socket.emit('stop-typing', name);
  }, 2000);
})

socket.on("user-joined", (name) => {
  append(`${name} joined the chat`, "left");
});

socket.on('user-typing', (username) => {
  typingIndicator.innerText = `${username} is typing..`
  typingIndicator.innerText = `${username} is typing......`
})

socket.on("private-mess",(data) =>{
  append(
    `(Private) ${data.from}:${data.message}`,
    "left"
  )
})

socket.on('user-stop-typing', () => {
  typingIndicator.innerText = ''
})
socket.on("receive", (data) => {
  append(`${data.username} : ${data.message}`, "left");
});
socket.on('message-history', (messages) => {
  messages.forEach(msg => {
    append(`${msg.username}: ${msg.text}`, 'left');
  });
});
socket.on("left", name => {
  append(`${name} left the chat`, "left")
})
