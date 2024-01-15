import { isServer } from 'lit';
import { browserDetection } from '@lion/ui/core.js';
import { Resettable } from './Resettable.js';
import { visibilityStyle, scrollLockStyle } from './styles.js';

function supportsPopover() {
  // Just presume we have popover support on the server. We correct if needed via hydration...
  if (isServer) return true;
  return HTMLElement.prototype.hasOwnProperty('popover');
}

function isDisabled(el) {
  return el.disabled || el.hasAttribute?.('disabled') || el.hasAttribute?.('aria-disabled');
}

/**
 * Controller for expandables like disclosures and popovers, that visually toggle a piece of content.
 * The controller allows for:
 * - visually-hidden as a hiding mechanism (when we want to keep the content available to assistive technology, for instance in a link overview)
 * - flexible application of a certain accessible pattern, regardless of presentation (the native `<details>` and `[popover]` imply a certain presentation).
 * - dynamic disabling of the toggle
 */
export class VisibilityToggleCtrl {
  host;
  level;
  invoker;
  target;
  open = false;
  visuallyHidden = false;
  usesPopover = false;

  _rInvoker;
  _rTarget;

  static _hasScrollLockStyles = false;

  static handleScrollLock({ isOpen }) {
    const { isIOS, isMacSafari } = browserDetection;
    // no check as classList will dedupe it anyways
    document.body.toggleAttribute('data-scroll-lock', isOpen);
    if (isIOS || isMacSafari) {
      // iOS and safar for mac have issues with overlays with input fields. This is fixed by applying
      // position: fixed to the body. As a side effect, this will scroll the body to the top.
      document.body.toggleAttribute('data-scroll-lock-ios-fix', isOpen);
    }
    if (isIOS) {
      document.documentElement.toggleAttribute('data-scroll-lock-ios-fix', isOpen);
    }
  }

  constructor(host, options) {
    (this.host = host).addController(this);
    const {
      invoker,
      target,
      level,
      initialOpen,
      visuallyHidden,
      mode,
      omitStyleDependecyCheck,
      shouldHandleScrollLock,
    } = options;

    if (!invoker) {
      throw new Error('[VisibilityToggleCtrl]: Missing invoker');
    }
    if (!target) {
      throw new Error('[VisibilityToggleCtrl]: Missing target');
    }

    if (omitStyleDependecyCheck) {
      const hostStyles = this.host.constructor.elementStyles;
      const hasvisibilityStyle = hostStyles.includes(visibilityStyle);
      if (!hasvisibilityStyle) {
        throw new Error(
          '[VisibilityToggleCtrl]: Missing `visibilityStyle` that provides [hidden] and [data-visually-hidden] rules',
        );
      }
    }

    if (!isServer && !this._hasScrollLockStyles) {
      const styleTag = document.createElement('style');
      styleTag.setAttribute('data-scroll-lock-styles', '');
      styleTag.textContent = /** @type {CSSResult} */ (scrollLockStyle).cssText;
      document.head.appendChild(styleTag);
      // TODO: use overlay ctrl for this, since it has knowledge of all overlays
      this._hasScrollLockStyles = true;
    }

    this.level = level;
    this.invoker = invoker;
    this.target = target;
    this._rInvoker = new Resettable(invoker);
    this._rTarget = new Resettable(target);
    this.shouldHandleScrollLock = shouldHandleScrollLock;

    // Will be undefined on server, but that's ok, since we only use it in event handlers
    const rootNode = host.shadowRoot || target.getRootNode?.();

    this.visuallyHidden = visuallyHidden;
    this.usesPopover = supportsPopover() && mode === 'popover';
    const targetId = this.target?.getAttribute?.('id') || Math.random().toString(36).substr(2, 9);

    if (this.usesPopover) {
      this._rInvoker.setAttribute('popovertarget', targetId);
      this._rTarget.setAttribute('popover', '');
      this._rTarget.setAttribute('id', targetId);
      // if (initialOpen && !isServer) {
      //   // // We invoke the popover so that it's painted to the top layer.
      //   // // From here on, we take over a11y and visibility management (either via [data-visually-hidden] or [hidden])
      //   target.showPopover();
      // }
      // Make sure that we sync back popover state to our VisibilityToggleCtrl instance
      if (!isServer) {
        this._rTarget.addEventListener?.('beforetoggle', event => {
          if (this.__wasInternalPopoverSync) return;
          // console.log('beforetoggle');
          if (event.target !== this.target) return;

          if (event.newState === 'open') {
            this._set({ open: true, syncsFromPopover: true });
          }
        });
        this._rTarget.addEventListener?.('toggle', event => {
          if (this.__wasInternalPopoverSync) return;
          // console.log('toggle', 'event.target', event.target, 'this.target', this.target);

          if (event.target !== this.target) return;

          if (event.newState !== 'open') {
            this._set({ open: false, syncsFromPopover: true });
          }
        });
      }
    }

    this._rInvoker.setAttribute('aria-controls', targetId);
    // Also add click listener if popover is not supported
    if (!this.usesPopover && !isServer) {
      this._rInvoker.addEventListener?.('click', e => {
        const isLeftMouseButton = e.button === 0;
        if (!isLeftMouseButton) return;
        this._set({ open: 'toggle' });
      });
    }

    // Make our first render proper
    this._set({ open: Boolean(initialOpen), isInitialRender: true });

    // Sr only targets can be seen by the screen reader. This is important for navigation menus,
    // so that the screen reader can create an overview of all available links.
    if (this.visuallyHidden && !isServer) {
      // Check when a child element is focused. If so, we should make the toggle visible
      this._rTarget.addEventListener?.('focusin', async event => {
        await this.host.updateComplete;
        if (this.__wasInternalPopoverSync) return;
        // console.log('set focusin', event.relatedTarget);
        this._set({ open: true });
      });
      this._rTarget.addEventListener?.('focusout', async event => {
        // only close when it has no active items
        await this.host.updateComplete;
        if (
          this.__wasInternalPopoverSync ||
          target.contains(rootNode.activeElement) ||
          target.contains(event.relatedTarget)
        )
          return;
        this._set({ open: false });
      });
    }
  }

  async _set({ open, isInitialRender = false, syncsFromPopover = false }) {
    if (isDisabled(this.invoker)) {
      return;
    }
    if (!isInitialRender && open === this.open) {
      return;
    }

    const { usesPopover, visuallyHidden } = this;

    this.open = Boolean(open === 'toggle' ? !this.open : open);
    // console.trace(this.open, this.target);

    this._rTarget.toggleAttribute?.('data-open', this.open);
    if (!usesPopover) {
      this._rInvoker.setAttribute('aria-expanded', `${this.open}`);
    } else if (!syncsFromPopover) {
      this.__wasInternalPopoverSync = true;
      if (this.open) {
        this.target.showPopover?.();
      } else {
        this.target.hidePopover?.();
      }
      this.__wasInternalPopoverSync = false;
    }

    // if (this.open && !isInitialRender && !isServer) {
    //   await Promise.all(this.target.getAnimations().map(animation => animation.finished));
    //   this._rTarget.removeAttribute(visuallyHidden ? 'data-visually-hidden' : 'hidden');
    // } else {
    //   this._rTarget.setAttribute(visuallyHidden ? 'data-visually-hidden' : 'hidden', '');
    // }

    // Note we don't want smth to animate when we start
    if (!isInitialRender && !isServer) {
      // console.trace(this.target.getAnimations()[0]?.playState, this.target, this.open);
      try {
        await Promise.all(this.target.getAnimations().map(animation => animation.finished));
      } catch (e) {
        console.warn(e);
      }
    }
    this._rTarget.toggleAttribute?.(visuallyHidden ? 'data-visually-hidden' : 'hidden', !this.open);

    if (this.shouldHandleScrollLock) {
      this.constructor.handleScrollLock({ isOpen: this.open });
    }
  }

  toggle() {
    this._set({ open: 'toggle' });
  }

  show() {
    this._set({ open: true });
  }

  hide() {
    this._set({ open: false });
  }

  teardown() {
    this._rInvoker.reset();
    this._rTarget.reset();

    this.host.removeController(this);
  }
}
