import { css } from '@lion/core';

export const carbonCalendarStyles = css`
  @font-face {
    font-family: 'IBM Plex Sans';
    font-style: italic;
    font-weight: 300;
    font-display: auto;
    src: local('IBM Plex Sans Light Italic'), local('IBMPlexSans-LightItalic'),
      url(https://fonts.gstatic.com/s/ibmplexsans/v6/zYX7KVElMYYaJe8bpLHnCwDKhdTmvIRcdvfo.woff)
        format('woff');
  }

  @font-face {
    font-family: 'IBM Plex Sans';
    font-style: italic;
    font-weight: 400;
    font-display: auto;
    src: local('IBM Plex Sans Italic'), local('IBMPlexSans-Italic'),
      url(https://fonts.gstatic.com/s/ibmplexsans/v6/zYX-KVElMYYaJe8bpLHnCwDKhdTuF6ZP.woff)
        format('woff');
  }

  @font-face {
    font-family: 'IBM Plex Sans';
    font-style: italic;
    font-weight: 600;
    font-display: auto;
    src: local('IBM Plex Sans SemiBold Italic'), local('IBMPlexSans-SemiBoldItalic'),
      url(https://fonts.gstatic.com/s/ibmplexsans/v6/zYX7KVElMYYaJe8bpLHnCwDKhdTmyIJcdvfo.woff)
        format('woff');
  }

  @font-face {
    font-family: 'IBM Plex Sans';
    font-style: normal;
    font-weight: 300;
    font-display: auto;
    src: local('IBM Plex Sans Light'), local('IBMPlexSans-Light'),
      url(https://fonts.gstatic.com/s/ibmplexsans/v6/zYX9KVElMYYaJe8bpLHnCwDKjXr8AIFscg.woff)
        format('woff');
  }

  @font-face {
    font-family: 'IBM Plex Sans';
    font-style: normal;
    font-weight: 400;
    font-display: auto;
    src: local('IBM Plex Sans'), local('IBMPlexSans'),
      url(https://fonts.gstatic.com/s/ibmplexsans/v6/zYXgKVElMYYaJe8bpLHnCwDKhdHeEw.woff)
        format('woff');
  }

  @font-face {
    font-family: 'IBM Plex Sans';
    font-style: normal;
    font-weight: 600;
    font-display: auto;
    src: local('IBM Plex Sans SemiBold'), local('IBMPlexSans-SemiBold'),
      url(https://fonts.gstatic.com/s/ibmplexsans/v6/zYX9KVElMYYaJe8bpLHnCwDKjQ76AIFscg.woff)
        format('woff');
  }

  .carbon {
    --spacing-02: 0.25rem;
    --spacing-03: 0.5rem;
    --spacing-08: 2.5rem;

    --ui-background: #ffffff;
    --interactive-01: #0f62fe;
    --interactive-02: #393939;

    --ui-01: #f4f4f4;
    --ui-02: #ffffff;
    --ui-03: #e0e0e0;
    --ui-04: #8d8d8d;
    --ui-05: #161616;

    --text-01: #161616;
    --text-02: #525252;
    --text-03: #a8a8a8;
    --text-04: #ffffff;
    --text-05: #6f6f6f;

    --icon-01: #161616;

    --focus: #0f62fe;
    --hover-ui: #e5e5e5;

    --box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);

    --font-family: IBM Plex Sans, Helvetica Neue, Arial, sans-serif;
  }

  .carbon lion-calendar {
    width: 18rem;
    padding: var(--spacing-02) var(--spacing-02) var(--spacing-03);
    background-color: var(--ui-01);
    font-family: var(--font-family);
    box-shadow: var(--box-shadow);
    font-size: 0.875rem;
    -webkit-font-smoothing: antialiased;
  }

  .carbon lion-calendar::part(navigation),
  .carbon lion-calendar::part(grid),
  .carbon lion-calendar::part(cell) {
    padding: 0;
  }

  .carbon lion-calendar::part(grid) {
    border-collapse: collapse;
  }

  .carbon lion-calendar::part(cell) {
    height: var(--spacing-08);
    width: var(--spacing-08);
  }

  .carbon lion-calendar::part(cell header) {
    font-weight: normal;
  }

  .carbon lion-calendar::part(navigation container),
  .carbon lion-calendar::part(row header) {
    padding-bottom: var(--spacing-02);
  }

  .carbon lion-calendar::part(button) {
    position: relative;
    height: var(--spacing-08);
    width: var(--spacing-08);
    background-color: var(--ui-01);
    border: 1px solid var(--ui-01);
    color: var(--text-01);
    font-family: var(--font-family);
    fill: currentColor;
  }

  .carbon lion-calendar::part(year),
  .carbon lion-calendar::part(month) {
    align-items: center;
  }

  .carbon lion-calendar::part(heading) {
    flex-grow: 1;
    text-align: center;
    font-size: 0.875rem;
    font-weight: 600;
    margin: 0;
  }

  .carbon lion-calendar::part(button):hover {
    background-color: var(--hover-ui);
  }

  .carbon lion-calendar::part(button):focus {
    outline: 0.0625rem solid #f4f4f4;
    outline-offset: -0.1875rem;
    border-color: var(--day-border-focus);
  }

  .carbon lion-calendar::part(day button) {
    color: var(--text-01);
    background-color: var(--ui-01);
  }

  .carbon lion-calendar::part(today) {
    color: var(--interactive-01);
    font-weight: 600;
    text-decoration: none;
  }

  .carbon lion-calendar::part(day selected),
  .carbon lion-calendar::part(day selected):hover {
    color: var(--text-04);
    background-color: var(--interactive-01);
  }

  .carbon lion-calendar::part(day selected),
  .carbon lion-calendar::part(day selected):hover {
    color: var(--text-04);
    background-color: var(--interactive-01);
  }

  .carbon lion-calendar::part(today)::after {
    content: '';
    position: absolute;
    display: block;
    bottom: 0.4375rem;
    left: 50%;
    transform: translateX(-50%);
    height: var(--spacing-02);
    width: var(--spacing-02);
    background-color: var(--interactive-01);
  }

  .carbon lion-calendar::part(disabled) {
    color: var(--text-05);
    background-color: var(--ui-01);
  }

  .carbon lion-calendar::part(previous content),
  .carbon lion-calendar::part(next content) {
    width: 1rem;
    height: 1rem;
  }
`;
