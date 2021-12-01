import { AnalyzerName, Feature, AnalyzerConfig, PathRelativeFromProjectRoot } from './index';
import { Analyzer } from '../../core/Analyzer';
export { Analyzer } from '../../core/Analyzer';

/**
 * Type of the query. Currently only "ast-analyzer" supported
 */
export type QueryType = 'ast-analyzer' | 'search' | 'feature';

/** an object containing keys name, value, term, tag */
export interface QueryConfig {
  /**
   * The type of the tag we are searching for.
   * A certain type has an additional property with more detailed information about the type
   */
  type: QueryType;
}

export interface AnalyzerQueryConfig extends QueryConfig {
  /** query details for a feature search */
  analyzer: Analyzer;
  analyzerName: AnalyzerName;
  analyzerConfig: AnalyzerConfig;
}

export interface FeatureQueryConfig extends QueryConfig {
  /** query details for a feature search */
  feature: Feature;
}

export interface SearchQueryConfig extends QueryConfig {
  /** if type is 'search', a regexString should be provided */
  regexString: string;
}

export interface QueryOutputEntry {
  result: any;
  file: PathRelativeFromProjectRoot;
}

export type QueryOutput = QueryOutputEntry[];

export interface QueryResult {
  queryOutput: QueryOutput;
  meta: {
    searchType: QueryType;
  };
}
