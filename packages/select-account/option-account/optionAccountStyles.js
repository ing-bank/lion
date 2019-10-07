// TODO: Consider moving option to a seperate folder, so it can be used inside
// the (to be made) ing-fieldset as well

import { css } from '@lion/core';
// import { orange } from '../../../style.js';

export const optionAccountStyles = css`

  .option-account {
    display: flex;
  }

  .option-account__prefix {
    margin-right: 16px;
  }

    .option-account__icon {
      width: 32px;
      height: 32px;
      fill: #ff6200;
      background: white;
    }

  .option-account__body {

  }

    .option-account__title {
      font-weight: bold;
    }


    .option-account__amount {

    }

    .option-account__iban {

    }
`;
