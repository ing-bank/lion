/* eslint-disable no-console */
import commandLineArgs from 'command-line-args';
import path from 'path';
import { PublishDocs } from './PublishDocs.js';

/** @typedef {import('./PublishDocs').PublishDocsOptions} PublishDocsOptions */

export class PublishDocsCli {
  constructor({ argv } = { argv: undefined }) {
    const mainDefinitions = [
      { name: 'project-dir', type: String },
      { name: 'github-url', type: String },
      { name: 'git-root-dir', type: String },
      { name: 'copy-dir', type: String },
      { name: 'copy-target', type: String },
    ];
    const options = commandLineArgs(mainDefinitions, {
      stopAtFirstUnknown: true,
      argv,
    });
    /** @type {Partial<PublishDocsOptions>} */
    this.options = {
      projectDir: options['project-dir'] ? path.resolve(options['project-dir']) : process.cwd(),
      gitHubUrl: options['github-url'],
      gitRootDir: options['git-root-dir'] ? path.resolve(options['git-root-dir']) : process.cwd(),
      copyDir: options['copy-dir'],
    };
    if (options['copy-target'] !== undefined) {
      this.options.copyTarget = options['copy-target'];
    }
  }

  /**
   * @param {Partial<PublishDocs>} newOptions
   */
  setOptions(newOptions) {
    this.options = {
      ...this.options,
      ...newOptions,
    };
  }

  async execute() {
    const publishDocs = new PublishDocs(this.options);
    await publishDocs.execute();

    console.log('📖 Docs have been copied, processed and are now publishable.');
  }
}
