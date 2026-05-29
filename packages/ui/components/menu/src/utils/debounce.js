/**
 * @template T
 * @param {Function & T} mainFunction
 * @param {{delay?:number;}} config
 * @returns {Promise<Function & T>}
 */
export function debounce(mainFunction, { delay = 200 }) {
  // Declare a variable called 'timer' to store the timer ID
  // eslint-disable-next-line jsdoc/no-undefined-types
  /** @type {NodeJS.Timeout} */
  let timer;

  // Return an anonymous function that takes in any number of arguments
  // eslint-disable-next-line jsdoc/no-undefined-types
  return /** @type {* & Function & T} */ (
    // eslint-disable-next-line jsdoc/require-returns
    /** @param {Parameters<T>} args */
    function (...args) {
      // Clear the previous timer to prevent the execution of 'mainFunction'
      clearTimeout(timer);

      //   if (isAsync) {
      // Return a promise that resolves after the specified delay
      return new Promise(resolve => {
        // Set a new timer that will execute 'mainFunction' after the specified delay
        timer = setTimeout(() => {
          resolve(mainFunction(...args));
        }, delay);
      });
      //   }
      //   // Set a new timer that will execute 'mainFunction' after the specified delay
      //   timer = setTimeout(() => {
      //     mainFunction(...args);
      //   }, delay);
    }
  );
}
