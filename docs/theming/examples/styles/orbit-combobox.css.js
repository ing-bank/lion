import { css } from '@lion/core';

export const orbitComboboxStyles = css`
  .orbit {
    /* Orbit Design Tokens: https://orbit.kiwi/design-tokens/ */
    --fontFamily: Roboto, -apple-system, '.SFNSText-Regular', 'San Francisco', 'Segoe UI',
      'Helvetica Neue', 'Lucida Grande', sans-serif;
    --fontSizeTextNormal: 14px;
    --lineHeightText: 1.4;
    --heightInputNormal: 44px;
    --widthIconMedium: 24px;
    --heightIconMedium: 24px;
    --borderRadiusNormal: 3px;
    --paddingInputNormal: 0 12px;
    --spaceXXXSmall: 2px;
    --spaceSmall: 12px;
    --durationFast: 0.15s;

    --colorTextInput: #252a31;
    --colorTextInputPrefix: #5f738c;
    --colorTextInputDisabled: #bac7d5;

    --backgroundInput: #ffffff;
    --borderColorInput: #bac7d5;
    --borderColorInputHover: #a6b6c8;

    --heightButtonNormal: 44px;
    --backgroundButtonLinkPrimary: transparent;
    --backgroundButtonLinkPrimaryHover: #e5eaef;
    --backgroundButtonLinkPrimaryActive: #d6dee6;
    --colorTextButtonLinkPrimary: #00a991;
    --colorTextButtonLinkPrimaryHover: #009882;
    --colorTextButtonLinkPrimaryActive: #008f7b;

    /* list */
    --paddingTable: 12px 16px;
    --colorTextTag: #252a31;
    --colorTextTagSelected: #eff2f5;
    --backgroundSeparator: #eff2f5;
    --backgroundTag: #f5f7f9;
    --backgroundTagSelected: #252a31;
    --backgroundTagHover: #e5eaef;
    --backgroundTagSelectedHover: #181b20;
    --backgroundTagActive: #d6dee6;
    --backgroundTagSelectedActive: #0b0c0f;
  }

  .orbit lion-combobox {
    font-family: var(--fontFamily);
    font-size: var(--fontSizeTextNormal);
    color: var(--colorTextInput);
  }

  .orbit svg {
    width: var(--widthIconMedium);
    height: var(--heightIconMedium);
    fill: currentcolor;
  }

  .orbit lion-combobox::part(label) {
    line-height: var(--lineHeightText);
  }

  .orbit lion-combobox::part(container) {
    height: var(--heightInputNormal);
    background-color: var(--backgroundInput);
    border: 1px solid var(--borderColorInput);
    border-radius: var(--borderRadiusNormal);
    transition: all 0.15s ease-in-out 0s;
  }

  .orbit lion-combobox::part(input) {
    padding: var(--paddingInputNormal);
  }

  .orbit lion-combobox::part(prefix) {
    color: var(--colorTextInputDisabled);
    display: flex;
    align-items: center;
    pointer-events: none;
    justify-content: center;
    padding: 0px 0px 0px var(--spaceSmall);
  }

  .orbit lion-button.link {
    height: var(--heightButtonNormal);
    transition: all var(--durationFast) ease-in-out;
    background: var(--backgroundButtonLinkPrimary);
    color: var(--colorTextButtonLinkPrimary);
  }

  .orbit lion-button.link:hover {
    background: var(--backgroundButtonLinkPrimaryHover);
    color: var(--colorTextButtonLinkPrimaryHover);
  }

  .orbit lion-options {
    width: 100%;
    margin-top: var(--spaceXXXSmall);
    border: 1px solid var(--borderColorInput);
    border-radius: var(--borderRadiusNormal);
  }
  .orbit lion-option {
    padding: var(--paddingTable);
    color: var(--colorTextTag);
    background-color: var(--backgroundTag);
    border-bottom: 1px solid var(--backgroundSeparator);
  }
  .orbit lion-option:hover {
    background-color: var(--backgroundTagHover);
  }
  .orbit lion-option[checked] {
    background-color: var(--backgroundTagSelected);
    color: var(--colorTextTagSelected);
  }
  .orbit lion-option[checked]:hover {
    background-color: var(--backgroundTagSelectedHover);
  }
`;
