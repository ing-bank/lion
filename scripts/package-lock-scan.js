const fs = require('fs');
const path = require('path');

const packageLockPath = './package-lock.json';
const data = fs.readFileSync(path.resolve(packageLockPath), 'utf8');
if (data.match(/artifactory/g)) {
  throw new Error(
    'Artifactory references in your package-lock.json! Please make sure you are using a public npm registry when downloading your dependencies!',
  );
}
