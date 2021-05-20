export { PublishDocs } from "./src/PublishDocs.js";
export type PublishDocsOptions = {
    projectDir: string;
    gitHubUrl: string;
    gitRootDir: string;
    copyDir: string;
    copyTarget: string;
};
