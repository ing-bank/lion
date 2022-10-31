/**
 * From https://stackoverflow.com/questions/4565112/javascript-how-to-find-out-if-the-user-browser-is-chrome
 * @param {string} [flavor]
 */
function checkChrome(flavor = 'google-chrome') {
  const isChromium = /** @type {window & { chrome?: boolean}} */ (window).chrome;
  if (flavor === 'chromium') {
    return isChromium;
  }
  const winNav = window.navigator;
  const vendorName = winNav.vendor;
  const isOpera = typeof (/** @type {window & { opr?: boolean}} */ (window).opr) !== 'undefined';
  const isIEedge = winNav.userAgent.indexOf('Edge') > -1;
  const isIOSChrome = winNav.userAgent.match('CriOS');

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
  isIE11: /Trident/.test(window.navigator.userAgent),
  isChrome: checkChrome(),
  isIOSChrome: checkChrome('ios'),
  isChromium: checkChrome('chromium'),
  isMac: navigator.appVersion.indexOf('Mac') !== -1,
};
