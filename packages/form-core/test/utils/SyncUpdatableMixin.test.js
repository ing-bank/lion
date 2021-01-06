import { LitElement } from '@lion/core';
import { defineCE, expect, fixture, fixtureSync, html, unsafeStatic } from '@open-wc/testing';
import sinon from 'sinon';
import { SyncUpdatableMixin } from '../../src/utils/SyncUpdatableMixin.js';

describe('SyncUpdatableMixin', () => {
  describe('Until firstUpdated', () => {
    it('initializes all properties', async () => {
      let hasCalledFirstUpdated = false;
      let hasCalledUpdateSync = false;
      // @ts-expect-error base constructors same return type
      class UpdatableImplementation extends SyncUpdatableMixin(LitElement) {
        static get properties() {
          return {
            propA: { type: String },
            propB: {
              type: String,
              attribute: 'prop-b',
            },
          };
        }

        constructor() {
          super();
          this.propA = 'init-a';
          this.propB = 'init-b';
        }

        /** @param {import('@lion/core').PropertyValues } changedProperties */
        firstUpdated(changedProperties) {
          super.firstUpdated(changedProperties);
          hasCalledFirstUpdated = true;
        }

        /**
         * @param {string} name
         * @param {*} oldValue
         */
        updateSync(name, oldValue) {
          super.updateSync(name, oldValue);
          hasCalledUpdateSync = true;
        }
      }

      const tagString = defineCE(UpdatableImplementation);
      const tag = unsafeStatic(tagString);
      const el = /** @type {UpdatableImplementation} */ (fixtureSync(
        html`<${tag} prop-b="b"></${tag}>`,
      ));

      // Getters setters work as expected, without running property effects
      expect(el.propA).to.equal('init-a');
      expect(el.propB).to.equal('b');
      el.propA = 'a2';
      expect(el.propA).to.equal('a2');
      expect(hasCalledFirstUpdated).to.be.false;
      expect(hasCalledUpdateSync).to.be.false;

      await el.updateComplete;
      expect(hasCalledFirstUpdated).to.be.true;
      expect(hasCalledUpdateSync).to.be.true;
    });

    // See: https://github.com/webcomponents/gold-standard/wiki/Member-Order-Independence
    it('guarantees Member Order Independence', async () => {
      let hasCalledRunPropertyEffect = false;

      // @ts-expect-error base constructors same return type
      class UpdatableImplementation extends SyncUpdatableMixin(LitElement) {
        static get properties() {
          return {
            propA: { type: String },
            propB: {
              type: String,
              attribute: 'prop-b',
            },
            derived: { type: String },
          };
        }

        constructor() {
          super();
          this.propA = 'init-a';
          this.propB = 'init-b';
        }

        /**
         * @param {string} name
         * @param {*} oldValue
         */
        updateSync(name, oldValue) {
          super.updateSync(name, oldValue);

          if (name === 'propB') {
            this._runPropertyEffect();
          }
        }

        _runPropertyEffect() {
          hasCalledRunPropertyEffect = true;
          this.derived = this.propA + this.propB;
        }
      }

      const tagString = defineCE(UpdatableImplementation);
      const tag = unsafeStatic(tagString);
      const el = /** @type {UpdatableImplementation} */ (fixtureSync(
        html`<${tag} prop-b="b" .propA="${'a'}"></${tag}>`,
      ));

      // Derived
      expect(el.derived).to.be.undefined;
      expect(hasCalledRunPropertyEffect).to.be.false;

      await el.updateComplete;
      expect(el.derived).to.equal('ab');
      expect(hasCalledRunPropertyEffect).to.be.true;

      const el2 = /** @type {UpdatableImplementation} */ (await fixture(
        html`<${tag} .propA="${'a'}"></${tag}>`,
      ));
      expect(el2.derived).to.equal('ainit-b');

      const el3 = /** @type {UpdatableImplementation} */ (await fixture(
        html`<${tag} .propB="${'b'}"></${tag}>`,
      ));
      expect(el3.derived).to.equal('init-ab');

      const el4 = /** @type {UpdatableImplementation} */ (await fixture(
        html`<${tag} .propA=${'a'} .propB="${'b'}"></${tag}>`,
      ));
      expect(el4.derived).to.equal('ab');
    });

    it('runs "updateSync" once per property with most current value', async () => {
      let propChangedCount = 0;
      let propUpdateSyncCount = 0;

      // @ts-expect-error the private override is on purpose
      class UpdatableImplementation extends SyncUpdatableMixin(LitElement) {
        static get properties() {
          return {
            prop: { type: String },
          };
        }

        constructor() {
          super();
          this.prop = 'a';
        }

        /**
         * @param {string} name
         * @param {*} oldValue
         */
        requestUpdateInternal(name, oldValue) {
          super.requestUpdateInternal(name, oldValue);
          if (name === 'prop') {
            propChangedCount += 1;
          }
        }

        /**
         * @param {string} name
         * @param {*} oldValue
         */
        updateSync(name, oldValue) {
          super.updateSync(name, oldValue);
          if (name === 'prop') {
            propUpdateSyncCount += 1;
          }
        }
      }

      const tagString = defineCE(UpdatableImplementation);
      const tag = unsafeStatic(tagString);

      const el = /** @type {UpdatableImplementation} */ (fixtureSync(html`<${tag}></${tag}>`));
      el.prop = 'a';
      // Getters setters work as expected, without running property effects
      expect(propChangedCount).to.equal(2);
      expect(propUpdateSyncCount).to.equal(0);

      await el.updateComplete;
      expect(propChangedCount).to.equal(2);
      expect(propUpdateSyncCount).to.equal(1);
    });
  });

  describe('After firstUpdated', () => {
    it('calls "updateSync" immediately when the observed property is changed (newValue !== oldValue)', async () => {
      // @ts-expect-error
      class UpdatableImplementation extends SyncUpdatableMixin(LitElement) {
        static get properties() {
          return {
            propA: { type: String },
            propB: {
              type: String,
              attribute: 'prop-b',
            },
            derived: { type: String },
          };
        }

        constructor() {
          super();
          this.propA = 'init-a';
          this.propB = 'init-b';
        }

        /**
         * @param {string} name
         * @param {*} oldValue
         */
        updateSync(name, oldValue) {
          super.updateSync(name, oldValue);

          if (name === 'propB') {
            this._runPropertyEffect();
          }
        }

        _runPropertyEffect() {
          this.derived = this.propA + this.propB;
        }
      }

      const tagString = defineCE(UpdatableImplementation);
      const tag = unsafeStatic(tagString);
      const el = /** @type {UpdatableImplementation} */ (fixtureSync(
        html`<${tag} prop-b="b" .propA="${'a'}"></${tag}>`,
      ));
      const spy = sinon.spy(el, '_runPropertyEffect');
      expect(spy.callCount).to.equal(0);

      await el.updateComplete;
      expect(el.derived).to.equal('ab');
      expect(spy.callCount).to.equal(1);
      el.propB = 'b2';
      expect(el.derived).to.equal('ab2');
      expect(spy.callCount).to.equal(2);
    });
  });

  describe('Features', () => {
    // See: https://lit-element.polymer-project.org/guide/lifecycle#haschanged
    it('supports "hasChanged" from UpdatingElement', async () => {
      // @ts-expect-error base constructors same return type
      class UpdatableImplementation extends SyncUpdatableMixin(LitElement) {
        static get properties() {
          return {
            complexProp: {
              type: Object,
              /**
               * @param {Object} result
               * @param {Object} prevResult
               */
              hasChanged: (result, prevResult) => {
                // Simple way of doing a deep comparison
                if (JSON.stringify(result) !== JSON.stringify(prevResult)) {
                  return true;
                }
                return false;
              },
            },
          };
        }

        constructor() {
          super();
          this.complexProp = {};
        }

        /**
         * @param {string} name
         * @param {*} oldValue
         */
        updateSync(name, oldValue) {
          super.updateSync(name, oldValue);

          if (name === 'complexProp') {
            this._onComplexPropChanged();
          }
        }

        _onComplexPropChanged() {
          // do smth
        }
      }

      const tagString = defineCE(UpdatableImplementation);

      const tag = unsafeStatic(tagString);
      const el = /** @type {UpdatableImplementation} */ (fixtureSync(html`<${tag}></${tag}>`));
      const spy = sinon.spy(el, '_onComplexPropChanged');
      await el.updateComplete;

      // Constructor sets it first, so start at 1
      expect(spy.callCount).to.equal(1);
      el.complexProp = { key1: true };
      expect(spy.callCount).to.equal(2);
      el.complexProp = { key1: false };
      expect(spy.callCount).to.equal(3);
      el.complexProp = { key1: false };
      expect(spy.callCount).to.equal(3);
    });
  });
});
