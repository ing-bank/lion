import { expect } from '@open-wc/testing';
import {
  ajax,
  setAjax,
  Ajax,
  AjaxFetchError,
  acceptLanguageRequestInterceptor,
  createXSRFRequestInterceptor,
  getCookie,
  cacheRequestInterceptorFactory,
  cacheResponseInterceptorFactory,
  validateOptions,
} from '@lion/ajax';

describe('public interface', () => {
  it('exports Ajax', () => {
    expect(Ajax).to.exist;
  });

  it('exports an instance of Ajax', () => {
    expect(ajax).to.be.an.instanceOf(Ajax);
  });

  it('can replace ajax with another instance', () => {
    const newAjax = new Ajax();
    setAjax(newAjax);
    expect(ajax).to.equal(newAjax);
  });

  it('exports AjaxFetchError', () => {
    expect(AjaxFetchError).to.exist;
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
