// N.B. phone numbers (like Australia recently introduced new numbers (494) instead of the old regular (491) numbers).
// Make sure that we're always up to date

const { spawnSync } = require('child_process');

const packageName = 'awesome-phonenumber';
const commandArgs = ['outdated', packageName, '--json'];

const result = spawnSync('npm', commandArgs, {
  encoding: 'utf8',
});

if (result.error) {
  console.error(`[lint:phone-number-up-to-date] Failed to run npm: ${result.error.message}`);
  process.exit(1);
}

const stdout = (result.stdout || '').trim();

if (!stdout) {
  console.log(`[lint:phone-number-up-to-date] ${packageName} is up to date.`);
  process.exit(0);
}

let outdated;
try {
  outdated = JSON.parse(stdout);
} catch {
  console.error('[lint:phone-number-up-to-date] Could not parse npm outdated output as JSON.');
  console.error(stdout);
  process.exit(1);
}

const pkgInfo = outdated[packageName]?.[0];
if (!pkgInfo) {
  console.log(`[lint:phone-number-up-to-date] ${packageName} is up to date.`);
  process.exit(0);
}

const current = pkgInfo.current || 'unknown';
const latest = pkgInfo.latest || 'unknown';

console.error(
  `[lint:phone-number-up-to-date] ${packageName} is not on the latest version. current=${current}, latest=${latest}`,
);
process.exit(1);
