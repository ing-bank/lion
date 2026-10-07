export type PkgName = `@${string}/${string}` | string;
export type PkgVersion = `${number}.${number}.${number}`;
export type TargetDep = `${PkgName}#${PkgVersion}`;
export type TargetDepsObj = {
  [key: TargetDep]: TargetDep[];
};

export type TargetOrRefCollectionsObj = {
  [key: PkgName]: PkgName[];
};

export type ProvidenceCliConf = {
  metaConfig: {
    categoryConfig: {
      /* This is the name found in package.json */
      project: string;
      majorVersion: number;
      /* These conditions will be run on overy filePath */
      categories: {
        [category: string]: (localFilePath: string) => string[];
      };
    }[];
  };
  /*
   * By predefening groups, we can do a query for programs/collections...
   * Select via " providence analyze --search-target-collection 'exampleCollection' "
   */
  searchTargetCollections: {
    [targetCollection: string]: string[];
  };
  referenceCollections: {
    /**
     * Usually the references are different from the targets.
     * In this demo file, we test @lion usage amongst itself
     * Select via " providence analyze --reference-collection 'exampleCollection' "
     */
    [referenceCollection: string]: string[];
  };
};

// export { Node as Parse5Node } from 'parse5/dist/tree-adapters/default/index.js';
