const TIMEOUT = 3;

/**
 * countdown start counting down from the TIMEOUT value to 0 and calls onAdvance on every tick (once a second) and onTimeout when the countdown reaches 0.
 * onAdvance is also called before the first tick.
 * @param {Function(val: number)} onAdvance called on each tick
 * @param {Function} onTimeout called when the countdown reaches 0
 */
export function countdown(onAdvance, onTimeout) {
  let timeout = TIMEOUT;
  onAdvance(timeout);
  const countdownInterval = setInterval(() => {
    timeout--;
    onAdvance(timeout);
    if (timeout <= 0) {
      clearInterval(countdownInterval);
      onTimeout();
    }
  }, 1000);
}
