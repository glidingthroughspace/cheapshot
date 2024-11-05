import { createApiClient } from "./lib/api.js";
import { delay } from "./lib/delay.js";
import { createRemoteLogger } from "./lib/log.js";
const socket = io({ extraHeaders: { role: "capture-controller" } });
const countdown = document.querySelector(".countdown");
const trigger = document.querySelector(".trigger");
const log = createRemoteLogger("CAPTR", socket);
const loadingIndicator = {
  _element: document.querySelector("#loadingIndicator"),
  show() {
    this._element.classList.add("visible");
  },
  hide() {
    this._element.classList.remove("visible");
  },
};

const statusMessage = {
  _element: document.querySelector("#statusMessage"),
  info(msg) {
    this._element.innerText = msg;
    this._element.classList.remove("error");
    this._element.classList.add("visible");
  },
  error(msg) {
    this._element.innerText = msg;
    this._element.classList.add("visible", "error");
  },
  hide() {
    this._element.classList.remove("error", "visible");
  },
};

socket.on("connect", () => {
  loadingIndicator.hide();
  statusMessage.hide();
});

socket.on("new-server-state", ({ currentStatus }) => {
  switch (currentStatus) {
    case "ready":
      loadingIndicator.show();
      statusMessage.info("Waiting for the server to be started");
      break;
    case "capturing":
      loadingIndicator.hide();
      statusMessage.hide();
      break;
    case "capture_device_disconnected":
      loadingIndicator.show();
      statusMessage.error("A capture device disconnected");
      break;
    case "faulty":
      statusMessage.error("The server has run into an error");
      break;
    default:
      statusMessage.error("Unexpected server status");
      break;
  }
});

socket.on("disconnect", () => {
  loadingIndicator.show();
  statusMessage.error("Reconnecting to server...");
});

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
  loadingIndicator.show();
  try {
    const capture = await api("/capture", "POST");
    countdown.classList.remove("visible");
  } catch {
    alert("Failed to trigger"); // FIXME: This should be localized.
  } finally {
    loadingIndicator.hide();
  }
});

const setupWebRTC = (socket, roomId) => {
  console.log("Setting up WebRTC");
  loadingIndicator.show();
  const peerConnection = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  });

  const videoElement = document.getElementById("videoStream");

  peerConnection.ontrack = (event) => {
    console.log("Received track");
    videoElement.srcObject = event.streams[0];
  };

  peerConnection.onconnectionstatechange = () => {
    console.log("Connection state changed:", peerConnection.connectionState);
  };

  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      console.log("Sending ICE candidate");
      socket.emit("ice-candidate", {
        candidate: event.candidate,
        roomId,
      });
    }
  };

  peerConnection.oniceconnectionstatechange = () => {
    console.log("ICE connection state:", peerConnection.iceConnectionState);
  };

  return peerConnection;
};

const setupSignaling = (roomId) => {
  console.log("Setting up signaling");
  const peerConnection = setupWebRTC(socket, roomId);

  socket.on("offer", async (offer) => {
    try {
      console.log("Received offer:", offer);
      if (!offer || !offer.sdp || !offer.type) {
        throw new Error("Invalid offer format received");
      }

      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(offer)
      );
      console.log("Remote description set");

      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      console.log("Sending answer");

      socket.emit("answer", {
        answer: {
          type: answer.type,
          sdp: answer.sdp,
        },
        roomId,
      });
    } catch (err) {
      statusMessage.error("Failed start preview");
      console.error("Offer handling error:", err);
    }
  });

  socket.on("ice-candidate", async (data) => {
    try {
      console.log("Received ICE candidate");
      await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
    } catch (err) {
      console.error("Error adding ICE candidate:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });

  socket.on("error", (error) => {
    console.error("Socket error:", error);
    statusMessage.error("Communication error");
  });

  socket.emit("join-room", roomId);

  return { socket, peerConnection };
};

const cleanup = (socket, peerConnection) => {
  const videoElement = document.getElementById("videoStream");
  if (videoElement.srcObject) {
    videoElement.srcObject.getTracks().forEach((track) => track.stop());
  }
  if (peerConnection) {
    peerConnection.close();
  }
};

window.addEventListener("load", () => {
  const roomId = "preview";

  try {
    console.log("Initializing with room:", roomId);
    const { socket, peerConnection } = setupSignaling(roomId);

    window.addEventListener("beforeunload", () => {
      cleanup(socket, peerConnection);
    });
  } catch (err) {
    statusMessage.error("Failed to initialize preview");
  }
});

document.querySelector(".startpreview").addEventListener("click", () => {
  socket.emit("start-preview");
});
