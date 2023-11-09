import toBabel from 'swc-to-babel';

/**
 * @typedef {import('@babel/types').File} File
 */

/**
 * Internal wrapper around swc-to-babel...
 * Allows to easily switch all swc based analyzers to Babel in case
 * they turn out to be not stable yet (for instance printing a transformed ast with @babel/generator)
 * Checks first whether it gets a Babel ast provided or not...
 * @param {*} swcOrBabelAst
 * @param {string} source
 * @returns {File}
 */
export function guardedSwcToBabel(swcOrBabelAst, source) {
  const isSwcAst = swcOrBabelAst.type === 'Module';
  if (isSwcAst) {
    // @ts-ignore
    return toBabel(swcOrBabelAst, source);
  }
  return swcOrBabelAst;
}
