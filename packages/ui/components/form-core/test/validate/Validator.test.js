import { LitElement } from 'lit';
import { defineCE, expect, fixture, html, unsafeStatic } from '@open-wc/testing';
import sinon from 'sinon';
import { ValidateMixin, Validator } from '@lion/ui/form-core.js';

/**
 * @param {function} method
 * @param {string} errorMessage
 */
async function expectThrowsAsync(method, errorMessage) {
  let error = null;
  try {
    await method();
  } catch (err) {
    error = err;
  }
  expect(error).to.be.an('Error', 'No error was thrown');
  if (errorMessage) {
    expect(/** @type {Error} */ (error).message).to.equal(errorMessage);
  }
}
/**
 * @param {Validator} validatorEl
 */
function getProtectedMembers(validatorEl) {
  return {
    // @ts-ignore
    getMessage: (...args) => validatorEl._getMessage(...args),
  };
}

describe('Validator', () => {
  it('has an "execute" function returning "shown" state', async () => {
    class MyValidator extends Validator {
      /**
       * @param {string} [modelValue]
       * @param {string} [param]
       */
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
      new MyValidator().execute(undefined);
    }).to.throw(
      'A validator needs to have a name! Please set it via "static get validatorName() { return \'IsCat\'; }"',
    );
  });

  it('throws when executing a Validator that has a getMessage config property with a value not of type function', async () => {
    class MyValidator extends Validator {
      static get validatorName() {
        return 'MyValidator';
      }
    }

    // @ts-ignore needed for test
    const vali = new MyValidator({}, { getMessage: 'This is the custom error message' });
    const { getMessage } = getProtectedMembers(vali);

    await expectThrowsAsync(
      () => getMessage(),
      "You must provide a value for getMessage of type 'function', you provided a value of type: string",
    );
  });

  it('receives a "param" as a first argument on instantiation', async () => {
    const vali = new Validator('myParam');
    expect(vali.param).to.equal('myParam');
  });

  it('receives a config object (optionally) as a second argument on instantiation', async () => {
    const vali = new Validator('myParam', { fieldName: 'X' });
    expect(vali.config).to.eql({ fieldName: 'X' });
  });

  it('has access to name, type, params, config in getMessage provided by config', () => {
    const configSpy = sinon.spy();
    class MyValidator extends Validator {
      static get validatorName() {
        return 'MyValidator';
      }
    }
    const vali = new MyValidator('myParam', { fieldName: 'X', getMessage: configSpy });
    const { getMessage } = getProtectedMembers(vali);
    getMessage();

    expect(configSpy.args[0][0]).to.deep.equal({
      name: 'MyValidator',
      type: 'error',
      params: 'myParam',
      config: { fieldName: 'X', getMessage: configSpy },
    });
  });

  it('has access to name, type, params, config in static get getMessage', () => {
    let data;
    class MyValidator extends Validator {
      static get validatorName() {
        return 'MyValidator';
      }

      /**
       * @param {Object.<string,?>} _data
       */
      static async getMessage(_data) {
        data = _data;
        return '';
      }
    }
    const vali = new MyValidator('myParam', { fieldName: 'X' });
    const { getMessage } = getProtectedMembers(vali);
    getMessage();

    expect(data).to.deep.equal({
      name: 'MyValidator',
      type: 'error',
      params: 'myParam',
      config: { fieldName: 'X' },
    });
  });

  it('fires "param-changed" event on param change', async () => {
    const vali = new Validator('foo');
    const cb = sinon.spy(() => {});
    if (vali.addEventListener) {
      vali.addEventListener('param-changed', cb);
    }
    vali.param = 'bar';
    expect(cb.callCount).to.equal(1);
  });

  it('fires "config-changed" event on config change', async () => {
    const vali = new Validator('foo', { fieldName: 'X' });
    const cb = sinon.spy(() => {});
    if (vali.addEventListener) {
      vali.addEventListener('config-changed', cb);
    }
    vali.config = { fieldName: 'Y' };
    expect(cb.callCount).to.equal(1);
  });

  it('has access to FormControl', async () => {
    const lightDom = '';
    class ValidateElement extends ValidateMixin(LitElement) {
      /** @type {any} */
      static get properties() {
        return { modelValue: String };
      }
    }
    const tagString = defineCE(ValidateElement);
    const tag = unsafeStatic(tagString);

    class MyValidator extends Validator {
      /**
       * @param {string} modelValue
       * @param {string} param
       */
      execute(modelValue, param) {
        const hasError = modelValue === 'forbidden' && param === 'values';
        return hasError;
      }
    }
    const myVal = new MyValidator();
    const connectSpy = sinon.spy(myVal, 'onFormControlConnect');
    const disconnectSpy = sinon.spy(myVal, 'onFormControlDisconnect');

    const el = /** @type {ValidateElement} */ (
      await fixture(html`
      <${tag} .validators=${[myVal]}>${lightDom}</${tag}>
    `)
    );

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
        /**
         * @param  {...any} args
         */
        constructor(...args) {
          super(...args);
          this.type = 'my-type';
        }
      }
      expect(new MyValidator().type).to.equal('my-type');
    });
  });
});
