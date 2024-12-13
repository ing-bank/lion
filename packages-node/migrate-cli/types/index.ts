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

export type Options = {
  configFile?: string;
  inputDir: string;
  cwd: string;
  setupCliPlugins?: Function;
  task?: string;
  jscsOpts?: object;
  upgradesConfigHref?: string;
  upgradesDir: URL | string;
  _upgradesDirUrl?: URL | undefined;
  upgradeTaskNames: string[];
  upgradeTaskUrl: string | URL;
  allowedCompositeTasks?: Map<string, string[]>;
};

export type InitOptions = {
  plugins?: { setupCommand: Function; stop: Function }[];
  argv?: string[];
  commandsUrls?: URL[];
  cliName?: string;
  cliIntroductionText?: string;
  includeBaseCommands?: boolean;
  cwd?: string;
  pathToPkgJson?: string;
  cliVersion?: string;
  options?: Partial<Options>;
};
