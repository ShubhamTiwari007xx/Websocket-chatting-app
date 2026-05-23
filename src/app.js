const messages = document.querySelector("#messages");
const composer = document.querySelector("#composer");
const messageInput = document.querySelector("#messageInput");
const quickReplies = document.querySelector(".quick-replies");
const briefingButton = document.querySelector("#briefingButton");

const replies = [
  "Copy that. I will keep the channel clear and the route monitored.",
  "Signal logged. Oracle is sweeping the next three intersections.",
  "Understood. Backup is shadowing from two blocks out.",
  "Message received. Alfred says the vehicle is ready below the east ramp."
];

function currentTime() {
  return new Intl.DateTimeFormat([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(new Date());
}

function addMessage(text, type = "outgoing", sender = "You") {
  const article = document.createElement("article");
  article.className = `message ${type}`;

  if (type === "incoming") {
    const avatar = document.createElement("span");
    avatar.className = "avatar";
    avatar.textContent = sender.charAt(0);
    article.append(avatar);
  }

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.innerHTML = `
    <div class="meta">
      <strong>${sender}</strong>
      <time>${currentTime()}</time>
    </div>
    <p></p>
  `;

  bubble.querySelector("p").textContent = text;
  article.append(bubble);
  messages.append(article);
  messages.scrollTop = messages.scrollHeight;
}

function queueReply() {
  const reply = replies[Math.floor(Math.random() * replies.length)];

  window.setTimeout(() => {
    addMessage(reply, "incoming", "Oracle");
  }, 700);
}

composer.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = messageInput.value.trim();

  if (!text) {
    return;
  }

  addMessage(text);
  messageInput.value = "";
  queueReply();
});

quickReplies.addEventListener("click", (event) => {
  const button = event.target.closest("button");

  if (!button) {
    return;
  }

  messageInput.value = button.textContent;
  messageInput.focus();
});

briefingButton.addEventListener("click", () => {
  addMessage("Bridge cameras, convoy timing, and alternate roof access are pinned for the team.", "incoming", "Oracle");
});
