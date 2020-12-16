/* eslint-disable max-classes-per-file */
import { RefClass } from 'exporting-ref-project';
import { ExtendedComp } from '../match-subclasses/ExtendedComp.js';

// external
customElements.define('ref-class', RefClass);

// internal (+ via window and inside CallExpression)
(() => {
  window.customElements.define('extended-comp', ExtendedComp);
})();

// direct class (not supported atm)
// To connect this to a constructor, we should also detect customElements.get()
customElements.define('on-the-fly', class extends HTMLElement {});

// eslint-disable-next-line no-unused-vars
class ExtendedOnTheFly extends customElements.get('on-the-fly') {}
