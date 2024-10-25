/**
 * Returns a promise that resolves after a given amount of time
 * @param {number} durationInMs Time in milliseconds to delay
 * @returns {Promise<void>} A promise that resolves after the given duration
 */
export function delay(durationInMs) {
  return new Promise((resolve) => {
    setTimeout(resolve, durationInMs);
  });
}
