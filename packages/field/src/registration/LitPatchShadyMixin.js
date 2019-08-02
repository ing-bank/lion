import { UpdatingElement, dedupeMixin } from '@lion/core';

/**
 * This temporary mixin is needed until https://github.com/webcomponents/polyfills/issues/95 is
 * fixed.
 * It solves an issue that currently occurs when LitElement is combined with ShadyDOM.
 *
 * The flow below illustrates the problem:
 * - 1. LitElement creates a shadowRoot first renders to it.
 * - 2. It renders asynchronously (at an unpredictable time in case render gets postponed).
 * All events sent between 1 and 2 (usually connectedCallback) are lost when ShadyDOM is used.
 *
 * This mixin solves the problem by creating the shadow root right before the first render,
 * as suggested by Steve Orvell here: https://github.com/Polymer/lit-element/issues/658
 */
export const LitPatchShadyMixin = dedupeMixin(superclass =>
  // eslint-disable-next-line no-shadow
  class LitPatchShadyMixin extends superclass {
    /**
     * @override
     */
    initialize() {
      // We must make sure we bypass initialize of LitElement, but call the one of UpdatingElement
      const superInitialize = UpdatingElement.prototype.initialize.bind(this);
      superInitialize();

      // Before patch, in original LitElement.prototype.initialize, a shadow root was created here.
      // This logic is now delayed until first render and put in
      // this.__createRenderRootAndAdoptStyles.
    }

    __createRenderRootAndAdoptStyles() {
      // Logic was extracted from LitElement.prototype.initialize
      this.renderRoot = this.createRenderRoot();
      if (window.ShadowRoot && this.renderRoot instanceof window.ShadowRoot) {
        this.adoptStyles();
      }

      this.__hasCreatedRenderRoot = true;
    }

    /**
     * @override
     */
    update(changedProperties) {
      // Right before LitElement calls render, create a shadow root
      if(!this.__hasCreatedRenderRoot) {
        this.__createRenderRootAndAdoptStyles();
      }
      // Now hand over to LitElement again
      super.update(changedProperties);
    }
  }
);