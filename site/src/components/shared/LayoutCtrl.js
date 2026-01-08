/**
 * This controller allows to switch layouts on different screen sizes.
 * Component authors can easily compose layouts and reuse them in different scenarios
 * For full ssr-support styles will be rendered to container queries.
 */
export class LayoutCtrl {
  host;

  container;

  resizeObserver;

  layouts;

  layoutsContainer;

  currentLayout;

  constructor(host, { layouts, layoutsContainer }) {
    (this.host = host).addController(this);

    if (!layouts || !Object.keys(layouts).length) {
      return;
    }

    this.layouts = layouts;
    this.layoutsContainer = layoutsContainer;
  }

  hostConnected() {
    // We only are interested in width, so we put resizeObserver on body.
    this.resizeObserver = new ResizeObserver(entries => {
      const newWidth = entries[0].contentBoxSize[0].inlineSize;
      const layoutArrayOrdered = Object.entries(this.layouts).sort((a, b) => b[1] - a[1]);
      const newLayout = layoutArrayOrdered.find(([, minWidth]) => newWidth >= minWidth)?.[0];

      // TODO: make nicer/more flexible
      if (newLayout !== this.currentLayout) {
        this.host.setAttribute('data-layout', newLayout);
        this.currentLayout = newLayout;
      }
    });
    this.container =
      (this.layoutsContainer === globalThis ? document?.body : this.layoutsContainer) || this.host;
    this.resizeObserver?.observe(this.container);
  }

  hostDisconnected() {
    this.resizeObserver?.unobserve(this.container);
  }
}
