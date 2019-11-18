export class AsyncQueue {
  constructor() {
    this.__running = false;
    this.__queue = [];
  }

  add(task) {
    this.__queue.push(task);
    if (!this.__running) {
      // aka we have a new queue, because before there was nothing in the queue
      this.complete = new Promise(resolve => {
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
      // queue is empty again, so call complete
      this.__running = false;
      this.__callComplete();
    }
  }
}
