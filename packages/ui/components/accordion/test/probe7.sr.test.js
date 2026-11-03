import { fixture } from '@open-wc/testing';
import { html } from 'lit';
import sr from 'test-runner-sr/commands.js';
import '@lion/ui/define/lion-accordion.js';

const count = (/** @type {string[]} */ log, /** @type {string} */ text) =>
  log.filter((p) => p.includes(text)).length;

describe('probe7', () => {
  before(async () => { await sr.initialize(); });
  after(async () => { await sr.stop(); });
  beforeEach(async () => { await sr.reset(); });

  it('one pass', async () => {
    await fixture(html`<div>
      <lion-accordion>
        <h3 slot="invoker"><button>Summary one</button></h3>
        <div slot="content">Content one</div>
        <h3 slot="invoker"><button>Summary two</button></h3>
        <div slot="content">Content two</div>
      </lion-accordion>
      <button type="button">Next</button>
    </div>`);
    await sr.focus('lion-accordion');
    let steps = 0;
    for (let s = 0; s < 20; s += 1) {
      const log = await sr.phraseLog();
      if (log.some((p) => p.includes('end of heading, Summary two'))) break;
      await sr.next();
      steps += 1;
    }
    const log = await sr.phraseLog();
    throw new Error(`PROBE7 steps=${steps} one=${count(log, 'Summary one')} two=${count(log, 'Summary two')} log=${JSON.stringify(log)}`);
  });
});
