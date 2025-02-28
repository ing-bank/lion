/**
 * Reads a text and extracts a title from it
 *
 * @param {string} content The text where to extract the title from
 * @param {string} engine
 */
export function extractTitle(content, engine = 'md') {
  if (engine === 'md') {
    let captureHeading = true;
    let i = 0;
    for (const line of content.split('\n')) {
      if (line.startsWith('```')) {
        captureHeading = !captureHeading;
      }
      if (captureHeading && line.startsWith('# ')) {
        return { title: line.substring(2), lineNumber: i };
      }
      i += 1;
    }
  }
  return { title: '', lineNumber: -1 };
}

/**
 * Parses a title and extracts the relevante data for it.
 * A title can contain
 * - ">>" to define a parent => child relationship
 * - "||" to define the order for this page
 *
 * @example
 * Foo ||3
 * Foo >> Bar ||10
 *
 * @param {string} inTitle
 * @return {{ title: string, navigationTitle: string, order: number }}
 */
export function parseTitle(inTitle) {
  if (typeof inTitle !== 'string') {
    throw new Error('You need to provide a string to `parseTitle`');
  }

  let title = inTitle;
  let navigationTitle = title;
  let order = 0;
  if (title.includes('||')) {
    const parts = title
      .split('||')
      .map(part => part.trim())
      .filter(Boolean);
    if (parts.length !== 2) {
      throw new Error('You can use || only once in `parseTitle`');
    }

    navigationTitle = navigationTitle.split('||').map(part => part.trim())[0];
    title = parts[0];
    order = parseInt(parts[1]);
  }

  let navigationParent = '';
  let titleParts = [];
  if (title.includes('>>')) {
    const parts = title
      .split('>>')
      .map(part => part.trim())
      .filter(Boolean);
    title = parts.join(': ');
    navigationParent = parts[0];
    navigationTitle = parts[parts.length - 1];
    titleParts = parts;
    if (parts.length >= 2) {
      title = `${parts[0]}: ${parts[1]}`;
      const parentParts = [...parts];
      parentParts.pop();
      if (parts.length >= 3) {
        title = `${parts[parts.length - 2]}: ${parts[parts.length - 1]}`;
      }
    }
  } else {
    titleParts = [title];
  }


  return {
    title,
    navigationTitle,
    navigationParent,
    order,
    parts: titleParts,
  };
  // data.parts = titleParts;
  // data.title = title;
  // data.eleventyNavigation = {
  //   key,
  //   title: navigationTitle,
  //   order,
  // };
  // if (parent) {
  //   data.eleventyNavigation.parent = parent;
  // }
  // return data;
}
