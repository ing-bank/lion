import {
  PathRelativeFromProjectRoot,
  IdentifierName,
  RootFile,
  AnalyzerQueryResult,
  FindAnalyzerOutputFile,
} from '../core';

export interface FindCustomelementsAnalyzerResult extends AnalyzerQueryResult {
  queryOutput: FindCustomelementsAnalyzerOutputFile[];
}

export interface FindCustomelementsAnalyzerOutputFile extends FindAnalyzerOutputFile {
  /** path relative from project root for which a result is generated based on AST traversal */
  file: PathRelativeFromProjectRoot;
  /** result of AST traversal for file in project */
  result: FindCustomelementsAnalyzerEntry[];
}

export interface FindCustomelementsAnalyzerEntry {
  /**
   * Tag name found in CE definition:
   * `customElements.define('my-name', MyConstructor)` => 'my-name'
   */
  tagName: string;
  /**
   * Identifier found in CE definition:
   * `customElements.define('my-name', MyConstructor)` => MyConstructor
   */
  constructorIdentifier: IdentifierName;
  /** Rootfile traced for constuctorIdentifier found in CE definition */
  rootFile: RootFile;
}
