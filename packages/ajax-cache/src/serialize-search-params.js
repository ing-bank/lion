/**
 * @typedef {Object} Params
 * @property {{[key:string]: string}=} _
 */

/**
 * Serialize search parameters into url query string parameters.
 * If params === null, returns ''
 * @param {Params} params query string parameters object
 * @returns {string} of querystring parameters WITHOUT `?` or empty string ''
 */
export const searchParamSerializer = params =>
  params
    ? Object.keys(params)
        .map(key => `${key}=${params[key]}`)
        .join('&')
    : '';
