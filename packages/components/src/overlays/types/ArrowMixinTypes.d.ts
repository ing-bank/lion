import { Constructor } from '@open-wc/dedupe-mixin';
import { LitElement, TemplateResult } from '@lion/components/core.js';
import { CSSResultArray } from '@lion/components/core.js';
import { Options as PopperOptions, State } from '@popperjs/core/lib/popper';
import { OverlayConfig } from '../types/OverlayConfig';

export declare class ArrowHost {
  static get properties(): {
    hasArrow: {
      type: BooleanConstructor;
      reflect: boolean;
      attribute: string;
    };
  };
  hasArrow: boolean;
  repositionComplete: Promise<void>;

  static get styles(): CSSResultArray;

  render(): TemplateResult;
  protected _arrowTemplate(): TemplateResult;
  protected _arrowNodeTemplate(): TemplateResult;
  protected _defineOverlayConfig(): OverlayConfig;
  protected _getPopperArrowConfig(popperConfigToExtendFrom: Partial<PopperOptions>): Partial<PopperOptions>;
  private __setupRepositionCompletePromise(): void;
  get _arrowNode(): Element | null;
  private __syncFromPopperState(data: Partial<State>): void;
}

export declare function ArrowImplementation<T extends Constructor<LitElement>>(
  superclass: T,
): T &
  Constructor<ArrowHost> &
  Pick<typeof ArrowHost, keyof typeof ArrowHost> &
  Pick<typeof LitElement, keyof typeof LitElement>;

export type ArrowMixin = typeof ArrowImplementation;