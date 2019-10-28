import { expect, fixtureSync, defineCE } from '@open-wc/testing';
import sinon from 'sinon';
import { UpdatingElement } from '@lion/core';
import { SyncUpdatableMixin } from '../src/utils/SyncUpdatableMixin.js';

describe('SyncUpdatableMixin', () => {
  describe('Until firstUpdated', () => {
    it('initializes all properties', async () => {
      let hasCalledFirstUpdated = false;
      let hasCalledUpdateSync = false;

      const tag = defineCE(
        class extends SyncUpdatableMixin(UpdatingElement) {
          static get properties() {
            return {
              propA: String,
              propB: {
                type: String,
                attribute: 'prop-b',
              },
            };
          }

          constructor() {
            super();
            this.propA = 'a';
          }

          firstUpdated(c) {
            super.firstUpdated(c);
            hasCalledFirstUpdated = true;
          }

          updateSync(...args) {
            super.updateSync(...args);
            hasCalledUpdateSync = true;
          }
        },
      );
      const el = fixtureSync(`<${tag} prop-b="b"></${tag}>`);

      // Getters setters work as expected, without running property effects
      expect(el.propA).to.equal('a');
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

      const tag = defineCE(
        class extends SyncUpdatableMixin(UpdatingElement) {
          static get properties() {
            return {
              propA: String,
              propB: {
                type: String,
                attribute: 'prop-b',
              },
              derived: String,
            };
          }

          constructor() {
            super();
            this.propA = 'a';
          }

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
        },
      );
      const el = fixtureSync(`<${tag} prop-b="b" .propA="${'a'}"></${tag}>`);

      // Derived
      expect(el.derived).to.be.undefined; // with _requestUpdate, we would have gotten 'undefinedb'
      expect(hasCalledRunPropertyEffect).to.be.false;

      await el.updateComplete;
      expect(el.derived).to.equal('ab');
      expect(hasCalledRunPropertyEffect).to.be.true;
    });

    it('runs "updateSync" once per property with most current value', async () => {
      let propChangedCount = 0;
      let propUpdateSyncCount = 0;

      const tag = defineCE(
        class extends SyncUpdatableMixin(UpdatingElement) {
          static get properties() {
            return {
              prop: String,
            };
          }

          constructor() {
            super();
            console.log('dingen etceteraaaahhhh');
            this.prop = 'a';
            console.log('dingen etceterbeeeh');
          }

          _requestUpdate(name, oldValue) {
            super._requestUpdate(name, oldValue);
            if (name === 'prop') {
              propChangedCount += 1;
            }
          }

          updateSync(name, oldValue) {
            super.updateSync(name, oldValue);
            console.log('updateSync');
            if (name === 'prop') {
              propUpdateSyncCount += 1;
            }
          }
        },
      );
      const el = fixtureSync(`<${tag}></${tag}>`);
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
      const tag = defineCE(
        class extends SyncUpdatableMixin(UpdatingElement) {
          static get properties() {
            return {
              propA: String,
              propB: {
                type: String,
                attribute: 'prop-b',
              },
              derived: String,
            };
          }

          constructor() {
            super();
            this.propA = 'a';
          }

          updateSync(name, oldValue) {
            super.updateSync(name, oldValue);

            if (name === 'propB') {
              this._runPropertyEffect();
            }
          }

          _runPropertyEffect() {
            this.derived = this.propA + this.propB;
          }
        },
      );
      const el = fixtureSync(`<${tag} prop-b="b" .propA="${'a'}"></${tag}>`);
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
      const tag = defineCE(
        class extends SyncUpdatableMixin(UpdatingElement) {
          static get properties() {
            return {
              complexProp: {
                type: Object,
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

          updateSync(name, oldValue) {
            super.updateSync(name, oldValue);

            if (name === 'complexProp') {
              this._onComplexPropChanged();
            }
          }

          _onComplexPropChanged() {
            // do smth
          }
        },
      );
      const el = fixtureSync(`<${tag}></${tag}>`);
      const spy = sinon.spy(el, '_onComplexPropChanged');
      await el.updateComplete;

      expect(spy.callCount).to.equal(0);
      el.complexProp = { key1: true };
      expect(spy.callCount).to.equal(1);
      el.complexProp = { key1: false };
      expect(spy.callCount).to.equal(2);
      el.complexProp = { key1: false };
      expect(spy.callCount).to.equal(2);
    });
  });
});
