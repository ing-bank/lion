import { Constructor } from '@open-wc/dedupe-mixin';

export type StylesMap = {
  [key: string]: string;
};
export declare class UpdateStylesHost {
  /**
   * @example
   * <my-element>
   *     <style>
   *         :host {
   *          color: var(--foo);
   *         }
   *     </style>
   * </my-element>
   *
   * $0.updateStyles({'background': 'orange', '--foo': '#fff'})
   * Chrome, Firefox: <my-element style="background: orange; --foo: bar;">
   * IE: <my-element>
   *     => to head: <style>color: #fff</style>
   *
   * @param {StylesMap} updateStyles
   */
  public updateStyles(updateStyles: StylesMap): void;
}

/**
 * # UpdateStylesMixin
 */
declare function UpdateStylesMixinImplementation<T extends Constructor<HTMLElement>>(
  superclass: T,
): T &
  Constructor<UpdateStylesHost> &
  Pick<typeof UpdateStylesHost, keyof typeof UpdateStylesHost> &
  Pick<typeof HTMLElement, keyof typeof HTMLElement>;

export type UpdateStylesMixin = typeof UpdateStylesMixinImplementation;
