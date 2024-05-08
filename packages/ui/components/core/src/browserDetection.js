import { isServer } from 'lit';

/**
 * From https://stackoverflow.com/questions/4565112/javascript-how-to-find-out-if-the-user-browser-is-chrome
 * @param {string} [flavor='google-chrome']
 */
function checkChrome(flavor = 'google-chrome') {
  if (isServer) {
    return flavor === 'google-chrome';
  }

  const isChromium =
    /** @type {window & { chrome?: boolean}} */ (globalThis).chrome ||
    globalThis.navigator.userAgent.indexOf('Chrome') > -1;

  if (flavor === 'chromium') {
    return isChromium;
  }
  const winNav = globalThis.navigator;
  const vendorName = winNav?.vendor;
  const isOpera =
    typeof (/** @type {window & { opr?: boolean}} */ (globalThis).opr) !== 'undefined';
  // @ts-ignore
  const isIEedge = globalThis.userAgent?.indexOf('Edge') > -1;
  // @ts-ignore
  const isIOSChrome = globalThis.userAgent?.match('CriOS');

  if (flavor === 'ios') {
    return isIOSChrome;
  }

  if (flavor === 'google-chrome') {
    return (
      isChromium !== null &&
      typeof isChromium !== 'undefined' &&
      vendorName === 'Google Inc.' &&
      isOpera === false &&
      isIEedge === false
    );
  }

  return undefined;
}

export const browserDetection = {
  isIE11: /Trident/.test(globalThis.navigator?.userAgent),
  isChrome: checkChrome(),
  isIOSChrome: checkChrome('ios'),
  isChromium: checkChrome('chromium'),
  isFirefox: globalThis.navigator?.userAgent.toLowerCase().indexOf('firefox') > -1,
  isMac: globalThis.navigator?.appVersion?.indexOf('Mac') !== -1,
  isIOS: /iPhone|iPad|iPod/i.test(globalThis.navigator?.userAgent),
  isMacSafari: Boolean(
    globalThis.navigator?.vendor &&
      globalThis.navigator?.vendor.indexOf('Apple') > -1 &&
      globalThis.navigator?.userAgent &&
      globalThis.navigator?.userAgent.indexOf('CriOS') === -1 &&
      globalThis.navigator?.userAgent.indexOf('FxiOS') === -1 &&
      globalThis.navigator?.appVersion.indexOf('Mac') !== -1,
  ),
};
