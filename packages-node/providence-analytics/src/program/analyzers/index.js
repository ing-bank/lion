// A base class for writing Analyzers
const { Analyzer } = require('./helpers/Analyzer.js');

// Expose analyzers that are requested to be run in external contexts
const FindExportsAnalyzer = require('./find-exports.js');
const FindImportsAnalyzer = require('./find-imports.js');
const MatchImportsAnalyzer = require('./match-paths.js');

const {
  transformIntoIterableFindImportsOutput,
} = require('./helpers/transform-into-iterable-find-imports-output.js');
const {
  transformIntoIterableFindExportsOutput,
} = require('./helpers/transform-into-iterable-find-exports-output.js');

module.exports = {
  Analyzer,
  FindExportsAnalyzer,
  FindImportsAnalyzer,
  MatchImportsAnalyzer,
  transformIntoIterableFindImportsOutput,
  transformIntoIterableFindExportsOutput,
};
