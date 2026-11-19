/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
/**
 * Map of ARIAMixin properties to attributes
 */
export const ariaMixinAttributes = {
    ariaAtomic: 'aria-atomic',
    ariaAutoComplete: 'aria-autocomplete',
    ariaBrailleLabel: 'aria-braillelabel',
    ariaBrailleRoleDescription: 'aria-brailleroledescription',
    ariaBusy: 'aria-busy',
    ariaChecked: 'aria-checked',
    ariaColCount: 'aria-colcount',
    ariaColIndex: 'aria-colindex',
    ariaColIndexText: 'aria-colindextext',
    ariaColSpan: 'aria-colspan',
    ariaCurrent: 'aria-current',
    ariaDescription: 'aria-description',
    ariaDisabled: 'aria-disabled',
    ariaExpanded: 'aria-expanded',
    ariaHasPopup: 'aria-haspopup',
    ariaHidden: 'aria-hidden',
    ariaInvalid: 'aria-invalid',
    ariaKeyShortcuts: 'aria-keyshortcuts',
    ariaLabel: 'aria-label',
    ariaLevel: 'aria-level',
    ariaLive: 'aria-live',
    ariaModal: 'aria-modal',
    ariaMultiLine: 'aria-multiline',
    ariaMultiSelectable: 'aria-multiselectable',
    ariaOrientation: 'aria-orientation',
    ariaPlaceholder: 'aria-placeholder',
    ariaPosInSet: 'aria-posinset',
    ariaPressed: 'aria-pressed',
    ariaReadOnly: 'aria-readonly',
    ariaRelevant: 'aria-relevant',
    ariaRequired: 'aria-required',
    ariaRoleDescription: 'aria-roledescription',
    ariaRowCount: 'aria-rowcount',
    ariaRowIndex: 'aria-rowindex',
    ariaRowIndexText: 'aria-rowindextext',
    ariaRowSpan: 'aria-rowspan',
    ariaSelected: 'aria-selected',
    ariaSetSize: 'aria-setsize',
    ariaSort: 'aria-sort',
    ariaValueMax: 'aria-valuemax',
    ariaValueMin: 'aria-valuemin',
    ariaValueNow: 'aria-valuenow',
    ariaValueText: 'aria-valuetext',
    role: 'role',
};
// Shim the global element internals object
// Methods should be fine as noops and properties can generally
// be while on the server.
export const ElementInternalsShim = class ElementInternals {
    get shadowRoot() {
        // Grab the shadow root instance from the Element shim
        // to ensure that the shadow root is always available
        // to the internals instance even if the mode is 'closed'
        return this.__host
            .__shadowRoot;
    }
    constructor(_host) {
        this.ariaActiveDescendantElement = null;
        this.ariaAtomic = '';
        this.ariaAutoComplete = '';
        this.ariaBrailleLabel = '';
        this.ariaBrailleRoleDescription = '';
        this.ariaBusy = '';
        this.ariaChecked = '';
        this.ariaColCount = '';
        this.ariaColIndex = '';
        this.ariaColIndexText = '';
        this.ariaColSpan = '';
        this.ariaControlsElements = null;
        this.ariaCurrent = '';
        this.ariaDescribedByElements = null;
        this.ariaDescription = '';
        this.ariaDetailsElements = null;
        this.ariaDisabled = '';
        this.ariaErrorMessageElements = null;
        this.ariaExpanded = '';
        this.ariaFlowToElements = null;
        this.ariaHasPopup = '';
        this.ariaHidden = '';
        this.ariaInvalid = '';
        this.ariaKeyShortcuts = '';
        this.ariaLabel = '';
        this.ariaLabelledByElements = null;
        this.ariaLevel = '';
        this.ariaLive = '';
        this.ariaModal = '';
        this.ariaMultiLine = '';
        this.ariaMultiSelectable = '';
        this.ariaOrientation = '';
        this.ariaOwnsElements = null;
        this.ariaPlaceholder = '';
        this.ariaPosInSet = '';
        this.ariaPressed = '';
        this.ariaReadOnly = '';
        this.ariaRelevant = '';
        this.ariaRequired = '';
        this.ariaRoleDescription = '';
        this.ariaRowCount = '';
        this.ariaRowIndex = '';
        this.ariaRowIndexText = '';
        this.ariaRowSpan = '';
        this.ariaSelected = '';
        this.ariaSetSize = '';
        this.ariaSort = '';
        this.ariaValueMax = '';
        this.ariaValueMin = '';
        this.ariaValueNow = '';
        this.ariaValueText = '';
        this.role = '';
        this.form = null;
        this.labels = [];
        this.states = new Set();
        this.validationMessage = '';
        this.validity = {};
        this.willValidate = true;
        this.__host = _host;
    }
    checkValidity() {
        // TODO(augustjk) Consider actually implementing logic.
        // See https://github.com/lit/lit/issues/3740
        console.warn('`ElementInternals.checkValidity()` was called on the server.' +
            'This method always returns true.');
        return true;
    }
    reportValidity() {
        return true;
    }
    setFormValue() { }
    setValidity() { }
};
const ElementInternalsShimWithRealType = ElementInternalsShim;
export { ElementInternalsShimWithRealType as ElementInternals };
export const HYDRATE_INTERNALS_ATTR_PREFIX = 'hydrate-internals-';
//# sourceMappingURL=element-internals.js.map