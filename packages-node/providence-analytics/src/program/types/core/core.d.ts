/**
 * The name of a variable in a local context. Examples:
 * - 'b': (`import {a as b } from 'c';`)
 * - 'MyClass': (`class MyClass {}`)
 */
export type IdentifierName = string;

/**
 * The string representation of an export.
 * Examples:
 * - 'x':          (`export { x } from 'y';` or `import { x } from 'y';`)
 * - '[default]':  (`export x from 'y';` or `import x from 'y';`)
 * - '[*]':        (`export * from 'y';` or `import * as allFromY from 'y';`)
 */
export type SpecifierName = '[default]' | '[*]' | IdentifierName;

/**
 * Source of import or export declaration. Examples:
 * - 'my/external/project'
 * - './my/local/file.js'
 */
export type SpecifierSource = string;

/**
 * The resolved filePath relative from project root.
 * Examples:
 * - "./index.js"
 * - "./src/helpers/foo.js"
 */
export type PathRelative = `${'./' | '../'}${string}`;

/**
 * The resolved filePath relative from project root.
 * Examples:
 * - "./index.js"
 * - "./src/helpers/foo.js"
 */
export type PathRelativeFromProjectRoot = `./${string}`;

/**
 * Posix compatible path from system root.
 * Example:
 * - "/my/projects/project-x"
 */
export type PathFromSystemRoot = `/${string}`;

export type RootFile = {
  /** the file path containing declaration, for instance './target-src/direct-imports.js'. Can also contain keyword '[current]' */
  file: string;
  /** the specifier/identifier that was exported in root file, for instance 'MyClass' */
  specifier: SpecifierName;
};

/**
 * Required ast for the analysis. Currently, only Babel is supported
 */
export type RequiredAst = 'babel';

/**
 * Name entry found in package.json
 */
export type ProjectName = string;

export type ImportOrExportId = `${SpecifierName}::${PathRelativeFromProjectRoot}::${ProjectName}`;

export interface RootFileMapEntry {
  /** This is the local name in the file we track from */
  currentFileSpecifier: SpecifierName;
  /**
   * The file that contains the original declaration of a certain Identifier/Specifier.
   * Contains file(filePath) and specifier keys
   */
  rootFile: RootFile;
}

export interface Project {
  /** "name" found in package.json and under which the package is registered in npm */
  name: ProjectName;
  /** "version" found in package.json */
  version: string;
  /** "main" File found in package.json */
  mainEntry: PathRelativeFromProjectRoot;
  /** if a git repo is analyzed, stores commit hash, [not-a-git-repo] if not */
  commitHash: '[not-a-git-repo]' | string;

  path: PathFromSystemRoot;
}

export interface Feature {
  /** the name of the feature. For instance 'size' */
  name?: string;

  /** the value of the feature. For instance 'xl' */
  value?: string;
  /** the name of the object this feature belongs to. */
  memberOf?: string;
  /**
   * the HTML element it belongs to. Will be used in html
   * queries. This option will take precedence over 'memberOf' when configured
   */
  tag?: string;
  /**
   * useful for HTML queries explicitly looking for attribute
   * name instead of property name. When false(default), query searches for properties
   */
  isAttribute?: boolean;
  /** when the attribute value is not an exact match */
  usesValueContains?: boolean;
  /**
   * when looking for a partial match:
   * div[class*=foo*] -> <div class="baz foo-bar">*/
  usesValuePartialMatch?: boolean;
  /**
   * when looking for an exact match inside a space
   * separated list within an attr: div[class*=foo] -> <div class="baz foo bar">
   */
  usesTagPartialMatch?: boolean;
}

export interface GatherFilesConfig {
  /** file extension like ['.js', '.html'] */
  extensions: `.${string}`[];
  filter?: AnyMatchString[];
  omitDefaultAllowlist?: boolean;
  depth?: number;
  allowlist: string[];
  allowlistMode?: 'npm' | 'git' | 'all';
}

export interface ProjectInputData {
  project: Project;
  /**
   * Array of paths that are found within 'project' that
   * comply to the rules as configured in 'gatherFilesConfig'
   */
  entries: PathFromSystemRoot[];
}

export interface ProjectInputDataWithMeta {
  project: Project;
  entries: { file: PathRelativeFromProjectRoot; context: { code: string } }[];
}
/**
 * See: https://www.npmjs.com/package/anymatch
 * Allows negations as well. See: https://www.npmjs.com/package/is-negated-glob
 * Examples:
 * - `'scripts/**\/*.js'
 * - '!scripts / vendor/**'
 * - 'scripts/vendor/react.js'
 */
export type AnyMatchString = string;

export type ProvidenceConfig = {
  /* Whether analyzer should be run or a grep should be performed */
  queryMethod: 'ast' | 'grep';
  /* Search target projects. For instance ['/path/to/app-a', '/path/to/app-b', ... '/path/to/app-z'] */
  targetProjectPaths: PathFromSystemRoot[];
  /* Reference projects. Needed for 'match analyzers', having `requiresReference: true`. For instance ['/path/to/lib1', '/path/to/lib2'] */
  referenceProjectPaths: PathFromSystemRoot[];
  /* When targetProjectPaths are dependencies of other projects (their 'roots') */
  targetProjectRootPaths: PathFromSystemRoot[];
  gatherFilesConfig: GatherFilesConfig;
  report: boolean;
  debugEnabled: boolean;
};
