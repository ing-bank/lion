import fs from 'fs';
// eslint-disable-next-line import/no-extraneous-dependencies
import db from 'mime-db';

function generateMimeTypes() {
  const mimeTypes = {
    'image/*': [],
    'audio/*': [],
    'video/*': [],
  };

  for (const type of Object.keys(db)) {
    if (type.startsWith('image/')) {
      mimeTypes['image/*'].push(type);
    } else if (type.startsWith('audio/')) {
      mimeTypes['audio/*'].push(type);
    } else if (type.startsWith('video/')) {
      mimeTypes['video/*'].push(type);
    }
  }

  const content = `
    /** @type {Record<string, string[]>} */
    export const mimeTypes = ${JSON.stringify(mimeTypes, null, 2)};
`;

  fs.writeFileSync('./components/core/src/mime-types.js', content);
}

generateMimeTypes();
