import { css } from 'lit';

/**
 * Multiple columns, no l1 toggle
 */
export default css`
  [data-part='level-back-btn'] {
    display: none;
  }

  [popovertarget='level-1'] {
    display: none;
  }

  [data-part='l1-invoker'] {
    height: 100%;
  }

  [data-part='root'] {
    --_width-1st-column: 160px;
    --_width-2nd-column: 240px;
    --_bgcolor: #fff;
    --_hover-bgcolor: #f0f0f0;
    --_hover-fgcolor: #000000;
    --_hover-fontweight: bold;

    --_subtle-border-color: #ccc;

    --_accent-color: #ff6200;

    height: 100vh;
    width: var(--_width-1st-column);
    display: block;
    position: sticky;
    top: 0;
    transition: width 0.25s ease-in-out;
    background-color: var(--_bgcolor);
    z-index: 1;
  }

  [data-part='root']:has([data-open][data-level]) {
    width: calc(var(--_width-1st-column) + var(--_width-2nd-column));
  }

  [data-part='nav'] {
    height: 100%;
  }

  [data-part='level'][data-level='0'] {
    width: var(--_width-1st-column);
    border-right: 1px solid var(--_subtle-border-color);
  }

  [data-part='l0-after'] {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  [data-part='l1-wrapper'] {
    height: 100%;
  }

  [data-part='level'] {
    overflow: scroll;
  }

  [data-part='level'][data-level='1'] {
    width: var(--_width-1st-column);
    height: 100%;
    border-right: 1px solid var(--_subtle-border-color);
  }

  [data-part='level'][data-level='2'] {
    width: var(--_width-2nd-column);
    left: var(--_width-1st-column);
    top: 0;
    padding-inline: 16px;
    padding-top: 56px;
    border-right: 1px solid var(--_subtle-border-color);
    height: 100%;
  }

  [data-part='level'][data-level='3'] {
    position: relative;
    background-color: transparent;
  }

  [data-part='list'] {
    list-style-type: none;
    margin: 0;
    padding: 0;
  }

  [data-part='listitem'] {
    display: block;
  }

  [data-part='listitem'][data-level='1'] {
    margin-bottom: 48px;
  }

  [data-part='listitem'][data-level='2'] {
    margin-bottom: 4px;
  }

  [data-part='icon'][data-level='1'] {
    display: block;
    width: var(--size-7);
    height: var(--size-7);
    margin-bottom: var(--size-1);
  }

  [data-part='anchor'][data-level='1'],
  [data-part='invoker-for-level'][data-level='1'] {
    display: flex;
    flex-direction: column;
    align-items: center;
    /** buttons are not full width with display:flex */
    width: 100%;
  }

  [data-part='anchor'],
  [data-part='invoker-for-level'] {
    color: inherit;
    text-decoration: inherit;
    font-size: 14px;
    fill: #666666;
    display: block;
    box-sizing: border-box;
    text-transform: capitalize;
  }

  [data-part='anchor']:hover,
  [data-part='invoker-for-level']:hover {
    text-decoration: underline;
    text-underline-offset: 0.3em;
  }

  [data-part='anchor'][data-level='2'],
  [data-part='invoker-for-level'][data-level='2'] {
    padding: 16px;
  }

  [data-part='listitem'][data-active][data-level='2'] > [data-part='anchor'],
  [data-part='listitem'][data-active][data-level='2'] > [data-part='invoker-for-level'] {
    background-color: var(--_hover-bgcolor);
    color: var(--_hover-fgcolor);
    font-weight: var(--_hover-fontweight);
    border-radius: 8px;
  }

  [data-part='listitem'][data-active] [data-part='icon'],
  [data-part='listitem'][data-has-active-child] [data-part='icon'] {
    fill: var(--_accent-color);
    color: var(--_accent-color);
  }

  /** parts added by ingportal */

  [data-part='logo'] {
    height: 48px;
    width: 100%;
    display: block;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 56px;
    margin-bottom: 48px;
  }

  [data-part='l0-and-1-wrapper'] {
    position: fixed;
    height: 100%;
    background-color: var(--_bgcolor);
  }
`;
