import {
  SpecifierName,
  SpecifierSource,
  PathRelativeFromProjectRoot,
  AnalyzerQueryResult,
  FindAnalyzerOutputFile,
} from '../core';

export interface FindImportsAnalyzerResult extends AnalyzerQueryResult {
  queryOutput: FindImportsAnalyzerOutputFile[];
}

export interface FindImportsAnalyzerOutputFile extends FindAnalyzerOutputFile {
  /** result of AST traversal for file in project */
  result: FindImportsAnalyzerEntry[];
}

export interface FindImportsAnalyzerEntry {
  /**
   * The specifiers found in an import statement.
   *
   * For example:
   * - file `import { X } from 'project'` gives `['X']`
   * - file `import X from 'project'` gives `['[default]']`
   * - file `import x, { y, z } from 'project'` gives `['[default]', 'y', 'z']`
   */
  importSpecifiers: SpecifierName[];
  /**
   * The original "source" string belonging to specifier.
   * For example:
   * - file `import { x } from './my/file';` gives `"./my/file"`
   * - file `import { x } from 'project';` gives `"project"`
   */
  source: SpecifierSource;
  /**
   * The normalized "source" string belonging to specifier
   * (based on file system information, resolves right names and extensions).
   * For example:
   * - file `import { x } from './my/file';` gives `"./my/file.js"`
   * - file `import { x } from 'project';` gives `"project"` (only files in current project are resolved)
   * - file `import { x } from '../';` gives `"../index.js"`
   */
  normalizedSource: SpecifierSource;
}

/**
 * Iterable version of `FindExportsAnalyzerEntry`.
 * Makes it easier to do comparisons inside MatchAnalyzers
 */
export interface IterableFindImportsAnalyzerEntry {
  file: PathRelativeFromProjectRoot;
  specifier: SpecifierName;
  source: SpecifierSource;
  /**
   * Resolved `SpecifierSource` o relative file path
   */
  normalizedSource: SpecifierSource;
}
