/* eslint-env mocha */
import { expect, fixture, oneEvent } from '@open-wc/testing';

import '../lion-steps.js';
import '../lion-step.js';

describe('lion-step', () => {
  it('has a condition which allows it to become active (condition is true by default)', async () => {
    const steps = await fixture(`
      <fake-lion-steps><lion-step>Step 1</lion-step></fake-lion-steps>
    `);
    expect(steps.children[0].condition()).to.equal(true);
    expect(steps.children[0].passesCondition()).to.equal(true);
  });

  it('does not invert condition by default', async () => {
    const steps = await fixture(`
      <fake-lion-steps><lion-step>Step 1</lion-step></fake-lion-steps>
    `);
    expect(steps.children[0].invertCondition).to.equal(false);
    expect(steps.children[0].passesCondition()).to.equal(true);
  });

  it('can invert its condition', async () => {
    const steps = await fixture(`
      <fake-lion-steps><lion-step>Step 1</lion-step></fake-lion-steps>
    `);
    steps.children[0].condition = () => true;
    steps.children[0].invertCondition = true;
    expect(steps.children[0].condition()).to.equal(true);
    expect(steps.children[0].passesCondition()).to.equal(false);
  });

  it('allows to define it as the initial-step', async () => {
    const withInitial = await fixture(`
      <fake-lion-steps><lion-step initial-step>Step 1</lion-step></fake-lion-steps>
    `);
    expect(withInitial.current).to.equal(0);
    expect(withInitial.children[0].status).to.equal('entered');

    const withSecondInitial = await fixture(`<fake-lion-steps
      ><lion-step>Step 1</lion-step><lion-step initial-step>Step 2</lion-step></fake-lion-steps>
      `);
    expect(withSecondInitial.current).to.equal(1);
    expect(withSecondInitial.children[0].status).to.equal('untouched');
    expect(withSecondInitial.children[1].status).to.equal('entered');
  });

  it('has "untouched" status by default', async () => {
    const steps = await fixture(`
      <fake-lion-steps><lion-step>Step 1</lion-step></fake-lion-steps>
    `);
    expect(steps.children[0].status).to.equal('untouched');
  });

  it('communicates with a parent steps controller to handles actions', async () => {
    const steps = await fixture(`
      <fake-lion-steps><lion-step>Step 1</lion-step></fake-lion-steps>
    `);
    expect(steps.children[0].controller).to.equal(steps);
  });

  describe('navigation', () => {
    it('can be entered', async () => {
      const steps = await fixture(`
        <fake-lion-steps><lion-step>Step 1</lion-step></fake-lion-steps>
      `);
      setTimeout(() => steps.children[0].enter(), 0);
      await oneEvent(steps.children[0], 'enter');
      expect(steps.children[0].status).to.equal('entered');
    });

    it('can be left', async () => {
      const steps = await fixture(`
        <fake-lion-steps><lion-step>Step 1</lion-step></fake-lion-steps>
      `);
      setTimeout(() => steps.children[0].leave(), 0);
      await oneEvent(steps.children[0], 'leave');
      expect(steps.children[0].status).to.equal('left');
    });

    it('can be skipped', async () => {
      const steps = await fixture(`
        <fake-lion-steps><lion-step>Step 1</lion-step></fake-lion-steps>
      `);
      setTimeout(() => steps.children[0].skip(), 0);
      await oneEvent(steps.children[0], 'skip');
      expect(steps.children[0].status).to.equal('skipped');
    });
  });
});
