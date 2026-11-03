/**
 * The AST node shape the traversal works with, shared by every parser this package can use.
 *
 * `AstService.getAst` returns oxc's ESTree for each shipped analyzer and babel's AST behind
 * `--fallback-to-babel`; the traversal only ever reads `type` plus the child fields its visitors
 * add, and narrows through casts. Keeping the node structural - instead of one parser's node union -
 * is what lets the parser itself be an optional runtime dependency, and keeps our shipped
 * declarations free of a parser's typings.
 */
export type AstNode = {
  type: string;
  start?: number | null;
  end?: number | null;
  span?: { start: number; end: number };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [childNode: string]: any;
};
import { IdentifierName } from '../index.js';

export type SwcScope = {
  id: number;
  parentScope?: SwcScope;
  bindings: { [key: string]: SwcBinding };
  path: SwcPath | null;
  getBinding: (IdentifierName: string) => SwcBinding;
  dispose: () => void;
  _pendingRefsWithoutBinding: AstNode[];
  _isIsolatedBlockStatement: boolean;
};

/* Binding https://github.com/jamiebuilds/babel-handbook/blob/master/translations/en/plugin-handbook.md#toc-bindings */
export type SwcBinding = {
  identifier: AstNode;
  // kind: string;
  refs: AstNode[];
  path: SwcPath;
};

export type SwcPath = {
  node: AstNode;
  parent: AstNode;
  stop: () => void;
  scope?: SwcScope;
  parentPath: SwcPath | null | undefined;
  get: (id: string) => SwcPath | undefined;
  type: string;
  traverse: (visitor: SwcVisitor) => void;
};

type SwcVisitorFn = (swcPath: SwcPath) => void;
export type SwcVisitor = {
  [key: string]: SwcVisitorFn | { enter?: SwcVisitorFn; leave?: SwcVisitorFn };
};

export type SwcTraversalContext = { visitOnExitFns: (() => void)[]; scopeId: number };

/**
 * The subset of a `@web/dev-server` config that `miniDevServer` supports. `watch` is accepted for
 * compatibility and ignored.
 */
export type MiniDevServerMiddleware = (
  ctx: { url: string; type?: string; body?: unknown },
  next: () => Promise<unknown>,
) => Promise<unknown> | undefined;

export type MiniDevServerConfig = {
  /** Directory the server serves files from */
  rootDir: string;
  /** File served for '/' - wds calls this the app index */
  appIndex?: string;
  /** Rewrite bare module specifiers so the browser can load them (wds: nodeResolve) */
  nodeResolve?: boolean;
  /** Where to look for packages, used together with nodeResolve */
  moduleDirs?: string;
  middleware?: MiniDevServerMiddleware[];
  /** Open the served url in the default browser */
  open?: boolean;
  port?: number;
  hostname?: string;
  /** Legacy alias of hostname */
  host?: string;
  /** Accepted for compatibility with wds, this server does not watch */
  watch?: boolean;
};

/** @see miniDevServer in src/program/utils/mini-dev-server.js */
export type MiniDevServer = {
  config: MiniDevServerConfig;
  /** The node http server */
  server: import('http').Server;
  /** `http://<hostname>:<port>`, set once started */
  url: string;
  start: () => Promise<MiniDevServer>;
  stop: () => Promise<void>;
};
