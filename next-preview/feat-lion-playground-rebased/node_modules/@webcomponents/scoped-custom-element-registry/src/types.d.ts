export {};

declare global {
  interface ShadowRoot {
    // This overload is for roots that use the global registry
    createElement<K extends keyof HTMLElementTagNameMap>(
      tagName: K,
      options?: ElementCreationOptions
    ): HTMLElementTagNameMap[K];
    // This overload is for roots that use a scoped registry
    createElement<K extends keyof BuiltInHTMLElementTagNameMap>(
      tagName: K,
      options?: ElementCreationOptions
    ): BuiltInHTMLElementTagNameMap[K];
    createElement(
      tagName: string,
      options?: ElementCreationOptions
    ): HTMLElement;
  }

  interface ShadowRootInit {
    customElements?: CustomElementRegistry;
  }

  interface ShadowRoot {
    readonly customElements?: CustomElementRegistry;
  }

  /*
   * Many custom element definitions will add themselves to the global
   * HTMLElementTagNameMap interface. Using that interface in
   * ShadowRoot.prototype.createElement() would mean that TypeScript uses
   * the global tag name map mapping for a scoped API which doesn't use
   * global registrations.
   *
   * This interface allows us to only accept keys of known built-ins, and
   * possibly create a typed API for scoped registrations.
   *
   * This interface should be kept in sync with HTMLElementTagNameMap.
   */
  interface BuiltInHTMLElementTagNameMap {
    'a': HTMLAnchorElement;
    'abbr': HTMLElement;
    'address': HTMLElement;
    'area': HTMLAreaElement;
    'article': HTMLElement;
    'aside': HTMLElement;
    'audio': HTMLAudioElement;
    'b': HTMLElement;
    'base': HTMLBaseElement;
    'bdi': HTMLElement;
    'bdo': HTMLElement;
    'blockquote': HTMLQuoteElement;
    'body': HTMLBodyElement;
    'br': HTMLBRElement;
    'button': HTMLButtonElement;
    'canvas': HTMLCanvasElement;
    'caption': HTMLTableCaptionElement;
    'cite': HTMLElement;
    'code': HTMLElement;
    'col': HTMLTableColElement;
    'colgroup': HTMLTableColElement;
    'data': HTMLDataElement;
    'datalist': HTMLDataListElement;
    'dd': HTMLElement;
    'del': HTMLModElement;
    'details': HTMLDetailsElement;
    'dfn': HTMLElement;
    'dialog': HTMLDialogElement;
    'div': HTMLDivElement;
    'dl': HTMLDListElement;
    'dt': HTMLElement;
    'em': HTMLElement;
    'embed': HTMLEmbedElement;
    'fieldset': HTMLFieldSetElement;
    'figcaption': HTMLElement;
    'figure': HTMLElement;
    'footer': HTMLElement;
    'form': HTMLFormElement;
    'h1': HTMLHeadingElement;
    'h2': HTMLHeadingElement;
    'h3': HTMLHeadingElement;
    'h4': HTMLHeadingElement;
    'h5': HTMLHeadingElement;
    'h6': HTMLHeadingElement;
    'head': HTMLHeadElement;
    'header': HTMLElement;
    'hgroup': HTMLElement;
    'hr': HTMLHRElement;
    'html': HTMLHtmlElement;
    'i': HTMLElement;
    'iframe': HTMLIFrameElement;
    'img': HTMLImageElement;
    'input': HTMLInputElement;
    'ins': HTMLModElement;
    'kbd': HTMLElement;
    'label': HTMLLabelElement;
    'legend': HTMLLegendElement;
    'li': HTMLLIElement;
    'link': HTMLLinkElement;
    'main': HTMLElement;
    'map': HTMLMapElement;
    'mark': HTMLElement;
    'menu': HTMLMenuElement;
    'meta': HTMLMetaElement;
    'meter': HTMLMeterElement;
    'nav': HTMLElement;
    'noscript': HTMLElement;
    'object': HTMLObjectElement;
    'ol': HTMLOListElement;
    'optgroup': HTMLOptGroupElement;
    'option': HTMLOptionElement;
    'output': HTMLOutputElement;
    'p': HTMLParagraphElement;
    'picture': HTMLPictureElement;
    'pre': HTMLPreElement;
    'progress': HTMLProgressElement;
    'q': HTMLQuoteElement;
    'rp': HTMLElement;
    'rt': HTMLElement;
    'ruby': HTMLElement;
    's': HTMLElement;
    'samp': HTMLElement;
    'script': HTMLScriptElement;
    'search': HTMLElement;
    'section': HTMLElement;
    'select': HTMLSelectElement;
    'slot': HTMLSlotElement;
    'small': HTMLElement;
    'source': HTMLSourceElement;
    'span': HTMLSpanElement;
    'strong': HTMLElement;
    'style': HTMLStyleElement;
    'sub': HTMLElement;
    'summary': HTMLElement;
    'sup': HTMLElement;
    'table': HTMLTableElement;
    'tbody': HTMLTableSectionElement;
    'td': HTMLTableCellElement;
    'template': HTMLTemplateElement;
    'textarea': HTMLTextAreaElement;
    'tfoot': HTMLTableSectionElement;
    'th': HTMLTableCellElement;
    'thead': HTMLTableSectionElement;
    'time': HTMLTimeElement;
    'title': HTMLTitleElement;
    'tr': HTMLTableRowElement;
    'track': HTMLTrackElement;
    'u': HTMLElement;
    'ul': HTMLUListElement;
    'var': HTMLElement;
    'video': HTMLVideoElement;
    'wbr': HTMLElement;
  }
}
