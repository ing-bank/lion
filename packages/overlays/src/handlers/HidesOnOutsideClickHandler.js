class OverlayControllerHandler {
  onInit(ctrl) {}

  onBeforeShow(ctrl) {}

  onShow(ctrl) {}

  onHide(ctrl) {}

  onTeardown(ctrl) {}
}

export class HidesOnOutsideClickHandler extends OverlayControllerHandler {
  constructor(ctrl) {
    super();
    this.wasClickInside = false;
    this.wasIndirectSynchronousClick = false;

    this.ctrl = ctrl;
  }

  onShow({ contentWrapperNode, invokerNode }) {
    this.wasClickInside = false;
    this.wasIndirectSynchronousClick = false;
    // Handle on capture phase and remember till the next task that there was an inside click

    contentWrapperNode.addEventListener('click', this._preventCloseOutsideClick);
    if (invokerNode) {
      invokerNode.addEventListener('click', this._preventCloseOutsideClick);
    }
    document.documentElement.addEventListener('click', this._onCaptureHtmlClick);
  }

  onHide({ contentWrapperNode, invokerNode }) {
    this._removeListeners({ contentWrapperNode, invokerNode });
  }

  onTeardown({ contentWrapperNode, invokerNode }) {
    this._removeListeners({ contentWrapperNode, invokerNode });
  }

  _removeListeners({ contentWrapperNode, invokerNode }) {
    contentWrapperNode.removeEventListener('click', this._preventCloseOutsideClick);
    if (invokerNode) {
      invokerNode.removeEventListener('click', this._preventCloseOutsideClick);
    }
    document.documentElement.removeEventListener('click', this._onCaptureHtmlClick);
  }

  /** @type {EventListener} */
  _preventCloseOutsideClick() {
    this.wasClickInside = true;

    // if (this.wasClickInside) {
    //   // This occurs when a synchronous new click is triggered from a previous click.
    //   // For instance, when we have a label pointing to an input, the platform triggers
    //   // a new click on the input. Not taking this click into account, will hide the overlay
    //   // in `__onCaptureHtmlClick`
    //   this.wasIndirectSynchronousClick = true;
    // }
    // this.wasClickInside = true;
    // setTimeout(() => {
    //   this.wasClickInside = false;
    //   setTimeout(() => {
    //     this.wasIndirectSynchronousClick = false;
    //   });
    // });
  }

  // handle on capture phase and schedule the hide if needed
  /** @type {EventListener} */
  _onCaptureHtmlClick() {
    // console.log('__onCaptureHtmlClick');
    // setTimeout(() => {
    //   console.log(
    //     'timeout __onCaptureHtmlClick',
    //     'wasClickInside',
    //     this.wasClickInside,
    //     'wasIndirectSynchronousClick',
    //     this.wasIndirectSynchronousClick,
    //     this.ctrl.invoker,
    //   );
    //   if (this.wasClickInside === false && !this.wasIndirectSynchronousClick) {
    //     this.ctrl.hide();
    //   }
    // });

    if (!this.wasClickInside) {
      this.ctrl.hide();
    }
    this.wasClickInside = false;
  }
}
