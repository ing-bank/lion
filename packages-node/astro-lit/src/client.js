/**
 * @license
 * Copyright 2026 ING Bank N.V.
 * SPDX-License-Identifier: MIT
 *
 * Client entrypoint for the Astro + Lit integration. Astro calls the default
 * export for every hydrated (`client:*`) Lit island it encounters.
 */
const addSlotAttrsToHtmlString = (slotName, html) => {
  const template = document.createElement('template');
  template.innerHTML = html;
  Array.from(template.content.children).forEach(node => {
    node.setAttribute('slot', slotName);
  });
  return template.innerHTML;
};

/**
 * @param {Element} element The `<astro-island>` element this component lives in
 * @param {CustomElementConstructor} Component The Lit custom element class
 * @param {Record<string, unknown>} props The props passed from Astro
 * @param {{ default?: string } & Record<string, string>} slots The slot content
 */
export default function clientEntry(element) {
  return async function hydrate(Component, props, { default: defaultChildren, ...slotted }) {
    let component = element.children[0];
    const isClientOnly = element.getAttribute('client') === 'only';

    if (isClientOnly) {
      component = new Component();
      const otherSlottedChildren = Object.entries(slotted)
        .map(([slotName, htmlStr]) => addSlotAttrsToHtmlString(slotName, htmlStr))
        .join('');
      component.innerHTML = `${defaultChildren ?? ''}${otherSlottedChildren}`;
      element.appendChild(component);
      for (const [name, value] of Object.entries(props)) {
        if (!(name in Component.prototype)) {
          component.setAttribute(name, value);
        }
      }
    }

    if (!component || !(component.hasAttribute('defer-hydration') || isClientOnly)) {
      return;
    }

    // Props that are actual class properties are set as properties so that Lit
    // picks them up before hydration completes.
    for (const [name, value] of Object.entries(props)) {
      if (name in Component.prototype) {
        component[name] = value;
      }
    }

    component.removeAttribute('defer-hydration');
  };
}
