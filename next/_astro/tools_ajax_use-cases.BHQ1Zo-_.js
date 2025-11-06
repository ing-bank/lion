const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.DYUong5B.js","_astro/node-tools_providence-analytics_overview.LFFQBZzG.js","_astro/lit-element.qDHKJJma.js","_astro/lit-html.C7L4dwLU.js","_astro/unsafe-html.J0GGe2Q7.js","_astro/directive.CGE4aKEl.js","_astro/define.m2CvvXyF.js"])))=>i.map(i=>d[i]);
import{_ as w}from"./preload-helper.4zY6-HO4.js";import"./node-tools_providence-analytics_overview.LFFQBZzG.js";import"./lit-element.qDHKJJma.js";import{x as i}from"./lit-html.C7L4dwLU.js";import"./unsafe-html.J0GGe2Q7.js";import"./sb-action-logger.2lH_jUdd.js";import{r as l}from"./renderLitAsNode.DRxcIGFy.js";import"./directive.CGE4aKEl.js";async function N(s){if(!s.headers.has("accept-language")){const t=document.documentElement.lang,n=document.documentElement.getAttribute("data-localize-lang")||t||"en";s.headers.set("accept-language",n)}return s}function p(s){if(typeof s!="string")return s;const t=s,e=document.createElement("a");return e.setAttribute("href",t),{protocol:e.protocol?e.protocol.replace(/:$/,""):"",host:e.host}}function j(s,t){const e=p(s),n=p(t);return e.protocol===n.protocol&&e.host===n.host}function F(s,t){const e=typeof s=="string"?p(s):s;return[p(window.location.href)].concat(t.map(p)).some(j.bind(null,e))}function J(s,t=document){const e=t.cookie.match(new RegExp(`(^|;\\s*)(${s})=([^;]*)`));return e?decodeURIComponent(e[3]):null}function H(s,t,e,n=document){async function o(r){const c=J(s,n),a=F(r.url,e);return["POST","PUT","DELETE","PATCH"].includes(r.method)&&a&&c&&r.headers.set(t,c),r}return o}class L{constructor(){this._cachedRequests={},this._size=0}set(t,e,n=0){this._cachedRequests[t]&&this.delete(t),this._cachedRequests[t]={createdAt:Date.now(),size:n,response:e},this._size+=n}get(t,{maxAge:e=1/0,maxResponseSize:n=1/0}={}){const o=c=>Number(c)===c,r=this._cachedRequests[t];if(r&&o(e)&&o(n)&&!(Date.now()>=r.createdAt+e)&&!(r.size>n))return r.response}delete(t){const e=this._cachedRequests[t];e&&(this._size-=e.size,delete this._cachedRequests[t])}deleteMatching(t){Object.keys(this._cachedRequests).forEach(e=>{new RegExp(t).test(e)&&this.delete(e)})}truncateTo(t){if(this._size<=t)return;const e=this._cachedRequests,n=Object.keys(e).sort((o,r)=>e[o].createdAt-e[r].createdAt);for(const o of n)if(this.delete(o),this._size<=t)return}reset(){this._cachedRequests={},this._size=0}}class v{constructor(){this._pendingRequests={}}set(t){if(this._pendingRequests[t])return;let e;const n=new Promise(o=>{e=o});this._pendingRequests[t]={promise:n,resolve:e}}get(t){return this._pendingRequests[t]?.promise}resolve(t){this._pendingRequests[t]?.resolve(),delete this._pendingRequests[t]}resolveMatching(t){Object.keys(this._pendingRequests).forEach(e=>{t.test(e)&&this.resolve(e)})}reset(){this.resolveMatching(/.*/),this._pendingRequests={}}}let x;const g=new L,d=new v,_=s=>s===x,U=s=>{x=s},z=s=>{if(!s)throw new Error("Invalid cache identifier");_(s)||(U(s),g.reset(),d.reset())},G=(s={})=>typeof s=="object"&&s!==null?new URLSearchParams(s).toString():"",M=({url:s="",params:t},e=G)=>{const n=e(t);return n?`${s}?${n}`:s},D=1e3*60*60,O=({useCache:s=!1,methods:t=["get"],maxAge:e=D,requestIdFunction:n=M,invalidateUrls:o,invalidateUrlsRegex:r,contentTypes:c,maxResponseSize:a,maxCacheSize:h})=>({useCache:s,methods:t,maxAge:e,requestIdFunction:n,invalidateUrls:o,invalidateUrlsRegex:r,contentTypes:c,maxResponseSize:a,maxCacheSize:h}),C=({useCache:s,methods:t,maxAge:e,requestIdFunction:n,invalidateUrls:o,invalidateUrlsRegex:r,contentTypes:c,maxResponseSize:a,maxCacheSize:h}={})=>{if(s!==void 0&&typeof s!="boolean")throw new Error("Property `useCache` must be a `boolean`");if(t!==void 0&&JSON.stringify(t)!==JSON.stringify(["get"]))throw new Error("Cache can only be utilized with `GET` method");if(e!==void 0&&!Number.isFinite(e))throw new Error("Property `maxAge` must be a finite `number`");if(o!==void 0&&!Array.isArray(o))throw new Error("Property `invalidateUrls` must be an `Array` or `undefined`");if(r!==void 0&&!(r instanceof RegExp))throw new Error("Property `invalidateUrlsRegex` must be a `RegExp` or `undefined`");if(n!==void 0&&typeof n!="function")throw new Error("Property `requestIdFunction` must be a `function`");if(c!==void 0&&!Array.isArray(c))throw new Error("Property `contentTypes` must be an `Array` or `undefined`");if(a!==void 0&&!Number.isFinite(a))throw new Error("Property `maxResponseSize` must be a finite `number`");if(h!==void 0&&!Number.isFinite(h))throw new Error("Property `maxCacheSize` must be a finite `number`")},B=(s,{invalidateUrls:t,invalidateUrlsRegex:e})=>{g.delete(s),d.resolve(s),Array.isArray(t)&&t.forEach(n=>{g.delete(n),d.resolve(n)}),e&&(g.deleteMatching(e),d.resolveMatching(e))},$=(s,t)=>s.includes(t.toLowerCase()),S=(s,t)=>Array.isArray(t)?!!t.find(e=>String(s.headers.get("Content-Type")).includes(e)):!0,X=async s=>Number(s.headers.get("Content-Length"))||(await s.clone().blob()).size||0,K=(s,t)=>!t||!s?!0:s<=t,V=(s,t)=>async e=>{C(e.cacheOptions);const n=s(),r=typeof n!="string"&&"then"in n?await n:n;z(r);const c=O({...t,...e.cacheOptions}),{useCache:a,requestIdFunction:h,methods:f,contentTypes:k,maxAge:q,maxResponseSize:T}=c;if(e.cacheOptions=c,e.cacheSessionId=r,!a)return e;const b=h(e);if(!$(f,e.method))return B(b,c),e;const R=d.get(b);if(R&&(await R,!_(e.cacheSessionId)))return e;const y=g.get(b,{maxAge:q,maxResponseSize:T});if(y&&S(y,k)){e.cacheOptions=e.cacheOptions??{useCache:!1};const m=y.clone();return m.request=e,m.fromCache=!0,m}return d.set(b),e},Q=s=>async t=>{const e=t;if(!e.request)throw new Error("Missing request in response");const{requestIdFunction:n,methods:o,contentTypes:r,maxResponseSize:c,maxCacheSize:a}=O({...s,...e.request.cacheOptions});if(!e.fromCache&&$(o,e.request.method)){const h=n(e.request),f=a||c?await X(e):0;_(e.request.cacheSessionId)&&S(e,r)&&K(f,c)&&(g.set(h,e.clone(),f),a&&g.truncateTo(a)),d.resolve(h)}return e},A=(s,t)=>{C(t);const e=V(s,t),n=Q(t);return{cacheRequestInterceptor:e,cacheResponseInterceptor:n}};class I extends Error{constructor(t,e,n){super(`Fetch request to ${t.url} failed with status ${e.status} ${e.statusText}`),this.name="AjaxFetchError",this.request=t,this.response=e,this.body=n}}function E(s){return s.status>=400&&s.status<600}class W{constructor(t={}){this.__config={addAcceptLanguage:!0,addCaching:!1,xsrfCookieName:"XSRF-TOKEN",xsrfHeaderName:"X-XSRF-TOKEN",xsrfTrustedOrigins:[],jsonPrefix:"",...t,cacheOptions:{getCacheIdentifier:()=>"_default",...t.cacheOptions}},this._requestInterceptors=[],this._responseInterceptors=[],this._responseJsonInterceptors=[],this.__config.addAcceptLanguage&&this.addRequestInterceptor(N);const{xsrfCookieName:e,xsrfHeaderName:n,xsrfTrustedOrigins:o}=this.__config;e&&n&&o&&this.addRequestInterceptor(H(e,n,o));const r=this.__config.cacheOptions;if((r&&r.useCache||this.__config.addCaching)&&r.getCacheIdentifier){const{cacheRequestInterceptor:c,cacheResponseInterceptor:a}=A(r.getCacheIdentifier,r);this.addRequestInterceptor(c),this.addResponseInterceptor(a)}}set options(t){this.__config=t}get options(){return this.__config}addRequestInterceptor(t){this._requestInterceptors.push(t)}removeRequestInterceptor(t){this._requestInterceptors=this._requestInterceptors.filter(e=>e!==t)}addResponseInterceptor(t){this._responseInterceptors.push(t)}removeResponseInterceptor(t){this._responseInterceptors=this._responseInterceptors.filter(e=>e!==t)}addResponseJsonInterceptor(t){this._responseJsonInterceptors.push(t)}async fetch(t,e,n=!1){const o=new Request(t,{...e});o.cacheOptions=e?.cacheOptions,o.params=e?.params;const r=await this.__interceptRequest(o);if(r instanceof Response){const h=r;if(h.request=o,E(r))throw new I(o,h,n?await this.__attemptParseFailedResponseBody(h):void 0);return h}const c=await fetch(r);c.request=r;const a=await this.__interceptResponse(c);if(E(a))throw new I(o,c,n?await this.__attemptParseFailedResponseBody(c):void 0);return a}async fetchJson(t,e){const n={...e,headers:{...e?.headers,accept:"application/json"}};n?.body&&(n.headers["content-type"]="application/json",n.body=JSON.stringify(n.body));const o=n,r=await this.fetch(t,o,!0);let c=await this.__parseBody(r);return typeof c=="object"&&(c=await this.__interceptResponseJson(c,r)),{response:r,body:c}}async __parseBody(t){let e=await t.clone().text();const{jsonPrefix:n}=this.__config;typeof n=="string"&&e.startsWith(n)&&(e=e.substring(n.length));let o=e;if(o.length&&(!t.headers.get("content-type")||t.headers.get("content-type")?.includes("json")))try{o=JSON.parse(e)}catch{throw new Error(`Failed to parse response from ${t.url} as JSON.`)}else o=e;return o}async __attemptParseFailedResponseBody(t){let e;try{e=await this.__parseBody(t)}catch{}return e}async __interceptRequest(t){let e=t;for(const n of this._requestInterceptors){const o=await n(e);if(o instanceof Request)e=o;else return this.__interceptResponse(o)}return e}async __interceptResponse(t){let e=t;for(const n of this._responseInterceptors)e=await n(e);return e}async __interceptResponseJson(t,e){let n=t;for(const o of this._responseJsonInterceptors)n=await o(n,e);return n}}const u=new W,Y=()=>{let s=localStorage.getItem("lion-ajax-cache-demo-user-id");return s||(localStorage.setItem("lion-ajax-cache-demo-user-id","1"),s="1"),s},Z=1e3*60*10,ee={useCache:!0,maxAge:Z},{cacheRequestInterceptor:te,cacheResponseInterceptor:se}=A(Y,ee);u.addRequestInterceptor(te);u.addResponseInterceptor(se);const ne=()=>{const s=l(i`<sb-action-logger></sb-action-logger>`),t=e=>{u.fetch(`../assets/${e}.json`).then(n=>n.json()).then(n=>{s.log(JSON.stringify(n,null,2))})};return i`
    <style>
      sb-action-logger {
        --sb-action-logger-max-height: 300px;
      }
    </style>
    <button @click="${()=>t("pabu")}">Fetch Pabu</button>
    <button @click="${()=>t("naga")}">Fetch Naga</button>
    ${s}
  `},oe=()=>{const s=l(i`<sb-action-logger></sb-action-logger>`),t=e=>{u.fetchJson(`../assets/${e}.json`).then(n=>{console.log(n.response),s.log(JSON.stringify(n.body,null,2))})};return i`
    <style>
      sb-action-logger {
        --sb-action-logger-max-height: 300px;
      }
    </style>
    <button @click="${()=>t("pabu")}">Fetch Pabu</button>
    <button @click="${()=>t("naga")}">Fetch Naga</button>
    ${s}
  `},re=()=>{const s=l(i`<sb-action-logger></sb-action-logger>`);return i`
    <style>
      sb-action-logger {
        --sb-action-logger-max-height: 300px;
      }
    </style>
    <button @click="${async()=>{try{const e=await u.fetchJson("/api/users")}catch(e){e.response&&e.response.status===400||s.log(e)}}}">Fetch</button>
    ${s}
  `},ce=()=>{const s=l(i`<sb-action-logger></sb-action-logger>`),t=e=>{u.fetchJson(`../assets/${e}.json`).then(n=>{s.log(`From cache: ${n.response.fromCache||!1}`),s.log(JSON.stringify(n.body,null,2))})};return i`
    <style>
      sb-action-logger {
        --sb-action-logger-max-height: 300px;
      }
    </style>
    <button @click="${()=>t("pabu")}">Fetch Pabu</button>
    <button @click="${()=>t("naga")}">Fetch Naga</button>
    ${s}
  `},ie=()=>{const s=l(i`<sb-action-logger></sb-action-logger>`),t=e=>{let n;e==="naga"&&(n={useCache:!1}),u.fetchJson(`../assets/${e}.json`,{cacheOptions:n}).then(o=>{s.log(`From cache: ${o.response.fromCache||!1}`),s.log(JSON.stringify(o.body,null,2))})};return i`
    <style>
      sb-action-logger {
        --sb-action-logger-max-height: 300px;
      }
    </style>
    <button @click="${()=>t("pabu")}">Fetch Pabu</button>
    <button @click="${()=>t("naga")}">Fetch Naga</button>
    ${s}
  `},ae=()=>{const s=l(i`<sb-action-logger></sb-action-logger>`);return i`
    <style>
      sb-action-logger {
        --sb-action-logger-max-height: 300px;
      }
    </style>
    <button @click="${()=>{u.fetchJson("../assets/pabu.json",{cacheOptions:{maxAge:1e3*3}}).then(e=>{s.log(`From cache: ${e.response.fromCache||!1}`),s.log(JSON.stringify(e.body,null,2))})}}">Fetch Pabu</button>
    ${s}
  `},he=()=>{const s=l(i`<sb-action-logger></sb-action-logger>`);return i`
    <style>
      sb-action-logger {
        --sb-action-logger-max-height: 300px;
      }
    </style>
    <button @click="${()=>{u.fetchJson("../assets/pabu.json").then(n=>{s.log(`From cache: ${n.response.fromCache||!1}`),s.log(JSON.stringify(n.body,null,2))})}}">Fetch Pabu</button>
    <button @click="${()=>{const n=parseInt(localStorage.getItem("lion-ajax-cache-demo-user-id"),10);localStorage.setItem("lion-ajax-cache-demo-user-id",`${n+1}`)}}">Change user</button>
    ${s}
  `},ue=()=>{const s=l(i`<sb-action-logger></sb-action-logger>`),t=(e,n)=>{u.fetchJson(`../assets/${e}.json`,{method:n}).then(o=>{s.log(`From cache: ${o.response.fromCache||!1}`),s.log(JSON.stringify(o.body,null,2))})};return i`
    <style>
      sb-action-logger {
        --sb-action-logger-max-height: 300px;
      }
    </style>
    <button @click="${()=>t("pabu","GET")}">GET Pabu</button>
    <button @click="${()=>t("pabu","PATCH")}">PATCH Pabu</button>
    <button @click="${()=>t("naga","GET")}">GET Naga</button>
    <button @click="${()=>t("naga","PATCH")}">PATCH Naga</button>
    ${s}
  `},le=()=>{const s=l(i`<sb-action-logger></sb-action-logger>`),t=(e,n)=>{const o={};e==="pabu"&&(o.invalidateUrlsRegex=/\/docs\/tools\/ajax\/assets\/naga.json/),u.fetchJson(`../assets/${e}.json`,{method:n,cacheOptions:o}).then(r=>{s.log(`From cache: ${r.response.fromCache||!1}`),s.log(JSON.stringify(r.body,null,2))})};return i`
    <style>
      sb-action-logger {
        --sb-action-logger-max-height: 300px;
      }
    </style>
    <button @click="${()=>t("pabu","GET")}">GET Pabu</button>
    <button @click="${()=>t("pabu","PATCH")}">PATCH Pabu</button>
    <button @click="${()=>t("naga","GET")}">GET Naga</button>
    <button @click="${()=>t("naga","PATCH")}">PATCH Naga</button>
    ${s}
  `},ge=document,de=[{key:"getRequest",story:ne},{key:"getJsonRequest",story:oe},{key:"errorHandling",story:re},{key:"cache",story:ce},{key:"cacheActionOptions",story:ie},{key:"cacheMaxAge",story:ae},{key:"changeCacheIdentifier",story:he},{key:"nonGETRequest",story:ue},{key:"invalidateRules",story:le}];let P=!1;for(const s of de){const t=ge.querySelector(`[mdjs-story-name="${s.key}"]`);t&&(t.story=s.story,t.key=s.key,P=!0,Object.assign(t,{simulatorUrl:"/next/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}P&&(customElements.get("mdjs-preview")||w(()=>import("./define.DYUong5B.js"),__vite__mapDeps([0,1,2,3,4,5])),customElements.get("mdjs-story")||w(()=>import("./define.m2CvvXyF.js"),__vite__mapDeps([6,2,3])));export{ce as cache,ie as cacheActionOptions,ae as cacheMaxAge,he as changeCacheIdentifier,re as errorHandling,oe as getJsonRequest,ne as getRequest,le as invalidateRules,ue as nonGETRequest};
