/* eslint-env mocha */
import { expect, aTimeout } from '@open-wc/testing';
import sinon from 'sinon';

import { AjaxClass } from '../src/AjaxClass.js';

describe('AjaxClass languages', () => {
  let fakeXhr;
  let requests;

  beforeEach(() => {
    fakeXhr = sinon.useFakeXMLHttpRequest();
    requests = [];
    fakeXhr.onCreate = xhr => {
      requests.push(xhr);
    };
  });

  afterEach(() => {
    fakeXhr.restore();
    document.documentElement.lang = 'en-GB';
  });

  it('sets "Accept-Language" header to "en-GB" for one request if <html lang="en-GB">', async () => {
    document.documentElement.lang = 'en-GB';
    const req = new AjaxClass();
    req.get('data.json');
    await aTimeout();
    expect(requests.length).to.equal(1);
    expect(requests[0].requestHeaders['Accept-Language']).to.equal('en-GB');
  });

  it('sets "Accept-Language" header to "en-GB" for multiple subsequent requests if <html lang="en-GB">', async () => {
    document.documentElement.lang = 'en-GB';
    const req = new AjaxClass();
    req.get('data1.json');
    req.post('data2.json');
    req.put('data3.json');
    req.delete('data4.json');
    await aTimeout();
    expect(requests.length).to.equal(4);
    requests.forEach(request => {
      expect(request.requestHeaders['Accept-Language']).to.equal('en-GB');
    });
  });

  it('sets "Accept-Language" header to "nl-NL" for one request if <html lang="nl-NL">', async () => {
    document.documentElement.lang = 'nl-NL';
    const req = new AjaxClass();
    req.get('data.json');
    await aTimeout();
    expect(requests.length).to.equal(1);
    expect(requests[0].requestHeaders['Accept-Language']).to.equal('nl-NL');
  });

  it('sets "Accept-Language" header to "nl-NL" for multiple subsequent requests if <html lang="nl-NL">', async () => {
    document.documentElement.lang = 'nl-NL';
    const req = new AjaxClass();
    req.get('data1.json');
    req.post('data2.json');
    req.put('data3.json');
    req.delete('data4.json');
    await aTimeout();
    expect(requests.length).to.equal(4);
    requests.forEach(request => {
      expect(request.requestHeaders['Accept-Language']).to.equal('nl-NL');
    });
  });

  it('does not set "Accept-Language" header if <html lang="">', async () => {
    document.documentElement.lang = '';
    const req = new AjaxClass();
    req.get('data.json');
    await aTimeout();
    expect(requests.length).to.equal(1);
    expect(requests[0].requestHeaders['Accept-Language']).to.equal(undefined);
  });
});
