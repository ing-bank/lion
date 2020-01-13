/**
 * Sorts each depth level according to the provided array order.
 *
 * @example
 * addParameters({
 *   options: {
 *     showRoots: true,
 *     storySort: sortEachDepth([
 *       ['Intro', 'Forms', 'Buttons', '...'] // 1. level - ordered like this rest default order
 *       ['Intro', '...', 'System'], // 2. level - Intro first, System last in between default order
 *       ['Overview', '...'] // 3. level - Intro first rest default order
 *     ]),
 * });
 *
 * @param {array} orderPerDepth array of arrays giving the order of each level
 */
export function sortEachDepth(orderPerDepth) {
  return (a, b) => {
    // If the two stories have the same story kind, then use the default
    // ordering, which is the order they are defined in the story file.
    if (a[1].kind === b[1].kind) {
      return 0;
    }
    const storyKindA = a[1].kind.split('/');
    const storyKindB = b[1].kind.split('/');
    let depth = 0;
    let nameA;
    let nameB;
    let indexA;
    let indexB;
    let ordering = orderPerDepth[0] || [];
    if (ordering.indexOf('...') !== -1 && ordering.indexOf('...abc') !== -1) {
      throw new Error(
        `Found ${ordering.join(',')} You need to use either "..." or "...abc" for each level.`,
      );
    }
    // eslint-disable-next-line no-constant-condition
    while (true) {
      nameA = storyKindA[depth] ? storyKindA[depth] : '';
      nameB = storyKindB[depth] ? storyKindB[depth] : '';

      if (nameA === nameB) {
        // We'll need to look at the next part of the name.
        depth += 1;
        ordering = orderPerDepth[depth] || [];
        if (ordering.indexOf('...') !== -1 && ordering.indexOf('...abc') !== -1) {
          throw new Error('You need to use either "..." or "...abc" for each level.');
        }
        // eslint-disable-next-line no-continue
        continue;
      } else {
        // Look for the names in the given `ordering` array.
        indexA = ordering.indexOf(nameA);
        indexB = ordering.indexOf(nameB);

        // If at least one of the names is found, sort by the `ordering` array.
        if (indexA !== -1 || indexB !== -1) {
          // If one of the names is not found in `ordering`, list it at the place of '...' or last.
          let insertPosition = ordering.length;
          if (ordering.indexOf('...') !== -1) {
            insertPosition = ordering.indexOf('...');
          }
          if (ordering.indexOf('...abc') !== -1) {
            insertPosition = ordering.indexOf('...abc');
          }

          if (indexA === -1) {
            indexA = insertPosition;
          }
          if (indexB === -1) {
            indexB = insertPosition;
          }
          return indexA - indexB;
        }
      }
      if (ordering.indexOf('...abc') !== -1) {
        return nameA.localeCompare(nameB);
      }
      // Otherwise, use source code order.
      return 0;
    }
  };
}
