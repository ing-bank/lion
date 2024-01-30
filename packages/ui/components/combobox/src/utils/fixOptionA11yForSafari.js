/**
 * @typedef {import('@lion/ui/listbox.js').LionOption} LionOption
 */

const matchA11ySpanReverseFns = new WeakMap();

/**
 * For Safari, we need to add a label to the element
 * Create a wrapping span: => `<my-option><b>my</b> text</my-option>`
 * becomes `<my-option><span aria-label="my text"><b>my</b> text</span></my-option>`
 * @param {Element} option
 */
export function fixOptionA11yForSafari(option) {
  if (!option.textContent) {
    return;
  }

  // [1] Wrap the content in a span with an aria-label
  // `<my-option><b>my</b> text</my-option>` =>
  // `<my-option><span aria-label="my text"><b>my</b> text</span></my-option>`
  const a11ySpan = document.createElement('span');
  a11ySpan.setAttribute('aria-label', option.textContent.replace(/\s+/g, ' '));
  for (const childNode of Array.from(option.childNodes)) {
    a11ySpan.appendChild(childNode);
  }
  option.appendChild(a11ySpan);

  // [2] Store a function to call later, that does:
  // `<my-option><span aria-label="my text"><b>my</b> text</span></my-option>` =>
  // `<my-option><b>my</b> text</my-option>`
  matchA11ySpanReverseFns.set(option, () => {
    for (const childNode of Array.from(a11ySpan.childNodes)) {
      option.appendChild(childNode);
    }
    if (option.contains(a11ySpan)) {
      option.removeChild(a11ySpan);
    }
  });
}

/**
 * @param {Element} option
 */
export function cleanupOptionA11yForSafari(option) {
  if (matchA11ySpanReverseFns.has(option)) {
    matchA11ySpanReverseFns.get(option)();
  }
  matchA11ySpanReverseFns.delete(option);
}
