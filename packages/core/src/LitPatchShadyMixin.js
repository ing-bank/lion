import { UpdatingElement } from 'lit-element';
import { dedupeMixin } from './dedupeMixin.js';

/**
 * This temporary mixin is needed until https://github.com/webcomponents/polyfills/issues/95 is
 * fixed.
 * It solves an issue that currently occurs when LitElement is combined with ShadyDOM.
 *
 * The flow below illustrates the problem in LitElement:
 * - 1. It creates a shadowRoot
 * - 2. It renders asynchronously (at an unpredictable time in case render gets postponed).
 * All events sent between 1 and 2 (usually connectedCallback) are 'lost' when ShadyDOM is used
 * in combination with LitElement.
 *
 * This mixin solves this problem by creating the shadow root right before the first render,
 * as suggested by Steve Orvell here: https://github.com/Polymer/lit-element/issues/658
 */
export const LitPatchShadyMixin = dedupeMixin(superclass =>
  // eslint-disable-next-line no-shadow
  class LitPatchShadyMixin extends superclass {
    /** @override */
    initialize() {
      // We must make sure we bypass initialize of LitElement, but call the one of UpdatingElement
      const superInitialize = UpdatingElement.prototype.initialize.bind(this);
      superInitialize();
      // Original from logic LitElement.prototype.initialize was here before
    }

    /** @override */
    update(changedProperties) {
      // Right before LitElement calls render, create a shadow root
      if(!this.__hasCreatedRenderRoot && /* compatibility UpdatingElement */ this.createRenderRoot) {
        // Original logic from LitElement.prototype.initialize is placed here
        this.renderRoot = this.createRenderRoot();
        if (window.ShadowRoot && this.renderRoot instanceof window.ShadowRoot) {
          this.adoptStyles();
        }
        this.__hasCreatedRenderRoot = true;
      }
      // Now hand over to LitElement again
      super.update(changedProperties);
    }
  }
);
