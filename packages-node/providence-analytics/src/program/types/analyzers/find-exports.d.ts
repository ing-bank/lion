import {
  SpecifierName,
  SpecifierSource,
  PathRelativeFromProjectRoot,
  RootFileMapEntry,
  RootFile,
  AnalyzerQueryResult,
  FindAnalyzerOutputFile,
} from '../core';

export interface FindExportsAnalyzerResult extends AnalyzerQueryResult {
  queryOutput: FindExportsAnalyzerOutputFile[];
}

export interface FindExportsAnalyzerOutputFile extends FindAnalyzerOutputFile {
  /** path relative from project root for which a result is generated based on AST traversal */
  file: PathRelativeFromProjectRoot;
  /** result of AST traversal for file in project */
  result: FindExportsAnalyzerEntry[];
}

export interface FindExportsAnalyzerEntry {
  /**
   * The specifiers found in an export statement.
   *
   * For example:
   * - file `export class X {}` gives `['X']`
   * - file `export default const y = 0` gives `['[default]']`
   * - file `export { y, z } from 'project'` gives `['y', 'z']`
   */
  exportSpecifiers: SpecifierName[];
  /**
   * The original "source" string belonging to specifier.
   * For example:
   * - file `export { x } from './my/file';` gives `"./my/file"`
   * - file `export { x } from 'project';` gives `"project"`
   */
  source: SpecifierSource;
  /**
   * The normalized "source" string belonging to specifier
   * (based on file system information, resolves right names and extensions).
   * For example:
   * - file `export { x } from './my/file';` gives `"./my/file.js"`
   * - file `export { x } from 'project';` gives `"project"` (only files in current project are resolved)
   * - file `export { x } from '../';` gives `"../index.js"`
   */
  normalizedSource: SpecifierSource;
  /** map of tracked down Identifiers */
  rootFileMap: RootFileMapEntry[];
}

/**
 * Iterable version of `FindExportsAnalyzerEntry`.
 * Makes it easier to do comparisons inside MatchAnalyzers
 */
export interface IterableFindExportsAnalyzerEntry {
  file: PathRelativeFromProjectRoot;
  specifier: SpecifierName;
  /**
   * The local name of an export. Example:
   * 'a' in case of `export {a as b} from 'c';`
   */
  localSpecifier: SpecifierName;
  source: SpecifierSource | null;
  rootFile: RootFile;
  meta?: object;
}
