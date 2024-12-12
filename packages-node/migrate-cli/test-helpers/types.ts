export type MockBridgeOpts = {
  extraMock?: object;
  extraPkgJsonDeps?: object;
  extraPkgJsonDevDeps?: object;
  projectName?: string;
  iw1Features?: 0 | 1 | 2;
  iw2Features?: 0 | 1 | 2;
  iw3Features?: 0 | 1 | 2;
  iw3?: boolean;
  iw2?: boolean;
  iw1?: boolean;
  litElement2?: boolean;
  litElement3?: boolean;
  litHtml1?: boolean;
  litHtml2?: boolean;
  scopedElements1?: boolean;
  scopedElements2?: boolean;
  legacyAjax?: boolean;
  bridge?: boolean;
  hoistCfg?: {
    iw?: 1 | 2 | 3;
    litElement?: 2 | 3;
    litHtml?: 1 | 2;
    scopedElements?: 1 | 2;
  };
};
