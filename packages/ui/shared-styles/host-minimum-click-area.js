import { css } from 'lit';

export const hostMinimumClickArea = css`
  :host::before {
    content: '';

    /* center vertically and horizontally */
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    /* Minimum click area to meet [WCAG Success Criterion 2.5.5 Target Size (Enhanced)](https://www.w3.org/TR/WCAG22/#target-size-enhanced) */
    min-height: 44px;
    min-width: 44px;
    width: 100%;
    height: 100%;
  }
`;
