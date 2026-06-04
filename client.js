import { io } from '/socket.io/socket.io.esm.min.js';
let selectedUser = null;
const socket = io();
const messageContainer = document.querySelector("#messages");
const form = document.querySelector("#messageForm");
const messageInput = document.querySelector("#messageInput");
const typingIndicator = document.querySelector("#typing-indicator");
const usersList = document.querySelector("#users-list");
const audio = new Audio('noti.mp3');
let typingTimeout;
const append = (message, position) => {
  const messageElement = document.createElement("div");

  messageElement.innerText = message;
  messageElement.classList.add("message", position);

  messageContainer.append(messageElement);

  messageContainer.parentElement.scrollTop =
    messageContainer.parentElement.scrollHeight;

  if (position === "left") {
    audio.play();
  }
};

socket.on("connect", () => {
  console.log("Connected:", socket.id);
});

socket.on("online-users", (users) => {
  usersList.innerHTML = "";

    users.forEach(user => {
      if(user === name) return;
        const div = document.createElement("div");
        div.innerText = user;

        div.addEventListener("click", ()=>{
          selectedUser = user;
        })
        usersList.appendChild(div);
    });
});


socket.on("user-joined", (name) => {
  append(`${name} joined the chat`, "left");
});

socket.on("receive", (data) => {
  append(`${data.username}: ${data.message}`, "left");
});

socket.on("mess-history", (messages) => {
  messages.forEach(msg => {
    append(`${msg.username}: ${msg.text}`, "left");
  });
});

socket.on("user-typing", (username) => {
  typingIndicator.innerText = `${username} is typing...`;
});

socket.on("user-stop-typing", () => {
  typingIndicator.innerText = "";
});

socket.on("private-mess", (data) => {
  append(
    `(Private-msg) ${data.from}: ${data.message}`,
    "left"
  );
});

socket.on("left", (name) => {
  append(`${name} left the chat`, "left");
});


const name = prompt("Enter your name") || "Guest";

socket.emit("new-user-joined", name);

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const message = messageInput.value;

  if (selectedUser) {
  socket.emit("private-mess", {
    to: selectedUser,
    message
  });

  append(
    `(Private to ${selectedUser}) ${message}`,
    "right"
  );
} else {
  socket.emit("send", {
    username: name,
    message
  });

  append(`You: ${message}`, "right");
}

  messageInput.value = "";
  typingIndicator.innerText = "";
});



messageInput.addEventListener("input", () => {
  socket.emit("typing", name);
  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    socket.emit("stop-typing", name);
  }, 2000);
});