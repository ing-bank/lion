import {
  PathFromSystemRoot,
  IdentifierName,
  RootFile,
  AnalyzerQueryResult,
  FindAnalyzerOutputFile,
} from '../core';

export interface FindClassesAnalyzerResult extends AnalyzerQueryResult {
  queryOutput: FindClassesAnalyzerOutputFile[];
}

export interface FindClassesAnalyzerOutputFile extends FindAnalyzerOutputFile {
  /** result of AST traversal for file in project */
  result: FindClassesAnalyzerEntry[];
}

export interface FindClassesAnalyzerEntry {
  /** the name of the class */
  name: IdentifierName;
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

type AccessType = 'public' | 'protected' | 'private';

interface ClassProperty {
  /** class property name */
  name: IdentifierName;
  /** 'public', 'protected' or 'private' */
  accessType: AccessType;
  /** can be 'get', 'set' or both */
  kind: ('get' | 'set')[];
  /** whether property is static */
  static: boolean;
}

interface ClassMethod {
  /** class method name */
  name: IdentifierName;
  accessType: AccessType;
}

export interface SuperClass {
  /** the name of the super class */
  name: IdentifierName;
  /** whether the superClass is a mixin function */
  isMixin: boolean;
  rootFile: RootFile;
}

export interface FindClassesConfig {
  /** search target paths */
  targetProjectPath: PathFromSystemRoot;
}
