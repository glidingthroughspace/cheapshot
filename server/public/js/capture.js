import { createApiClient } from "./lib/api.js";
import { delay } from "./lib/delay.js";
const socket = io({ extraHeaders: { role: "capture-controller" } });
const countdown = document.querySelector(".countdown");
const trigger = document.querySelector(".trigger");

function log(logEntry) {
  if (logEntry.level === "error") {
    console.error(logEntry);
  }
}

const api = createApiClient(log);

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
    const response = await api("/capture", "POST");
  } catch {
    alert("Failed to trigger"); // FIXME: This should be localized.
  }
  countdown.classList.remove("visible");
});
