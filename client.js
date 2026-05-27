import { io } from '/socket.io/socket.io.esm.min.js';
const socket = io();

const messageContainer = document.querySelector("#messages");
const form = document.querySelector("#messageForm");
const messageInput = document.querySelector("#messageInput");
var audio = new Audio ('noti.mp3')
const append = (message, position) => {
  const messageElement = document.createElement("div");
    messageElement.innerText = message;
  messageElement.classList.add('message');
  messageElement.classList.add(position);
  messageContainer.append(messageElement);
  messageContainer.parentElement.scrollTop = messageContainer.parentElement.scrollHeight;
  if(position =='left'){
      audio.play();
  }
};
form.addEventListener('submit', (e)=>{
  e.preventDefault();
  const message = messageInput.value
    append(`You: ${message}`, "right")
  socket.emit('send',({
      username: name,
      message: message,
  }))
  messageInput.value= ''
})

const name = prompt("Enter your name to join");
socket.emit("new-user-joined", name);

socket.on("user-joined", (name) => {
  append(`${name} joined the chat`, "left");
});
socket.on("receive", (data) => {
  append(`${data.username} : ${data.message}`, "left");
});
socket.on("left",name =>{
  append(`${name} left the chat`, "left")
})
