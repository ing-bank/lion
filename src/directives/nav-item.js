import { AsyncDirective, directive } from 'lit/async-directive.js';

export class NavItemDirective extends AsyncDirective {
  update(part, [item]) {
    const anchorEl = part.element;
    if (!(anchorEl instanceof HTMLAnchorElement)) {
      throw new Error('[NavItemDirective] Please apply to HTMLAnchorElement');
    }

    anchorEl.href = item.redirect || item.url;
    if (item.active) {
      anchorEl.setAttribute('aria-current', 'page');
    }
  }
}

export const navItemDirective = directive(NavItemDirective);
