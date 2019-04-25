import sinon from 'sinon';
import { expect, fixture, html, oneEvent } from '@open-wc/testing';

import '../lion-steps.js';
import '../lion-step.js';

async function checkWorkflow(steps, expected) {
  return new Promise(resolve => {
    const transitions = [];
    steps.addEventListener('transition', event => {
      if (!transitions.length) {
        transitions.push(event.detail.fromStep.number);
      }
      transitions.push(event.detail.toStep.number);
    });
    setTimeout(() => {
      // allow time for other transitions to happen if any
      const transitionsString = transitions.join(' => ');
      expect(transitionsString).to.equal(expected.transitions, 'transition flow is different');
      const statusesString = Array.from(steps.children)
        .map(step => step.status)
        .join(' ');
      expect(statusesString).to.equal(expected.statuses, 'steps statuses are different');
      resolve();
    });
  });
}

describe('lion-steps', () => {
  describe('initialization', () => {
    it('activates step with an "initial-step" attribute', async () => {
      const steps = await fixture(`
        <lion-steps>
          <lion-step initial-step>Step 0</lion-step>
          <lion-step>Step 1</lion-step>
        </lion-steps>
      `);
      const firstStep = steps.children[0];
      expect(steps.current).to.equal(0);
      expect(firstStep.status).to.equal('entered');
    });
  });

  describe('navigation', () => {
    it('can navigate to the next step', async () => {
      const steps = await fixture(`
        <lion-steps>
          <lion-step initial-step>Step 0</lion-step>
          <lion-step>Step 1</lion-step>
        </lion-steps>
      `);

      setTimeout(() => {
        steps.next();
      });

      const { detail } = await oneEvent(steps, 'transition');
      expect(detail.fromStep.number).to.equal(0);
      expect(detail.fromStep.element.innerHTML).to.equal('Step 0');
      expect(detail.toStep.number).to.equal(1);
      expect(detail.toStep.element.innerHTML).to.equal('Step 1');
      expect(steps.current).to.equal(1);
    });

    it('can navigate to the previous step', async () => {
      const steps = await fixture(`
        <lion-steps>
          <lion-step>Step 0</lion-step>
          <lion-step initial-step>Step 1</lion-step>
        </lion-steps>
      `);

      setTimeout(() => {
        steps.previous();
      });

      const { detail } = await oneEvent(steps, 'transition');
      expect(detail.fromStep.number).to.equal(1);
      expect(detail.fromStep.element.innerHTML).to.equal('Step 1');
      expect(detail.toStep.number).to.equal(0);
      expect(detail.toStep.element.innerHTML).to.equal('Step 0');
      expect(steps.current).to.equal(0);
    });

    it('prevents navigating to the next step if user is on the last step', async () => {
      const steps = await fixture(`
        <lion-steps>
          <lion-step>Step 0</lion-step>
          <lion-step initial-step>Step 1</lion-step>
        </lion-steps>
      `);
      const cb = sinon.spy();
      steps.addEventListener('transition', cb);
      expect(() => steps.next()).to.throw();
      expect(cb.callCount).to.equal(0);
      expect(steps.current).to.equal(1);
    });

    it('prevents navigating to the previous step if user is on the first step', async () => {
      const steps = await fixture(`
        <lion-steps>
          <lion-step initial-step>Step 0</lion-step>
          <lion-step>Step 1</lion-step>
        </lion-steps>
      `);
      const cb = sinon.spy();
      steps.addEventListener('transition', cb);
      expect(() => steps.previous()).to.throw();
      expect(cb.callCount).to.equal(0);
      expect(steps.current).to.equal(0);
    });

    it('can navigate to an arbitrary step skipping intermediate conditions', async () => {
      const steps = await fixture(html`
        <lion-steps .data=${{ age: 25 }}>
          <lion-step initial-step>Step 0</lion-step>
          <lion-step .condition=${data => data.age < 18}>Step 1</lion-step>
          <lion-step>Step 2</lion-step>
          <lion-step .condition=${data => data.age < 22}>Step 3</lion-step>
          <lion-step>Step 4</lion-step>
        </lion-steps>
      `);

      steps.current = 2;
      await checkWorkflow(steps, {
        transitions: '0 => 2',
        statuses: 'left untouched entered untouched untouched',
      });

      steps.current = 3; // can't enter because of condition move to next available one
      await checkWorkflow(steps, {
        transitions: '2 => 4',
        statuses: 'left untouched left skipped entered',
      });
    });

    it('throws an error if current step is set out of bounds', async () => {
      const el = await fixture(`
        <lion-steps>
          <lion-step>Step 0</lion-step>
          <lion-step>Step 1</lion-step>
          <lion-step>Step 2</lion-step>
        </lion-steps>
      `);

      expect(() => el._goTo(3, el.current)).to.throw(Error, 'There is no step at index 3.');
      expect(() => el._goTo(-1, el.current)).to.throw(Error, 'There is no step at index -1.');
    });
  });

  describe('workflow with data and conditions', () => {
    it('navigates to the next step which passes the condition', async () => {
      const steps = await fixture(html`
        <lion-steps .data=${{ age: 25 }}>
          <lion-step initial-step>Step 0</lion-step>
          <lion-step .condition=${data => data.age < 18}>Step 1</lion-step>
          <lion-step .condition=${data => data.age >= 18 && data.age < 21}>Step 2</lion-step>
          <lion-step .condition=${data => data.age >= 21}>Step 3</lion-step>
          <lion-step>Step 4</lion-step>
        </lion-steps>
      `);

      setTimeout(() => {
        steps.next();
      });

      await checkWorkflow(steps, {
        transitions: '0 => 3',
        statuses: 'left skipped skipped entered untouched',
      });
    });

    it('skips steps with failing condition when navigating to the next step', async () => {
      const steps = await fixture(html`
        <lion-steps .data=${{ age: 19 }}>
          <lion-step initial-step>Step 0</lion-step>
          <lion-step .condition=${data => data.age < 18}>Step 1</lion-step>
          <lion-step .condition=${data => data.age >= 18 && data.age < 21}>Step 2</lion-step>
          <lion-step .condition=${data => data.age >= 21}>Step 3</lion-step>
          <lion-step>Step 4</lion-step>
        </lion-steps>
      `);

      steps.next();

      setTimeout(() => {
        steps.next();
      });

      await checkWorkflow(steps, {
        transitions: '2 => 4',
        statuses: 'left skipped left skipped entered',
      });
    });

    it('skips steps with failing condition when navigating to the previous step', async () => {
      const steps = await fixture(html`
        <lion-steps .data=${{ age: 15 }}>
          <lion-step initial-step>Step 0</lion-step>
          <lion-step .condition=${data => data.age < 18}>Step 1</lion-step>
          <lion-step .condition=${data => data.age >= 18 && data.age < 21}>Step 2</lion-step>
          <lion-step .condition=${data => data.age >= 21}>Step 3</lion-step>
          <lion-step>Step 4</lion-step>
        </lion-steps>
      `);

      steps.next();
      steps.next();

      setTimeout(() => {
        steps.previous();
      });

      await checkWorkflow(steps, {
        transitions: '4 => 1',
        statuses: 'left entered skipped skipped left',
      });
    });
  });

  describe('workflow with inverted condition', () => {
    it('behaves like "if not" when inverted condition is present', async () => {
      const steps = await fixture(html`
        <lion-steps .data=${{}}>
          <lion-step initial-step>Step 0</lion-step>
          <lion-step .condition=${data => data.age < 18} invert-condition>Step 1</lion-step>
          <lion-step>Step 2</lion-step>
        </lion-steps>
      `);

      setTimeout(() => {
        steps.data.age = 15;
        steps.next();
        steps.previous();
        steps.data.age = 20;
        steps.next();
        steps.next();
        steps.previous();
        steps.previous();
      });

      await checkWorkflow(steps, {
        transitions: '0 => 2 => 0 => 1 => 2 => 1 => 0',
        statuses: 'entered left left',
      });
    });

    it('behaves like "if/else" in case both condition and inverted condition are present', async () => {
      const condition = data => data.age < 18;
      const steps = await fixture(html`
        <lion-steps .data=${{}}>
          <lion-step initial-step>Step 0</lion-step>
          <lion-step .condition=${condition}>Step 1</lion-step>
          <lion-step .condition=${condition} invert-condition>Step 2</lion-step>
        </lion-steps>
      `);

      setTimeout(() => {
        steps.data.age = 15;
        steps.next();
        steps.previous();
        steps.data.age = 20;
        steps.next();
        steps.previous();
      });

      await checkWorkflow(steps, {
        transitions: '0 => 1 => 0 => 2 => 0',
        statuses: 'entered skipped left',
      });
    });
  });

  describe('workflow with forward-only', () => {
    it('activates step when going forward', async () => {
      const steps = await fixture(`
        <lion-steps>
          <lion-step initial-step>Step 0</lion-step>
          <lion-step forward-only>Step 1</lion-step>
          <lion-step>Step 2</lion-step>
        </lion-steps>
      `);

      setTimeout(() => {
        steps.next();
        steps.next();
      });

      await checkWorkflow(steps, {
        transitions: '0 => 1 => 2',
        statuses: 'left left entered',
      });
    });

    it('skips step when going back to prevent reevaluation of "service" steps', async () => {
      const steps = await fixture(`
        <lion-steps>
          <lion-step initial-step>Step 0</lion-step>
          <lion-step forward-only>Step 1</lion-step>
          <lion-step>Step 2</lion-step>
        </lion-steps>
      `);

      steps.next();
      steps.next();

      setTimeout(() => {
        steps.previous();
      });

      await checkWorkflow(steps, {
        transitions: '2 => 0',
        statuses: 'entered left left',
      });
    });

    it('does not set "skipped" status when going back', async () => {
      const steps = await fixture(`
        <lion-steps>
          <lion-step initial-step>Step 0</lion-step>
          <lion-step forward-only>Step 1</lion-step>
          <lion-step>Step 2</lion-step>
        </lion-steps>
      `);

      steps.next();
      steps.next();
      steps.previous();

      expect(steps.children[1].status).to.equal('left');
    });
  });
});
