/**
 * @param timeout (ms how long to debounce)
 * @param cancelDebounce (cancels ongoing debounce and executes instantly whatever was waiting)
 */

/**
 * Debounce a method
 */
export function NgDebounce(timeout: number, randomize?: boolean, cancelDebounce?: CallableFunction) {
  // store timeout value for cancel the timeout
  let timeoutRef: any = null;

  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {

    // store original function for future use
    const original = descriptor.value;

    // override original function body
    descriptor.value = function debounce(...args: any[]) {

      if (randomize) {
        timeout = Math.floor(Math.random() * timeout)
      }

      // clear previous timeout
      clearTimeout(timeoutRef);

      // schedule timer
      timeoutRef = setTimeout(() => {

        // call original function
        original.apply(this, args);

      }, timeout);

      if (cancelDebounce) {
        // define a property to cancel existing debounce timer
        Object.defineProperty(debounce, 'cancelDebounce', {
          value: function() {
            clearTimeout(timeoutRef);
          }
        })
      }

    }

    // return descriptor with new value
    return descriptor;
  }
}
