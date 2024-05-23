const functionsByLevel = {
  error: console.error,
  warn: console.warn,
  info: console.info,
  debug: console.debug,
  default: console.warn,
};

/**
 * Logs to the browser console and sends the log to the server depending on its level
 * @param {"error" | "warn" | "info" | "debug"} level
 * @param  {...any} parameters
 */
export function log(level, ...parameters) {
  consoleLog = functionsByLevel[level] ?? functionsByLevel.default;
  consoleLog(...parameters);
  if (level === "warn" || level === "error") {
    fetch("/logs/web", {
      method: "POST",
      body: `[${level.toUpperCase()}] ${parameters
        .map((p) => p.toString())
        .join(" ")}`,
    });
  }
}
