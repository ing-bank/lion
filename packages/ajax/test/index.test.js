import { expect } from '@open-wc/testing';
import {
  ajax,
  Ajax,
  AjaxFetchError,
  acceptLanguageRequestInterceptor,
  createXsrfRequestInterceptor,
  createCacheInterceptors,
} from '@lion/ajax';

describe('public interface', () => {
  it('exports ajax', () => {
    expect(ajax).to.exist;
  });

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

  it('exports createCacheInterceptors', () => {
    expect(createCacheInterceptors).to.exist;
  });
});
