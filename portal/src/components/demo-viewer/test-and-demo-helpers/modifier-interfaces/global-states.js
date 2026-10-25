export const codeToFigmaMap = [{ name: 'active', figmaName: 'pressed' }];

export const globalStateMap = [
  // All controls
  // https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes#user_action_pseudo-classes
  { name: 'hover', pseudoClass: ':hover' },
  { name: 'active', pseudoClass: ':active', lionGlobalAttr: 'active' },
  { name: 'focus', pseudoClass: ':focus' },
  { name: 'focus-visible', pseudoClass: ':focus-visible' },
  { name: 'focus-within', pseudoClass: ':focus-within', lionGlobalAttr: 'focused' },

  // Expandables (collapsibles, overlays)

  // N.B. accordion does not follow this convention and should therefore override this
  { name: 'open', lionGlobalAttr: 'opened', lionGlobalProp: 'opened' },

  // Inputs
  // https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes#input_pseudo-classes
  // Choice Inputs

  { name: 'checked', pseudoClass: ':checked' },
  { name: 'indeterminate', pseudoClass: ':indeterminate' },
  {
    name: 'read-only',
    pseudoClass: ':read-only',
    lionGlobalAttr: 'readonly',
    lionGlobalProp: 'readOnly',
  },

  // Inputs: Interaction states
  { name: 'blank', pseudoClass: ':blank', lionGlobalAttr: '!filled', lionGlobalProp: '!filled' },
  {
    name: 'user-invalid',
    pseudoClass: ':user-invalid',
    lionGlobalAttr: 'dirty & touched & has-feedback-for~=error',
  },

  {
    name: 'optional',
    pseudoClass: ':optional',
    lionGlobalAttr: '!required',
    lionGlobalProp: '!required',
  },

  // Inputs: Feedback and validation
  { name: 'valid', lionGlobalAttr: '!has-feedback-for~=error', lionGlobalProp: '!filled' },
];
