import{E as t,T as r}from"./b4be29f1.js";
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const i={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},e=t=>(...r)=>({_$litDirective$:t,values:r});class s{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,r,i){this._$Ct=t,this._$AM=r,this._$Ci=i}_$AS(t,r){return this.update(t,r)}update(t,r){return this.render(...r)}}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class n extends s{constructor(r){if(super(r),this.it=t,r.type!==i.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(i){if(i===t||null==i)return this._t=void 0,this.it=i;if(i===r)return i;if("string"!=typeof i)throw Error(this.constructor.directiveName+"() called with a non-string value");if(i===this.it)return this._t;this.it=i;const e=[i];return e.raw=e,this._t={_$litType$:this.constructor.resultType,strings:e,values:[]}}}n.directiveName="unsafeHTML",n.resultType=1;export{e,s as i,i as t};
