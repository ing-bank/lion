const { execSync } = require('child_process');
const fs = require('fs');

const distDocs = 'dist/docs';

const getAllFiles = (dirPath, arrayOfFiles) => {
  const files = fs.readdirSync(dirPath);

  // eslint-disable-next-line no-param-reassign
  arrayOfFiles = arrayOfFiles || [];

  files.forEach(file => {
    if (fs.statSync(`${dirPath}/${file}`).isDirectory()) {
      // eslint-disable-next-line no-param-reassign
      arrayOfFiles = getAllFiles(`${dirPath}/${file}`, arrayOfFiles);
    } else if (file === '__mdjs-stories.js') {
      execSync(
        `npx rollup ${dirPath}/__mdjs-stories.js --config rollup.config-test.js --dir ${dirPath}/`,
      );
    }
  });

  return arrayOfFiles;
};

const postBuildDist = () => {
  getAllFiles(distDocs);
};

module.exports = {
  postBuildDist,
};
