import { Constructor } from '@open-wc/dedupe-mixin';
import { LitElement, TemplateResult } from '@lion/core';
import { CSSResultArray } from 'lit-element';
import Data from 'popper.js';
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

  static styles: CSSResultArray;

  render(): TemplateResult;
  _arrowTemplate(): TemplateResult;
  _defineOverlayConfig(): OverlayConfig;
  __setupRepositionCompletePromise(): void;
  get _arrowNode(): Element | null;
  __syncFromPopperState(data: Data): void;
}

export declare function ArrowImplementation<T extends Constructor<LitElement>>(
  superclass: T,
): T & Constructor<ArrowHost> & ArrowHost;

export type ArrowMixin = typeof ArrowImplementation;
