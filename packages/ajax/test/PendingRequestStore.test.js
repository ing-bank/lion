// @ts-nocheck
import { expect } from '@open-wc/testing';
import PendingRequestStore from '../src/PendingRequestStore.js';

describe('PendingRequestStore', () => {
  let pendingRequestStore;

  beforeEach(() => {
    pendingRequestStore = new PendingRequestStore();
  });

  describe('public interface', () => {
    it('PendingRequestStore has `set` method', () => {
      expect(pendingRequestStore.set).to.exist;
    });

    it('PendingRequestStore has `get` method', () => {
      expect(pendingRequestStore.get).to.exist;
    });

    it('PendingRequestStore has `resolve` method', () => {
      expect(pendingRequestStore.resolve).to.exist;
    });

    it('PendingRequestStore has `reset` method', () => {
      expect(pendingRequestStore.reset).to.exist;
    });
  });

  describe('getting and setting', () => {
    it('will return undefined for an unknown key', () => {
      expect(pendingRequestStore.get('unknown-key')).to.be.undefined;
    });

    it('will return a promise for a key that has been added earlier', () => {
      // Given
      pendingRequestStore.set('a-key');

      // Then
      expect(pendingRequestStore.get('a-key')).to.be.a('Promise');
    });

    it('will not replace an already known entry', () => {
      // Given
      pendingRequestStore.set('the-original-key');
      const theOriginalPromise = pendingRequestStore.get('the-original-key');

      // When
      pendingRequestStore.set('the-original-key');

      // Then
      expect(pendingRequestStore.get('the-original-key')).to.equal(theOriginalPromise);
    });

    it('will return the same promise when retrieved twice', () => {
      // Given
      pendingRequestStore.set('a-key');

      // When
      const a1 = pendingRequestStore.get('a-key');
      const a2 = pendingRequestStore.get('a-key');

      // Then
      expect(a1).to.equal(a2);
    });

    it('will return undefined when the store is reset', () => {
      // Given
      pendingRequestStore.set('a-key');

      // When
      pendingRequestStore.reset();

      // Then
      expect(pendingRequestStore.get('a-key')).to.be.undefined;
    });
  });

  describe('resolving', () => {
    it('will resolve a named promise and delete it', async () => {
      // Given
      pendingRequestStore.set('do-groceries');
      const backFromTheStore = pendingRequestStore
        .get('do-groceries')
        .catch(() => expect.fail('Promise was rejected before it could be resolved'));

      // When
      pendingRequestStore.resolve('do-groceries');
      await backFromTheStore;

      // Then
      expect(pendingRequestStore.get('do-groceries')).to.be.undefined;
    });

    it('will use the same promise when retrieving or resolving the same key', async () => {
      // Given
      const fridge = [];

      pendingRequestStore.set('do-groceries');
      pendingRequestStore.get('do-groceries').then(() => fridge.push('milk'));
      pendingRequestStore.get('do-groceries').then(() => fridge.push('eggs'));

      const backFromTheStore = pendingRequestStore.get('do-groceries');

      // When
      pendingRequestStore.resolve('do-groceries');
      await backFromTheStore;

      // Then
      expect(fridge).to.contain('milk');
      expect(fridge).to.contain('eggs');

      expect(pendingRequestStore.get('do-groceries')).to.be.undefined;
    });
  });

  describe('resolving multiple requestIds by regular expression', () => {
    it('will resolve multiple promises matching a regular expression and delete them', async () => {
      // Given
      let canIPlayNow = false;

      pendingRequestStore.set('do-dishes');
      pendingRequestStore.set('do-groceries');

      const choresAllDone = Promise.all([
        pendingRequestStore.get('do-dishes'),
        pendingRequestStore.get('do-groceries'),
      ]);

      // When
      pendingRequestStore.resolveMatching(/^do-/);
      await choresAllDone.then(() => {
        canIPlayNow = true;
      });

      // Then
      expect(canIPlayNow).to.be.ok;

      expect(pendingRequestStore.get('do-groceries')).to.be.undefined;
      expect(pendingRequestStore.get('do-dishes')).to.be.undefined;
    });
  });

  it('will leave unmatched requests alone when resolving', () => {
    // Given
    pendingRequestStore.set('do-dishes');
    pendingRequestStore.set('do-groceries');
    pendingRequestStore.set('ponder-meaning-of-life');

    // When
    pendingRequestStore.resolveMatching(/^do-/);

    // Then
    expect(pendingRequestStore.get('do-groceries')).to.be.undefined;
    expect(pendingRequestStore.get('do-dishes')).to.be.undefined;

    expect(pendingRequestStore.get('ponder-meaning-of-life')).not.to.be.undefined;
  });
});
