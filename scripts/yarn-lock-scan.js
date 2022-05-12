const fs = require('fs');
const path = require('path');

const lockFileContent = fs.readFileSync(path.resolve('./yarn.lock'), 'utf8');

const allowedRegistries = ['registry.yarnpkg.com', 'registry.npmjs.org'];
const resolvedUrls = lockFileContent.match(/"https:.*"/g);
resolvedUrls.forEach(url => {
  const [, registry] = url.match(/^"https:\/\/(.*?)\/.*"$/) || [];
  if (!allowedRegistries.includes(registry)) {
    throw new Error(
      `Disallowed registries ("${registry}") in your yarn.lock!
      Please make sure you are using a public npm registry when downloading your dependencies!`,
    );
  }
});
