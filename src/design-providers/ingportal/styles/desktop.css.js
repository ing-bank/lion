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
    --_width-l0: var(--size-11);
    --_width-l1: var(--size-13);
    height: 100vh;
    /** Make this the positioning parent of l0 and l1 */
    position: relative;
    width: var(--_width-l0);
    display: block;
    position: sticky;
    top: 0;
  }

  [data-part='root']:has([data-open][data-level]) {
    width: calc(var(--_width-l0) + var(--_width-l1));
  }

  [data-part='nav'] {
    height: 100%;
  }

  [data-part='l1-wrapper'] {
    height: 100%;
  }

  [data-part='level'] {
    overflow: scroll;
  }

  [data-part='level'][data-level='1'] {
    padding-top: var(--size-6);
    width: var(--_width-l0);
    height: 100%;
    border-right: 1px solid #ccc;
  }

  [data-part='level'][data-level='2'] {
    padding-top: var(--size-6);
    width: var(--_width-l1);
    left: var(--_width-l0);
    top: 0;
    padding-inline: var(--size-6);
    border-right: 1px solid #ccc;
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
    margin-bottom: var(--size-6);
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
  }

  [data-part='anchor']:hover,
  [data-part='invoker-for-level']:hover {
    text-decoration: underline;
    text-underline-offset: 0.3em;
  }
`;
