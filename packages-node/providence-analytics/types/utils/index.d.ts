import { IdentifierName } from "../index.js";

export type SwcScope = {
  id: number;
  parentScope?: Scope;
  bindings: { [key: string]: SwcBinding };
  path: SwcPath | null;
  getBinding: (IdentifierName:string) => SwcBinding;
  _pendingRefsWithoutBinding: SwcNode[];
  _isIsolatedBlockStatement: boolean;
};

/* Binding https://github.com/jamiebuilds/babel-handbook/blob/master/translations/en/plugin-handbook.md#toc-bindings */
export type SwcBinding = {
  identifier: SwcNode;
  // kind: string;
  refs: SwcNode[];
  path: SwcPath | null | undefined;
};

export type SwcPath = {
  node: SwcNode;
  parent: SwcNode;
  stop: function;
  scope: SwcScope;
  parentPath: SwcPath | null | undefined;
  get: (id: string) => SwcPath | undefined;
  type: string;
};

type SwcVisitorFn = (swcPath: SwcPath) => void;
export type SwcVisitor = {
  [key: string]: SwcVisitorFn | { enter?: SwcVisitorFn; leave?: SwcVisitorFn };
};

export type SwcTraversalContext = { visitOnExitFns: (() => void)[]; scopeId: number };
