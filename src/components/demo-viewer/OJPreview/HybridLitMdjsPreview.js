import { render } from 'lit';
// @ts-ignore
// eslint-disable-next-line import/no-extraneous-dependencies
import { MdJsPreview } from '@mdjs/mdjs-preview';

/**
 * @typedef {object} HybridLitMdjsPreviewType
 * @property {(htmlTag: any, container: any) => void} renderStory
 */

/** @type {typeof MdJsPreview} */
/* eslint-disable-next-line max-classes-per-file */
export class HybridLitMdjsPreview extends MdJsPreview {
  /**
   * @param {any} htmlTag
   * @param {any} container
   */
  // eslint-disable-next-line class-methods-use-this
  renderStory(htmlTag, container) {
    render(htmlTag, container);
  }
}
