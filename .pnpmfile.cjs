// pnpm resolves exactly what the committed package-lock.json installs (packages-node/lockfile-interop).
module.exports = require('./packages-node/lockfile-interop/src/pin-to-npm-lock.cjs').createHooks(
  __dirname,
);
