import { LitElement } from 'lit-element';
import { ElementMixin } from './ElementMixin.js';

export { css } from 'lit-element';
export { html } from './lit-html.js';

/**
 * @deprecated use LitElement instead.
 */
export class LionLitElement extends ElementMixin(LitElement) {}
