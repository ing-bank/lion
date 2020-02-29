import { expect, fixture, html, unsafeStatic, defineCE } from '@open-wc/testing';
import sinon from 'sinon';
import { LitElement } from '@lion/core';
import { ValidateMixin } from '../src/ValidateMixin.js';
import { Validator } from '../src/Validator.js';

async function expectThrowsAsync(method, errorMessage) {
  let error = null;
  try {
    await method();
  } catch (err) {
    error = err;
  }
  expect(error).to.be.an('Error', 'No error was thrown');
  if (errorMessage) {
    expect(error.message).to.equal(errorMessage);
  }
}

describe('Validator', () => {
  it('has an "execute" function returning "shown" state', async () => {
    class MyValidator extends Validator {
      execute(modelValue, param) {
        const hasError = modelValue === 'test' && param === 'me';
        return hasError;
      }
    }
    expect(new MyValidator().execute('test', 'me')).to.be.true;
  });

  it('throws when executing a Validator without a name', async () => {
    class MyValidator extends Validator {}
    expect(() => {
      new MyValidator().execute();
    }).to.throw('You must provide a name like "this.name = \'IsCat\'" for your Validator');
  });

  it('throws when executing a Validator that has a getMessage config property with a value not of type function', async () => {
    class MyValidator extends Validator {
      constructor(...args) {
        super(...args);
        this.name = 'MyValidator';
      }
    }

    await expectThrowsAsync(
      () => new MyValidator({}, { getMessage: 'This is the custom error message' })._getMessage(),
      "You must provide a value for getMessage of type 'function', you provided a value of type: string",
    );
  });

  it('receives a "param" as a first argument on instantiation', async () => {
    const vali = new Validator('myParam');
    expect(vali.param).to.equal('myParam');
  });

  it('receives a config object (optionally) as a second argument on instantiation', async () => {
    const vali = new Validator('myParam', { my: 'config' });
    expect(vali.config).to.eql({ my: 'config' });
  });

  it('has access to name, type, params, config in getMessage provided by config', () => {
    const configSpy = sinon.spy();
    class MyValidator extends Validator {
      constructor(...args) {
        super(...args);
        this.name = 'MyValidator';
      }
    }
    const vali = new MyValidator('myParam', { my: 'config', getMessage: configSpy });
    vali._getMessage();

    expect(configSpy.args[0][0]).to.deep.equal({
      name: 'MyValidator',
      type: 'error',
      params: 'myParam',
      config: { my: 'config', getMessage: configSpy },
    });
  });

  it('has access to name, type, params, config in static get getMessage', () => {
    let staticArgs;
    class MyValidator extends Validator {
      constructor(...args) {
        super(...args);
        this.name = 'MyValidator';
      }

      static getMessage(...args) {
        staticArgs = args;
      }
    }
    const vali = new MyValidator('myParam', { my: 'config' });
    vali._getMessage();

    expect(staticArgs[0]).to.deep.equal({
      name: 'MyValidator',
      type: 'error',
      params: 'myParam',
      config: { my: 'config' },
    });
  });

  it('fires "param-changed" event on param change', async () => {
    const vali = new Validator('foo');
    const cb = sinon.spy(() => {});
    vali.addEventListener('param-changed', cb);
    vali.param = 'bar';
    expect(cb.callCount).to.equal(1);
  });

  it('fires "config-changed" event on config change', async () => {
    const vali = new Validator('foo', { foo: 'bar' });
    const cb = sinon.spy(() => {});
    vali.addEventListener('config-changed', cb);
    vali.config = { bar: 'foo' };
    expect(cb.callCount).to.equal(1);
  });

  it('has access to FormControl', async () => {
    const lightDom = '';
    const tagString = defineCE(
      class extends ValidateMixin(LitElement) {
        static get properties() {
          return { modelValue: String };
        }
      },
    );
    const tag = unsafeStatic(tagString);

    class MyValidator extends Validator {
      execute(modelValue, param) {
        const hasError = modelValue === 'forbidden' && param === 'values';
        return hasError;
      }

      // eslint-disable-next-line
      onFormControlConnect(formControl) {
        // I could do something like:
        // - add aria-required="true"
        // - add type restriction for MaxLength(3, { isBlocking: true })
      }

      // eslint-disable-next-line
      onFormControlDisconnect(formControl) {
        // I will cleanup what I did in connect
      }
    }
    const myVal = new MyValidator();
    const connectSpy = sinon.spy(myVal, 'onFormControlConnect');
    const disconnectSpy = sinon.spy(myVal, 'onFormControlDisconnect');

    const el = await fixture(html`
      <${tag} .validators=${[myVal]}>${lightDom}</${tag}>
    `);

    expect(connectSpy.callCount).to.equal(1);
    expect(connectSpy.calledWith(el)).to.equal(true);
    expect(disconnectSpy.callCount).to.equal(0);

    el.validators = [];
    expect(connectSpy.callCount).to.equal(1);
    expect(disconnectSpy.callCount).to.equal(1);
    expect(disconnectSpy.calledWith(el)).to.equal(true);
  });

  describe('Types', () => {
    it('has type "error" by default', async () => {
      expect(new Validator().type).to.equal('error');
    });

    it('supports customized types', async () => {
      // This test shows the best practice of adding custom types
      class MyValidator extends Validator {
        constructor(...args) {
          super(...args);
          this.type = 'my-type';
        }
      }
      expect(new MyValidator().type).to.equal('my-type');
    });
  });
});
