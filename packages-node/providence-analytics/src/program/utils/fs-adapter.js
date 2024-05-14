import originalNodeFs from 'fs';

/**
 * Provides access to the file system (fs) which can be the real file system or a mock.
 */
class FsAdapter {
  constructor() {
    this.fs = originalNodeFs;
  }

  /**
   * Call this for mocking or compatibility with non-node environments.
   * @param {originalNodeFs} fs
   */
  setFs(fs) {
    this.fs = fs;
  }

  /**
   * When done testing, call this to restore the real file system.
   */
  restoreFs() {
    this.fs = originalNodeFs;
  }
}

export const fsAdapter = new FsAdapter();
