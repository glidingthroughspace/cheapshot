let timeout = 3;
let countdownInterval = null;

function advanceCountdown() {
  timeout--;
  countdown.innerText = timeout;
  if (timeout <= 0) {
    clearInterval(countdownInterval);
    triggerSnapshot();
    countdown.classList.remove("active");
    timeout = 3;
  }
}

async function triggerSnapshot() {
  const response = await fetch("/trigger", { method: "POST" });
  if (!response.ok) {
    console.error("Taking photo failed", response.status, response.statusText);
  }
  const snapshotID = await response.text();
  console.log("Triggered okay, snapshot ID is", snapshotID);
  previewLoadingIndicator.classList.add("active");
}

function trigger() {
  console.log("Triggering a shot");
  countdown.classList.add("active");
  countdownInterval = setInterval(advanceCountdown, 1000);
}
