import { createApiClient } from "./lib/api.js";
import { createLocalLogger } from "./lib/log.js";
const log = createLocalLogger(
  "MGMNT",
  document.querySelector(".logs-container")
);
const api = createApiClient(({ level, message }) => log(level, message));
const deviceContainer = document.getElementById("device-container");

Array.from(deviceContainer.children).forEach((device) => {
  device.querySelector("button.camera").addEventListener("click", () => {
    api("/management/set-preview-device", "POST", { deviceId: device.id });
  });
});

Sortable.create(deviceContainer, {
  animation: 150, // Animation speed in ms
  ghostClass: "sortable-ghost", // Class name for the drop placeholder
  onEnd: function (evt) {
    console.log(`Moved device from index ${evt.oldIndex} to ${evt.newIndex}`);
    const devices = Array.from(deviceContainer.children).map(
      (deviceElement) => deviceElement.id
    );
    console.log("New devices: ", devices);
    api("/management/set-device-order", "POST", { devices });
  },
});

const socket = io({
  extraHeaders: {
    role: "management",
  },
});

const mainActionButton = document.getElementById("main-action-button");
mainActionButton.addEventListener("click", () => {
  if (mainActionButton.classList.contains("primary")) {
    log("debug", "Starting capture mode");
    api("/management/start-capture", "POST");
  } else {
    log("debug", "Stopping capture mode");
    api("/management/stop-capture", "POST");
  }
});

socket.on("new-server-state", (state) => {
  console.log("New server state: ", state);
  document.getElementById("server-status-text").innerText =
    state.serverStatusText;
  deviceContainer.querySelectorAll(".device").forEach((device) => {
    device.remove();
  });
  for (const device of state.captureDevices) {
    const deviceElement = document.createElement("div");
    deviceElement.classList.add("device");
    deviceElement.id = device.id;
    deviceElement.innerHTML = `
        <button class="camera ${
          device.isPreviewDevice ? "isPreviewDevice" : ""
        }"></button><div class="device-id">${device.id}</div>`;
    deviceContainer.appendChild(deviceElement);
  }

  Array.from(deviceContainer.children).forEach((device) => {
    device.querySelector("button.camera").addEventListener("click", () => {
      api("/management/set-preview-device", "POST", { deviceId: device.id });
    });
  });

  updateMainActionButton(state.currentStatus);
});

socket.on("log", function (params) {
  log(params.level, params.message, params.timestamp, params.source);
});

function updateMainActionButton(serverStatus) {
  if (serverStatus === "ready") {
    mainActionButton.innerText = "Start Capture Mode";
    mainActionButton.disabled = false;
    mainActionButton.classList.remove("destructive");
    mainActionButton.classList.add("primary");
  } else if (serverStatus === "capturing") {
    mainActionButton.innerText = "Stop Capture Mode";
    mainActionButton.disabled = false;
    mainActionButton.classList.remove("primary");
    mainActionButton.classList.add("destructive");
  } else {
    mainActionButton.innerText = "Start Capture Mode";
    mainActionButton.disabled = true;
    mainActionButton.classList.add("primary");
    mainActionButton.classList.remove("destructive");
  }
}
