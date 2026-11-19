/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
type StringKeys<T extends object> = {
    [K in keyof T]: T[K] extends string | null ? K : never;
}[keyof T];
type ARIAAttributeMap = {
    [K in StringKeys<ARIAMixin>]: string;
};
/**
 * Map of ARIAMixin properties to attributes
 */
export declare const ariaMixinAttributes: ARIAAttributeMap;
export declare const ElementInternalsShim: {
    new (_host: HTMLElement): {
        ariaActiveDescendantElement: null;
        ariaAtomic: string;
        ariaAutoComplete: string;
        ariaBrailleLabel: string;
        ariaBrailleRoleDescription: string;
        ariaBusy: string;
        ariaChecked: string;
        ariaColCount: string;
        ariaColIndex: string;
        ariaColIndexText: string;
        ariaColSpan: string;
        ariaControlsElements: null;
        ariaCurrent: string;
        ariaDescribedByElements: null;
        ariaDescription: string;
        ariaDetailsElements: null;
        ariaDisabled: string;
        ariaErrorMessageElements: null;
        ariaExpanded: string;
        ariaFlowToElements: null;
        ariaHasPopup: string;
        ariaHidden: string;
        ariaInvalid: string;
        ariaKeyShortcuts: string;
        ariaLabel: string;
        ariaLabelledByElements: null;
        ariaLevel: string;
        ariaLive: string;
        ariaModal: string;
        ariaMultiLine: string;
        ariaMultiSelectable: string;
        ariaOrientation: string;
        ariaOwnsElements: null;
        ariaPlaceholder: string;
        ariaPosInSet: string;
        ariaPressed: string;
        ariaReadOnly: string;
        ariaRelevant: string;
        ariaRequired: string;
        ariaRoleDescription: string;
        ariaRowCount: string;
        ariaRowIndex: string;
        ariaRowIndexText: string;
        ariaRowSpan: string;
        ariaSelected: string;
        ariaSetSize: string;
        ariaSort: string;
        ariaValueMax: string;
        ariaValueMin: string;
        ariaValueNow: string;
        ariaValueText: string;
        role: string;
        __host: HTMLElement;
        get shadowRoot(): ShadowRoot;
        checkValidity(): boolean;
        form: null;
        labels: NodeListOf<HTMLLabelElement>;
        reportValidity(): boolean;
        setFormValue(): void;
        setValidity(): void;
        states: Set<string>;
        validationMessage: string;
        validity: ValidityState;
        willValidate: boolean;
    };
};
declare const ElementInternalsShimWithRealType: typeof ElementInternals;
export { ElementInternalsShimWithRealType as ElementInternals };
export declare const HYDRATE_INTERNALS_ATTR_PREFIX = "hydrate-internals-";
//# sourceMappingURL=element-internals.d.ts.map