import { Constructor } from '@open-wc/dedupe-mixin';
import { LitElement } from 'lit';
import { FormControlHost } from './FormControlMixinTypes.js';

/**
 * A set of meta info about a FormControl that helps in the context of determining validation
 * feedback visibility
 */
export type InteractionStates = {
  submitted: boolean;
  touched: boolean;
  dirty: boolean;
  filled: boolean;
  prefilled: boolean;
};
export declare class InteractionStateHost {
  /**
   * True when user has focused and left(blurred) the field.
   */
  touched: boolean;

  /**
   * True when user has changed the value of the field.
   */
  dirty: boolean;

  /**
   * True when user has left non-empty field or input is prefilled.
   * The name must be seen from the point of view of the input field:
   * once the user enters the input field, the value is non-empty.
   */
  prefilled: boolean;

  /**
   * True when the modelValue is non-empty (see _isEmpty in FormControlMixin)
   */
  filled: boolean;

  /**
   * True when user has attempted to submit the form, e.g. through a button
   * of type="submit"
   */
  submitted: boolean;

  /**
   * Evaluations performed on connectedCallback.
   * This method is public, so it can be called at a later moment (when we need to wait for
   * registering children for instance) as well.
   * Since this method will be called twice in last mentioned scenario, it must stay idempotent.
   */
  initInteractionState(): void;

  /**
   * Resets touched and dirty, and recomputes prefilled
   */
  resetInteractionState(): void;

  /**
   * The event that triggers the touched state
   */
  protected _leaveEvent: string;

  /**
   * The event that triggers the dirty state
   */
  protected _valueChangedEvent: string;

  /**
   * Sets touched value to true and reevaluates prefilled state.
   * When false, on next interaction, user will start with a clean state.
   */
  protected _iStateOnLeave(): void;

  /**
   * Sets dirty value and validates when already touched or invalid
   */
  protected _iStateOnValueChange(): void;

  /**
   * Dispatches event on touched state change
   */
  protected _onTouchedChanged(): void;

  /**
   * Dispatches event on touched state change
   */
  protected _onDirtyChanged(): void;
}

export declare function InteractionStateImplementation<T extends Constructor<LitElement>>(
  superclass: T,
): T &
  Constructor<InteractionStateHost> &
  Pick<typeof InteractionStateHost, keyof typeof InteractionStateHost> &
  Constructor<FormControlHost> &
  Pick<typeof FormControlHost, keyof typeof FormControlHost> &
  Pick<typeof LitElement, keyof typeof LitElement>;

export type InteractionStateMixin = typeof InteractionStateImplementation;
