import { expect } from '@open-wc/testing';

import '../demo/singleton/overlayCompatibility.js';

import { overlays } from '../demo/singleton/node_modules/overlays/instance.js';
import { overlays as overlays2 } from '../demo/singleton/node_modules/page-b/node_modules/overlays/instance.js';

describe('singleton-demo', () => {
  it('uses the compatibility overrides', async () => {
    // Note: we can not test how it would work without applying the compatibility layer
    //       as it is a global side effect and there is only one karma instance running.
    expect(overlays.name).to.equal('Compatible from App');
    expect(overlays2.name).to.equal('Compatible from App');
  });
});
