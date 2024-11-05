import { $ } from "bun";
import ejs from "ejs";
import express from "express";
import multer from "multer";
import { nanoid } from "nanoid";
import dns from "node:dns/promises";
import { readdirSync, statSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import { createServer } from "node:http";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  pingInterval: 500,
  pingTimeout: 1000,
});

type CaptureDevice = {
  id?: string;
  /**
   * If the socket ID is nullish, the device currently isn't connected. If a new
   * device connects with the same ID, the server will auto-reset to the
   * "capturing" state and update the socket ID.
   */
  socketId?: string;
};

type CaptureController = {
  id: string;
};

type ServerStatus =
  | "waiting_for_controller"
  | "ready"
  | "capturing"
  | "capture_device_disconnected"
  | "faulty";

let currentStatus: ServerStatus = "waiting_for_controller";

function log(level: "debug" | "info" | "warn" | "error", message: string) {
  io.to("management").emit("log", {
    level,
    message,
    source: "SERVR",
    timestamp: new Date(),
  });
  switch (level) {
    case "debug":
      console.debug(message);
      break;
    case "info":
      console.info(message);
      break;
    case "warn":
      console.warn(message);
      break;
    case "error":
      console.error(message);
      break;
  }
}

function connectCaptureController(socketId: string) {
  captureControllers.push({ id: socketId });
  currentStatus = "ready";
  sendManagementUpdate();
  log("info", `Capture controller connected (${socketId})`);
}

function potentiallyDisconnectCaptureController(socketId: string) {
  if (captureControllers.find((c) => c.id === socketId)) {
    captureControllers = captureControllers.filter((c) => c.id !== socketId);
    if (captureControllers.length === 0) {
      currentStatus = "waiting_for_controller";
    }
    log("warn", `Capture controller disconnected (${socketId})`);
    sendManagementUpdate();
  }
}

function potentiallyDisconnectCaptureDevice(socketId: string) {
  const dev = captureDevices.find((d) => d.socketId === socketId);
  if (dev) {
    dev.socketId = undefined;
    log("warn", `Capture device disconnected (${dev.id})`);
    if (currentStatus === "capturing") {
      currentStatus = "capture_device_disconnected";
    }
    sendManagementUpdate();
  }
}

function connectCaptureDevice(device: CaptureDevice) {
  if (
    currentStatus !== "ready" &&
    currentStatus !== "capture_device_disconnected" &&
    currentStatus !== "waiting_for_controller"
  )
    throw new Error(
      `Cannot connect capture device in state '${currentStatus}'`
    );
  if (!device.id) {
    throw new Error(
      `Capture device with socket ID ${device.socketId} didn't announce an ID`
    );
  }
  const existingDevice = captureDevices.find((d) => d.id === device.id);
  if (existingDevice) {
    existingDevice.socketId = device.socketId;
    if (currentStatus === "capture_device_disconnected") {
      currentStatus = "ready";
    }
  } else {
    captureDevices.push(device);
  }
  sendManagementUpdate();
  log("info", `Capture device connected: ${device.id}`);
}

function sendManagementUpdate() {
  io.to("management").emit("new-server-state", {
    captureDevices,
    captureControllers,
    serverStatusText: serverStatusMessages[currentStatus],
    currentStatus,
  });
  io.to("capture-controller").emit("new-server-state", {
    serverStatusText: serverStatusMessages[currentStatus],
    currentStatus,
  });
}

function fault(err: any) {
  currentStatus = "faulty";
  if ("message" in err) {
    log("error", `Server fault: ${err.message}`);
  } else {
    log("error", `Unknown server fault: ${err}`);
  }
  sendManagementUpdate();
}

let captureDevices: CaptureDevice[] = [];
let captureControllers: CaptureController[] = [];
const serverStatusMessages: Record<ServerStatus, string> = {
  waiting_for_controller: "Waiting for a capture controller",
  ready: "Ready to start capturing",
  capturing: "Capturing",
  capture_device_disconnected: "A capture device has been disconnected",
  faulty: "The server is faulty",
};

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { captureId } = req.params;
    cb(null, `./captures/${captureId}`); // Files will be stored in directory
  },
  filename: (req, file, cb) => {
    const { deviceId } = req.params;
    cb(null, `${deviceId}.jpg`);
  },
});

// File filter to only allow JPEGs
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg") {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG files are allowed!"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Serve static files from the "public" directory
app.use(express.static(path.join("public")));

// Set the "views" directory for ESM templates
app.set("views", path.join("views"));
app.engine("html", ejs.renderFile);
app.set("view engine", "html");

// Define a route to render a template
app.get("/", (req, res) => {
  res.render("index", {
    captureDevices,
    captureControllers,
    serverStatusText: serverStatusMessages[currentStatus],
    currentStatus,
  });
});

app.get("/capture", (req, res) => {
  res.render("capture", {});
});

app.post("/api/v1/management/set-device-order", express.json(), (req, res) => {
  captureDevices = req.body.devices.map((id: string) => ({ id }));
  log("info", "Updated capture device order");
  sendManagementUpdate();
  res.json({ success: true });
});

app.post("/api/v1/management/start-capture", (req, res) => {
  if (currentStatus !== "ready") {
    res
      .json({
        success: false,
        error: `Server is not ready to start capturing. Current status is ${currentStatus}`,
      })
      .status(412);
    return;
  }
  currentStatus = "capturing";
  log("info", "Capture started");
  sendManagementUpdate();
});

app.post("/api/v1/management/stop-capture", (req, res) => {
  if (currentStatus !== "capturing") {
    res
      .json({ success: false, error: "Server is currently not capturing" })
      .status(412);
    return;
  }
  currentStatus = "ready";
  log("info", "Capture stopped");
  sendManagementUpdate();
});

app.post("/api/v1/capture", express.json(), async (req, res) => {
  if (currentStatus !== "capturing") {
    res
      .json({
        success: false,
        error: "Server is currently not in the capture status",
      })
      .status(412);
    return;
  }
  const now = new Date();
  const captureId = `${now.getUTCFullYear()}${now.getUTCMonth()}${now.getUTCDay()}-${now.getHours()}${now.getMinutes()}${now.getSeconds()}-${nanoid(
    3
  )}`;
  log("info", `New capture started: ${captureId}`);
  await mkdir(`./captures/${captureId}`, { recursive: true });
  io.to("capture-device").emit("capture-now", { captureId });
  res.json({ success: true, captureId }).status(200);
});

app.put(
  "/api/v1/captures/:captureId/photos/:deviceId",
  upload.single("photo"),
  async (req, res) => {
    const captureId = req.params.captureId;
    const deviceId = req.params.deviceId;
    log(
      "info",
      `Received photo for capture ${captureId} from device ${deviceId}`
    );

    try {
      if (!req.file) {
        res.status(400).json({ error: "No file uploaded" });
        return;
      }
      res.json({
        success: true,
        message: "File uploaded successfully",
        filename: req.file.filename,
        path: req.file.path,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
    try {
      if (allUploadsComplete(captureId)) {
        log("info", `All photos received for capture ${captureId}`);
        generateVideo(captureId);
      }
    } catch (err) {
      fault(err);
    }
  }
);

function allUploadsComplete(captureId: string) {
  return captureDevices.every((device) => {
    return statSync(`./captures/${captureId}/${device.id}.jpg`).isFile();
  });
}

async function generateVideo(captureId: string) {
  log("info", `Starting FFMPEG for capture ${captureId}`);
  // Start FFMPEG
  // Create a temporary directory to store the resized images
  const tempDir = (await $`mktemp -d`.text()).trimEnd();
  try {
    // Resize and copy the images to the temporary directory
    for (const file of readdirSync(`./captures/${captureId}`)) {
      //   convert "$file" -resize 2160x3840 "$temp_dir/$(basename "$file")"
      const src = `./captures/${captureId}/${file}`;
      const dst = `${tempDir}/${captureDevices.findIndex(
        (dev) => dev.id === file.split(".jpg")[0]
      )}.jpg`;
      log("debug", `Copying ${src} to ${dst}`);
      await $`cp ${src} ${dst}`;
    }
    try {
      await $`ffmpeg -framerate 6 -i "${tempDir}/%d.jpg" -c:v libx264 -r 30 -pix_fmt yuvj422p "${tempDir}/single.mp4"`.quiet();
      await $`ffmpeg -y -i "${tempDir}/single.mp4" -filter_complex '[0]reverse[r];[0][r][0]concat=n=3' "./captures/${captureId}/${captureId}.mp4"`.quiet();
      //     await $`ffmpeg -framerate 12 -autorotate -i "${tempDir}/%d.jpg" -filter_complex \
      // 'format=yuv420p,[0]split=3[f1][f2][f3];[f2]reverse[r];[f1][r][f3]concat=n=3:v=1:a=0' \
      // -c:v libx264 -r 30 -pix_fmt yuvj422p \
      // "./captures/${captureId}/${captureId}.mp4"`.quiet();
      log("info", `Video for capture ${captureId} generated`);
    } catch (err) {
      log("error", `Failed to generate video for capture ${captureId}`);
      log("error", err.stdout.toString());
      log("error", err.stderr.toString());
    }
  } catch (error) {
    log("error", `Failed to process capture ${captureId}: ${error.message}`);
  } finally {
    await $`rm -rf "${tempDir}"`;
  }
}

app.post(
  "/api/v1/debug/connect-capture-controller",
  express.json(),
  (req, res) => {
    connectCaptureController(req.body.id);
    res.json({ success: true });
  }
);

app.post("/api/v1/debug/generate-dummy-devices", express.json(), (req, res) => {
  console.log("Generating dummy devices");
  const count = 2 + Math.ceil(Math.random() * 10);
  console.log("Generating " + count + " devices");
  for (let i = 0; i < count; i++) {
    connectCaptureDevice({
      socketId: Math.random().toString(36).substring(3, 8),
      id: Math.random().toString(36).substring(3, 8),
    });
  }
  res.json({ captureDevices });
});

// Socket.IO connection handler
io.on("connection", (socket) => {
  if (socket.handshake.headers["role"] === "management") {
    socket.join("management");
    log("info", "Managment device connected");
  } else if (socket.handshake.headers["role"] === "capture-controller") {
    socket.join("capture-controller");
    connectCaptureController(socket.id);
  } else if (socket.handshake.headers["role"] === "capture-device") {
    socket.join("capture-device");
    connectCaptureDevice({
      socketId: socket.id,
      id: socket.handshake.headers["id"] as string,
    });
  }
  socket.on("error", (err) => {
    log("error", `Socket.IO error ${err}`);
  });
  socket.on("log", (data) => {
    io.to("management").emit("log", data);
  });
  socket.on("disconnect", () => {
    potentiallyDisconnectCaptureController(socket.id);
    potentiallyDisconnectCaptureDevice(socket.id);
  });

  // This is for handling the preview WebRTC stream
  // Handle room joining
  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  // Handle offer forwarding
  socket.on("offer", (data) => {
    socket.to(data.roomId).emit("offer", data.offer);
    console.log(`Forwarded offer to room ${data.roomId}:`);
    console.dir(data.offer);
  });

  // Handle answer forwarding
  socket.on("answer", (data) => {
    socket.to(data.roomId).emit("answer", data.answer);
    console.log(`Forwarded answer to room ${data.roomId}: ${data.answer}`);
    console.dir(data.answer);
  });

  // Handle ICE candidate forwarding
  socket.on("ice-candidate", (data) => {
    socket.to(data.roomId).emit("ice-candidate", data);
    console.log(
      `Forwarded ICE candidate to room ${data.roomId}: ${data.candidate}`
    );
    console.dir(data.candidate);
  });

  socket.on("start-preview", () => {
    io.emit("preview_enable");
  });
});

io.on("error", (err) => {
  log("error", `Socket.IO error ${err}`);
});

// Start the server
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, async () => {
  const options = { family: 4 };

  const addr = await dns.lookup(os.hostname(), options);
  console.log(`Server is now running.`);
  console.log(`🔧 Management UI: http://localhost:${PORT}`);
  console.log(`🎛️  Capture Controller: http://${addr.address}:${PORT}/capture`);
  console.log(`📸 Capture Device: ${addr.address}:${PORT}`);
});
