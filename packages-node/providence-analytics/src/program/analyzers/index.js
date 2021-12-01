// A base class for writing Analyzers
const { Analyzer } = require('../core/Analyzer.js');

// Expose analyzers that are requested to be run in external contexts
const FindExportsAnalyzer = require('./find-exports.js');
const FindImportsAnalyzer = require('./find-imports.js');
const MatchImportsAnalyzer = require('./match-paths.js');

module.exports = {
  Analyzer,
  FindExportsAnalyzer,
  FindImportsAnalyzer,
  MatchImportsAnalyzer,
};
