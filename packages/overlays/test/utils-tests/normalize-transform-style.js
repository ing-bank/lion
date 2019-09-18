/**
 * @desc Compensates for browsers that use floats in output
 * @param {string} cssValue
 */
export function normalizeTransformStyle(cssValue) {
  // eslint-disable-next-line no-unused-vars
  const [_, transformType, positionPart] = cssValue.match(/(.*)\((.*?)\)/);
  const numberswithPx = positionPart.split(',').map(p => p.replace('px', ''));
  const normalizedNumbers = numberswithPx.map(n => {
    const number = Number(n.replace('px', ''));
    return Math.floor(number);
  });
  return `${transformType}(${normalizedNumbers
    .map((n, i) => `${n}px${normalizedNumbers.length - 1 === i ? '' : ', '}`)
    .join('')})`;
}
