module.exports = async function transformerWrapper(/* fileInfo, api, options */) {
  return 'export const updated = true;';
};
