const fs = require('fs');
const path = require('path');

const yarnLockPath = './yarn.lock';
const data = fs.readFileSync(path.resolve(yarnLockPath), 'utf8');
if (data.match(/artifactory/g)) {
  throw new Error(
    'Artifactory references in your yarn.lock! Please make sure you are using the official yarn or npm registry when downloading your dependencies!',
  );
}
