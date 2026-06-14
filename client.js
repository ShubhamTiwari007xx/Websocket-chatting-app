import { io } from '/socket.io/socket.io.esm.min.js';

const name = prompt("Enter your name") || "Guest";
let selectedUser = null;
const socket = io();
const messageContainer = document.querySelector("#messages");
const form = document.querySelector("#messageForm");
const messageInput = document.querySelector("#messageInput");
const typingIndicator = document.querySelector("#typing-indicator");
const usersList = document.querySelector("#users-list");
const userCount = document.querySelector("#user-count");
const publicRoomButton = document.querySelector("#public-room");
const chatTarget = document.querySelector("#chat-target");
const status = document.querySelector("#status");
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
    audio.play().catch(() => {});
  }
};

const setChatTarget = (username) => {
  selectedUser = username;
  chatTarget.innerText = username ? `Private: ${username}` : "Public chat";
  publicRoomButton.classList.toggle("is-active", !username);

  usersList.querySelectorAll(".user-card").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.username === username);
  });
};


const renderOnlineUsers = (users) => {
  const otherUsers = users.filter((user) => user !== name);
  userCount.innerText = String(users.length);
  usersList.innerHTML = "";

  if (selectedUser && !otherUsers.includes(selectedUser)) {
    setChatTarget(null);
  }

  if (otherUsers.length === 0) {
    const emptyState = document.createElement("p");
    emptyState.className = "empty-users";
    emptyState.innerText = "No other users online";
    usersList.appendChild(emptyState);
    return;
  }

  otherUsers.forEach((user) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "user-card";
    button.dataset.username = user;
    button.innerHTML = `
    
      <span class="presence-dot"></span>
      <span>
        <strong></strong>
        <small>Send private message</small>
      </span>
    `;
    button.querySelector("strong").innerText = user;
    button.classList.toggle("is-active", user === selectedUser);
    button.addEventListener("click", () => setChatTarget(user));
    usersList.appendChild(button);
  });
};

socket.on("connect", () => {
  console.log("Connected:", socket.id);
  status.innerText = `Connected as ${name}`;
});

socket.on("disconnect", () => {
  status.innerText = "Disconnected";
});

socket.on("online-users", (users) => {
  renderOnlineUsers(users);
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


socket.emit("new-user-joined", name);
status.innerText = `Connected as ${name}`;

publicRoomButton.addEventListener("click", () => {
  setChatTarget(null);
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value.trim();

  if (!message) return;

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
