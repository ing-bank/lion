import {
  SpecifierName,
  ProjectName,
  PathRelativeFromProjectRoot,
  AnalyzerQueryResult,
  MatchedExportSpecifier,
} from '../core';

export interface MatchSubclassesAnalyzerResult extends AnalyzerQueryResult {
  queryOutput: MatchSubclassesAnalyzerOutputEntry[];
}

export interface MatchSubclassesAnalyzerOutputEntry {
  exportSpecifier: MatchedExportSpecifier;
  matchesPerProject: MatchSubclassesAnalyzerOutputEntryMatch[];
}

export interface MatchSubclassesAnalyzerOutputEntryMatch {
  /** The target project that extends the class exported by reference project */
  project: ProjectName;
  /** Array of meta objects for matching files  */
  files: MatchSubclassesAnalyzerOutputEntryMatchFile[];
}

export interface MatchSubclassesAnalyzerOutputEntryMatchFile {
  /**
   * The local filepath that contains the matched class inside the target project
   * like `./src/ExtendedClass.js`
   */
  file: PathRelativeFromProjectRoot;
  /**
   * The local Identifier inside matched file that is exported
   * @example
   * - `ExtendedClass` for `export ExtendedClass extends RefClass {};`
   * - `[default]` for `export default ExtendedClass extends RefClass {};`
   */
  identifier: SpecifierName;
}
