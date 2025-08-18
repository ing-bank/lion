import { css } from 'lit';

export default css`
  :host([data-layout='floating-toggle']) {
    width: 0;
  }

  :host([data-layout='floating-toggle']) .burger {
    position: absolute;
    z-index: 1000;

    display: flex;
    flex-direction: column;
    width: 32px;
    height: 32px;
    justify-content: center;
    cursor: pointer;
    left: 20px;
    top: 20px;
  }

  :host([data-layout='floating-toggle']) .burger span {
    height: 4px;
    margin: 4px 0;
    background: #333;
    border-radius: 2px;
    transition: 0.3s;
    display: block;
  }

  :host([data-layout='floating-toggle']) #l1-wrapper {
    display: none;
    z-index: 100;
    background: #fff;
  }
  :host([data-layout='floating-toggle']) [data-part='level'] {
    z-index: 100;
    background: #fff;
  }
  :host([data-layout='floating-toggle']) #burger-toggle:checked ~ #l1-wrapper {
    display: block;
    position: absolute;
  }
`;
