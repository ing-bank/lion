/* eslint-disable max-classes-per-file */
// ---- Generic controls ----

// Everything that is interactive (has a tabindex or is a platform control), can be considered a control.
export class UIControl {
  static states = ['hover', 'focus', 'focus-visible'];
}

// https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/disabled
export class UIButtonControl extends UIControl {
  static states = [...super.states, 'active', 'disabled'];
}

export class UIAnchorControl extends UIButtonControl {
  // TODO: should any-link be here or ob UIControl or Element?
  static states = [...super.states, 'visited', 'local-link', 'target', 'any-link', 'active'];
}

export class UIExpandableControl extends UIButtonControl {
  static states = [...super.states, 'open'];
}

// ---- Form Control ----

// A form control is a control like HTMLInputElement, HTMLSelectElement, HTMLTextAreaElement
// Also, elements that are not part of the platform, but do have a WAI-ARIA implementation (like listbox)
// are considered form controls. They should use ElementInternals to implement the platform API
// For advanced validation, UIFormControlEnhanced is needed
export class UIFormControl extends UIControl {
  static states = [...super.states, 'invalid', 'required', 'readonly'];
}

// The platform is not able to deliver all user and developer experiences
// with default FormControls
export class UIFormControlEnhanced extends UIFormControl {
  // implements EnhancedValidationControl, EnhancedValueControl, EnhancedInteractionStatesControl
  static states = [...super.states, 'filled', 'dirty', 'touched', 'submitted'];
}

// An element like option
export class UIChoiceSelectable {
  static states = ['selected'];
}

// An element like checkbox or radio, but also menuitemcheckbox and menuitemradio
export class UIChoiceCheckable {
  static states = ['checked', 'indeterminate'];
}

// A choice control that can be individually checked
// Think of HTMLInputElement with type checkbox or radio
export class UIChoiceControl extends UIFormControl {
  // implements UIChoiceSelectable OR UIChoiceCheckable
  // static states = [];
}

export class UIChoiceGroup {
  // choiceRefs = (UIChoiceControl | UIChoiceSelectable | UIChoiceCheckable)[];
}

// ---- Groups ----

export class UIControlGroup {
  static states = ['focus-within'];
  // controlRefs = UIControl[];
}

// https://open-ui.org/components/focusgroup.explainer/
export class UIFocusGroup extends UIControlGroup {}

export class UIFormControlGroup extends UIControlGroup {
  static states = ['focus-within'];
  // controlRefs = (UIFormControl | UIFormControlGroup)[];
}

// --- Containers ----

// This is the equivalent of LionField. It contains an accessible surrounding
// anatomy(label, help text, error message etc.) around the UIFormControl.
// Also, it proxies the api of the UIFormControl it references.
export class UIFormControlContainer {
  static states = ['focus-within'];
  // controlRef = UIFormControl | UIFormControlEnhanced;
}

// export class UIAnchorControlContainer extends UIControlContainer {
//   static states = [...super.states, 'target-within'];
// }

// Connects the control and
export class UIExpandableControlContainer {
  // The open state is proxied from UIExpandableControl
  static states = ['opened'];
  // controlRef = UIExpandableControl;
  // overlayRef = HTMLDialogElement | HTMLElementWithPopoverAttr;
}
