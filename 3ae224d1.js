import{E as t}from"./b4be29f1.js";import{f as s}from"./afb8834e.js";import{e as i}from"./05905ff1.js";
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const e=()=>new h;class h{}const o=new WeakMap,n=i(class extends s{render(s){return t}update(s,[i]){const e=i!==this.G;return e&&void 0!==this.G&&this.rt(void 0),(e||this.lt!==this.ct)&&(this.G=i,this.ht=s.options?.host,this.rt(this.ct=s.element)),t}rt(t){if(this.isConnected||(t=void 0),"function"==typeof this.G){const s=this.ht??globalThis;let i=o.get(s);void 0===i&&(i=new WeakMap,o.set(s,i)),void 0!==i.get(this.G)&&this.G.call(this.ht,void 0),i.set(this.G,t),void 0!==t&&this.G.call(this.ht,t)}else this.G.value=t}get lt(){return"function"==typeof this.G?o.get(this.ht??globalThis)?.get(this.G):this.G?.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}});export{e,n};
