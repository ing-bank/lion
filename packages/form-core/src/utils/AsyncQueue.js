// TODO: still needed? It can be solved with while loop as well

/**
 * Use the `.add` method to add async functions to the queue
 * Await the `.complete` if you want to ensure the queue is empty at any point
 * `complete` resolves whenever no more tasks are running.
 * Important note: Currently runs tasks 1 by 1, there is no concurrency option at the moment
 */
export class AsyncQueue {
  constructor() {
    this.__running = false;
    /** @type {function[]} */
    this.__queue = [];
  }

  /**
   *
   * @param {function} task
   */
  add(task) {
    this.__queue.push(task);
    if (!this.__running) {
      // We have a new queue, because before there was nothing in the queue
      this.complete = new Promise(resolve => {
        /** @type {function} */
        this.__callComplete = resolve;
      });
      this.__run();
    }
  }

  async __run() {
    this.__running = true;
    await this.__queue[0]();
    this.__queue.shift();
    if (this.__queue.length > 0) {
      this.__run();
    } else {
      this.__running = false;
      if (this.__callComplete) {
        this.__callComplete();
      }
    }
  }
}
