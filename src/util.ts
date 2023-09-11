export function tryCatch<R, E extends Error>(func: Function, ...args: unknown[]): [E | undefined, R | undefined] {
  try {
    return [undefined, func(...args)]
  } catch (err) {
    return [err, undefined]
  }
}
