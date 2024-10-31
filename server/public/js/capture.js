import { createApiClient } from "./lib/api.js";
import { delay } from "./lib/delay.js";
import { createRemoteLogger } from "./lib/log.js";
const socket = io({ extraHeaders: { role: "capture-controller" } });
const countdown = document.querySelector(".countdown");
const trigger = document.querySelector(".trigger");
const errorOverlay = document.querySelector(".error-overlay");
const log = createRemoteLogger("CAPTR", socket);

socket.on("connect", () => {
  clearMessage();
});

socket.on("new-server-state", ({ currentStatus }) => {
  switch (currentStatus) {
    case "waiting_for_controller":
      raiseMessage(true, "Server is waiting for controller to connect");
      break;
    case "ready":
      raiseMessage(false, "We are ready, but the server isn't started yet");
      break;
    case "capturing":
      clearMessage();
      break;
    case "capture_device_disconnected":
      raiseMessage(true, "A capture device disconnected");
      break;
    case "faulty":
      raiseMessage(true, "The server has run into an error");
      break;
  }
});

socket.on("disconnect", () => {
  raiseMessage(true, "Disconnected from server");
});

function raiseMessage(isError, msg) {
  errorOverlay.innerHTML = msg ?? "An unknown error occurred"; // FIXME: This should be localized.
  errorOverlay.classList.add("visible");
  trigger.disabled = true;
}

function clearMessage() {
  errorOverlay.classList.remove("visible");
  trigger.disabled = false;
}

const api = createApiClient((logEntry) =>
  log(logEntry.level, logEntry.message)
);

trigger.addEventListener("click", async () => {
  countdown.textContent = "3";
  countdown.classList.add("visible");
  await delay(1000);
  countdown.textContent = "2";
  await delay(1000);
  countdown.textContent = "1";
  await delay(1000);
  countdown.textContent = "🧀";
  try {
    const capture = await api("/capture", "POST");
    countdown.classList.remove("visible");
  } catch {
    alert("Failed to trigger"); // FIXME: This should be localized.
  }
});
