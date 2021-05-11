import { expect } from '@open-wc/testing';
import {
  Ajax,
  AjaxFetchError,
  acceptLanguageRequestInterceptor,
  createXsrfRequestInterceptor,
  createCacheRequestInterceptor,
  createCacheResponseInterceptor,
} from '@lion/ajax';

describe('public interface', () => {
  it('exports Ajax', () => {
    expect(Ajax).to.exist;
  });

  it('exports AjaxFetchError', () => {
    expect(AjaxFetchError).to.exist;
  });

  it('exports acceptLanguageRequestInterceptor', () => {
    expect(acceptLanguageRequestInterceptor).to.exist;
  });

  it('exports createXsrfRequestInterceptor', () => {
    expect(createXsrfRequestInterceptor).to.exist;
  });

  it('exports createCacheRequestInterceptor', () => {
    expect(createCacheRequestInterceptor).to.exist;
  });

  it('exports createCacheResponseInterceptor', () => {
    expect(createCacheResponseInterceptor).to.exist;
  });
});
