/**
 * @desc Readable way to do an async forEach
 * Since predictability mathers, all array items will be handled in a queue;
 * one after anotoher
 * @param {array} array
 * @param {function} callback
 */
async function aForEach(array, callback) {
  for (let i = 0; i < array.length; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    await callback(array[i], i);
  }
}
/**
 * @desc Readable way to do an async forEach
 * Since predictability mathers, all array items will be handled in a queue;
 * one after anotoher
 * @param {array} array
 * @param {function} callback
 */
async function aForEachNonSequential(array, callback) {
  return Promise.all(array.map(callback));
}
/**
 * @desc Readable way to do an async map
 * Since predictability is crucial for a map, all array items will be handled in a queue;
 * one after anotoher
 * @param {array} array
 * @param {function} callback
 */
async function aMap(array, callback) {
  const mappedResults = [];
  for (let i = 0; i < array.length; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    const resolvedCb = await callback(array[i], i);
    mappedResults.push(resolvedCb);
  }
  return mappedResults;
}

module.exports = { aForEach, aMap, aForEachNonSequential };
