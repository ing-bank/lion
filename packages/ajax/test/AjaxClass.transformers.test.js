import { expect } from '@open-wc/testing';
import sinon from 'sinon';

import { AjaxClass } from '../src/AjaxClass.js';

describe('AjaxClass transformers', () => {
  let server;

  beforeEach(() => {
    server = sinon.fakeServer.create({ autoRespond: true });
  });

  afterEach(() => {
    server.restore();
  });

  describe('use cases', () => {
    it('can be added on a class for all instances', () => {
      ['requestDataTransformers', 'responseDataTransformers'].forEach(type => {
        const myInterceptor = () => {};
        class MyApi extends AjaxClass {
          constructor() {
            super();
            this[type] = [...this[type], myInterceptor];
          }
        }
        const ajaxWithout = AjaxClass.getNewInstance();
        const ajaxWith = MyApi.getNewInstance();
        expect(ajaxWithout[type]).to.not.include(myInterceptor);
        expect(ajaxWith[type]).to.include(myInterceptor);
      });
    });

    it('can be added per instance withour changing the class', () => {
      ['requestDataTransformers', 'responseDataTransformers'].forEach(type => {
        const myInterceptor = () => {};
        const ajaxWithout = AjaxClass.getNewInstance();
        const ajaxWith = AjaxClass.getNewInstance();
        ajaxWith[type].push(myInterceptor);
        expect(ajaxWithout[type]).to.not.include(myInterceptor);
        expect(ajaxWith[type]).to.include(myInterceptor);
      });
    });

    it('can be removed after request', async () => {
      await Promise.all(
        ['requestDataTransformers', 'responseDataTransformers'].map(async type => {
          server.respondWith('GET', 'data.json', [
            200,
            { 'Content-Type': 'application/json' },
            '{}',
          ]);

          const myTransformer = sinon.spy(foo => foo);

          const ajax = AjaxClass.getNewInstance();

          ajax[type].push(myTransformer);
          await ajax.get('data.json');

          ajax[type] = ajax[type].filter(item => item !== myTransformer);
          await ajax.get('data.json');

          expect(myTransformer.callCount).to.eql(1);
        }),
      );
    });
  });

  describe('requestDataTransformers', () => {
    it('allow to transform request data', async () => {
      server.respondWith('POST', 'data.json', [
        200,
        { 'Content-Type': 'application/json' },
        '{ "method": "post" }',
      ]);
      const addBarTransformer = data => ({ ...data, bar: 'bar' });
      const myAjax = AjaxClass.getNewInstance();
      myAjax.requestDataTransformers.push(addBarTransformer);
      const response = await myAjax.post('data.json', { foo: 'foo' });
      expect(JSON.parse(response.config.data)).to.deep.equal({
        foo: 'foo',
        bar: 'bar',
      });
    });
  });

  describe('responseDataTransformers', () => {
    it('allow to transform response data', async () => {
      server.respondWith('GET', 'data.json', [
        200,
        { 'Content-Type': 'application/json' },
        '{ "method": "get" }',
      ]);
      const addBarTransformer = data => ({ ...data, bar: 'bar' });
      const myAjax = AjaxClass.getNewInstance();
      myAjax.responseDataTransformers.push(addBarTransformer);
      const response = await myAjax.get('data.json');
      expect(response.data).to.deep.equal({ method: 'get', bar: 'bar' });
    });
  });
});
