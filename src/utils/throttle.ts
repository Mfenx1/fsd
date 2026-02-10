export const throttle = <A extends unknown[]>(
  fn: (...args: A) => void,
  delayMs: number
): ((...args: A) => void) => {
  let lastCall = 0;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: A | null = null;

  const run = (args: A) => {
    lastCall = Date.now();
    lastArgs = null;
    fn(...args);
  };

  return (...args: A) => {
    lastArgs = args;
    const now = Date.now();

    if (now - lastCall >= delayMs) {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      run(args);
    } else if (!timeoutId) {
      timeoutId = setTimeout(() => {
        timeoutId = null;
        if (lastArgs) run(lastArgs);
      }, delayMs - (now - lastCall));
    }
  };
};
