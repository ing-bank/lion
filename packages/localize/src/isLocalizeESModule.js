/* eslint-disable no-underscore-dangle */

export default function isLocalizeESModule(obj) {
  return !!(obj && obj.default && typeof obj.default === 'object' && Object.keys(obj).length === 1);
}
