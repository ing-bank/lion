import fs from 'fs';
import path from 'path';
import os from 'os';
import crypto from 'crypto';
import childProcess from 'child_process';
import util from 'util';
import url from 'url';

const execFile = util.promisify(childProcess.execFile);
const packageRoot = url.fileURLToPath(new URL('../', import.meta.url));
const artifact = path.join(
  packageRoot,
  'vendor/awesome-phonenumber-7.9.0-tlouisse.libphonenumber-9.0.41.tgz',
);
const expectedSha256 = '855b0476ea7784457e8ec63d4824ff925eed0e339f72e8e05b7eea75a80ec018';
const sha256 = crypto
  .createHash('sha256')
  .update(await fs.promises.readFile(artifact))
  .digest('hex');
if (sha256 !== expectedSha256) {
  throw new Error(`Vendored awesome-phonenumber checksum mismatch: ${sha256}`);
}

// A separate prefix keeps npm from reinstalling Lion's other runtime dependencies.
const temporaryRoot = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'lion-vendored-phone-'));
try {
  const npmCli = process.env.npm_execpath;
  if (!npmCli) {
    throw new Error('Run this packaging helper through npm so npm_execpath is available.');
  }
  await execFile(process.execPath, [
    npmCli,
    'install',
    '--prefix',
    temporaryRoot,
    '--offline',
    '--workspaces=false',
    '--ignore-scripts',
    '--no-save',
    '--package-lock=false',
    '--no-audit',
    '--no-fund',
    artifact,
  ]);
  const installedPackage = path.join(temporaryRoot, 'node_modules/awesome-phonenumber');
  const manifest = JSON.parse(
    await fs.promises.readFile(path.join(installedPackage, 'package.json'), 'utf8'),
  );
  if (
    manifest.name !== 'awesome-phonenumber' ||
    manifest.version !== '7.9.0-tlouisse.libphonenumber-9.0.41'
  ) {
    throw new Error('Unexpected vendored awesome-phonenumber package identity.');
  }
  const bundledPackage = path.join(packageRoot, 'node_modules/awesome-phonenumber');
  await fs.promises.rm(bundledPackage, { recursive: true, force: true });
  await fs.promises.cp(installedPackage, bundledPackage, { recursive: true });
} finally {
  await fs.promises.rm(temporaryRoot, { recursive: true, force: true });
}
