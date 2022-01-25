/**
 * @param throttleMs (ms how long to throttle)
 */

/**
 * Throttle a method
 */
export function NgThrottle(throttleMs: number) {
  let timeout: any;

  return function(
    target: any,
    methodKey: string,
    descriptor: PropertyDescriptor
  ): void | PropertyDescriptor {
    const original = descriptor.value;

    descriptor.value = function(...args: any[]) {
      if (timeout) {
        return;
      }

      timeout = setTimeout(() => {
        timeout = undefined;
      }, throttleMs);
      original.apply(this, args);
    };

    return descriptor;
  };
}
