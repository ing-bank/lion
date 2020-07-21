/**
 * @param {Object} obj
 * @param {Object} obj.default
 */
export default function isLocalizeESModule(obj) {
  return !!(obj && obj.default && typeof obj.default === 'object' && Object.keys(obj).length === 1);
}
