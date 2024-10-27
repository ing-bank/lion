export type WorkspaceMeta = {
  /** Path to monorepo root */
  monoRoot: string;
  /** Whether we're dealing with the monorepo root, a workspace, or a regular single package repo */
  type: 'monorepo-workspace' | 'monorepo-root' | 'single-package';
  /** All packages within the monorepo and their types */
  workspacePackages: {
    dir: string;
    type: 'monorepo-workspace' | 'monorepo-root' | 'single-package';
  }[];
};
