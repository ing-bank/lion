import { expect, fixture, html, unsafeStatic, defineCE } from '@open-wc/testing';
import { LitElement } from '@lion/core';
import sinon from 'sinon';
import { ValidateCoreMixin } from '../src/ValidateCoreMixin.js';
import { Validator } from '../src/Validator.js';
import { ResultValidator } from '../src/ResultValidator.js';
import { Required, MinLength } from '../src/validators.js';

class IsCat extends Validator {
  constructor(...args) {
    super(...args);
    this.name = 'isCat';
    this.execute = (modelValue, param) => {
      const validateString = param && param.number ? `cat${param.number}` : 'cat';
      const showError = modelValue !== validateString;
      return showError;
    };
  }
}

describe('Validator', () => {
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

  it('has type "error" by default', async () => {
    expect(new Validator().type).to.equal('error');
  });

  it('has an "execute" function returning active state', async () => {
    // This test shows the best practice of adding custom types
    class MyValidator extends Validator {
      execute(modelValue, param) {
        const showError = modelValue === 'test' && param === 'me';
        return showError;
      }
    }
    expect(new MyValidator().execute('test', 'me')).to.equal(true);
  });

  it('receives a param on instantiation', async () => {
    const vali = new Validator('myParam');
    expect(vali.param).to.equal('myParam');
  });

  it('receives a config object on instantiation', async () => {
    const vali = new Validator('myParam', { my: 'config' });
    expect(vali.config).to.eql({ my: 'config' });
  });

  it('fires "param-changed" event on param change', async () => {
    const vali = new Validator('foo');
    const cb = sinon.spy(() => {});
    vali.addEventListener('param-changed', cb);
    vali.param = 'bar';
    expect(cb.callCount).to.equal(1);
  });

  it('fires "config-changed" event on param change', async () => {
    const vali = new Validator('foo', { foo: 'bar' });
    const cb = sinon.spy(() => {});
    vali.addEventListener('config-changed', cb);
    vali.config = { bar: 'foo' };
    expect(cb.callCount).to.equal(1);
  });

  it('has an "execute" function returning active state', async () => {
    // This test shows the best practice of adding custom types
    class MyValidator extends Validator {
      execute(modelValue, param) {
        const showError = modelValue === 'forbidden' && param === 'values';
        return showError;
      }
    }
    expect(new MyValidator().execute('forbidden', 'values')).to.equal(true);
  });

  it('have access to FormControl', async () => {
    const lightDom = '';
    const tagString = defineCE(
      class extends ValidateCoreMixin(LitElement) {
        static get properties() {
          return { modelValue: String };
        }
      },
    );
    const tag = unsafeStatic(tagString);

    class MyValidator extends Validator {
      execute(modelValue, param) {
        const showError = modelValue === 'forbidden' && param === 'values';
        return showError;
      }

      onFormControlConnect(formControl) {
        // eslint-disable-line
        // I could do something like:
        // - add aria-required="true"
        // - add type restriction for MaxLength(3, { isBlocking: true })
      }

      onFormControlDisconnect(formControl) {
        // eslint-disable-line
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

  it('contains "execute" function returning true when Validator is "active"', async () => {
    const isCatFn = new IsCat().execute;
    expect(typeof fn).to.equal('function');
    expect(isCatFn('cat')).to.be.false;
    expect(isCatFn('dog')).to.be.true;
  });
});

describe('ResultValidator', () => {
  it('has an "executeOnResults" function returning active state', async () => {
    // This test shows the best practice of creating executeOnResults method
    class MyResultValidator extends ResultValidator {
      executeOnResults({ regularValidarionResult, prevValidationResult }) {
        const showMessage = regularValidarionResult.length && !prevValidationResult.length;
        return showMessage;
      }
    }
    expect(
      new MyResultValidator().executeOnResults({
        regularValidarionResult: [new Required(), new MinLength(3)],
        prevValidationResult: [],
      }),
    ).to.equal(true);
  });
});
