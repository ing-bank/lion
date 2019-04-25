import { storiesOf, html } from '@open-wc/storybook';

import '../lion-steps.js';
import '../lion-step.js';

storiesOf('Steps|<lion-steps>', module)
  /* eslint-disable */
  .add(
    'Default',
    () => html`
      <lion-steps id="stepsController">
        <lion-step initial-step>
          <p>Welcome</p>
          <button disabled>previous</button> &nbsp;
          <input type="button" value="next" @click=${() => stepsController.next()} />
        </lion-step>
        <lion-step>
          <p>Are you single?</p>
          <input
            type="button"
            value="yes"
            @click=${() => {
              stepsController.data.isSingle = true;
              stepsController.next();
            }}
          />
          &nbsp;
          <input
            type="button"
            value="no"
            @click=${() => {
              stepsController.data.isSingle = false;
              stepsController.next();
            }}
          />
          <br /><br />
          <input type="button" value="previous" @click=${() => stepsController.previous()} />
        </lion-step>
        <lion-step id="is-single" .condition="${data => data.isSingle}">
          <p>You are single</p>
          <input type="button" value="previous" @click=${() => stepsController.previous()} /> &nbsp;
          <input type="button" value="next" @click=${() => stepsController.next()} />
        </lion-step>
        <lion-step id="is-not-single" .condition="${data => data.isSingle}" invert-condition>
          <p>You are NOT single.</p>
          <input type="button" value="previous" @click=${() => stepsController.previous()} /> &nbsp;
          <input type="button" value="next" @click=${() => stepsController.next()} />
        </lion-step>
        <lion-step>
          <p>Finish</p>
          <input type="button" value="previous" @click=${() => stepsController.previous()} />
        </lion-step>
      </lion-steps>
    `,
  );
/* eslint-enable */
