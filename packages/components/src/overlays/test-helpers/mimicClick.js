async function sleep(t = 0) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(true);
    }, t);
  });
}

/**
 * @param {HTMLElement} el
 * @param {{isAsync?:boolean, releaseElement?: HTMLElement}} [config]
 */
export async function mimicClick(el, { isAsync, releaseElement } = { isAsync: false }) {
  const releaseEl = releaseElement || el;
  el.dispatchEvent(new MouseEvent('mousedown'));
  if (isAsync) {
    await sleep();
  }
  releaseEl.dispatchEvent(new MouseEvent('click'));
  releaseEl.dispatchEvent(new MouseEvent('mouseup'));
}
