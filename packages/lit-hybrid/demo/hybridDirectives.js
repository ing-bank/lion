/* eslint-disable eqeqeq */
import '@lion/collapsible/define';
import '@lion/button/define';
import {
  asyncAppend as asyncAppend1,
  asyncReplace as asyncReplace1,
  cache as cache1,
  classMap as classMap1,
  guard as guard1,
  ifDefined as ifDefined1,
  repeat as repeat1,
  styleMap as styleMap1,
  unsafeHTML as unsafeHTML1,
  until as until1,
  html as html1,
  LitElement as LitElement1,
  css as css1,
} from '../src/lit1-exports.js';

import {
  html as html2,
  css as css2,
  asyncAppend as asyncAppend2,
  asyncReplace as asyncReplace2,
  cache as cache2,
  classMap as classMap2,
  guard as guard2,
  ifDefined as ifDefined2,
  repeat as repeat2,
  styleMap as styleMap2,
  unsafeHTML as unsafeHTML2,
  until as until2,
  LitElement as LitElement2,
} from '../src/lit2-exports.js';
import { html2Hybrid } from '../src/hybrid-lit2/html2-hybrid-tag.js';

// cache
const view1 = (/** @type {any} */ tag) => tag`View 1: <input value="edit me then toggle">`;
const view2 = (/** @type {any} */ tag) => tag`View 2: <input value="edit me then toggle">`;

// asyncReplace
/**
 * @param {number} count
 */
async function* tossCoins(count) {
  for (let i = 0; i < count; i += 1) {
    yield Math.random() > 0.5 ? '✌' : '✊';
    await new Promise(r => setTimeout(r, 1000));
  }
}

// asyncAppend
/**
 * @param {number} count
 */
async function* countDown(count) {
  while (count > 0) {
    // eslint-disable-next-line no-plusplus, no-param-reassign
    yield count--;
    await new Promise(r => setTimeout(r, 1000));
  }
}

const directivesLit1 = {
  asyncAppend: asyncAppend1,
  asyncReplace: asyncReplace1,
  cache: cache1,
  classMap: classMap1,
  guard: guard1,
  ifDefined: ifDefined1,
  repeat: repeat1,
  styleMap: styleMap1,
  unsafeHTML: unsafeHTML1,
  until: until1,
};

const directivesLit2 = {
  asyncAppend: asyncAppend2,
  asyncReplace: asyncReplace2,
  cache: cache2,
  classMap: classMap2,
  guard: guard2,
  ifDefined: ifDefined2,
  repeat: repeat2,
  styleMap: styleMap2,
  unsafeHTML: unsafeHTML2,
  until: until2,
};

/**
 *
 * @param {{tag: html1|html2|html2Hybrid, tagInner?: html1|html2|html2Hybrid, cssTag: css1|css2, litBaseClass: typeof LitElement1|typeof LitElement2, title:string}} param0
 * @param {*} directives
 * @returns {typeof HTMLElement}
 */
function generateClass({ tag, tagInner, cssTag, litBaseClass, title }, directives) {
  class DirectiveClass extends litBaseClass {
    static get properties() {
      return {
        _tosses: { type: Number },
        _timer: { type: Number },
        toggleValue: { type: Number },
        toggleOtherValue: { type: Number },
        debug: { type: Boolean },
        reset: { type: Boolean },
        items: { type: Array },
      };
    }

    static get styles() {
      return [
        cssTag`
        .green {
          background-color: green;
        }

        .padded {
          padding: 20px;
        }

        .flex-equal {
          display: flex;
        }

        .flex-equal > * {
          flex: 1;
        }
    `,
      ];
    }

    constructor() {
      super();

      this.debug = false;
      this._init();
    }

    _init() {
      this._tosses = tossCoins(10);
      this._timer = countDown(10);
      this.toggleValue = 1;
      this.toggleOtherValue = 1;

      this.__classes = {
        green: this.toggleValue === 1,
        padded: this.toggleValue === 1,
      };

      this.items = [
        { id: 0, name: 'Justin' },
        { id: 1, name: 'Steve' },
        { id: 2, name: 'Kevin' },
        { id: 3, name: 'Russell' },
        { id: 4, name: 'Liz' },
        { id: 5, name: 'Peter' },
      ];
    }

    /**
     * @param {{ has: (arg0: string) => any; }} changedProperties
     */
    updated(changedProperties) {
      super.updated(changedProperties);

      if (changedProperties.has('reset') && this.reset) {
        this._init();
      }
      if (changedProperties.has('toggleValue')) {
        this.__classes = {
          green: this.toggleValue === 1,
          padded: this.toggleValue === 1,
        };
      }
    }

    render() {
      return tag`
      ${this.debug ? tag`this.toggleValue: ${this.toggleValue}` : ''}
      ${this.debug ? tag`this.toggleOtherValue: ${this.toggleOtherValue}` : ''}

      <div style="display:flex;">
        ${this._directivesTemplate({ tagInner: tagInner || tag, title }, directives)}
      </div>
    `;
    }

    _directivesTemplate(
      { tagInner, title },
      {
        asyncAppend,
        asyncReplace,
        cache,
        classMap,
        guard,
        ifDefined,
        repeat,
        styleMap,
        unsafeHTML,
        until,
      },
    ) {
      return tagInner`
      <section>

      <lion-collapsible opened>
        <lion-button slot="invoker">
          ${title}
        </lion-button>

        <div slot="content">
            <ul>
              <li>
                <b>asyncAppend</b><br/>
                ${asyncAppend(this._tosses, v => tagInner`${v}`)}
              </li>

              <li>
                <b>asyncReplace</b><br/>
                <span>${asyncReplace(this._timer)}</span>
              </li>

              <li>
                <b>cache</b><br/>
                Cached and re-used when template re-rendered:<br/>
                ${cache(this.toggleValue == 1 ? view1(tagInner) : view2(tagInner))}
              </li>

              <li>
                <b>classMap</b><br/>
                <div class=${classMap(this.__classes)}>Classy text</div>
              </li>

              <li>
                <b>guard</b><br/>
                <div>
                  ${guard([this.toggleOtherValue], () => Math.random() * 10)}
                </div>
              </li>

              <li>
                <b>repeat</b><br/>

                <button @click=${() => this.sort(1)}>Sort ascending</button>
                <button @click=${() => this.sort(-1)}>Sort descending</button><hr>

                With keying (DOM including checkbox state moves with items):
                <ul>
                  ${repeat(
                    this.items,
                    (/** @type {{ id: any; }} */ item) => item.id,
                    (/** @type {{ name: any; }} */ item, /** @type {any} */ index) => tagInner` <li>
                      ${index}: <label><input type="checkbox" />${item.name}</label>
                    </li>`,
                  )}
                </ul><hr>

                Without keying (items are re-used in place, checkbox state does not change):
                <ul>
                  ${repeat(
                    this.items,
                    (/** @type {{ name: any; }} */ item, /** @type {any} */ index) => tagInner` <li>
                      ${index}: <label><input type="checkbox" />${item.name}</label>
                    </li>`,
                  )}
                </ul>
              </li>

            </ul>
        </div>
        </lion-collapsible>
    </section>
    `;
    }

    /**
     * @param {number} dir
     */
    sort(dir) {
      this.items = [
        ...this.items.sort(
          (/** @type {{ name: string; }} */ a, /** @type {{ name: any; }} */ b) =>
            a.name.localeCompare(b.name) * dir,
        ),
      ];
    }
  }
  return /** @type {* & typeof HTMLElement} */ (DirectiveClass);
}

export const Lit2Directives = generateClass(
  { tag: html2, cssTag: css2, litBaseClass: LitElement2, title: 'Reference: html2 - directives2' },
  directivesLit2,
);

export const Lit1Directives = generateClass(
  { tag: html1, cssTag: css1, litBaseClass: LitElement1, title: 'Reference: html1 - directives1' },
  directivesLit1,
);

export const Html1InHybrid2Lit2Directives = generateClass(
  {
    tag: html2Hybrid,
    tagInner: html1,
    cssTag: css2,
    litBaseClass: LitElement2,
    title: 'Might work: html1 in html2Hybrid - directives2',
  },
  directivesLit2,
);

export const Hybrid2InHybrid2Lit2Directives = generateClass(
  {
    tag: html2Hybrid,
    cssTag: css2,
    litBaseClass: LitElement2,
    title: 'Recommended: html2Hybrid in html2Hybrid - directives2',
  },
  directivesLit2,
);

export const Html1InHtml1Lit2Directives = generateClass(
  {
    tag: html1,
    tagInner: html1,
    cssTag: css1,
    litBaseClass: LitElement1,
    title: 'html1 in html1 - directives2',
  },
  directivesLit2,
);
