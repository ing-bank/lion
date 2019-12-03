import { html, storiesOf } from '@open-wc/demoing-storybook';
import '../lion-step.js';
import '../lion-steps.js';

storiesOf('Steps|Steps')
  /* eslint-disable */
  .add(
    'Default',
    () => html`
      <lion-steps>
        <lion-step initial-step>
          <p>Welcome</p>
          <button disabled>previous</button> &nbsp;
          <input
            type="button"
            value="next"
            @click=${ev => ev.target.parentElement.controller.next()}
          />
        </lion-step>
        <lion-step>
          <p>Are you single?</p>
          <input
            type="button"
            value="yes"
            @click=${ev => {
              ev.target.parentElement.controller.data.isSingle = true;
              ev.target.parentElement.controller.next();
            }}
          />
          &nbsp;
          <input
            type="button"
            value="no"
            @click=${ev => {
              ev.target.parentElement.controller.data.isSingle = false;
              ev.target.parentElement.controller.next();
            }}
          />
          <br /><br />
          <input
            type="button"
            value="previous"
            @click=${ev => ev.target.parentElement.controller.previous()}
          />
        </lion-step>
        <lion-step id="is-single" .condition="${data => data.isSingle}">
          <p>You are single</p>
          <input
            type="button"
            value="previous"
            @click=${ev => ev.target.parentElement.controller.previous()}
          />
          &nbsp;
          <input
            type="button"
            value="next"
            @click=${ev => ev.target.parentElement.controller.next()}
          />
        </lion-step>
        <lion-step id="is-not-single" .condition="${data => data.isSingle}" invert-condition>
          <p>You are NOT single.</p>
          <input
            type="button"
            value="previous"
            @click=${ev => ev.target.parentElement.controller.previous()}
          />
          &nbsp;
          <input
            type="button"
            value="next"
            @click=${ev => ev.target.parentElement.controller.next()}
          />
        </lion-step>
        <lion-step>
          <p>Finish</p>
          <input
            type="button"
            value="previous"
            @click=${ev => ev.target.parentElement.controller.previous()}
          />
        </lion-step>
      </lion-steps>
    `,
  );
/* eslint-enable */
