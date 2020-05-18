/**
 * @desc Compensates for browsers that use floats in output
 * - from: 'transform3d(12.25px, 6.75px, 0px)'
 * - to: 'transform3d(12px, 7px, 0px)'
 * @param {string} cssValue
 */
export function normalizeTransformStyle(cssValue) {
  // eslint-disable-next-line no-unused-vars
  const [_, transformType, positionPart] = cssValue.match(/(.*)\((.*?)\)/);
  const normalizedNumbers = positionPart
    .split(',')
    .map(p => Math.round(Number(p.replace('px', ''))));
  return `${transformType}(${normalizedNumbers
    .map((n, i) => `${n}px${normalizedNumbers.length - 1 === i ? '' : ', '}`)
    .join('')})`;
}
