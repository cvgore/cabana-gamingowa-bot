/**
 * @template T
 */
export default class EventableQueue {
  /**
   * @type T[]
   */
  #queue = [];
  /**
   * emptied - called when no more values are present in queue
   * filled - called when first value is inserted into queue
   * queued - called when value is inserted into queue EVERY TIME
   *
   * @type {{emptied: Function[], filled: Function[], queued: Function[]}}
   */
  #listeners = {};

  /**
   * @param {T} type
   */
  constructor(type) {}

  /**
   * @type {T} what
   */
  push(what) {
    this.#queue.push(what);

    this.#emit("queued");

    if (this.#queue.length === 1) {
      this.#emit("filled");
    }
  }

  /**
   * @return {T|null}
   */
  take() {
    if (this.#queue.length === 0) {
      return null;
    }

    const element = this.#queue.shift();

    if (this.#queue.length === 0) {
      this.#emit("emptied");
    }

    return element;
  }

  /**
   * @param {'emptied'|'filled'|'queued'} what
   * @param {unknown[]} args
   */
  #emit(what, ...args) {
    for (const listener of this.#listeners[what]) {
      setTimeout(() => listener(...args), 0);
    }
  }
}
