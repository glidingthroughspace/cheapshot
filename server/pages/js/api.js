import { log } from "./log.js";

export async function triggerSnapshot() {
  const response = await fetch("/snapshots", { method: "POST" });
  if (!response.ok) {
    log("error", "Taking photo failed", response.status, response.statusText);
    throw new APIError("Taking photo failed", true, {
      action: "fetch",
      result: {
        status: response.status,
        statusText: response.statusText,
      },
    });
  }
  const snapshotID = await response.text();
  log("info", "Triggered okay, snapshot ID is", snapshotID);
  return snapshotID;
}

export async function pollForSnapshotReady(snapshotID) {
  let response;
  do {
    response = await fetch("/snapshots/" + snapshotID, {
      method: "HEAD",
    });
    if (!response.ok) {
      log(
        "error",
        "Fetching snapshot failed",
        response.status,
        response.statusText
      );
      throw new APIError("Fetching snapshot status failed", true, {
        action: "fetch",
        result: {
          status: response.status,
          statusText: response.statusText,
        },
      });
    }
    log("info", "Snapshot not ready yet, retrying in 250ms");
    await new Promise((resolve) => setTimeout(resolve, 250));
  } while (response.status === 206);
  log("info", "Snapshot is ready");
}

export async function getPreviewIPAddress() {
  const response = await fetch("/preview-ip");
  if (!response.ok) {
    log(
      "error",
      "Fetching preview IP failed",
      response.status,
      response.statusText
    );
    throw new APIError("Fetching preview IP failed", false, {
      action: "fetch",
      result: {
        status: response.status,
        statusText: response.statusText,
      },
    });
  }
  return response.text();
}

export class APIError extends Error {
  constructor(message, requiresOperator, debugInfo) {
    super(message);
    this.requiresOperator = requiresOperator;
    this.debugInfo = debugInfo;
  }
}
