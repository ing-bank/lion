/* oxlint-disable lion/camelcase -- the `eslint-disable-line camelcase` in this file does not match the oxlint rule id */

import assert from 'node:assert/strict';
import childProcess from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import url from 'node:url';
import util from 'node:util';

const execFile = util.promisify(childProcess.execFile);
const script = url.fileURLToPath(new URL('../scripts/prepare-phone-build.js', import.meta.url));
for (const [command, expectedTask] of [
  ['pack', 'types'],
  ['publish', 'build:phone'],
]) {
  test(`prepack runs ${expectedTask} during npm ${command}`, async () => {
    const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'lion-prepack-'));
    try {
      const npmCli = path.join(directory, 'npm.cjs');
      await fs.writeFile(npmCli, 'process.stdout.write(JSON.stringify(process.argv.slice(2)));');
      const { stdout, stderr } = await execFile(process.execPath, [script], {
        env: {
          ...process.env,
          npm_execpath: npmCli,
          npm_command: command,
        },
      });
      assert.equal(stdout, '');
      assert.deepEqual(JSON.parse(stderr), ['run', expectedTask]);
    } finally {
      await fs.rm(directory, {
        recursive: true,
        force: true,
      });
    }
  });
}
