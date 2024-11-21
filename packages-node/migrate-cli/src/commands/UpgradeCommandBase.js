/* eslint-disable no-empty, class-methods-use-this, no-use-before-define, no-await-in-loop */
import fs from 'fs';
import path, { isAbsolute } from 'path';
import { globby } from 'globby';
import * as readline from 'readline';

import { Option, Command } from 'commander';
import { executeJsCodeShiftTransforms } from '../migrate-helpers/executeJsCodeShiftTransforms.js';

export const consoleColorHelpers = {
  reset: '\x1b[0m',
  error: '\x1b[41m',
};

/**
 * @param {URL|string} upgradesDir
 * @returns {URL}
 */
function getUpgradesDirUrl(upgradesDir) {
  if (upgradesDir instanceof URL) {
    return upgradesDir;
  }
  if (!(typeof upgradesDir === 'string')) {
    throw new Error('upgradesDir should be a URL or a string');
  }
  try {
    return new URL(upgradesDir);
  } catch (e) {}
  try {
    const absolutePath = isAbsolute(upgradesDir) ? upgradesDir : path.resolve(upgradesDir);
    return new URL(`file://${absolutePath}`);
  } catch (e) {
    throw new Error('Provided upgradesDir cannot be converted to a URL.');
  }
}

/**
 * @param {string} msg
 * @param {{shouldPrompt: boolean}} options
 * @returns {Promise<void>|void}
 */
function logErrorAndPromptForContinue(msg, { shouldPrompt }) {
  console.error(`${consoleColorHelpers.error} ${msg} ${consoleColorHelpers.reset} \n`);

  if (!shouldPrompt) return undefined;

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise(resolve => {
    rl.question('Do you want to continue (y/n)?', answer => {
      const shouldContinue = answer.toLowerCase() === 'y';
      rl.close();

      if (!shouldContinue) {
        process.exit(0);
      }
      resolve(undefined);
    });
    rl.write('y');
  });
}

/**
 * @param {string} task
 * @param {URL} upgradesDirUrl
 * @returns {URL}
 */
function getUpgradeTaskUrl(task, upgradesDirUrl) {
  return new URL(`./${task}/index.js`, upgradesDirUrl);
}

/**
 * @param {string} inputDir
 */
async function getRepoInfo(inputDir) {
  const packageJsonPath = path.join(inputDir, 'package.json');
  let pkgJson;
  try {
    pkgJson = JSON.parse((await fs.promises.readFile(packageJsonPath)).toString());
  } catch {
    return { isInvalidPackage: true, workspaces: [] };
  }
  const isMonoRepo = Boolean(pkgJson.workspaces);
  const workspaces = [];
  for (const w of pkgJson.workspaces || []) {
    // eslint-disable-next-line no-await-in-loop
    const packageDirs = await globby(w, { cwd: inputDir, onlyDirectories: true });
    workspaces.push(...packageDirs.map(p => path.join(inputDir, p)));
  }
  return { isMonoRepo, workspaces };
}

/**
 * @param {{upgradeTaskUrl:URL|string; options:{inputDir:string;subclasserMode?:boolean;}; task:string; isRunningMultipleTasks?: boolean}} opts
 */
async function runUpgradeTask({ upgradeTaskUrl, options, task, isRunningMultipleTasks = false }) {
  const importStr = typeof upgradeTaskUrl === 'string' ? upgradeTaskUrl : upgradeTaskUrl.toString();
  const script = await import(importStr);

  const { workspaces, isMonoRepo } = await _mockable.getRepoInfo(options.inputDir);

  const workspacePackages = [
    ...workspaces.map(dir => ({ dir, type: 'monorepo-workspace' })),
    {
      dir: options.inputDir,
      type: isMonoRepo ? 'monorepo-root' : 'single-package',
    },
  ];

  for (const workspacePackage of workspacePackages) {
    console.log(
      `\n\n=== starting task ${task} for .${workspacePackage.dir.replace(
        options.inputDir,
        '',
      )} ===`,
    );
    const { isInvalidPackage } = await _mockable.getRepoInfo(workspacePackage.dir);
    if (isInvalidPackage) {
      console.error(`package.json not found for ${workspacePackage.dir}. Skipping codemods...`);
      // eslint-disable-next-line no-continue
      continue;
    }

    const workspaceMeta = {
      monoRoot: workspaces.length ? options.inputDir : null,
      type: workspacePackage.type,
      workspacePackages,
    };

    try {
      await script._mockable.upgrade(
        {
          skipPackageJson: false,
          transformFunction: executeJsCodeShiftTransforms,
          ...options,
          inputDir: workspacePackage.dir,
        },
        workspaceMeta,
      );
    } catch (e) {
      // not all mono packages may apply: give
      const fullMsg = `${e}`;
      const relevantMsg = fullMsg.replace(/^Error:/, 'Warning:');
      await logErrorAndPromptForContinue(relevantMsg, {
        shouldPrompt: isRunningMultipleTasks,
      });
    }
  }
}

export class UpgradeCommandBase {
  /**
   * @param {import('commander').Command} program
   * @param {import('../MigrateCli.js').MigrateCli} cli
   */
  async setupCommand(program, cli) {
    this.cli = cli;
    this.program = program;
    this.active = true;
    this.addHelpText();
    const command = new Command('upgrade');
    this.setCommandOptions(command);
    command.action(async options => {
      // if config file is provided, first apply this before applying other options
      const { configFile, ..._options } = options;
      if (configFile) {
        cli.applyConfigFile(configFile);
      }
      cli.setOptions(_options);
      // eslint-disable-next-line no-param-reassign
      cli.activePlugin = this;
      await this.upgrade();
    });
    this.program.addCommand(command);
  }

  /**
   *
   * @param {import('commander').Command} command
   */
  setCommandOptions(command) {
    command.addOption(
      new Option(
        '-i, --input-dir <path>',
        'path to where to search for source files (default to current directory)',
      ),
    );
    command.addOption(
      new Option('-t, --task <task>', 'what upgrade task do you want to run [lib-foo-2-to-3]'),
    );
    command.addOption(
      new Option('-u, --upgrades-dir <upgrades-dir>', 'directory for upgrades tasks'),
    );
    command.addOption(
      new Option(
        '--skip-package-json',
        'skips package.json checks and updates. Can be handy for mono repos including docs folders etc.',
      ),
    );
    command.addOption(new Option('-c, --config-file <config-file>', 'path of a config file'));
  }

  addHelpText() {
    this.program?.addHelpText(
      'after',
      [
        '',
        'Example call:',
        '  $ npx migrate-cli upgrade -t lib-foo-1-to-2 -u /path/to/upgrades/dir',
        '',
      ].join('\n'),
    );
  }

  /**
   * @returns
   */
  // eslint-disable-next-line no-unused-vars
  async setTransformOptions() {
    const { upgradeTaskUrl, upgradesDir } = /** @type {import('../MigrateCli.js').MigrateCli} */ (
      this.cli
    ).options;
    // At least one task or a base directory for a number of tasks is required for the codemod to run
    if (upgradeTaskUrl || upgradesDir) {
      return;
    }
    throw new Error(
      'The Upgrade Command is not properly configured. Please override the setTransformOptions method, or provide an upgrade location.',
    );
  }

  async setUpgradesConfig() {
    const { upgradesConfigHref, _upgradesDirUrl } =
      /** @type {import('../MigrateCli.js').MigrateCli} */ (this.cli).options;
    if (!upgradesConfigHref && !_upgradesDirUrl) {
      return;
    }

    // Fetch codemod specific config
    const upgradesConfigUrl =
      upgradesConfigHref || new URL('upgrades.config.js', _upgradesDirUrl).pathname;
    const upgradesConfig = fs.existsSync(upgradesConfigUrl)
      ? (await import(upgradesConfigUrl)).default
      : {};
    /** @type {import('../MigrateCli.js').MigrateCli} */ (this.cli).setOptions(upgradesConfig);
  }

  /**
   * @param {string} task
   */
  async getTaskDetails(task) {
    const { _upgradesDirUrl } = /** @type {import('../MigrateCli.js').MigrateCli} */ (this.cli)
      .options;
    if (_upgradesDirUrl) {
      /** @type {import('../MigrateCli.js').MigrateCli} */ (this.cli).options.upgradeTaskUrl =
        getUpgradeTaskUrl(task, _upgradesDirUrl);
    }
  }

  async upgrade() {
    if (!this.cli) {
      return;
    }

    const { task, upgradeTaskUrl } = this.cli.options;

    if (!task && !upgradeTaskUrl) {
      throw new Error(`Please provide a task via -t`);
    }
    await this.setTransformOptions();
    const { upgradesDir } = this.cli.options;
    const upgradesDirUrl = _mockable.getUpgradesDirUrl(upgradesDir);
    /** @type {import('../MigrateCli.js').MigrateCli} */ (this.cli).options._upgradesDirUrl =
      upgradesDirUrl;

    await this.setUpgradesConfig();

    await this.getTaskDetails(task);

    if (fs.existsSync(this.cli.options.upgradeTaskUrl)) {
      await _mockable.runUpgradeTask({
        upgradeTaskUrl: this.cli.options.upgradeTaskUrl,
        options: this.cli.options,
        task,
      });
    } else if (this.cli.options.allowedCompositeTasks?.get(task) && upgradesDirUrl) {
      const upgradeTasks = this.cli.options.allowedCompositeTasks.get(task) || [];
      const availableTasks = fs.readdirSync(new URL(upgradesDirUrl));
      let continueCombined = true;
      upgradeTasks.forEach(partialTask => {
        if (!availableTasks.includes(partialTask)) {
          continueCombined = false;
        }
      });

      if (continueCombined && upgradeTasks.length > 0 && availableTasks.length > 0) {
        console.log(
          `You are running the following codemods in composite mode: [${upgradeTasks.join(
            ', ',
          )}]. If your goal is to do checks inbetween codemods, please run them individually.`,
        );

        for (const _upgradeTask of upgradeTasks) {
          // TODO: consider `--interactive` option, allowing to diff and run test intermediately
          // eslint-disable-next-line no-await-in-loop
          await _mockable.runUpgradeTask({
            upgradeTaskUrl: getUpgradeTaskUrl(_upgradeTask, upgradesDirUrl),
            options: this.cli.options,
            task: _upgradeTask,
            isRunningMultipleTasks: true,
          });
        }

        console.log(
          `\n\nFinished running the following codemods in composite mode: [${upgradeTasks.join(
            ', ',
          )}].`,
        );
      }
    } else {
      console.log(`No upgrade task with the name "${task}" found.`);
      console.log('');
      console.log('Available upgrade tasks are:');
      for (const taskName of [
        ...this.cli.options.upgradeTaskNames,
        ...(this.cli.options.allowedCompositeTasks || []),
      ]) {
        console.log(`- ${taskName}`);
      }
      console.log('');
      console.log('Or check the upgradeTaskUrl in your config.');
    }
  }
}

export const _mockable = {
  getRepoInfo,
  runUpgradeTask,
  getUpgradesDirUrl,
};
