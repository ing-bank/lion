import { Constructor } from '@open-wc/dedupe-mixin';
import { LitElement } from 'lit';
import { SlotHost } from '@lion/ui/types/core.js';
import { ValidateHost } from '@lion/ui/types/form-core.js';

export declare class ScopedElementsHost {
  static get scopedElements(): { [key: string]: typeof HTMLElement };
  registry?: CustomElementRegistry;
}

export declare function ScopedMixin<T extends Constructor<LitElement>>(
  base: T,
): T &
  Constructor<ScopedElementsHost> &
  Pick<typeof ScopedElementsHost, keyof typeof ScopedElementsHost> &
  Pick<typeof LitElement, keyof typeof LitElement>;

export type ValidationExtension = <T extends Constructor<LitElement>>(
  base: T,
) => T &
  Constructor<ScopedElementsHost> &
  Pick<typeof ScopedElementsHost, keyof typeof ScopedElementsHost> &
  Constructor<ValidateHost> &
  Pick<typeof ValidateHost, keyof typeof ValidateHost> &
  Constructor<SlotHost> &
  Pick<typeof SlotHost, keyof typeof SlotHost> &
  Pick<typeof LitElement, keyof typeof LitElement>;
