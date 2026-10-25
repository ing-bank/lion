export type ModifierMap = {
  name: string;
  setter: (
    el: HTMLElement,
    modifier: CssStateModifier,
    state: boolean | string,
    opts: { variantValues?: string[] },
  ) => void;
  getter: (el: HTMLElement, modifier: CssStateModifier, opts: { variantValues?: string[] }) => void;
}[];

export type Constructor<T> = new (...args: any[]) => T;

export type VariantModifier = { name: string; values: string[] };
export type FlagModifier = string;
export type SizeModifier = 'sm' | 'md' | 'lg';
// Interaction states. These are either on or off. See https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes
// Note that we not handle "opposite cases" of mutually exclusive states. I.e. we only handle ":disabled" and not ":enabled"
export type CssStateModifier = 'hover' | 'focus' | 'pressed' | 'visited';
export type StateModifier =
  | 'disabled'
  | 'open'
  | 'readonly'
  | 'checked'
  | 'selected'
  | 'required'
  | ('indeterminate' & CssStateModifier);
export type ModifierDefinitions = {
  [modifierCategory: string]: VariantModifier[] | FlagModifier[] | SizeModifier[] | StateModifier[];
};

export type ModifierInterface = { designDefinitions: ModifierDefinitions; mapToCode: ModifierMap };
