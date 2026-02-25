const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export const debounce = <A extends unknown[]>(
  fn: (...args: A) => void,
  delayMs: number
): ((...args: A) => void) => {
  let version = 0;

  return (...args: A) => {
    version += 1;
    const currentVersion = version;
    delay(delayMs).then(() => {
      if (currentVersion === version) fn(...args);
    });
  };
};