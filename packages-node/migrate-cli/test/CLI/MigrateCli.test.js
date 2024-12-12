import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { MigrateCli } from '../../src/MigrateCli.js';

chai.use(chaiAsPromised);
const { expect } = chai;

describe('MigrateCli works as a base CLI', () => {
  describe('initialisation and preparation of the CLI works as expected', () => {
    /** @type {import('../../src/MigrateCli.js').MigrateCli} */ let cli;

    beforeEach(() => {
      cli = new MigrateCli();
    });

    it('initialises CLI with base command with minimal config', () => {
      expect(cli.program).to.exist;
      expect(cli.options.inputDir).to.equal('FALLBACK');
      expect(cli.program.helpInformation()).to.contain('--version');
      const { version, name } = cli.getNameAndVersion();
      expect(cli.program.version()).to.equal(version);
      expect(cli.program.name()).to.equal(name);
    });

    it('prepares a base plugin without specific config', async () => {
      await cli.prepare();
      expect(cli.config.plugins.length).to.equal(1);
    });

    it('accepts additional commands if so configured', async () => {
      cli = new MigrateCli({
        includeBaseCommands: true,
        commandsUrls: [new URL('../mocks/commands', import.meta.url)],
      });
      await cli.prepare();
      expect(cli.config.plugins.length).to.equal(2);
    });

    it('starts the CLI as expected', async () => {
      cli.config.commandsUrls = [new URL('../mocks/commands', import.meta.url)];
      cli.config.argv = ['/bin/node', '/migrate-cli/src/cli.js', 'mock'];
      await cli.start();
      expect(cli.activePlugin.program.args).to.include('mock');
      expect(cli.activePlugin.active).to.be.true;
    });

    it('applies a config file', async () => {
      const options = {
        inputDir: 'inputDir',
        configFile: new URL('../mocks/config-file-1.js', import.meta.url).pathname,
        upgradesDir: 'upgradesDir',
        task: 'task',
      };
      cli.setOptions(options);
      expect(cli.options.inputDir).to.equal(options.inputDir);
      expect(cli.options.upgradesDir).to.equal(options.upgradesDir);
      await cli.applyConfigFile();
      expect(cli.options.inputDir).to.equal('otherInputDir');
      expect(cli.options.upgradesDir).to.equal('otherUpgradesDir');
      expect(cli.options.task).to.equal(options.task);
    });
  });
});
