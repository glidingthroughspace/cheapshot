import { getPreviewIPAddress } from "./api.js";

const debugServerHealth = document.querySelector("#debugServerHealth");
debugServerHealth?.addEventListener("click", async () => {
  const previousText = debugServerHealth.textContent;
  try {
    const response = await fetch("/health");
    if (response.ok) {
      debugServerHealth.textContent = "✅ Server reachable";
      await new Promise((resolve) => setTimeout(resolve, 1000));
      debugServerHealth.textContent = previousText;
    } else {
      debugServerHealth.textContent = "❌ Server unreachable";
      await new Promise((resolve) => setTimeout(resolve, 1000));
      debugServerHealth.textContent = previousText;
      alert("Server is unhealthy");
    }
  } catch (err) {
    debugServerHealth.textContent = "❌ Server unreachable";
    await new Promise((resolve) => setTimeout(resolve, 1000));
    debugServerHealth.textContent = previousText;
  }
});

const debugEnablePreview = document.querySelector("#debugEnablePreview");
debugEnablePreview?.addEventListener("click", async () => {
  try {
    const previewIP = await getPreviewIPAddress();
    alert(previewIP);
    console.log(previewIP);
  } catch (e) {
    alert("Failed to get preview phone IP: " + e);
  }
});
