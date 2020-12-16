import { expect } from '@open-wc/testing';
import { ajax, setAjax } from '../src/ajax.js';
import { AjaxClient } from '../src/AjaxClient.js';

describe('ajax', () => {
  it('exports an instance of AjaxClient', () => {
    expect(ajax).to.be.an.instanceOf(AjaxClient);
  });

  it('can replace ajax with another instance', () => {
    const newAjax = new AjaxClient();
    setAjax(newAjax);
    expect(ajax).to.equal(newAjax);
  });
});
