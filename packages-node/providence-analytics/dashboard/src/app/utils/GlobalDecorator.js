export class GlobalDecorator {
  /**
   * @param { CssResult[] } styles
   * @param { boolean } prepend
   */
  static decorateStyles(styles, { prepend } = {}) {
    if (!prepend) {
      this.globalDecoratedStyles.push(styles);
    } else {
      this.globalDecoratedStylesPrepended.push(styles);
    }
  }
}
GlobalDecorator.globalDecoratedStylesPrepended = [];
GlobalDecorator.globalDecoratedStyles = [];
