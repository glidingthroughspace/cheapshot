async function requestWakeLock() {
  try {
    wakeLock = await navigator.wakeLock.request("screen");
    console.log("Wake Lock is active");
  } catch (err) {
    alert("Unable to acquire wake lock");
  }
}

// The width and height of the captured photo. We will set the
// width to the value defined here, but the height will be
// calculated based on the aspect ratio of the input stream.

requestWakeLock();

const width = 1080; // We will scale the photo width to this
let height = 0; // This will be computed based on the input stream

// |streaming| indicates whether or not we're currently streaming
// video from the camera. Obviously, we start at false.

let streaming = false;

// The various HTML elements we need to configure or control. These
// will be set by the startup() function.

let video = null;
let canvas = null;
let trigger = null;

function startup() {
  console.log("Starting up");
  video = document.getElementById("preview");
  canvas = document.getElementById("canvas");
  trigger = document.getElementById("trigger");

  navigator.mediaDevices.enumerateDevices().then((devices) => {
    // alert(JSON.stringify(devices, null, 2));
  });

  navigator.mediaDevices
    .getUserMedia({
      video: { facingMode: "environment", /*width: 1920,*/ height: 1080 },
    })
    .then((stream) => {
      video.srcObject = stream;
      video.play();
    })
    .catch((err) => {
      alert(`An error occurred: ${err}`);
    });

  video.addEventListener(
    "canplay",
    (ev) => {
      if (!streaming) {
        height = video.videoHeight / (video.videoWidth / width);

        // Firefox currently has a bug where the height can't be read from
        // the video, so we will make assumptions if this happens.

        if (isNaN(height)) {
          height = (width / 19) * 9;
        }

        //   video.setAttribute("width", width);
        //   video.setAttribute("height", height);
        canvas.setAttribute("width", width);
        canvas.setAttribute("height", height);
        streaming = true;
      }
    },
    false
  );

  trigger.addEventListener(
    "click",
    (ev) => {
      doTrigger();
      ev.preventDefault();
    },
    false
  );

  var socket = io.connect();
  socket.on("connect", function () {
    console.log("Websocket connected!");
  });
  socket.on("disconnect", function () {
    alert("Disconnected from server");
  });
  socket.on("message", function (msg) {
    console.log("Received message: " + msg);
  });

  socket.on("reload", function () {
    window.location.reload();
  });

  socket.on("take_snapshot", async function (data) {
    takepicture(async function (pictureData) {
      const snapshotId = data.id;
      const photoId = window.phone_index;

      const formData = new FormData();
      console.log(pictureData.length);
      formData.append("photo", pictureData);

      const response = await fetch(
        `/api/v1/snapshots/${snapshotId}/photos/${photoId}`,
        {
          method: "PUT",
          body: formData,
        }
      );
      if (!response.ok) {
        throw new Error("Failed to upload photo");
      }
    });

    clearphoto();
  });
}

// Fill the photo with an indication that none has been
// captured.
function clearphoto() {
  const context = canvas.getContext("2d");
  context.fillStyle = "#AAA";
  context.fillRect(0, 0, canvas.width, canvas.height);

  const data = canvas.toDataURL("image/png");
}

// Capture a photo by fetching the current contents of the video
// and drawing it into a canvas, then converting that to a PNG
// format data URL. By drawing it on an offscreen canvas and then
// drawing that to the screen, we can change its size and/or apply
// other changes before drawing it.
async function doTrigger() {
  await countdown(3);
  console.log("Creating snapshot");
  const response = await fetch(`/api/v1/snapshots`, {
    method: "POST",
  });

  if (!response.ok) {
    alert("Failed to take picture");
    return;
  }

  const { id } = await response.json();

  function poll() {
    setTimeout(async function () {
      const snapshotResponse = await fetch(`/api/v1/snapshots/${id}`, {
        headers: {
          Accept: "application/json",
        },
      });
      const snapshot = await snapshotResponse.json();
      if (snapshot.status === "complete") {
        console.log("Snapshot done");
        return;
      }
      console.log("Snapshot not done yet");
      poll();
    }, 1000);
  }

  poll();
}

function takepicture(callback) {
  const context = canvas.getContext("2d");
  if (width && height) {
    canvas.width = width;
    canvas.height = height;
    context.drawImage(video, 0, 0, width, height);

    canvas.toBlob(callback, "image/webp", 0.95);
  } else {
    clearphoto();
  }
}

// Set up our event listener to run the startup process
// once loading is complete.
// window.addEventListener("load", startup, false);
startup();

async function countdown(number) {
  console.log("Countdown", number, "...");
  let countdownContainer = document.querySelector("#countdownContainer");
  countdownContainer.innerText = number;
  if (number > 0) {
    countdownContainer.classList.add("visible");
    await delay(1000);
    await countdown(number - 1);
  } else {
    countdownContainer.classList.remove("visible");
  }
}

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
