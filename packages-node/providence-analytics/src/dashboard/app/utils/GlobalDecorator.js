/**
 * @typedef {import('lit').CSSResultGroup} CSSResultGroup
 */
export class GlobalDecorator {
  /**
   * @param { CSSResultGroup } styles
   * @param {{ prepend?: boolean }} [opts]
   */
  static decorateStyles(styles, { prepend } = {}) {
    if (!prepend) {
      this.globalDecoratedStyles.push(styles);
    } else {
      this.globalDecoratedStylesPrepended.push(styles);
    }
  }
}
/** @type {CSSResultGroup[]} */
GlobalDecorator.globalDecoratedStylesPrepended = [];
/** @type {CSSResultGroup[]} */
GlobalDecorator.globalDecoratedStyles = [];
