import{E as e,T as s}from"./lit-html.C7L4dwLU.js";import{i as n,t as o}from"./directive.CGE4aKEl.js";/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class r extends n{constructor(t){if(super(t),this.it=e,t.type!==o.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(t){if(t===e||t==null)return this._t=void 0,this.it=t;if(t===s)return t;if(typeof t!="string")throw Error(this.constructor.directiveName+"() called with a non-string value");if(t===this.it)return this._t;this.it=t;const i=[t];return i.raw=i,this._t={_$litType$:this.constructor.resultType,strings:i,values:[]}}}r.directiveName="unsafeHTML",r.resultType=1;
