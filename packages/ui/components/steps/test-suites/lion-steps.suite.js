import { html } from 'lit/static-html.js';
import { unsafeStatic, expect, fixture as _fixture, oneEvent } from '@open-wc/testing';
import sinon from 'sinon';
import { LionStep, LionSteps } from '@lion/ui/steps.js';
import { resolveSuiteTag } from '../../core/test-helpers/resolveSuiteTag.js';

/**
 * @typedef {import('@lion/ui/types/test-suites.js').SuiteElement} SuiteElement
 * @typedef {import('lit').TemplateResult} TemplateResult
 * @typedef {{[key: string]: any}} UnknownData
 */

const fixture = /** @type {(arg: TemplateResult) => Promise<LionSteps>} */ (_fixture);

/**
 *
 * @param {LionSteps} steps
 * @param {Object} expected
 * @param {string} expected.transitions
 * @param {string} expected.statuses
 * @returns {Promise<void>}
 */
async function checkWorkflow(steps, expected) {
  return new Promise(resolve => {
    /** @type {number[]} */
    const transitions = [];
    steps.addEventListener('transition', event => {
      const _event = /** @type {CustomEvent} */ (event);
      if (!transitions.length) {
        transitions.push(_event.detail.fromStep.number);
      }
      transitions.push(_event.detail.toStep.number);
    });
    setTimeout(() => {
      // allow time for other transitions to happen if any
      const transitionsString = transitions.join(' => ');
      expect(transitionsString).to.equal(expected.transitions, 'transition flow is different');
      const statusesString = /** @type {LionStep[]} */ (Array.from(steps.children))
        .map(step => step.status)
        .join(' ');
      expect(statusesString).to.equal(expected.statuses, 'steps statuses are different');
      resolve();
    });
  });
}

/**
 * Runs the `lion-steps` behavioural suite, moved out of `test/lion-steps.test.js` so a Subclasser can run
 * the same guarantees against its own element. Pass `tagString` to point it at your registered
 * tag; see docs/guides/principles/test-suites.md.
 * `tagString`, `klass` and the older role tag keys are deprecated: pass `classes` instead (Lion
 * itself uses `classes` everywhere).
 * @param {import('@lion/ui/types/test-suites.js').SuiteConfig<{host: SuiteElement; step: SuiteElement}, {stepTagString?: any}>} [customConfig]
 */
export function runStepsSuite({
  classes: { host = LionSteps, step = LionStep } = {},
  tagString: legacyTagString,
  stepTagString: legacyStepTagString,
} = {}) {
  const hostTagString = resolveSuiteTag(host, legacyTagString);
  const tagNameStep = resolveSuiteTag(step, legacyStepTagString);
  const tags = {
    host: unsafeStatic(hostTagString),
    step: unsafeStatic(tagNameStep),
  };

  describe('lion-steps', () => {
    it('can be instantiated', async () => {
      const el = await fixture(html`<${tags.host}> </${tags.host}>`);
      expect(el).to.be.a('HTMLElement');
    });

    it('is hidden when attribute hidden is true', async () => {
      const el = await fixture(html`<${tags.host} hidden> </${tags.host}>`);
      expect(el).not.to.be.displayed;
    });

    it('has "steps" getter that returns default slot elements', async () => {
      const el = await fixture(html`
        <${tags.host}>
          <${tags.step}>Step 1</${tags.step}>
          <${tags.step} initial-step>Step 2</${tags.step}>
          <other-step-element>Step 3</other-step-element>
          <steps-extension-element slot="new-slot">e.g. steps indicator</steps-extension-element>
        </${tags.host}>
      `);
      expect(el.steps.length).to.equal(3);
      expect(el.steps[0].tagName).to.equal(tagNameStep.toUpperCase());
      expect(el.steps[1].tagName).to.equal(tagNameStep.toUpperCase());
      expect(el.steps[2].tagName).to.equal('OTHER-STEP-ELEMENT');
    });

    describe('initialization', () => {
      it('activates step with an "initial-step" attribute', async () => {
        const el = await fixture(html`
          <${tags.host}>
            <${tags.step} initial-step>Step 0</${tags.step}>
            <${tags.step}>Step 1</${tags.step}>
          </${tags.host}>
        `);
        expect(el.current).to.equal(0);
        expect(/** @type {LionStep} */ (el.children[0]).status).to.equal('entered');
      });
    });

    describe('navigation', () => {
      it('can navigate to the next step', async () => {
        const el = await fixture(html`
          <${tags.host}>
            <${tags.step} initial-step>Step 0</${tags.step}>
            <${tags.step}>Step 1</${tags.step}>
          </${tags.host}>
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
          <${tags.host}>
            <${tags.step}>Step 0</${tags.step}>
            <${tags.step} initial-step>Step 1</${tags.step}>
          </${tags.host}>
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
          <${tags.host}>
            <${tags.step}>Step 0</${tags.step}>
            <${tags.step} initial-step>Step 1</${tags.step}>
          </${tags.host}>
        `);
        const cb = sinon.spy();
        el.addEventListener('transition', cb);
        expect(() => el.next()).to.throw();
        expect(cb.callCount).to.equal(0);
        expect(el.current).to.equal(1);
      });

      it('prevents navigating to the previous step if user is on the first step', async () => {
        const el = await fixture(html`
          <${tags.host}>
            <${tags.step} initial-step>Step 0</${tags.step}>
            <${tags.step}>Step 1</${tags.step}>
          </${tags.host}>
        `);
        const cb = sinon.spy();
        el.addEventListener('transition', cb);
        expect(() => el.previous()).to.throw();
        expect(cb.callCount).to.equal(0);
        expect(el.current).to.equal(0);
      });

      it('can navigate to an arbitrary step skipping intermediate conditions', async () => {
        const el = await fixture(html`
          <${tags.host} .data=${{ age: 25 }}>
            <${tags.step} initial-step>Step 0</${tags.step}>
            <${tags.step} .condition=${/** @param {UnknownData} data */ data => data.age < 18}
              >Step 1</${tags.step}
            >
            <${tags.step}>Step 2</${tags.step}>
            <${tags.step} .condition=${/** @param {UnknownData} data */ data => data.age < 22}
              >Step 3</${tags.step}
            >
            <${tags.step}>Step 4</${tags.step}>
          </${tags.host}>
        `);

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
          <${tags.host}>
            <${tags.step}>Step 0</${tags.step}>
            <${tags.step}>Step 1</${tags.step}>
            <${tags.step}>Step 2</${tags.step}>
          </${tags.host}>
        `);

        expect(() => el._goTo(3, el.current)).to.throw(Error, 'There is no step at index 3.');
        expect(() => el._goTo(-1, el.current)).to.throw(Error, 'There is no step at index -1.');
      });

      it('can navigate to a step that was added after first render', async () => {
        const el = await fixture(html`
          <${tags.host}>
            <${tags.step} initial-step>Step 0</${tags.step}>
            <${tags.step}>Step 1</${tags.step}>
          </${tags.host}>
        `);
        const addedStep = document.createElement(tagNameStep);
        addedStep.textContent = 'Step 2';
        el.appendChild(addedStep);

        el.next();
        el.next();
        expect(el.current).to.equal(2);
        expect(/** @type {LionStep} */ (addedStep).status).to.equal('entered');
      });

      it('throws the out of bounds error for a step that was removed after first render', async () => {
        const el = await fixture(html`
          <${tags.host}>
            <${tags.step} initial-step>Step 0</${tags.step}>
            <${tags.step}>Step 1</${tags.step}>
            <${tags.step}>Step 2</${tags.step}>
          </${tags.host}>
        `);
        /** @type {Element} */ (el.lastElementChild).remove();

        el.next();
        expect(() => el.next()).to.throw(Error, 'There is no step at index 2.');
        expect(el.current).to.equal(1);
      });
    });

    describe('events', () => {
      it('will fire lion-step @leave event before changing .current', async () => {
        let currentInLeaveEvent;
        const onLeave = /** @param {Event} ev */ ev => {
          currentInLeaveEvent = /** @type {LionStep} */ (ev.target).controller?.current;
        };
        const el = await fixture(html`
          <${tags.host}>
            <${tags.step} @leave=${onLeave}>Step 0</${tags.step}>
            <${tags.step}>Step 1</${tags.step}>
            <${tags.step}>Step 2</${tags.step}>
          </${tags.host}>
        `);
        el.next();
        expect(currentInLeaveEvent).to.equal(0);
      });

      it('will fire lion-step @enter event after changing .current', async () => {
        let currentInEnterEvent;
        const onEnter = /** @param {Event} ev */ ev => {
          currentInEnterEvent = /** @type {LionStep} */ (ev.target).controller?.current;
        };
        const el = await fixture(html`
          <${tags.host}>
            <${tags.step}>Step 0</${tags.step}>
            <${tags.step} @enter=${onEnter}> Step 1</${tags.step}>
            <${tags.step}>Step 2</${tags.step}>
          </${tags.host}>
        `);
        el.next();
        expect(currentInEnterEvent).to.equal(1);
      });

      it('will fire initial @enter event on first step with or with [initial-step] attribute', async () => {
        const firstEnterSpy = sinon.spy();
        await fixture(html`
          <${tags.host}>
            <${tags.step} @enter=${firstEnterSpy}>
              <div>test1</div>
            </${tags.step}>
          </${tags.host}>
        `);
        expect(firstEnterSpy).to.have.been.calledOnce;

        const firstEnterSpyWithInitial = sinon.spy();
        await fixture(html`
          <${tags.host}>
            <${tags.step} initial-step @enter=${firstEnterSpyWithInitial}>
              <div>test1</div>
            </${tags.step}>
          </${tags.host}>
        `);
        expect(firstEnterSpyWithInitial).to.have.been.calledOnce;
      });

      it('will fire initial @enter event only once if [initial-step] is not on first step', async () => {
        const firstEnterSpy = sinon.spy();
        const secondEnterSpy = sinon.spy();
        await fixture(html`
          <${tags.host}>
            <${tags.step} @enter=${firstEnterSpy}>
              <div>test1</div>
            </${tags.step}>
            <${tags.step} initial-step @enter=${secondEnterSpy}>
              <div>test2</div>
            </${tags.step}>
          </${tags.host}>
        `);
        expect(firstEnterSpy).to.not.have.been.called;
        expect(secondEnterSpy).to.have.been.calledOnce;
      });
    });

    describe('workflow with data and conditions', () => {
      it('navigates to the next step which passes the condition', async () => {
        const el = await fixture(html`
          <${tags.host} .data=${{ age: 25 }}>
            <${tags.step} initial-step>Step 0</${tags.step}>
            <${tags.step} .condition=${/** @param {UnknownData} data */ data => data.age < 18}
              >Step 1</${tags.step}
            >
            <${tags.step}
              .condition=${/** @param {UnknownData} data */ data => data.age >= 18 && data.age < 21}
              >Step 2</${tags.step}
            >
            <${tags.step} .condition=${/** @param {UnknownData} data */ data => data.age >= 21}
              >Step 3</${tags.step}
            >
            <${tags.step}>Step 4</${tags.step}>
          </${tags.host}>
        `);

        setTimeout(() => el.next());

        await checkWorkflow(el, {
          transitions: '0 => 3',
          statuses: 'left skipped skipped entered untouched',
        });
      });

      it('skips steps with failing condition when navigating to the next step', async () => {
        const el = await fixture(html`
          <${tags.host} .data=${{ age: 19 }}>
            <${tags.step} initial-step>Step 0</${tags.step}>
            <${tags.step} .condition=${/** @param {UnknownData} data */ data => data.age < 18}
              >Step 1</${tags.step}
            >
            <${tags.step}
              .condition=${/** @param {UnknownData} data */ data => data.age >= 18 && data.age < 21}
              >Step 2</${tags.step}
            >
            <${tags.step} .condition=${/** @param {UnknownData} data */ data => data.age >= 21}
              >Step 3</${tags.step}
            >
            <${tags.step}>Step 4</${tags.step}>
          </${tags.host}>
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
          <${tags.host} .data=${{ age: 15 }}>
            <${tags.step} initial-step>Step 0</${tags.step}>
            <${tags.step} .condition=${/** @param {UnknownData} data */ data => data.age < 18}
              >Step 1</${tags.step}
            >
            <${tags.step}
              .condition=${/** @param {UnknownData} data */ data => data.age >= 18 && data.age < 21}
              >Step 2</${tags.step}
            >
            <${tags.step} .condition=${/** @param {UnknownData} data */ data => data.age >= 21}
              >Step 3</${tags.step}
            >
            <${tags.step}>Step 4</${tags.step}>
          </${tags.host}>
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
          <${tags.host} .data=${{}}>
            <${tags.step} initial-step>Step 0</${tags.step}>
            <${tags.step}
              .condition=${/** @param {UnknownData} data */ data => data.age < 18}
              invert-condition
              >Step 1</${tags.step}
            >
            <${tags.step}>Step 2</${tags.step}>
          </${tags.host}>
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
        const condition = /** @param {UnknownData} data */ data => data.age < 18;
        const el = await fixture(html`
          <${tags.host} .data=${{}}>
            <${tags.step} initial-step>Step 0</${tags.step}>
            <${tags.step} .condition=${condition}>Step 1</${tags.step}>
            <${tags.step} .condition=${condition} invert-condition>Step 2</${tags.step}>
          </${tags.host}>
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
          <${tags.host}>
            <${tags.step} initial-step>Step 0</${tags.step}>
            <${tags.step} forward-only>Step 1</${tags.step}>
            <${tags.step}>Step 2</${tags.step}>
          </${tags.host}>
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
          <${tags.host}>
            <${tags.step} initial-step>Step 0</${tags.step}>
            <${tags.step} forward-only>Step 1</${tags.step}>
            <${tags.step}>Step 2</${tags.step}>
          </${tags.host}>
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
          <${tags.host}>
            <${tags.step} initial-step>Step 0</${tags.step}>
            <${tags.step} forward-only>Step 1</${tags.step}>
            <${tags.step}>Step 2</${tags.step}>
          </${tags.host}>
        `);

        el.next();
        el.next();
        el.previous();

        expect(/** @type {LionStep} */ (el.children[1]).status).to.equal('left');
      });
    });
  });
}
