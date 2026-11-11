import { expect } from '@open-wc/testing';

const IOS_CHROME_UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/120.0.6099.119 Mobile/15E148 Safari/604.1';
const LEGACY_EDGE_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 Edge/18.19582';

let importCount = 0;

/**
 * `browserDetection` is computed once, when its module is evaluated. To evaluate it against a
 * stubbed user agent, we stub `navigator.userAgent` and import a fresh copy of the module.
 * @param {{ userAgent: string, vendor?: string }} nav
 * @returns {Promise<typeof import('../src/browserDetection.js').browserDetection>}
 */
async function detectWith({ userAgent, vendor = 'Google Inc.' }) {
  const proto = Object.getPrototypeOf(navigator);
  const originalUserAgent = Object.getOwnPropertyDescriptor(proto, 'userAgent');
  const originalVendor = Object.getOwnPropertyDescriptor(proto, 'vendor');
  Object.defineProperty(proto, 'userAgent', { configurable: true, get: () => userAgent });
  Object.defineProperty(proto, 'vendor', { configurable: true, get: () => vendor });
  try {
    importCount += 1;
    const mod = await import(`../src/browserDetection.js?fresh=${importCount}`);
    return mod.browserDetection;
  } finally {
    Object.defineProperty(
      proto,
      'userAgent',
      /** @type {PropertyDescriptor} */ (originalUserAgent),
    );
    Object.defineProperty(proto, 'vendor', /** @type {PropertyDescriptor} */ (originalVendor));
  }
}

describe('browserDetection', () => {
  it('detects Chrome on iOS from navigator.userAgent', async () => {
    const detection = await detectWith({
      userAgent: IOS_CHROME_UA,
      vendor: 'Apple Computer, Inc.',
    });
    expect(detection.isIOSChrome).to.be.true;
    expect(detection.isIOS).to.be.true;
  });

  it('does not detect Chrome on iOS for other user agents', async () => {
    const detection = await detectWith({ userAgent: LEGACY_EDGE_UA });
    expect(detection.isIOSChrome).to.be.false;
  });

  it('does not detect legacy Edge as Google Chrome', async () => {
    const detection = await detectWith({ userAgent: LEGACY_EDGE_UA });
    expect(detection.isChrome).to.be.false;
  });
});
