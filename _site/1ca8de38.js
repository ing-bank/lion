import"./24f95583.js";import{x as e}from"./b4be29f1.js";import"./05905ff1.js";import"./dfb90d18.js";import{r as t}from"./9795287e.js";async function s(e){if(!e.headers.has("accept-language")){const t=document.documentElement.lang,s=document.documentElement.getAttribute("data-localize-lang")||t||"en";e.headers.set("accept-language",s)}return e}function o(e){if("string"!=typeof e)return e;const t=e,s=document.createElement("a");return s.setAttribute("href",t),{protocol:s.protocol?s.protocol.replace(/:$/,""):"",host:s.host}}function n(e,t){const s=o(e),n=o(t);return s.protocol===n.protocol&&s.host===n.host}function r(e,t){const s="string"==typeof e?o(e):e;return[o(window.location.href)].concat(t.map(o)).some(n.bind(null,s))}function a(e,t,s,o=document){return async function(n){const a=function(e,t=document){const s=t.cookie.match(new RegExp(`(^|;\\s*)(${e})=([^;]*)`));return s?decodeURIComponent(s[3]):null}(e,o),c=r(n.url,s);return["POST","PUT","DELETE","PATCH"].includes(n.method)&&c&&a&&n.headers.set(t,a),n}}let c;const i=new class{constructor(){this._cachedRequests={},this._size=0}set(e,t,s=0){this._cachedRequests[e]&&this.delete(e),this._cachedRequests[e]={createdAt:Date.now(),size:s,response:t},this._size+=s}get(e,{maxAge:t=1/0,maxResponseSize:s=1/0}={}){const o=e=>Number(e)===e,n=this._cachedRequests[e];if(n&&o(t)&&o(s)&&!(Date.now()>=n.createdAt+t||n.size>s))return n.response}delete(e){const t=this._cachedRequests[e];t&&(this._size-=t.size,delete this._cachedRequests[e])}deleteMatching(e){Object.keys(this._cachedRequests).forEach(t=>{new RegExp(e).test(t)&&this.delete(t)})}truncateTo(e){if(this._size<=e)return;const t=this._cachedRequests,s=Object.keys(t).sort((e,s)=>t[e].createdAt-t[s].createdAt);for(const t of s)if(this.delete(t),this._size<=e)return}reset(){this._cachedRequests={},this._size=0}},u=new class{constructor(){this._pendingRequests={}}set(e){if(this._pendingRequests[e])return;let t;const s=new Promise(e=>{t=e});this._pendingRequests[e]={promise:s,resolve:t}}get(e){return this._pendingRequests[e]?.promise}resolve(e){this._pendingRequests[e]?.resolve(),delete this._pendingRequests[e]}resolveMatching(e){Object.keys(this._pendingRequests).forEach(t=>{e.test(t)&&this.resolve(t)})}reset(){this.resolveMatching(/.*/),this._pendingRequests={}}},h=e=>e===c,l=e=>{if(!e)throw new Error("Invalid cache identifier");h(e)||(c=e,i.reset(),u.reset())},g=(e={})=>"object"==typeof e&&null!==e?new URLSearchParams(e).toString():"",p=({url:e="",params:t},s=g)=>{const o=s(t);return o?`${e}?${o}`:e},d=({useCache:e=!1,methods:t=["get"],maxAge:s=36e5,requestIdFunction:o=p,invalidateUrls:n,invalidateUrlsRegex:r,contentTypes:a,maxResponseSize:c,maxCacheSize:i})=>({useCache:e,methods:t,maxAge:s,requestIdFunction:o,invalidateUrls:n,invalidateUrlsRegex:r,contentTypes:a,maxResponseSize:c,maxCacheSize:i}),b=({useCache:e,methods:t,maxAge:s,requestIdFunction:o,invalidateUrls:n,invalidateUrlsRegex:r,contentTypes:a,maxResponseSize:c,maxCacheSize:i}={})=>{if(void 0!==e&&"boolean"!=typeof e)throw new Error("Property `useCache` must be a `boolean`");if(void 0!==t&&JSON.stringify(t)!==JSON.stringify(["get"]))throw new Error("Cache can only be utilized with `GET` method");if(void 0!==s&&!Number.isFinite(s))throw new Error("Property `maxAge` must be a finite `number`");if(void 0!==n&&!Array.isArray(n))throw new Error("Property `invalidateUrls` must be an `Array` or `undefined`");if(void 0!==r&&!(r instanceof RegExp))throw new Error("Property `invalidateUrlsRegex` must be a `RegExp` or `undefined`");if(void 0!==o&&"function"!=typeof o)throw new Error("Property `requestIdFunction` must be a `function`");if(void 0!==a&&!Array.isArray(a))throw new Error("Property `contentTypes` must be an `Array` or `undefined`");if(void 0!==c&&!Number.isFinite(c))throw new Error("Property `maxResponseSize` must be a finite `number`");if(void 0!==i&&!Number.isFinite(i))throw new Error("Property `maxCacheSize` must be a finite `number`")},f=(e,t)=>e.includes(t.toLowerCase()),m=(e,t)=>!Array.isArray(t)||!!t.find(t=>String(e.headers.get("Content-Type")).includes(t)),y=(e,t)=>async s=>{b(s.cacheOptions);const o=e(),n="string"!=typeof o&&"then"in o?await o:o;l(n);const r=d({...t,...s.cacheOptions}),{useCache:a,requestIdFunction:c,methods:g,contentTypes:p,maxAge:y,maxResponseSize:_}=r;if(s.cacheOptions=r,s.cacheSessionId=n,!a)return s;const R=c(s);if(!f(g,s.method))return((e,{invalidateUrls:t,invalidateUrlsRegex:s})=>{i.delete(e),u.resolve(e),Array.isArray(t)&&t.forEach(e=>{i.delete(e),u.resolve(e)}),s&&(i.deleteMatching(s),u.resolveMatching(s))})(R,r),s;const x=u.get(R);if(x&&(await x,!h(s.cacheSessionId)))return s;const w=i.get(R,{maxAge:y,maxResponseSize:_});if(w&&m(w,p)){s.cacheOptions=s.cacheOptions??{useCache:!1};const e=w.clone();return e.request=s,e.fromCache=!0,e}return u.set(R),s},_=e=>async t=>{const s=t;if(!s.request)throw new Error("Missing request in response");const{requestIdFunction:o,methods:n,contentTypes:r,maxResponseSize:a,maxCacheSize:c}=d({...e,...s.request.cacheOptions});if(!s.fromCache&&f(n,s.request.method)){const e=o(s.request),t=c||a?await(async e=>Number(e.headers.get("Content-Length"))||(await e.clone().blob()).size||0)(s):0;h(s.request.cacheSessionId)&&m(s,r)&&((e,t)=>!t||!e||e<=t)(t,a)&&(i.set(e,s.clone(),t),c&&i.truncateTo(c)),u.resolve(e)}return s},R=(e,t)=>{b(t);return{cacheRequestInterceptor:y(e,t),cacheResponseInterceptor:_(t)}};class x extends Error{constructor(e,t,s){super(`Fetch request to ${e.url} failed with status ${t.status} ${t.statusText}`),this.name="AjaxFetchError",this.request=e,this.response=t,this.body=s}}function w(e){return e.status>=400&&e.status<600}const q=new class{constructor(e={}){this.__config={addAcceptLanguage:!0,addCaching:!1,xsrfCookieName:"XSRF-TOKEN",xsrfHeaderName:"X-XSRF-TOKEN",xsrfTrustedOrigins:[],jsonPrefix:"",...e,cacheOptions:{getCacheIdentifier:()=>"_default",...e.cacheOptions}},this._requestInterceptors=[],this._responseInterceptors=[],this._responseJsonInterceptors=[],this.__config.addAcceptLanguage&&this.addRequestInterceptor(s);const{xsrfCookieName:t,xsrfHeaderName:o,xsrfTrustedOrigins:n}=this.__config;t&&o&&n&&this.addRequestInterceptor(a(t,o,n));const r=this.__config.cacheOptions;if((r&&r.useCache||this.__config.addCaching)&&r.getCacheIdentifier){const{cacheRequestInterceptor:e,cacheResponseInterceptor:t}=R(r.getCacheIdentifier,r);this.addRequestInterceptor(e),this.addResponseInterceptor(t)}}set options(e){this.__config=e}get options(){return this.__config}addRequestInterceptor(e){this._requestInterceptors.push(e)}removeRequestInterceptor(e){this._requestInterceptors=this._requestInterceptors.filter(t=>t!==e)}addResponseInterceptor(e){this._responseInterceptors.push(e)}removeResponseInterceptor(e){this._responseInterceptors=this._responseInterceptors.filter(t=>t!==e)}addResponseJsonInterceptor(e){this._responseJsonInterceptors.push(e)}async fetch(e,t,s=!1){const o=new Request(e,{...t});o.cacheOptions=t?.cacheOptions,o.params=t?.params;const n=await this.__interceptRequest(o);if(n instanceof Response){const e=n;if(e.request=o,w(n))throw new x(o,e,s?await this.__attemptParseFailedResponseBody(e):void 0);return e}const r=await fetch(n);r.request=n;const a=await this.__interceptResponse(r);if(w(a))throw new x(o,r,s?await this.__attemptParseFailedResponseBody(r):void 0);return a}async fetchJson(e,t){const s={...t,headers:{...t?.headers,accept:"application/json"}};s?.body&&(s.headers["content-type"]="application/json",s.body=JSON.stringify(s.body));const o=s,n=await this.fetch(e,o,!0);let r=await this.__parseBody(n);return"object"==typeof r&&(r=await this.__interceptResponseJson(r,n)),{response:n,body:r}}async __parseBody(e){let t=await e.clone().text();const{jsonPrefix:s}=this.__config;"string"==typeof s&&t.startsWith(s)&&(t=t.substring(s.length));let o=t;if(!o.length||e.headers.get("content-type")&&!e.headers.get("content-type")?.includes("json"))o=t;else try{o=JSON.parse(t)}catch(t){throw new Error(`Failed to parse response from ${e.url} as JSON.`)}return o}async __attemptParseFailedResponseBody(e){let t;try{t=await this.__parseBody(e)}catch(e){}return t}async __interceptRequest(e){let t=e;for(const e of this._requestInterceptors){const s=await e(t);if(!(s instanceof Request))return this.__interceptResponse(s);t=s}return t}async __interceptResponse(e){let t=e;for(const e of this._responseInterceptors)t=await e(t);return t}async __interceptResponseJson(e,t){let s=e;for(const e of this._responseJsonInterceptors)s=await e(s,t);return s}},$={useCache:!0,maxAge:6e5},{cacheRequestInterceptor:I,cacheResponseInterceptor:C}=R(()=>{let e=localStorage.getItem("lion-ajax-cache-demo-user-id");return e||(localStorage.setItem("lion-ajax-cache-demo-user-id","1"),e="1"),e},$);q.addRequestInterceptor(I),q.addResponseInterceptor(C);const E=()=>{const s=t(e`<sb-action-logger></sb-action-logger>`),o=e=>{q.fetch(`../assets/${e}.json`).then(e=>e.json()).then(e=>{s.log(JSON.stringify(e,null,2))})};return e`
    <style>
      sb-action-logger {
        --sb-action-logger-max-height: 300px;
      }
    </style>
    <button @click="${()=>o("pabu")}">Fetch Pabu</button>
    <button @click="${()=>o("naga")}">Fetch Naga</button>
    ${s}
  `},k=()=>{const s=t(e`<sb-action-logger></sb-action-logger>`),o=e=>{q.fetchJson(`../assets/${e}.json`).then(e=>{console.log(e.response),s.log(JSON.stringify(e.body,null,2))})};return e`
    <style>
      sb-action-logger {
        --sb-action-logger-max-height: 300px;
      }
    </style>
    <button @click="${()=>o("pabu")}">Fetch Pabu</button>
    <button @click="${()=>o("naga")}">Fetch Naga</button>
    ${s}
  `},S=()=>{const s=t(e`<sb-action-logger></sb-action-logger>`);return e`
    <style>
      sb-action-logger {
        --sb-action-logger-max-height: 300px;
      }
    </style>
    <button @click="${async()=>{try{await q.fetchJson("/api/users")}catch(e){e.response&&400===e.response.status||s.log(e)}}}">Fetch</button>
    ${s}
  `},A=()=>{const s=t(e`<sb-action-logger></sb-action-logger>`),o=e=>{q.fetchJson(`../assets/${e}.json`).then(e=>{s.log(`From cache: ${e.response.fromCache||!1}`),s.log(JSON.stringify(e.body,null,2))})};return e`
    <style>
      sb-action-logger {
        --sb-action-logger-max-height: 300px;
      }
    </style>
    <button @click="${()=>o("pabu")}">Fetch Pabu</button>
    <button @click="${()=>o("naga")}">Fetch Naga</button>
    ${s}
  `},j=()=>{const s=t(e`<sb-action-logger></sb-action-logger>`),o=e=>{let t;"naga"===e&&(t={useCache:!1}),q.fetchJson(`../assets/${e}.json`,{cacheOptions:t}).then(e=>{s.log(`From cache: ${e.response.fromCache||!1}`),s.log(JSON.stringify(e.body,null,2))})};return e`
    <style>
      sb-action-logger {
        --sb-action-logger-max-height: 300px;
      }
    </style>
    <button @click="${()=>o("pabu")}">Fetch Pabu</button>
    <button @click="${()=>o("naga")}">Fetch Naga</button>
    ${s}
  `},v=()=>{const s=t(e`<sb-action-logger></sb-action-logger>`);return e`
    <style>
      sb-action-logger {
        --sb-action-logger-max-height: 300px;
      }
    </style>
    <button @click="${()=>{q.fetchJson("../assets/pabu.json",{cacheOptions:{maxAge:3e3}}).then(e=>{s.log(`From cache: ${e.response.fromCache||!1}`),s.log(JSON.stringify(e.body,null,2))})}}">Fetch Pabu</button>
    ${s}
  `},O=()=>{const s=t(e`<sb-action-logger></sb-action-logger>`);return e`
    <style>
      sb-action-logger {
        --sb-action-logger-max-height: 300px;
      }
    </style>
    <button @click="${()=>{q.fetchJson("../assets/pabu.json").then(e=>{s.log(`From cache: ${e.response.fromCache||!1}`),s.log(JSON.stringify(e.body,null,2))})}}">Fetch Pabu</button>
    <button @click="${()=>{const e=parseInt(localStorage.getItem("lion-ajax-cache-demo-user-id"),10);localStorage.setItem("lion-ajax-cache-demo-user-id",`${e+1}`)}}">Change user</button>
    ${s}
  `},P=()=>{const s=t(e`<sb-action-logger></sb-action-logger>`),o=(e,t)=>{q.fetchJson(`../assets/${e}.json`,{method:t}).then(e=>{s.log(`From cache: ${e.response.fromCache||!1}`),s.log(JSON.stringify(e.body,null,2))})};return e`
    <style>
      sb-action-logger {
        --sb-action-logger-max-height: 300px;
      }
    </style>
    <button @click="${()=>o("pabu","GET")}">GET Pabu</button>
    <button @click="${()=>o("pabu","PATCH")}">PATCH Pabu</button>
    <button @click="${()=>o("naga","GET")}">GET Naga</button>
    <button @click="${()=>o("naga","PATCH")}">PATCH Naga</button>
    ${s}
  `},T=()=>{const s=t(e`<sb-action-logger></sb-action-logger>`),o=(e,t)=>{const o={};"pabu"===e&&(o.invalidateUrlsRegex=/\/docs\/tools\/ajax\/assets\/naga.json/),q.fetchJson(`../assets/${e}.json`,{method:t,cacheOptions:o}).then(e=>{s.log(`From cache: ${e.response.fromCache||!1}`),s.log(JSON.stringify(e.body,null,2))})};return e`
    <style>
      sb-action-logger {
        --sb-action-logger-max-height: 300px;
      }
    </style>
    <button @click="${()=>o("pabu","GET")}">GET Pabu</button>
    <button @click="${()=>o("pabu","PATCH")}">PATCH Pabu</button>
    <button @click="${()=>o("naga","GET")}">GET Naga</button>
    <button @click="${()=>o("naga","PATCH")}">PATCH Naga</button>
    ${s}
  `},F=document,N=[{key:"getRequest",story:E},{key:"getJsonRequest",story:k},{key:"errorHandling",story:S},{key:"cache",story:A},{key:"cacheActionOptions",story:j},{key:"cacheMaxAge",story:v},{key:"changeCacheIdentifier",story:O},{key:"nonGETRequest",story:P},{key:"invalidateRules",story:T}];let J=!1;for(const e of N){const t=F.querySelector(`[mdjs-story-name="${e.key}"]`);t&&(t.story=e.story,t.key=e.key,J=!0,Object.assign(t,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}J&&(customElements.get("mdjs-preview")||import("./a7b4f51b.js"),customElements.get("mdjs-story")||import("./cddf006a.js"));export{A as cache,j as cacheActionOptions,v as cacheMaxAge,O as changeCacheIdentifier,S as errorHandling,k as getJsonRequest,E as getRequest,T as invalidateRules,P as nonGETRequest};
