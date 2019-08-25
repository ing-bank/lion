import { expect } from '@open-wc/testing';
import { http, setHttp } from '../src/http.js';
import { HttpClient } from '../src/HttpClient.js';

describe('http', () => {
  it('exports an instance of HttpClient', () => {
    expect(http).to.be.an.instanceOf(HttpClient);
  });

  it('can replace http with another instance', () => {
    const newHttp = new HttpClient();
    setHttp(newHttp);
    expect(http).to.equal(newHttp);
  });
});
