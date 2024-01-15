import { html, isServer } from 'lit';
import { UIBaseElement } from '../shared/UIBaseElement.js';
import { UIPartDirective } from '../shared/UIPartDirective.js';
import {
  assertBannerLandmark,
  assertMainLandmark,
  assertContentinfoLandmark,
  assertComplementaryLandmark,
  assertAnchor,
  assertPresentation,
} from '../shared/element-assertions.js';

export class UIPageLayoutPartDirective extends UIPartDirective {
  setup(part, [context, name, localContext]) {
    const ctor = this.constructor;
    switch (name) {
      case 'root':
        ctor._setupRoot(part, { context, localContext });
        break;
      case 'header':
        ctor._setupHeader(part, { context, localContext });
        break;
      case 'aside-slot':
        ctor._setupAsideSlot(part, { context, localContext });
        break;
      case 'main':
        ctor._setupMain(part, { context, localContext });
        break;
      case 'footer':
        ctor._setupFooter(part, { context, localContext });
        break;
      case 'skip-link':
        ctor._setupSkipLink(part, { context, localContext });
        break;
      case 'utils-bottom':
        ctor._setupUtilsBottom(part, { context, localContext });
        break;
      case 'back-to-top-link':
        ctor._setupBackToTopLink(part, { context, localContext });
        break;
      default:
        throw new Error(`Unknown part ${name}`);
    }
  }

  static _setupRoot({ element }, { context }) {
    assertPresentation(element);
    element.setAttribute('data-part', 'root');
    context.registerRef('root', element);
  }

  static _setupHeader({ element }, { context }) {
    // We operate in the body context
    // https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/examples/banner.html
    element.setAttribute('role', 'banner');
    assertBannerLandmark(element);

    element.setAttribute('data-part', 'header');
    context.registerRef('header', element);
  }

  static _setupAsideSlot({ element }, { context }) {
    element.setAttribute('data-part', 'aside-slot');
    context.registerRef('aside-slot', element);
    if (isServer) return;

    const [asideElem] = element.assigedNodes({ flatten: true });
    if (!asideElem.children.length) {
      // Hide the slot if it is empty
      element.setAttribute('hidden', '');
    }

    asideElem.setAttribute('role', 'complementary');
    assertComplementaryLandmark(asideElem);
    if (!asideElem.getAttribute('aria-label') && !asideElem.getAttribute('aria-labelledby')) {
      throw new Error('Provide an aria-label or aria-labelledby attribute');
    }
  }

  static _setupMain({ element }, { context }) {
    assertMainLandmark(element);
    element.setAttribute('data-part', 'main');
    // Make sure our skip-link can focus this area, but do not make it a tab stop
    element.setAttribute('tabindex', '-1');
    context.registerRef('main', element);
  }

  static _setupFooter({ element }, { context }) {
    // We operate in the body context
    // https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/examples/banner.html
    element.setAttribute('role', 'contentinfo');
    assertContentinfoLandmark(element);
    element.setAttribute('data-part', 'footer');
    context.registerRef('footer', element);
  }

  static _setupSkipLink({ element }, { context }) {
    assertAnchor(element);
    element.setAttribute('data-part', 'skip-link');
    element.setAttribute('data-visually-hidden-focusable', '');
    element.setAttribute('style', 'position:fixed;');
    element.setAttribute('href', '#');

    context.registerRef('skip-link', element);

    if (isServer) return;

    element.addEventListener('click', () => {
      context.fns.focusMainContent();
    });
  }

  static _setupUtilsBottom({ element }, { context }) {
    assertPresentation(element);
    element.setAttribute('data-part', 'utils-bottom');
    element.setAttribute('hidden', '');
    element.setAttribute('style', 'position: fixed; bottom: 2rem; right: 2rem;');

    context.registerRef('utils-bottom', element);

    if (isServer) return;

    window.addEventListener('scroll', () => {
      const shouldShowBackToTopLink =
        document.documentElement.scrollTop > context.data?.scrollThreshold;
      element.toggleAttribute('hidden', !shouldShowBackToTopLink);
    });
  }

  static _setupBackToTopLink({ element }, { context }) {
    assertAnchor(element);
    element.setAttribute('data-part', 'back-to-top-link');
    element.setAttribute('href', '#');

    context.registerRef('back-to-top-link', element);

    if (isServer) return;

    element.addEventListener('click', () => {
      context.fns.focusTop();
    });
  }
}

/**
 * Accessible page layout with relevant page landmarks.
 * See https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/examples/banner.html
 * TODO: put all in directives...
 */
export class UIPageLayout extends UIBaseElement {
  static _partDirective = UIPageLayoutPartDirective;

  static tagName = 'ui-page-layout';

  get templateContext() {
    const { refs } = this;

    return {
      ...super.templateContext,
      data: {
        scrollThreshold: 200,
      },
      translations: {
        skipToMainContent: 'Skip to main content',
        backToTop: 'Back to top',
      },
      fns: {
        focusMainContent: () => {
          refs['main']?.focus();
        },
        focusTop: () => {
          document.body.focus();
        },
      },
    };
  }

  static templates = {
    root(context) {
      const { templates, part } = context;

      return html`
        <div ${part('root')}>
          <header ${part('header')}>
            ${templates.skipLink(context)}
            <slot name="main-nav"></slot>
          </header>
          <div data-part="main-wrapper">
            <slot ${part('aside-slot')} name="aside"></slot>
            <main ${part('main')}>
              <div data-part="container">
                <slot></slot>
              </div>
            </main>
          </div>
          ${templates.utilsBottom(context)}
          <footer ${part('footer')}>
            <slot name="footer"></slot>
          </footer>
        </div>
      `;
    },
    skipLink(context) {
      const { translations, part } = context;

      return html` <a ${part('skip-link')}> ${translations?.skipToMainContent} </a> `;
    },
    utilsBottom(context) {
      const { translations, part } = context;

      return html`<div ${part('utils-bottom')}>
        <a ${part('back-to-top-link')}> ${translations?.backToTop} </a>
      </div>`;
    },
    // headerItems(context) {
    //   const { part } = context;

    //   return html`
    //     <div ${part('header-items')}>
    //       <a href="/"><slot name="logo"></slot></a>
    //     </div>
    //   `;
    // },
  };
}
