/* eslint-disable */
import { Command } from 'commander';

export class MockCommand {
  async setupCommand(program, cli) {
    this.cli = cli;
    this.program = program;
    this.active = true;
    const command = new Command('mock');
    command.action(async options => {
      cli.activePlugin = this;
    });
    this.program.addCommand(command);
  }
}
