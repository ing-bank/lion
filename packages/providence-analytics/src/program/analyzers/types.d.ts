import { ProjectReference } from 'typescript';

export interface RootFile {
  /** the file path containing declaration, for instance './target-src/direct-imports.js'. Can also contain keyword '[current]' */
  file: string;
  /** the specifier/identifier that was exported in root file, for instance 'MyClass' */
  specifier: string;
}

export interface AnalyzerResult {
  /** meta info object */
  meta: Meta;
  /** array of AST traversal output, per project file */
  queryOutput: AnalyzerOutputFile[];
}

export interface AnalyzerOutputFile {
  /** path relative from project root for which a result is generated based on AST traversal */
  file: string;
  /** result of AST traversal for file in project */
  result: array;
}

// TODO: make sure that data structures of JSON output (generated in ReportService)
// and data structure generated in Analyzer.prototype._finalize match exactly (move logic from ReportSerivce to _finalize)
// so that these type definitions can be used to generate a json schema: https://www.npmjs.com/package/typescript-json-schema
interface Meta {
  /** type of the query. Currently onlu "ast-analyzer" supported */
  searchType: string;
  /** analyzer meta object */
  analyzerMeta: AnalyzerMeta;
}

export interface AnalyzerMeta {
  /** analizer name like 'find-imports' or 'match-sublcasses' */
  name: string;
  /** the ast format. Currently only 'babel' */
  requiredAst: string;
  /** a unique hash based on target, reference and configuration */
  identifier: string;
  /** target project meta object */
  targetProject: Project;
  /** reference project meta object */
  referenceProject?: Project;
  /** the configuration used for this particular analyzer run */
  configuration: object;
}

export interface Project {
  /** "name" found in package.json and under which the package is registered in npm */
  name: string;
  /** "version" found in package.json */
  version: string;
  /** "main" File found in package.json */
  mainFile: string;
  /** if a git repo is analyzed, stores commit hash, [not-a-git-repo] if not */
  commitHash: string;
}

// match-customelements
export interface MatchSubclassesAnalyzerResult extends AnalyzerResult {
  queryOutput: MatchSubclassesAnalyzerOutputEntry[];
}

export interface MatchSubclassesAnalyzerOutputEntry {
  exportSpecifier: MatchedExportSpecifier;
  matchesPerProject: MatchSubclassesAnalyzerOutputEntryMatch[];
}

export interface MatchSubclassesAnalyzerOutputEntryMatch {
  /** The target project that extends the class exported by reference project */
  project: string;
  /** Array of meta objects for matching files  */
  files: MatchSubclassesAnalyzerOutputEntryMatchFile[];
}

export interface MatchSubclassesAnalyzerOutputEntryMatchFile {
  /**
   * The local filepath that contains the matched class inside the target project
   * like `./src/ExtendedClass.js`
   */
  file: string;
  /**
   * The local Identifier inside matched file that is exported
   * @example
   * - `ExtendedClass` for `export ExtendedClass extends RefClass {};`
   * - `[default]` for `export default ExtendedClass extends RefClass {};`
   */
  identifier: string;
}

export interface MatchedExportSpecifier extends AnalyzerResult {
  /** The exported Identifier name.
   *
   * For instance
   * - `export { X as Y } from 'q'` => `Y`
   * - `export default class Z {}` => `[default]`
   */
  name: string;
  /** Project name as found in package.json */
  project: string;
  /** Path relative from project root, for instance `./index.js` */
  filePath: string;
  /** "[default]::./index.js::exporting-ref-project" */
  id: string;
}

// "find-customelements"

export interface FindCustomelementsAnalyzerResult extends AnalyzerResult {
  queryOutput: FindCustomelementsAnalyzerOutputFile[];
}

export interface FindCustomelementsAnalyzerOutputFile extends AnalyzerOutputFile {
  /** path relative from project root for which a result is generated based on AST traversal */
  file: string;
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
  constructorIdentifier: string;
  /** Rootfile traced for constuctorIdentifier found in CE definition */
  rootFile: RootFile;
}

// "find-exports"

export interface FindExportsAnalyzerResult extends AnalyzerResult {
  queryOutput: FindExportsAnalyzerOutputFile[];
}

export interface FindExportsAnalyzerOutputFile extends AnalyzerOutputFile {
  /** path relative from project root for which a result is generated based on AST traversal */
  file: string;
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
  exportSpecifiers: string[];
  /**
   * The original "source" string belonging to specifier.
   * For example:
   * - file `export { x } from './my/file';` gives `"./my/file"`
   * - file `export { x } from 'project';` gives `"project"`
   */
  source: string;
  /**
   * The normalized "source" string belonging to specifier
   * (based on file system information, resolves right names and extensions).
   * For example:
   * - file `export { x } from './my/file';` gives `"./my/file.js"`
   * - file `export { x } from 'project';` gives `"project"` (only files in current project are resolved)
   * - file `export { x } from '../';` gives `"../index.js"`
   */
  normalizedSource: string;
  /** map of tracked down Identifiers */
  rootFileMap: RootFileMapEntry[];
}

export interface RootFileMapEntry {
  /** This is the local name in the file we track from */
  currentFileSpecifier: string;
  /**
   * The file that contains the original declaration of a certain Identifier/Specifier.
   * Contains file(filePath) and specifier keys
   */
  rootFile: RootFile;
}

// "find-imports"

export interface FindImportsAnalyzerResult extends AnalyzerResult {
  queryOutput: FindImportsAnalyzerOutputFile[];
}

export interface FindImportsAnalyzerOutputFile extends AnalyzerOutputFile {
  /** path relative from project root for which a result is generated based on AST traversal */
  file: string;
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
  importSpecifiers: string[];
  /**
   * The original "source" string belonging to specifier.
   * For example:
   * - file `import { x } from './my/file';` gives `"./my/file"`
   * - file `import { x } from 'project';` gives `"project"`
   */
  source: string;
  /**
   * The normalized "source" string belonging to specifier
   * (based on file system information, resolves right names and extensions).
   * For example:
   * - file `import { x } from './my/file';` gives `"./my/file.js"`
   * - file `import { x } from 'project';` gives `"project"` (only files in current project are resolved)
   * - file `import { x } from '../';` gives `"../index.js"`
   */
  normalizedSource: string;
}

// "find-classes"

export interface FindClassesAnalyzerResult extends AnalyzerResult {
  queryOutput: FindClassesAnalyzerOutputFile[];
}

export interface FindClassesAnalyzerOutputFile extends AnalyzerOutputFile {
  /** path relative from project root for which a result is generated based on AST traversal */
  file: string;
  /** result of AST traversal for file in project */
  result: FindClassesAnalyzerEntry[];
}

export interface FindClassesAnalyzerEntry {
  /** the name of the class */
  name: string;
  /** whether the class is a mixin function */
  isMixin: boolean;
  /** super classes and mixins */
  superClasses: SuperClass[];
  members: ClassMember;
}

interface ClassMember {
  props: ClassProperty;
  methods: ClassMethod;
}

interface ClassProperty {
  /** class property name */
  name: string;
  /** 'public', 'protected' or 'private' */
  accessType: string;
  /** can be 'get', 'set' or both */
  kind: Array;
  /** whether property is static */
  static: boolean;
}

interface ClassMethod {
  /** class method name */
  name: string;
  /** 'public', 'protected' or 'private' */
  accessType: boolean;
}

export interface SuperClass {
  /** the name of the super class */
  name: string;
  /** whether the superClass is a mixin function */
  isMixin: boolean;
  rootFile: RootFile;
}

export interface FindClassesConfig {
  /** search target paths */
  targetProjectPath: string;
}

export interface AnalyzerConfig {
  /** search target project path */
  targetProjectPath: string;
  gatherFilesConfig: GatherFilesConfig;
}

export interface MatchAnalyzerConfig extends AnalyzerConfig {
  /** reference project path, used to match reference against target */
  referenceProjectPath: string;
}
