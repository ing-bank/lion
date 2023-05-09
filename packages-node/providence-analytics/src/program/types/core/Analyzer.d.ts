import {
  PathRelativeFromProjectRoot,
  PathFromSystemRoot,
  QueryType,
  QueryResult,
  RequiredAst,
  ImportOrExportId,
  Project,
  GatherFilesConfig,
  SpecifierName,
  QueryOutput,
} from './index';

/**
 * Name of the analyzer, like 'find-imports' or 'match-sublcasses'
 */
export type AnalyzerName = `${'find' | 'match'}-${string}`;

// TODO: make sure that data structures of JSON output (generated in ReportService)
// and data structure generated in Analyzer.prototype._finalize match exactly (move logic from ReportSerivce to _finalize)
// so that these type definitions can be used to generate a json schema: https://www.npmjs.com/package/typescript-json-schema
export interface Meta {
  searchType: QueryType;
  /** analyzer meta object */
  analyzerMeta: AnalyzerMeta;
}

export interface AnalyzerMeta {
  name: AnalyzerName;
  requiredAst: RequiredAst;
  /* a unique hash based on target, reference and configuration */
  identifier: ImportOrExportId;
  /* target project meta object */
  targetProject: Project;
  /* reference project meta object */
  referenceProject?: Project;
  /* the configuration used for this particular analyzer run */
  configuration: object;
  /* whether it was cached in file system or not */
  __fromCache?: boolean;
}

export interface AnalyzerQueryResult extends QueryResult {
  /** meta info object */
  meta: Meta;
  /** array of AST traversal output, per project file */
  queryOutput: QueryOutput;
}

export interface FindAnalyzerQueryResult extends AnalyzerQueryResult {
  queryOutput: FindAnalyzerOutputFile[];
}

export interface FindAnalyzerOutputFile {
  /** path relative from project root for which a result is generated based on AST traversal */
  file: PathRelativeFromProjectRoot;
  /** result of AST traversal for file in project */
  result: any[];
}

export interface AnalyzerConfig {
  /** search target project path */
  targetProjectPath: PathFromSystemRoot;
  gatherFilesConfig?: GatherFilesConfig;
  gatherFilesConfigReference?: GatherFilesConfig;
  skipCheckMatchCompatibility?: boolean;
}

export interface MatchAnalyzerConfig extends AnalyzerConfig {
  /** reference project path, used to match reference against target */
  referenceProjectPath: PathFromSystemRoot;
  targetProjectResult: AnalyzerQueryResult;
  referenceProjectResult: AnalyzerQueryResult;
}

export interface MatchedExportSpecifier extends AnalyzerQueryResult {
  name: SpecifierName;
  /** Project name as found in package.json */
  project: string;
  /** Path relative from project root, for instance `./index.js` */
  filePath: PathRelativeFromProjectRoot;
  id: ImportOrExportId;
}
