import assert from 'node:assert/strict';
import childProcess from 'node:child_process';
import url from 'node:url';
import util from 'node:util';

const npmCli = process.env.npm_execpath;
assert(npmCli, 'Run prepack through npm so npm_execpath is available.');
const execFile = util.promisify(childProcess.execFile);
const { stdout, stderr } = await execFile(process.execPath, [npmCli, 'run', 'types'], {
  cwd: url.fileURLToPath(new URL('../', import.meta.url)),
  maxBuffer: 10 * 1024 * 1024,
});
// Keep npm pack --json machine-readable even when Wireit rebuilds missing assets.
process.stderr.write(stdout);
process.stderr.write(stderr);
