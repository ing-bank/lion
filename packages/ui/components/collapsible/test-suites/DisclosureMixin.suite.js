// import { LitElement } from 'lit';
// import { expect, html, fixture as _fixture, unsafeStatic, defineCE } from '@open-wc/testing';
// import { DisclosureMixin } from '../src/DisclosureMixin.js';

// import '@lion/ui/define/lion-menu.js';
// import '@lion/ui/define/lion-item.js';

// class DisclosureClass extends DisclosureMixin(LitElement) {}

// /**
//  * @typedef {import('lit').TemplateResult} TemplateResult
//  */

// const fixture = /** @type {(arg: TemplateResult) => Promise<LionMenu>} */ (_fixture);

// /**
//  * @param { {tagString?:string, itemTagString?:string} } [customConfig]
//  */
// export function runDisclosureMixinSuite(customConfig = {}) {
//   const cfg = {
//     tagString: 'lion-menu',
//     ...customConfig,
//   };

//   const tagString = cfg.tagString || defineCE(DisclosureClass);
//   const tag = unsafeStatic(tagString);

//   describe('DisclosureMixin', () => {
//   });
// }
