/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var _a;
const MediaListShim = class MediaList extends Array {
    get mediaText() {
        return this.join(', ');
    }
    toString() {
        return this.mediaText;
    }
    appendMedium(medium) {
        if (!this.includes(medium)) {
            this.push(medium);
        }
    }
    deleteMedium(medium) {
        const index = this.indexOf(medium);
        if (index !== -1) {
            this.splice(index, 1);
        }
    }
    item(index) {
        return this[index] ?? null;
    }
};
const MediaListShimWithRealType = MediaListShim;
export { MediaListShimWithRealType as MediaList };
const StyleSheetShim = class StyleSheet {
    constructor() {
        this.__media = new MediaListShim();
        this.disabled = false;
    }
    get href() {
        return null;
    }
    get media() {
        return this.__media;
    }
    get ownerNode() {
        return null;
    }
    get parentStyleSheet() {
        return null;
    }
    get title() {
        return null;
    }
    get type() {
        return 'text/css';
    }
};
const StyleSheetShimWithRealType = StyleSheetShim;
export { StyleSheetShimWithRealType as StyleSheet };
const CSSRuleShim = (_a = class CSSRule {
        constructor() {
            this.STYLE_RULE = 1;
            this.CHARSET_RULE = 2;
            this.IMPORT_RULE = 3;
            this.MEDIA_RULE = 4;
            this.FONT_FACE_RULE = 5;
            this.PAGE_RULE = 6;
            this.NAMESPACE_RULE = 10;
            this.KEYFRAMES_RULE = 7;
            this.KEYFRAME_RULE = 8;
            this.SUPPORTS_RULE = 12;
            this.COUNTER_STYLE_RULE = 11;
            this.FONT_FEATURE_VALUES_RULE = 14;
            this.MARGIN_RULE = 9;
            this.__parentStyleSheet = null;
            this.cssText = '';
        }
        get parentRule() {
            return null;
        }
        get parentStyleSheet() {
            return this.__parentStyleSheet;
        }
        get type() {
            return 0;
        }
    },
    _a.STYLE_RULE = 1,
    _a.CHARSET_RULE = 2,
    _a.IMPORT_RULE = 3,
    _a.MEDIA_RULE = 4,
    _a.FONT_FACE_RULE = 5,
    _a.PAGE_RULE = 6,
    _a.NAMESPACE_RULE = 10,
    _a.KEYFRAMES_RULE = 7,
    _a.KEYFRAME_RULE = 8,
    _a.SUPPORTS_RULE = 12,
    _a.COUNTER_STYLE_RULE = 11,
    _a.FONT_FEATURE_VALUES_RULE = 14,
    _a.MARGIN_RULE = 9,
    _a);
const CSSRuleShimWithRealType = CSSRuleShim;
export { CSSRuleShimWithRealType as CSSRule };
const CSSRuleListShim = class CSSRuleList extends Array {
    item(index) {
        return this[index] ?? null;
    }
};
const CSSRuleListShimWithRealType = CSSRuleListShim;
export { CSSRuleListShimWithRealType as CSSRuleList };
const CSSStyleSheetShim = class CSSStyleSheet extends StyleSheetShim {
    constructor() {
        super(...arguments);
        this.__rules = new CSSRuleListShim();
    }
    get cssRules() {
        return this.__rules;
    }
    get ownerRule() {
        return null;
    }
    get rules() {
        return this.cssRules;
    }
    addRule(_selector, _style, _index) {
        throw new Error('Method not implemented.');
    }
    deleteRule(_index) {
        throw new Error('Method not implemented.');
    }
    insertRule(_rule, _index) {
        throw new Error('Method not implemented.');
    }
    removeRule(_index) {
        throw new Error('Method not implemented.');
    }
    replace(text) {
        this.replaceSync(text);
        return Promise.resolve(this);
    }
    replaceSync(text) {
        this.__rules.length = 0;
        const rule = new CSSRuleShim();
        rule.cssText = text;
        this.__rules.push(rule);
    }
};
const CSSStyleSheetShimWithRealType = CSSStyleSheetShim;
export { CSSStyleSheetShimWithRealType as CSSStyleSheet, CSSStyleSheetShimWithRealType as CSSStyleSheetShim, };
//# sourceMappingURL=css.js.map