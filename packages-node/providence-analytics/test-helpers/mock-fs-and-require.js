/* eslint-disable import/no-extraneous-dependencies */
// @ts-expect-error
import mockFs from 'mock-fs';
// @ts-expect-error
import mockRequire from 'mock-require';

/**
 * @param {object} obj
 */
export function mockFsAndRequire(obj) {
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
