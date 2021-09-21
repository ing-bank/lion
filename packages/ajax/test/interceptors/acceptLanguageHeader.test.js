import { expect } from '@open-wc/testing';
import { acceptLanguageRequestInterceptor } from '../../src/interceptors/acceptLanguageHeader.js';

describe('acceptLanguageRequestInterceptor()', () => {
  it('adds the locale as accept-language header', () => {
    const request = new Request('/foo/');
    acceptLanguageRequestInterceptor(request);
    expect(request.headers.get('accept-language')).to.equal('en');
  });

  it('does not change an existing accept-language header', () => {
    const request = new Request('/foo/', { headers: { 'accept-language': 'my-accept' } });
    acceptLanguageRequestInterceptor(request);
    expect(request.headers.get('accept-language')).to.equal('my-accept');
  });
});
