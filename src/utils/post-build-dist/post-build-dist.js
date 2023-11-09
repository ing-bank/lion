const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const distComponents = 'dist/docs/components';

const getAllFiles = (dirPath, arrayOfFiles) => {
  const files = fs.readdirSync(dirPath);

  // eslint-disable-next-line no-param-reassign
  arrayOfFiles = arrayOfFiles || [];

  files.forEach(file => {
    if (fs.statSync(`${dirPath}/${file}`).isDirectory()) {
      // eslint-disable-next-line no-param-reassign
      arrayOfFiles = getAllFiles(`${dirPath}/${file}`, arrayOfFiles);
    } else if (file === '__mdjs-stories.js') {
      const parentDirectoryName = path.basename(dirPath);
      // console.log('parentDirectoryName: ', parentDirectoryName);
      // console.log('file: ', file);
      execSync(
        `npx rollup ${distComponents}/${parentDirectoryName}/__mdjs-stories.js --config rollup.config-test.js --dir ${distComponents}/${parentDirectoryName}/`,
      );
    }
  });

  return arrayOfFiles;
};

const postBuildDist = () => {
  getAllFiles(distComponents);
};

module.exports = {
  postBuildDist,
};
