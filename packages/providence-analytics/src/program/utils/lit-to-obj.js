// import htm from 'htm';
const htm = require('htm');

function convertToObj(type, props, ...children) {
  return { type, props, children };
}

/**
 * @desc
 * Used for parsing lit-html templates inside ASTs
 * @returns {type, props, children}
 *
 * @example
 * litToObj`<h1 .id=${'hello'}>Hello world!</h1>`;
 * // {
 * //  type: 'h1',
 * //  props: { .id: 'hello' },
 * //  children: ['Hello world!']
 * // }
 */
const litToObj = htm.bind(convertToObj);

module.exports = litToObj;
