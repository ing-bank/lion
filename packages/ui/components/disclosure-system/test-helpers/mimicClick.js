async function sleep(t = 0) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(true);
    }, t);
  });
}

/**
 * @param {HTMLElement} el
 * @param {{isAsync?:boolean, releaseElement?: HTMLElement}} config releaseElement can be different when the mouse is dragged before release
 */
export async function mimicClick(el, { isAsync = false, releaseElement } = {}) {
  const releaseEl = releaseElement || el;
  el.dispatchEvent(new MouseEvent('mousedown'));
  if (isAsync) {
    await sleep();
  }
  releaseEl.dispatchEvent(new MouseEvent('click'));
  releaseEl.dispatchEvent(new MouseEvent('mouseup'));
}
