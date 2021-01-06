import { Constructor } from '@open-wc/dedupe-mixin';
import { LitElement, TemplateResult } from '@lion/core';
import { CSSResultArray } from '@lion/core';
import Data from 'popper.js';
import { Options as PopperOptions } from '@popperjs/core/lib/popper';
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
  _arrowTemplate(): TemplateResult;
  _arrowNodeTemplate(): TemplateResult;
  _defineOverlayConfig(): OverlayConfig;
  _getPopperArrowConfig(popperConfigToExtendFrom: Partial<PopperOptions>): Partial<PopperOptions>;
  __setupRepositionCompletePromise(): void;
  get _arrowNode(): Element | null;
  __syncFromPopperState(data: Data): void;
}

export declare function ArrowImplementation<T extends Constructor<LitElement>>(
  superclass: T,
): T & Constructor<ArrowHost> & ArrowHost;

export type ArrowMixin = typeof ArrowImplementation;
