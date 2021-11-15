import { ImportOrExportId, PathRelativeFromProjectRoot, ProjectName } from '../core/core';
import { AnalyzerQueryResult, MatchedExportSpecifier, MatchAnalyzerConfig } from '../core/Analyzer';

export interface MatchImportsAnalyzerResult extends AnalyzerQueryResult {
  queryOutput: MatchImportsAnalyzerOutputEntry[];
}

export interface MatchImportsAnalyzerOutputEntry {
  exportSpecifier: MatchedExportSpecifier;
  matchesPerProject: MatchImportsAnalyzerOutputEntryMatch[];
}

export interface MatchImportsAnalyzerOutputEntryMatch {
  /** The target project that extends the class exported by reference project */
  project: ProjectName;
  /** Array of meta objects for matching files  */
  files: PathRelativeFromProjectRoot[];
}

export type ConciseMatchImportsAnalyzerResult = ConciseMatchImportsAnalyzerResultEntry[];

export interface ConciseMatchImportsAnalyzerResultEntry {
  exportSpecifier: { id: ImportOrExportId; meta?: object };
  importProjectFiles: PathRelativeFromProjectRoot[];
}

export interface MatchImportsConfig extends MatchAnalyzerConfig {}
