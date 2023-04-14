const matchReverseFns = new WeakMap();

/**
 * @param {Node} root
 * @param {string} matchingString
 */
export function makeMatchingTextBold(root, matchingString) {
  Array.from(root.childNodes).forEach(childNode => {
    if (childNode.nodeName === '#text') {
      // check for match based on nodeValue

      const re = new RegExp(`^(.*?)(${matchingString})(.*)$`, 'i');
      // @ts-ignore
      const match = childNode.nodeValue.match(re);

      if (match) {
        // 1. textContent before match
        const textBefore = document.createTextNode(match[1]);
        root.appendChild(textBefore);

        // 2. matched part
        const boldElement = document.createElement('b');
        // eslint-disable-next-line prefer-destructuring
        boldElement.textContent = match[2];
        root.appendChild(boldElement);

        // 3. textContent after match
        const textAfter = document.createTextNode(match[3]);
        root.appendChild(textAfter);

        root.removeChild(childNode);

        matchReverseFns.set(root, () => {
          root.appendChild(childNode);
          if (root.contains(textBefore) && textBefore.parentNode !== null) {
            textBefore.parentNode.removeChild(textBefore);
          }
          if (root.contains(boldElement) && boldElement.parentNode !== null) {
            boldElement.parentNode.removeChild(boldElement);
          }
          if (root.contains(textAfter) && textAfter.parentNode !== null) {
            textAfter.parentNode.removeChild(textAfter);
          }
        });
      }
    } else {
      makeMatchingTextBold(childNode, matchingString);
    }
  });
}

/**
 * @param {Node} root
 */
export function unmakeMatchingTextBold(root) {
  if (matchReverseFns.has(root)) {
    matchReverseFns.get(root)();
  }
  Array.from(root.childNodes).forEach(childNode => {
    if (childNode.nodeName === '#text') {
      if (matchReverseFns.has(childNode)) {
        matchReverseFns.get(childNode)();
      }
    } else {
      unmakeMatchingTextBold(childNode);
    }
  });
}
