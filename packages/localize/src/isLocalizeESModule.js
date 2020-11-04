/**
 * @param {Object.<string, Object>} obj
 * @returns {boolean}
 */
export default function isLocalizeESModule(obj) {
  return !!(obj && obj.default && typeof obj.default === 'object' && Object.keys(obj).length === 1);
}
