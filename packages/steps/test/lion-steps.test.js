import sinon from 'sinon';
import { expect, fixture, html, oneEvent, nextFrame } from '@open-wc/testing';

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
  it('can be instantiated', async () => {
    const el = await fixture(html`
      <lion-steps> </lion-steps>
    `);
    expect(el).to.be.a('HTMLElement');
  });

  it('is hidden when attribute hidden is true', async () => {
    const el = await fixture(
      html`
        <lion-steps hidden> </lion-steps>
      `,
    );
    expect(el).not.to.be.displayed;
  });

  it('has "steps" getter that returns default slot elements', async () => {
    const el = await fixture(html`
      <lion-steps>
        <lion-step>Step 1</lion-step>
        <lion-step initial-step>Step 2</lion-step>
        <other-step-element>Step 3</other-step-element>
        <steps-extension-element slot="new-slot">e.g. steps indicator</steps-extension-element>
      </lion-steps>
    `);
    expect(el.steps.length).to.equal(3);
    expect(el.steps[0].tagName).to.equal('LION-STEP');
    expect(el.steps[1].tagName).to.equal('LION-STEP');
    expect(el.steps[2].tagName).to.equal('OTHER-STEP-ELEMENT');
  });

  describe('initialization', () => {
    it('activates step with an "initial-step" attribute', async () => {
      const el = await fixture(html`
        <lion-steps>
          <lion-step initial-step>Step 0</lion-step>
          <lion-step>Step 1</lion-step>
        </lion-steps>
      `);
      expect(el.current).to.equal(0);
      expect(el.children[0].status).to.equal('entered');
    });
  });

  describe('navigation', () => {
    it('can navigate to the next step', async () => {
      const el = await fixture(html`
        <lion-steps>
          <lion-step initial-step>Step 0</lion-step>
          <lion-step>Step 1</lion-step>
        </lion-steps>
      `);

      setTimeout(() => el.next());

      const { detail } = await oneEvent(el, 'transition');
      expect(detail.fromStep.number).to.equal(0);
      expect(detail.fromStep.element.innerHTML).to.equal('Step 0');
      expect(detail.toStep.number).to.equal(1);
      expect(detail.toStep.element.innerHTML).to.equal('Step 1');
      expect(el.current).to.equal(1);
    });

    it('can navigate to the previous step', async () => {
      const el = await fixture(html`
        <lion-steps>
          <lion-step>Step 0</lion-step>
          <lion-step initial-step>Step 1</lion-step>
        </lion-steps>
      `);

      setTimeout(() => el.previous());

      const { detail } = await oneEvent(el, 'transition');
      expect(detail.fromStep.number).to.equal(1);
      expect(detail.fromStep.element.innerHTML).to.equal('Step 1');
      expect(detail.toStep.number).to.equal(0);
      expect(detail.toStep.element.innerHTML).to.equal('Step 0');
      expect(el.current).to.equal(0);
    });

    it('prevents navigating to the next step if user is on the last step', async () => {
      const el = await fixture(html`
        <lion-steps>
          <lion-step>Step 0</lion-step>
          <lion-step initial-step>Step 1</lion-step>
        </lion-steps>
      `);
      const cb = sinon.spy();
      el.addEventListener('transition', cb);
      expect(() => el.next()).to.throw();
      expect(cb.callCount).to.equal(0);
      expect(el.current).to.equal(1);
    });

    it('prevents navigating to the previous step if user is on the first step', async () => {
      const el = await fixture(html`
        <lion-steps>
          <lion-step initial-step>Step 0</lion-step>
          <lion-step>Step 1</lion-step>
        </lion-steps>
      `);
      const cb = sinon.spy();
      el.addEventListener('transition', cb);
      expect(() => el.previous()).to.throw();
      expect(cb.callCount).to.equal(0);
      expect(el.current).to.equal(0);
    });

    it('can navigate to an arbitrary step skipping intermediate conditions', async () => {
      const el = await fixture(html`
        <lion-steps .data=${{ age: 25 }}>
          <lion-step initial-step>Step 0</lion-step>
          <lion-step .condition=${data => data.age < 18}>Step 1</lion-step>
          <lion-step>Step 2</lion-step>
          <lion-step .condition=${data => data.age < 22}>Step 3</lion-step>
          <lion-step>Step 4</lion-step>
        </lion-steps>
      `);
      await nextFrame();

      el.current = 2;
      await checkWorkflow(el, {
        transitions: '0 => 2',
        statuses: 'left untouched entered untouched untouched',
      });

      el.current = 3; // can't enter because of condition move to next available one
      await checkWorkflow(el, {
        transitions: '2 => 4',
        statuses: 'left untouched left skipped entered',
      });
    });

    it('throws an error if current step is set out of bounds', async () => {
      const el = await fixture(html`
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

  describe('events', () => {
    it('will fire lion-step @leave event before changing .current', async () => {
      let currentInLeaveEvent;
      const onLeave = ev => {
        currentInLeaveEvent = ev.target.controller.current;
      };
      const el = await fixture(html`
        <lion-steps>
          <lion-step @leave=${onLeave}>Step 0</lion-step>
          <lion-step>Step 1</lion-step>
          <lion-step>Step 2</lion-step>
        </lion-steps>
      `);
      el.next();
      expect(currentInLeaveEvent).to.equal(0);
    });

    it('will fire lion-step @enter event after changing .current', async () => {
      let currentInEnterEvent;
      const onEnter = ev => {
        currentInEnterEvent = ev.target.controller.current;
      };
      const el = await fixture(html`
        <lion-steps>
          <lion-step>Step 0</lion-step>
          <lion-step @enter=${onEnter}> Step 1</lion-step>
          <lion-step>Step 2</lion-step>
        </lion-steps>
      `);
      el.next();
      expect(currentInEnterEvent).to.equal(1);
    });

    it('will fire initial @enter event on first step with or with [initial-step] attribute', async () => {
      const firstEnterSpy = sinon.spy();
      await fixture(html`
        <lion-steps>
          <lion-step @enter=${firstEnterSpy}>
            <div>test1</div>
          </lion-step>
        </lion-steps>
      `);
      await nextFrame();
      expect(firstEnterSpy).to.have.been.calledOnce;

      const firstEnterSpyWithInitial = sinon.spy();
      await fixture(html`
        <lion-steps>
          <lion-step initial-step @enter=${firstEnterSpyWithInitial}>
            <div>test1</div>
          </lion-step>
        </lion-steps>
      `);
      await nextFrame();
      expect(firstEnterSpyWithInitial).to.have.been.calledOnce;
    });

    it('will fire initial @enter event only once if [initial-step] is not on first step', async () => {
      const firstEnterSpy = sinon.spy();
      const secondEnterSpy = sinon.spy();
      await fixture(html`
        <lion-steps>
          <lion-step @enter=${firstEnterSpy}>
            <div>test1</div>
          </lion-step>
          <lion-step initial-step @enter=${secondEnterSpy}>
            <div>test2</div>
          </lion-step>
        </lion-steps>
      `);
      expect(firstEnterSpy).to.not.have.been.called;
      expect(secondEnterSpy).to.have.been.calledOnce;
    });
  });

  describe('workflow with data and conditions', () => {
    it('navigates to the next step which passes the condition', async () => {
      const el = await fixture(html`
        <lion-steps .data=${{ age: 25 }}>
          <lion-step initial-step>Step 0</lion-step>
          <lion-step .condition=${data => data.age < 18}>Step 1</lion-step>
          <lion-step .condition=${data => data.age >= 18 && data.age < 21}>Step 2</lion-step>
          <lion-step .condition=${data => data.age >= 21}>Step 3</lion-step>
          <lion-step>Step 4</lion-step>
        </lion-steps>
      `);

      setTimeout(() => el.next());

      await checkWorkflow(el, {
        transitions: '0 => 3',
        statuses: 'left skipped skipped entered untouched',
      });
    });

    it('skips steps with failing condition when navigating to the next step', async () => {
      const el = await fixture(html`
        <lion-steps .data=${{ age: 19 }}>
          <lion-step initial-step>Step 0</lion-step>
          <lion-step .condition=${data => data.age < 18}>Step 1</lion-step>
          <lion-step .condition=${data => data.age >= 18 && data.age < 21}>Step 2</lion-step>
          <lion-step .condition=${data => data.age >= 21}>Step 3</lion-step>
          <lion-step>Step 4</lion-step>
        </lion-steps>
      `);

      el.next();

      setTimeout(() => el.next());

      await checkWorkflow(el, {
        transitions: '2 => 4',
        statuses: 'left skipped left skipped entered',
      });
    });

    it('skips steps with failing condition when navigating to the previous step', async () => {
      const el = await fixture(html`
        <lion-steps .data=${{ age: 15 }}>
          <lion-step initial-step>Step 0</lion-step>
          <lion-step .condition=${data => data.age < 18}>Step 1</lion-step>
          <lion-step .condition=${data => data.age >= 18 && data.age < 21}>Step 2</lion-step>
          <lion-step .condition=${data => data.age >= 21}>Step 3</lion-step>
          <lion-step>Step 4</lion-step>
        </lion-steps>
      `);

      el.next();
      el.next();

      setTimeout(() => el.previous());

      await checkWorkflow(el, {
        transitions: '4 => 1',
        statuses: 'left entered skipped skipped left',
      });
    });
  });

  describe('workflow with inverted condition', () => {
    it('behaves like "if not" when inverted condition is present', async () => {
      const el = await fixture(html`
        <lion-steps .data=${{}}>
          <lion-step initial-step>Step 0</lion-step>
          <lion-step .condition=${data => data.age < 18} invert-condition>Step 1</lion-step>
          <lion-step>Step 2</lion-step>
        </lion-steps>
      `);

      setTimeout(() => {
        el.data.age = 15;
        el.next();
        el.previous();
        el.data.age = 20;
        el.next();
        el.next();
        el.previous();
        el.previous();
      });

      await checkWorkflow(el, {
        transitions: '0 => 2 => 0 => 1 => 2 => 1 => 0',
        statuses: 'entered left left',
      });
    });

    it('behaves like "if/else" in case both condition and inverted condition are present', async () => {
      const condition = data => data.age < 18;
      const el = await fixture(html`
        <lion-steps .data=${{}}>
          <lion-step initial-step>Step 0</lion-step>
          <lion-step .condition=${condition}>Step 1</lion-step>
          <lion-step .condition=${condition} invert-condition>Step 2</lion-step>
        </lion-steps>
      `);

      setTimeout(() => {
        el.data.age = 15;
        el.next();
        el.previous();
        el.data.age = 20;
        el.next();
        el.previous();
      });

      await checkWorkflow(el, {
        transitions: '0 => 1 => 0 => 2 => 0',
        statuses: 'entered skipped left',
      });
    });
  });

  describe('workflow with forward-only', () => {
    it('activates step when going forward', async () => {
      const el = await fixture(html`
        <lion-steps>
          <lion-step initial-step>Step 0</lion-step>
          <lion-step forward-only>Step 1</lion-step>
          <lion-step>Step 2</lion-step>
        </lion-steps>
      `);

      setTimeout(() => {
        el.next();
        el.next();
      });

      await checkWorkflow(el, {
        transitions: '0 => 1 => 2',
        statuses: 'left left entered',
      });
    });

    it('skips step when going back to prevent reevaluation of "service" steps', async () => {
      const el = await fixture(html`
        <lion-steps>
          <lion-step initial-step>Step 0</lion-step>
          <lion-step forward-only>Step 1</lion-step>
          <lion-step>Step 2</lion-step>
        </lion-steps>
      `);

      el.next();
      el.next();

      setTimeout(() => el.previous());

      await checkWorkflow(el, {
        transitions: '2 => 0',
        statuses: 'entered left left',
      });
    });

    it('does not set "skipped" status when going back', async () => {
      const el = await fixture(html`
        <lion-steps>
          <lion-step initial-step>Step 0</lion-step>
          <lion-step forward-only>Step 1</lion-step>
          <lion-step>Step 2</lion-step>
        </lion-steps>
      `);

      el.next();
      el.next();
      el.previous();

      expect(el.children[1].status).to.equal('left');
    });
  });
});
