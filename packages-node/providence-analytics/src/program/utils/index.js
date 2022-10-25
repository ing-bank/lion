const {
  getSourceCodeFragmentOfDeclaration,
  getFilePathOrExternalSource,
} = require('./get-source-code-fragment-of-declaration.js');
const { memoize } = require('./memoize.js');
const { toRelativeSourcePath, isRelativeSourcePath } = require('./relative-source-path.js');

// TODO: move trackdownIdentifier to utils as well

module.exports = {
  memoize,
  getSourceCodeFragmentOfDeclaration,
  getFilePathOrExternalSource,
  toRelativeSourcePath,
  isRelativeSourcePath,
};
