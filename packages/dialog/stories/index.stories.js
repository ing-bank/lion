import { storiesOf, html, withKnobs, object } from '@open-wc/demoing-storybook';
import { css } from '@lion/core';
import '../lion-dialog.js';

const dialogDemoStyle = css`
  .demo-box {
    width: 200px;
    background-color: white;
    border-radius: 2px;
    border: 1px solid grey;
    padding: 8px;
  }

  .demo-box_placements {
    display: flex;
    flex-direction: column;
    width: 173px;
    margin: 0 auto;
    margin-top: 68px;
  }

  lion-dialog {
    padding: 10px;
  }

  .close-button {
    color: black;
    font-size: 28px;
    line-height: 28px;
  }

  .demo-box__column {
    display: flex;
    flex-direction: column;
  }

  .dialog {
    display: block;
    position: absolute;
    font-size: 16px;
    color: white;
    background-color: black;
    border-radius: 4px;
    padding: 8px;
  }

  @media (max-width: 480px) {
    .dialog {
      display: none;
    }
  }
`;

storiesOf('Overlays Specific WC | Dialog', module)
  .addDecorator(withKnobs)
  .add(
    'Button dialog',
    () => html`
      <style>
        ${dialogDemoStyle}
      </style>
      <p>
        Important note: Your <code>slot="content"</code> gets moved to global overlay container.
        After initialization it is no longer a child of <code>lion-dialog</code>
      </p>
      <p>
        To close your dialog from some action performed inside the content slot, fire a
        <code>hide</code> event.
      </p>
      <p>
        For the dialog to close, it will need to bubble to the content slot (use
        <code>bubbles: true</code>. If absolutely needed <code>composed: true</code> can be used to
        traverse shadow boundaries)
      </p>
      <p>The demo below demonstrates this</p>
      <div class="demo-box">
        <lion-dialog>
          <button slot="invoker">Dialog</button>
          <div slot="content" class="dialog">
            Hello! You can close this notification here:
            <button
              class="close-button"
              @click=${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}
            >
              ⨯
            </button>
          </div>
        </lion-dialog>
      </div>
    `,
  )
  .add('Custom configuration', () => {
    const dialog = placement => html`
      <lion-dialog .config=${{ viewportConfig: { placement } }}>
        <button slot="invoker">Dialog ${placement}</button>
        <div slot="content" class="dialog">
          Hello! You can close this notification here:
          <button
            class="close-button"
            @click=${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}
          >
            ⨯
          </button>
        </div>
      </lion-dialog>
    `;

    return html`
      <style>
        ${dialogDemoStyle}
      </style>
      <div class="demo-box_placements">
        ${dialog('center')} ${dialog('top-left')} ${dialog('top-right')} ${dialog('bottom-left')}
        ${dialog('bottom-right')}
      </div>
    `;
  })
  .add('Toggle placement with knobs', () => {
    const dialog = html`
      <lion-dialog .config=${object('config', { viewportConfig: { placement: 'center' } })}>
        <button slot="invoker">Dialog</button>
        <div slot="content" class="dialog">
          Hello! You can close this notification here:
          <button
            class="close-button"
            @click=${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}
          >
            ⨯
          </button>
        </div>
      </lion-dialog>
    `;

    return html`
      <style>
        ${dialogDemoStyle}
      </style>
      <div class="demo-box_placements">
        ${dialog}
      </div>
    `;
  });
