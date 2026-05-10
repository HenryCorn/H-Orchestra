export function debounce<T extends (...args: Parameters<T>) => void>(
  fn: T,
  delayMs: number
): (...args: Parameters<T>) => void {
  const timers = new Map<string, ReturnType<typeof setTimeout>>();

  return (...args: Parameters<T>) => {
    // Use first argument as the debounce key (file path)
    const key = String((args as unknown[])[0]);
    const existing = timers.get(key);
    if (existing) clearTimeout(existing);
    timers.set(
      key,
      setTimeout(() => {
        timers.delete(key);
        fn(...args);
      }, delayMs)
    );
  };
}
