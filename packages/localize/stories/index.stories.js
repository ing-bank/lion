/* eslint-disable no-underscore-dangle, class-methods-use-this */
import { storiesOf, html } from '@open-wc/storybook';

import { html as litHtml } from '@lion/core';
import { LionLitElement } from '@lion/core/src/LionLitElement.js';
import { localize } from '../src/localize.js';
import { LocalizeMixin } from '../src/LocalizeMixin.js';
import {
  formatNumber,
  formatNumberToParts,
  getGroupSeparator,
  getDecimalSeparator,
} from '../src/formatNumber.js';
import { formatDate, parseDate, getDateFormatBasedOnLocale } from '../src/formatDate.js';

storiesOf('Localize System|localize', module).add('lit component', () => {
  class LitHtmlExample extends LocalizeMixin(LionLitElement) {
    static get localizeNamespaces() {
      return [
        { 'lit-html-example': locale => import(`./translations/${locale}.js`) },
        ...super.localizeNamespaces,
      ];
    }

    static get properties() {
      return {
        now: {
          type: 'Date',
        },
      };
    }

    render() {
      // this is as simple as localization can be in JavaScript
      // the Promise is used to delay inserting of the content until data is loaded
      // for the first time as soon as `now` is provided or changed, it will rerender
      // with a new value if locale is changed, there is a preconfigured listener
      // to rerender when new data is loaded all thanks to lit-html capabilities
      const headerDate = this.msgLit('lit-html-example:headerDate');
      const headerNumber = this.msgLit('lit-html-example:headerNumber');
      const date = this.now ? this.msgLit('lit-html-example:date', { now: this.now }) : '';
      const time = this.now ? this.msgLit('lit-html-example:time', { now: this.now }) : '';

      // dateFormat
      const options1 = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      };
      options1.timeZone = 'UTC';
      options1.timeZoneName = 'short';
      const dateParse1 = parseDate('01-05-2012');
      const dateParse2 = parseDate('12/05/2012');
      const dateParse3 = parseDate('1-5-2017');
      const dateFormat1 = formatDate(dateParse1, options1);
      const dateFormat2 = formatDate(dateParse2, options1);
      const dateFormat3 = formatDate(dateParse3, options1);
      const dateFormat = getDateFormatBasedOnLocale();
      const datum = new Date();
      const options2 = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      };
      options2.timeZone = 'UTC';
      options2.timeZoneName = 'short';
      options2.locale = 'ja-JP-u-ca-japanese';
      const dateFormatted = formatDate(datum, options2);

      // numberFormat
      const number1 = formatNumber(123456.789, {
        style: 'currency',
        currency: 'EUR',
        currencyDisplay: 'code',
      });
      const formatNumberToParts1 = formatNumberToParts(123456.789, {
        style: 'currency',
        currency: 'EUR',
        currencyDisplay: 'code',
      });
      let printParts1 = '';
      for (let i = 0; i < formatNumberToParts1.length; i += 1) {
        printParts1 += `{ ${formatNumberToParts1[i].type}: ${formatNumberToParts1[i].value} }`;
      }

      const number2 = formatNumber(1234.5, { style: 'decimal' });
      const formatNumberToParts2 = formatNumberToParts(1234.5, { style: 'decimal' });
      let printParts2 = '';
      for (let i = 0; i < formatNumberToParts2.length; i += 1) {
        printParts2 += `{ ${formatNumberToParts2[i].type}: ${formatNumberToParts2[i].value} }`;
      }

      const number3 = formatNumber(-1234.5, {
        style: 'currency',
        currency: 'EUR',
        currencyDisplay: 'code',
      });
      const formatNumberToParts3 = formatNumberToParts(-1234.5, {
        style: 'currency',
        currency: 'EUR',
        currencyDisplay: 'code',
      });
      let printParts3 = '';
      for (let i = 0; i < formatNumberToParts3.length; i += 1) {
        printParts3 += `{ ${formatNumberToParts3[i].type}: ${formatNumberToParts3[i].value} }`;
      }
      const printGroupSeparator = getGroupSeparator();
      const printDecimalSeparator = getDecimalSeparator();
      return litHtml`
          <h2>${headerDate}</h2>
          <div>${date}</div>
          <div>Order of date parts:      ${dateFormat}</div>
          <div>Parsed date (01-05-2012): ${dateFormat1}</div>
          <div>Parsed date (12/05/2012): ${dateFormat2}</div>
          <div>Parsed date (1/5/2017)  : ${dateFormat3}</div>
          <div>Japanese date:            ${dateFormatted}</div>
          <div>${time}</div>
          <h2>${headerNumber}</h2>
          <div>${number1} ${printParts1}</div>
          <div>${number2} ${printParts2}</div>
          <div>${number3} ${printParts3}</div>
          <div>getGroupSeparator(): "${printGroupSeparator}"</div>
          <div>getDecimalSeparator(): "${printDecimalSeparator}"</div>
        `;
    }
  }
  if (!customElements.get('lit-html-example')) {
    customElements.define('lit-html-example', LitHtmlExample);
  }

  return html`
    <lit-html-example .now=${new Date()}></lit-html-example>
    <button
      @click=${() => {
        localize.locale = 'en-GB';
      }}
    >
      en-GB
    </button>
    <button
      @click=${() => {
        localize.locale = 'en-US';
      }}
    >
      en-US
    </button>
    <button
      @click=${() => {
        localize.locale = 'en-AU';
      }}
    >
      en-AU
    </button>
    <button
      @click=${() => {
        localize.locale = 'nl-NL';
      }}
    >
      nl-NL
    </button>
    <button
      @click=${() => {
        localize.locale = 'nl-BE';
      }}
    >
      nl-BE
    </button>
  `;
});
// .add('message', () => {
//   const en = {
//     bar: '[en] hello from bar',
//     foo: '[en] hey there from foo',
//   };
//   const enGB = {
//     ...en,
//     foo: '[en-GB] hey there from foo',
//   };
//   try {
//     localize.addData('en', 'demo', en);
//     localize.addData('en-GB', 'demo', enGB);
//   } catch (error) { /* demo will get executed multiple times */ }
//
//   return html`
//     <p>try 'demo:bar' as well</p>
//     <input type="text" value="demo:foo" id="keyInput">
//
//     <button @click=${() => action('translate')(localize.msg(keyInput.value))}>
//       Translate to Action Logger
//     </button>
//     <br />
//     <button @click=${() => { localize.locale = 'en'; }}>en</button>
//     <button @click=${() => { localize.locale = 'en-GB'; }}>en-GB</button>
//     <br /><br />
//     <button @click=${() => action('localize data')(localize.__storage)}>
//       Log available Data to Action Logger
//     </button>
//   `;
