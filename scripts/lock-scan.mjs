import path from 'path';
import fs from 'fs';

function containsDisallowedRegistry(url) {
  const [, registry] = url.match(/^"resolved": "https:\/\/(.*?)\/.*"$/) || [];
  return !['registry.yarnpkg.com', 'registry.npmjs.org'].includes(registry);
}

const lockFileContent = fs.readFileSync(path.resolve('./package-lock.json'), 'utf8');
const resolvedUrls = lockFileContent.match(/"resolved": "https:.*"/g);

if (resolvedUrls?.some(containsDisallowedRegistry)) {
  throw new Error(
    `Disallowed registries in your package-lock.json!
    Please make sure you are using a public npm registry when downloading your dependencies!`,
  );
}
