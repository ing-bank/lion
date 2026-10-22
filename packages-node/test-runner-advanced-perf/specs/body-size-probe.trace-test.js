/* eslint-disable import/no-extraneous-dependencies, no-console -- measure probe */
import { fixtureSync, html } from '@open-wc/testing';
import { executeServerCommand } from '@web/test-runner-commands';
import { OverlayController } from '@lion/ui/overlays.js';

describe('body-size forced layout probe', () => {
  it('probes whether requestToKeepBodySize produces forced layout under stronger dirt', async () => {
    const ctrl = new OverlayController({
      placementMode: 'local',
      invokerNode: fixtureSync(html`<div role="button" style="width:100px;height:20px;">I</div>`),
      contentNode: fixtureSync(html`<div style="width:80px;height:40px;">C</div>`),
    });

    const results = [];
    for (const [name, dirty] of [
      [
        'margin-left',
        () => {
          document.body.style.marginLeft = '20px';
        },
      ],
      [
        'font-size',
        () => {
          document.body.style.fontSize = '19px';
        },
      ],
      [
        'body-width',
        () => {
          document.body.style.width = '900px';
        },
      ],
      [
        'insert-wide-child',
        () => {
          const d = document.createElement('div');
          d.style.width = '2000px';
          d.id = '__wide-probe';
          document.body.appendChild(d);
        },
      ],
    ]) {
      await executeServerCommand('forced-layout-trace:start');
      dirty();
      ctrl.manager.requestToKeepBodySize({ phase: 'before-show' });
      await new Promise(r => {
        setTimeout(r, 20);
      });
      const stop = await executeServerCommand('forced-layout-trace:stop');
      results.push({ name, forcedLayoutCount: (stop?.events ?? []).length });
      document.querySelector('#__wide-probe')?.remove();
      await new Promise(r => {
        setTimeout(r, 60);
      });
    }
    console.error(`__BASELINE_RESULT__${JSON.stringify(results)}`);
  });
});
