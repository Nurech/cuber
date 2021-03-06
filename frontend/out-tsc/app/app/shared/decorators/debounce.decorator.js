/**
 * @param timeout (ms how long to debounce)
 * @param cancelDebounce (cancels ongoing debounce and executes instantly whatever was waiting)
 * Usage: look example, provide @ngBounce(3000) above a method to debounce the method for 3 sec
 * Joosep
 */
// @NgDebounce(3000)
// callMe(name) {
//   console.log('I am debouncing');
// }
/**
 * Debounce a method
 */
export function NgDebounce(timeout, randomize, cancelDebounce) {
    // store timeout value for cancel the timeout
    let timeoutRef = null;
    return function (target, propertyKey, descriptor) {
        // store original function for future use
        const original = descriptor.value;
        // override original function body
        descriptor.value = function debounce(...args) {
            if (randomize) {
                timeout = Math.floor(Math.random() * timeout);
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
                    value: function () {
                        clearTimeout(timeoutRef);
                    }
                });
            }
        };
        // return descriptor with new value
        return descriptor;
    };
}
//# sourceMappingURL=debounce.decorator.js.map