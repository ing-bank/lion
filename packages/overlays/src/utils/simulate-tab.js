import { getFocusableElements } from './get-focusable-elements.js';

export function simulateTab(node = document.body) {
  const current = document.activeElement;
  const all = getFocusableElements(node);

  const currentIndex = all.indexOf(current);
  let nextIndex = currentIndex + 1;
  if (nextIndex === all.length) {
    nextIndex = 0;
  }

  all[nextIndex].focus();
}
