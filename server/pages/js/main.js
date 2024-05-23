import { APIError, pollForSnapshotReady, triggerSnapshot } from "./api.js";
import { countdown } from "./countdown.js";
import { log } from "./log.js";

const previewLoadingIndicator = document.querySelector(
  "#previewLoadingIndicator"
);

const countdownElement = document.querySelector("#countdown");

function onCountdownAdvance(val) {
  if (countdownElement) {
    countdownElement.textContent = val;
  } else {
    log("error", "No countdown element found");
  }
}

function onCountdownTimeout() {
  takeSnapshot();
  countdownElement?.classList.remove("active");
}

async function takeSnapshot() {
  try {
    const snapshotID = await triggerSnapshot();
    previewLoadingIndicator?.classList.add("active");
    log("debug", "Polling for snapshot in 250ms");
    await pollForSnapshotReady(snapshotID);
    previewLoadingIndicator?.classList.remove("active");
    // resultVideo.setAttribute("src", "/snapshots/" + snapshotID);
    // resultVideo.style.visibility = "visible";
  } catch (err) {
    if (err instanceof APIError) {
      if (err.requiresOperator) {
        log(
          "error",
          "Operator debug information",
          JSON.stringify(err.debugInfo, null, 2)
        );
        alert("Operator intervention required");
        window.location.reload();
      } else {
        log("error", "Unexpected error", err.debugInfo);
      }
    }
  }
}

function trigger() {
  log("info", "Triggering a shot");
  countdownElement?.classList.add("active");
  countdown(onCountdownAdvance, onCountdownTimeout);
}

document.querySelector("#trigger").addEventListener("click", trigger);

window.addEventListener("keyup", function (event) {
  if (event.key === "d") {
    this.document.querySelector("#debug").classList.toggle("visible");
  }
});
