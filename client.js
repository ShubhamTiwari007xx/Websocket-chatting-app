const socket = io();

const messageContainer = document.querySelector(".message-container");
const form = document.querySelector("#messageForm");
const messageInput = document.querySelector("#messageInput");

const append = (message, position) => {
  const messageElement = document.createElement("div");
  messageElement.classList.add("message");
  messageElement.classList.add(position);
  messageElement.innerText = message;
  messageContainer.append(messageElement);
};

const name = prompt("Enter your name to join");
socket.emit("new-user-joined", name);

socket.on("user-joined", (name) => {
  append(`${name} joined the chat`, "left");
});

socket.on("receive", (data) => {
  append(`${data.name}: ${data.message}`, "left");
});

// form.addEventListener("submit", (event) => {
//   event.preventDefault();

//   const message = messageInput.value;
//   append(`You: ${message}`, "right");
//   socket.emit("send", message);
//   messageInput.value = "";
// });