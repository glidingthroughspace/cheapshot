/**
 * This function returns a `log` function which can be used to log messages to the given element.
 * @param {HTMLElement} element The element to append log lines to
 * @returns {Function} The `log` function which can be used to log messages to the given element
 */
export function createLocalLogger(sourceName, element) {
  /**
   * This function logs a message to the given element.
   * @param {Object} logObject The log object
   * @param {string} logObject.level The log level. Will be used as a class name
   * @param {number} logObject.timestamp The timestamp of the log message
   * @param {string} logObject.source The source of the log message, should be 5 characters long
   * @param {string} logObject.message The log message
   */
  return function log(
    level,
    message,
    timestamp = Date.now(),
    source = sourceName
  ) {
    element.insertAdjacentHTML(
      "afterbegin",
      `<pre class="log ${level}">${new Date(timestamp)
        .toTimeString()
        .substring(0, 8)} @ ${source}: ${message}</pre>`
    );
  };
}

export function createRemoteLogger(sourceName, socket) {
  return async function log(level, message) {
    socket.emit("log", {
      source: sourceName,
      timestamp: new Date(),
      level,
      message,
    });
  };
}
