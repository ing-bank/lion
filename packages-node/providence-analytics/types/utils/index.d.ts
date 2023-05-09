export type SwcScope = {
  id: number;
  parentScope?: Scope;
  bindings: { [key: string]: Binding };
  path: SwcPath | null;
  _pendingRefsWithoutBinding: SwcNode[];
  _isIsolatedBlockStatement: boolean;
};

/* Binding https://github.com/jamiebuilds/babel-handbook/blob/master/translations/en/plugin-handbook.md#toc-bindings */
export type SwcBinding = {
  identifier: SwcNode;
  // kind: string;
  refs: SwcNode[];
  path: SwcPath;
};

export type SwcPath = {
  node: SwcNode;
  parent: SwcNode;
  stop: function;
  scope: SwcScope;
  parentPath: SwcPath;
};

type SwcVisitorFn = (swcPath: SwcPath) => void;
export type SwcVisitor = {
  [key: string]: SwcVisitorFn | { enter?: SwcVisitorFn; leave?: SwcVisitorFn };
};

export type SwcTraversalContext = { visitOnExitFns: (() => void)[]; scopeId: number };
