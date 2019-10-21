import { expect, fixture, html, unsafeStatic, defineCE } from '@open-wc/testing';
import { LitElement } from '@lion/core';
import sinon from 'sinon';
import { ValidateMixin } from '../src/ValidateMixin.js';
import { Validator } from '../src/Validator.js';
import { ResultValidator } from '../src/ResultValidator.js';
import { Required, MinLength } from '../src/validators.js';

describe('Validator', () => {
  it('has an "execute" function returning "shown" state', async () => {
    class MyValidator extends Validator {
      execute(modelValue, param) {
        const showError = modelValue === 'test' && param === 'me';
        return showError;
      }
    }
    expect(new MyValidator().execute('test', 'me')).to.be.true;
  });

  it('receives a "param" as a first argument on instantiation', async () => {
    const vali = new Validator('myParam');
    expect(vali.param).to.equal('myParam');
  });

  it('receives a config object (optionally) as a second argument on instantiation', async () => {
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
        const showError = modelValue === 'forbidden' && param === 'values';
        return showError;
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

describe('ResultValidator', () => {
  it('has an "executeOnResults" function returning active state', async () => {
    // This test shows the best practice of creating executeOnResults method
    class MyResultValidator extends ResultValidator {
      executeOnResults({ regularValidateResult, prevValidationResult }) {
        const showMessage = regularValidateResult.length && !prevValidationResult.length;
        return showMessage;
      }
    }
    expect(
      new MyResultValidator().executeOnResults({
        regularValidateResult: [new Required(), new MinLength(3)],
        prevValidationResult: [],
      }),
    ).to.be.true;
  });
});
