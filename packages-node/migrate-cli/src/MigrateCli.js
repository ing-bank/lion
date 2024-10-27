/* eslint-disable new-cap, no-await-in-loop */
import { Option, Command } from 'commander';
import path, { dirname } from 'path';
import fs, { existsSync } from 'fs';
import { fileURLToPath } from 'url';

import { mergeDeep } from './cli-helpers/mergeDeep.js';
import { AsyncEventEmitter } from './cli-helpers/AsyncEventEmitter.js';

/**
 * @typedef {{ configFile?:string;inputDir:string; cwd:string; setupCliPlugins?: function; task?:string; jscsOpts?:object; _upgradeTaskHref?:string; upgradesConfigHref?:string; upgradesDir: URL|string; _upgradesDirUrl?: URL; upgradeTaskNames: string[]; upgradeTaskUrl: string|URL; allowedCompositeTasks?: Map<string, string[]>}} Options
 */

/**
 * @typedef {{ plugins: {setupCommand:function;stop:function}[]; argv:string[];commandsUrls:URL[]}} Config
 */

/**
 * @typedef {{ plugins?: {setupCommand:function;stop:function}[]; argv?:string[];commandsUrls?:URL[]; cliName?:string; cliIntroductionText?:string; includeBaseCommands?:boolean; cwd?:string; pathToPkgJson?:string; cliVersion?:string; options?: Partial<Options>}} InitOptions
 */

export class MigrateCli {
  /** @type {Options} */
  options = {
    // Codemod options
    configFile: '',
    inputDir: 'FALLBACK',
    cwd: process.cwd(),
    jscsOpts: {},
    upgradeTaskUrl: '',
    upgradesDir: '',
    upgradeTaskNames: [],
    _upgradeTaskHref: '',
  };

  events = new AsyncEventEmitter();

  /** @type {{setupCommand: function; upgrade?:function; runDoctorTask?:function}|undefined} */
  activePlugin = undefined;

  /**
   * @param {InitOptions} initOptions
   */
  constructor(initOptions = {}) {
    /** @type {Config} */
    this.config = {
      argv: initOptions.argv || process.argv,
      commandsUrls: initOptions.commandsUrls || [],
      plugins: initOptions.plugins || [],
    };

    if (!this.config.commandsUrls.length || initOptions.includeBaseCommands) {
      this.config.commandsUrls.push(new URL('./commands', import.meta.url));
    }
    this.program = new Command();
    // TODO: for later find a way to accept a config file without overriding the build in help
    // this.program.allowUnknownOption().option('-c, --config-file <path>', 'path to config file');
    // this.program.parse(this.config.argv);

    this.program.allowUnknownOption(false);
    this.program.addHelpText(
      'before',
      initOptions.cliIntroductionText || `Welcome to the migrate CLI 👋\n`,
    );
    this.pathToPkgJson =
      initOptions.pathToPkgJson ||
      path.resolve(dirname(fileURLToPath(import.meta.url)), '../package.json');

    if (initOptions.options) {
      this.setOptions(initOptions.options);
    }

    // const indexOfConfig = this.config.argv.findIndex(opt => opt === '-c' || opt === '--config') + 1;
    // const configFilePath = indexOfConfig > 0 ? this.config.argv[indexOfConfig] : '';
    // if (existsSync(configFilePath)) {
    //   console.log(configFilePath);
    //   this.options.configFile = configFilePath;
    // }
    const { name, version } = this.getNameAndVersion();
    this.program.version(initOptions.cliVersion || version, '-v, --version');
    this.program.name = () => name;
    if (this.program.opts().configFile) {
      this.options.configFile = this.program.opts().configFile;
    }
  }

  getNameAndVersion() {
    try {
      const pkgJsonContents = JSON.parse(fs.readFileSync(this.pathToPkgJson, 'utf8'));
      return {
        version: pkgJsonContents.version || 'N/A',
        name: pkgJsonContents.name || 'N/A',
      };
    } catch (err) {
      console.log(`No package.json file was detected for path ${this.pathToPkgJson}.`);
      return {
        version: 'Version unknown',
        name: 'Name unknown',
      };
    }
  }

  /**
   * @param {Options|{}} newOptions
   */
  setOptions(newOptions) {
    // @ts-ignore
    this.options = mergeDeep(this.options, newOptions);

    if (this.options.inputDir === 'FALLBACK') {
      this.options.inputDir = path.join(this.options.cwd);
    }
  }

  async applyConfigFile() {
    if (this.options.configFile) {
      const configFilePath = path.resolve(this.options.configFile);
      const fileOptions = (await import(configFilePath)).default;
      this.setOptions(fileOptions);
    } else {
      // make sure all default settings are properly initialized
      this.setOptions({});
    }
  }

  async prepare() {
    let pluginsMeta = [];
    for (const commandsUrl of this.config.commandsUrls) {
      const commandFileDir = fs.readdirSync(commandsUrl);
      for (const commandFile of commandFileDir) {
        const commandImport = await import(`${commandsUrl.pathname}/${commandFile}`);
        const command = commandImport[Object.keys(commandImport)[0]];
        pluginsMeta.push({ plugin: command, options: {} });
      }
    }
    if (Array.isArray(this.options.setupCliPlugins)) {
      for (const setupFn of this.options.setupCliPlugins) {
        // @ts-ignore
        pluginsMeta = setupFn(pluginsMeta);
      }
    }

    for (const pluginObj of pluginsMeta) {
      const pluginInst = pluginObj.options
        ? // @ts-ignore
          new pluginObj.plugin(pluginObj.options)
        : // @ts-ignore
          new pluginObj.plugin();
      this.config.plugins.push(pluginInst);
    }
  }

  async start() {
    await this.applyConfigFile();
    await this.prepare();

    if (!this.config.plugins) {
      return;
    }

    for (const plugin of this.config.plugins) {
      if (plugin.setupCommand) {
        await plugin.setupCommand(this.program, this);
      }
    }
    try {
      await this.program.parseAsync(this.config.argv);
    } catch (error) {
      // @ts-ignore
      console.error(`ERROR: ${error}`);
      if (error.action) {
        await error.action();
      }
      throw error;
    }
  }

  async stop({ hard = true } = {}) {
    if (!this.config.plugins) {
      return;
    }
    for (const plugin of this.config.plugins) {
      if (plugin.stop) {
        await plugin.stop({ hard });
      }
    }
  }
}
