/* eslint-disable import/no-extraneous-dependencies */
// @ts-ignore
const mockFs = require('mock-fs');
// @ts-ignore
const mockRequire = require('mock-require');

/**
 * @param {object} obj
 */
function mockFsAndRequire(obj) {
  mockFs(obj);

  // Object.entries(obj).forEach(([key, value]) => {
  //   if (key.endsWith('.json')) {
  //     mockRequire(key, JSON.parse(value));
  //   } else {
  //     mockRequire(key, value);
  //   }
  // });
}

mockFsAndRequire.restore = () => {
  mockFs.restore();
  mockRequire.stopAll();
};

module.exports = {
  mockFsAndRequire,
};
