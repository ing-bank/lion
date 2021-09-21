import { expect } from '@open-wc/testing';
import { createXsrfRequestInterceptor, getCookie } from '../../src/interceptors/xsrfHeader.js';

describe('getCookie()', () => {
  it('returns the cookie value', () => {
    expect(getCookie('foo', { cookie: 'foo=bar' })).to.equal('bar');
  });

  it('returns the cookie value when there are multiple cookies', () => {
    expect(getCookie('foo', { cookie: 'foo=bar; bar=foo;lorem=ipsum' })).to.equal('bar');
  });

  it('returns null when the cookie cannot be found', () => {
    expect(getCookie('foo', { cookie: 'bar=foo;lorem=ipsum' })).to.equal(null);
  });

  it('decodes the cookie vaue', () => {
    expect(getCookie('foo', { cookie: `foo=${decodeURIComponent('/foo/ bar "')}` })).to.equal(
      '/foo/ bar "',
    );
  });
});

describe('createXsrfRequestInterceptor()', () => {
  it('adds the xsrf token header to the request', () => {
    const interceptor = createXsrfRequestInterceptor('XSRF-TOKEN', 'X-XSRF-TOKEN', {
      cookie: 'XSRF-TOKEN=foo',
    });
    const request = new Request('/foo/');
    interceptor(request);
    expect(request.headers.get('X-XSRF-TOKEN')).to.equal('foo');
  });

  it('does not set anything if the cookie is not there', () => {
    const interceptor = createXsrfRequestInterceptor('XSRF-TOKEN', 'X-XSRF-TOKEN', {
      cookie: 'XXSRF-TOKEN=foo',
    });
    const request = new Request('/foo/');
    interceptor(request);
    expect(request.headers.get('X-XSRF-TOKEN')).to.equal(null);
  });
});
