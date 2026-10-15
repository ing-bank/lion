import fs from 'node:fs/promises';
import url from 'node:url';

const source = url.fileURLToPath(
  new URL('../../../packages-node/awesome-phonenumber/dist/', import.meta.url),
);
const destination = url.fileURLToPath(
  new URL('../generated/awesome-phonenumber/', import.meta.url),
);
await fs.rm(destination, { recursive: true, force: true });
await fs.cp(source, destination, { recursive: true });
