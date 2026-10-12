// A base class for writing Analyzers
export { Analyzer } from '#core/Analyzer.js';

// Expose analyzers that are requested to be run in external contexts
export { default as FindExportsAnalyzer } from '#analyzers/find-exports.js';
export { default as FindImportsAnalyzer } from '#analyzers/find-imports.js';
export { default as MatchImportsAnalyzer } from '#analyzers/match-imports.js';
export { default as MatchSubclassesAnalyzer } from '#analyzers/match-subclasses.js';

export { transformIntoIterableFindImportsOutput } from '#analyzers/helpers/transform-into-iterable-find-imports-output.js';
export { transformIntoIterableFindExportsOutput } from '#analyzers/helpers/transform-into-iterable-find-exports-output.js';
