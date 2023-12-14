export const maxDepthForNonComponentsNavigation = 2;
export const docsDirName = '/docs/';
export const isToBeConcatenated = (path) => {
    if (path.includes('/components/')) {
        return true;
    }
    const pathAfterDocs = path.split(docsDirName)[1];
    const numberOfSections = pathAfterDocs.split('/').length;
    return numberOfSections > maxDepthForNonComponentsNavigation;
}
