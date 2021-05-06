import { expect } from '@open-wc/testing';
import {
  ajax,
  setAjax,
  AjaxClient,
  AjaxClientFetchError,
  acceptLanguageRequestInterceptor,
  createXSRFRequestInterceptor,
  getCookie,
  cacheRequestInterceptorFactory,
  cacheResponseInterceptorFactory,
  validateOptions,
} from '@lion/ajax';

describe('public interface', () => {
  it('exports AjaxClient', () => {
    expect(AjaxClient).to.exist;
  });

  it('exports an instance of AjaxClient', () => {
    expect(ajax).to.be.an.instanceOf(AjaxClient);
  });

  it('can replace ajax with another instance', () => {
    const newAjax = new AjaxClient();
    setAjax(newAjax);
    expect(ajax).to.equal(newAjax);
  });

  it('exports AjaxClientFetchError', () => {
    expect(AjaxClientFetchError).to.exist;
  });

  it('exports acceptLanguageRequestInterceptor', () => {
    expect(acceptLanguageRequestInterceptor).to.exist;
  });

  it('exports createXSRFRequestInterceptor', () => {
    expect(createXSRFRequestInterceptor).to.exist;
  });

  it('exports getCookie', () => {
    expect(getCookie).to.exist;
  });

  it('exports cacheRequestInterceptorFactory', () => {
    expect(cacheRequestInterceptorFactory).to.exist;
  });

  it('exports cacheResponseInterceptorFactory', () => {
    expect(cacheResponseInterceptorFactory).to.exist;
  });

  it('exports validateOptions', () => {
    expect(validateOptions).to.exist;
  });
});
