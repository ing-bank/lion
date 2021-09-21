import { expect } from '@open-wc/testing';
import * as interceptors from '../../src/interceptors/index.js';

describe('interceptors interface', () => {
  it('exposes the acceptLanguageRequestInterceptor function', () => {
    expect(interceptors.acceptLanguageRequestInterceptor).to.be.a('Function');
  });

  it('exposes the createXsrfRequestInterceptor function', () => {
    expect(interceptors.createXsrfRequestInterceptor).to.be.a('Function');
  });

  it('exposes the createCacheInterceptors function', () => {
    expect(interceptors.createCacheInterceptors).to.be.a('Function');
  });
});
