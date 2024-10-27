import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import path from 'path';
import sinon from 'sinon';
import fs from 'fs';
import { _mockable, UpgradeCommandBase } from '../src/commands/UpgradeCommandBase.js';
import { MigrateCli } from '../src/MigrateCli.js';
import { Command } from 'commander';

chai.use(chaiAsPromised);
const { expect } = chai;

describe('UpgradeCommandBase works as base command', () => {
  describe('initialisation of the command works as expected', () => {
    const upgradeCommandBase = new UpgradeCommandBase();
    it('sets initial values correctly', () => {
      expect(upgradeCommandBase.upgradesConfig).to.not.be.null;
    });

    it('sets up the command', async () => {
      const addHelpTextSpy = sinon.spy(upgradeCommandBase, 'addHelpText');
      const setCommandOptionsSpy = sinon.spy(upgradeCommandBase, 'setCommandOptions');
      let commandAdded = false;
      const program = new Command();
      // @ts-ignore
      (program.addCommand = () => {
        commandAdded = true;
      }),
        await upgradeCommandBase.setupCommand(program, {});
      expect(addHelpTextSpy.callCount).to.equal(1);
      expect(setCommandOptionsSpy.callCount).to.equal(1);
      expect(commandAdded).to.be.true;
      addHelpTextSpy.resetHistory();
      setCommandOptionsSpy.resetHistory();
    });
  });

  describe('upgrade task behaves as expected', () => {
    let upgradeCommandBase;
    beforeEach(() => {
      upgradeCommandBase = new UpgradeCommandBase();
      sinon.restore();
      upgradeCommandBase.cli = new MigrateCli();
      upgradeCommandBase.cli.options.task = 'lib-foo-1-to-2';
    });

    it('fails when no task is provided', async () => {
      upgradeCommandBase.cli.options.task = undefined;
      try {
        await upgradeCommandBase.upgrade();
      } catch (e) {
        expect(e.message).to.equal(`Please provide a task via -t`);
      }
    });

    it('fails when setTransformOptions is not overridden', async () => {
      try {
        await upgradeCommandBase.upgrade();
      } catch (e) {
        expect(e.message).to.contain(`The Upgrade Command is not properly configured`);
      }
    });

    it('succeeds when upgradeTaskUrl is explicitly set', async () => {
      const fsExistsStub = sinon.stub(fs, 'existsSync');
      sinon.stub(_mockable, 'runUpgradeTask');
      fsExistsStub.onFirstCall().returns(false);
      fsExistsStub.onSecondCall().returns(true);
      upgradeCommandBase.cli.options.upgradeTaskUrl = 'test';
      await upgradeCommandBase.upgrade();
    });

    it('succeeds when upgradesDir is explicitly set', async () => {
      const fsExistsStub = sinon.stub(fs, 'existsSync');
      sinon.stub(_mockable, 'runUpgradeTask');
      fsExistsStub.returns(false);
      upgradeCommandBase.cli.options.upgradesDir = 'http://www.example.com';
      await upgradeCommandBase.upgrade();
    });
  });

  describe('composite tasks are allowed', () => {
    let upgradeCommandBase;

    beforeEach(() => {
      upgradeCommandBase = new UpgradeCommandBase();
      sinon.restore();
      upgradeCommandBase.cli = new MigrateCli();
      upgradeCommandBase.cli.options.task = 'transform-foo-combined';
      upgradeCommandBase.cli.options.upgradesDir = 'http://www.example.com';
    });

    it('runs upgrade for multiple tasks if found', async () => {
      const allowedCompositeTasks = new Map();
      allowedCompositeTasks.set('transform-foo-combined', [
        'transform-foo-part-1',
        'transform-foo-part-2',
      ]);
      upgradeCommandBase.cli.options.allowedCompositeTasks = allowedCompositeTasks;
      const runUpgradeStub = sinon.stub(_mockable, 'runUpgradeTask');
      const readDirStub = sinon.stub(fs, 'readdirSync');
      readDirStub.returns(['transform-foo-part-1', 'transform-foo-part-2']);
      await upgradeCommandBase.upgrade();
      expect(runUpgradeStub.callCount).to.equal(2);
    });

    it('does not run upgrade for multiple tasks if one not found', async () => {
      const allowedCompositeTasks = new Map();
      allowedCompositeTasks.set('transform-foo-combined', [
        'transform-foo-part-1',
        'transform-foo-part-2',
        'transform-foo-part-3',
      ]);
      upgradeCommandBase.cli.options.allowedCompositeTasks = allowedCompositeTasks;
      const runUpgradeStub = sinon.stub(_mockable, 'runUpgradeTask');
      const readDirStub = sinon.stub(fs, 'readdirSync');
      readDirStub.returns(['transform-foo-part-1', 'transform-foo-part-2']);
      await upgradeCommandBase.upgrade();
      expect(runUpgradeStub.callCount).to.equal(0);
    });

    it('does run upgrade for multiple tasks if task dir has more tasks than required', async () => {
      const allowedCompositeTasks = new Map();
      allowedCompositeTasks.set('transform-foo-combined', [
        'transform-foo-part-1',
        'transform-foo-part-2',
      ]);
      upgradeCommandBase.cli.options.allowedCompositeTasks = allowedCompositeTasks;
      const runUpgradeStub = sinon.stub(_mockable, 'runUpgradeTask');
      const readDirStub = sinon.stub(fs, 'readdirSync');
      readDirStub.returns(['transform-foo-part-1', 'transform-foo-part-2', 'transform-irrelevant']);
      await upgradeCommandBase.upgrade();
      expect(runUpgradeStub.callCount).to.equal(2);
    });
  });

  describe('getUpgradesDirUrl works as expected with different inputs', () => {
    it('handles a URL object', () => {
      const input = new URL('https://www.example.com');
      const returned = _mockable.getUpgradesDirUrl(input);
      expect(input.href).to.equal(returned.href);
    });

    it('handles string URL correctly', () => {
      const input = 'https://www.example.com/';
      const returned = _mockable.getUpgradesDirUrl(input);
      expect(input).to.equal(returned.href);
    });

    it('handles a local absolute path correctly', () => {
      const input = '/some/random/path';
      const returned = _mockable.getUpgradesDirUrl(input);
      expect(returned.href).to.equal(`file://${input}`);
    });

    it('handles a local relative path correctly', () => {
      const input = './some/random/path';
      const returned = _mockable.getUpgradesDirUrl(input, process.cwd());
      const resolvedPath = path.resolve(input);
      expect(returned.href).to.equal(`file://${resolvedPath}`);
    });
  });
});
