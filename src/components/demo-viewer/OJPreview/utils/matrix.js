/**
 * Say we have 3 statesL ['hover', 'focus', 'pressed']
 * We want all possible combinations of these states:
 * - ['', '', ''] (none)
 * - ['hover', '', ''] (one state pos1)
 * - ['', 'focus', ''] (one state pos2)
 * - ['', '', 'pressed'] (one state pos3)
 * - ['hover', 'focus', ''] (two states pos1)
 * - ['', 'focus', 'pressed'] (two states pos2)
 * - ['hover', '', 'pressed'] (two states pos3)
 * - ['hover', 'focus', 'pressed'] (all)
 *
 * Create a matrix of 0s and 1s that can be mapped to the state boolean values
 * Adds 0 and 1 to each entry in the matrix on every iteration
 * - [[]]
 * - [[0], [1]]
 * - [[0,0], [0,1], [1,0], [1,1]]
 * - etc.
 * The 0s and 1s can be mapped to the state boolean values above
 * @param {number} iterationsLeft
 * @param {Array<Array<number>>} arr
 * @returns {Array<Array<number>>}
 */
export function multiplyMatrix(iterationsLeft, arr = [[]]) {
  if (iterationsLeft === 0) return arr;

  /** @type {Array<Array<number>>} */
  const newArr = [];
  for (const entry of arr) {
    newArr.push([0, ...entry]);
    newArr.push([1, ...entry]);
  }
  return multiplyMatrix(iterationsLeft - 1, newArr);
}
