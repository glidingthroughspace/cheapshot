const trigger = document.getElementById("trigger");
const previewImage = document.getElementById("preview");
const countdownContainer = document.getElementById("countdownContainer");

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function countdown(number) {
  console.log("Countdown", number, "...");
  countdownContainer.innerText = number;
  if (number > 0) {
    countdownContainer.classList.add("visible");
    await delay(1000);
    await countdown(number - 1);
  } else {
    countdownContainer.classList.remove("visible");
  }
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
}

trigger.addEventListener(
  "click",
  (ev) => {
    doTrigger();
    ev.preventDefault();
  },
  false
);
