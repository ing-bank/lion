const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.BWpRLYnc.js","_astro/MdJsPreview.CainKAmn.js","_astro/lit-element.B1EQMsFJ.js","_astro/lit-html.BX7rm8u-.js","_astro/dedupeMixin.6XPTJgK8.js","_astro/LionAccordion.CCw3hAmZ.js","_astro/lit-element.BOikny4r.js","_astro/uuid.DjYKNjre.js","_astro/define.BPRa0k46.js"])))=>i.map(i=>d[i]);
import{_ as w}from"./preload-helper.DOA02mLT.js";import"./MdJsPreview.CainKAmn.js";import"./lit-element.B1EQMsFJ.js";import{b as i}from"./lit-html.BX7rm8u-.js";import"./node-tools_providence-analytics_overview.BQH7j7jT.js";import"./sb-action-logger.CbfRp3mN.js";import{r as l}from"./renderLitAsNode.CP1JjoKs.js";async function N(n){if(!n.headers.has("accept-language")){const t=document.documentElement.lang,s=document.documentElement.getAttribute("data-localize-lang")||t||"en";n.headers.set("accept-language",s)}return n}function p(n){if(typeof n!="string")return n;const t=n,e=document.createElement("a");return e.setAttribute("href",t),{protocol:e.protocol?e.protocol.replace(/:$/,""):"",host:e.host}}function j(n,t){const e=p(n),s=p(t);return e.protocol===s.protocol&&e.host===s.host}function F(n,t){const e=typeof n=="string"?p(n):n;return[p(window.location.href)].concat(t.map(p)).some(j.bind(null,e))}function J(n,t=document){const e=t.cookie.match(new RegExp(`(^|;\\s*)(${n})=([^;]*)`));return e?decodeURIComponent(e[3]):null}function H(n,t,e,s=document){async function o(r){const c=J(n,s),a=F(r.url,e);return["POST","PUT","DELETE","PATCH"].includes(r.method)&&a&&c&&r.headers.set(t,c),r}return o}class L{constructor(){this._cachedRequests={},this._size=0}set(t,e,s=0){this._cachedRequests[t]&&this.delete(t),this._cachedRequests[t]={createdAt:Date.now(),size:s,response:e},this._size+=s}get(t,{maxAge:e=1/0,maxResponseSize:s=1/0}={}){const o=c=>Number(c)===c,r=this._cachedRequests[t];if(r&&o(e)&&o(s)&&!(Date.now()>=r.createdAt+e)&&!(r.size>s))return r.response}delete(t){const e=this._cachedRequests[t];e&&(this._size-=e.size,delete this._cachedRequests[t])}deleteMatching(t){Object.keys(this._cachedRequests).forEach(e=>{new RegExp(t).test(e)&&this.delete(e)})}truncateTo(t){if(this._size<=t)return;const e=this._cachedRequests,s=Object.keys(e).sort((o,r)=>e[o].createdAt-e[r].createdAt);for(const o of s)if(this.delete(o),this._size<=t)return}reset(){this._cachedRequests={},this._size=0}}class v{constructor(){this._pendingRequests={}}set(t){if(this._pendingRequests[t])return;let e;const s=new Promise(o=>{e=o});this._pendingRequests[t]={promise:s,resolve:e}}get(t){return this._pendingRequests[t]?.promise}resolve(t){this._pendingRequests[t]?.resolve(),delete this._pendingRequests[t]}resolveMatching(t){Object.keys(this._pendingRequests).forEach(e=>{t.test(e)&&this.resolve(e)})}reset(){this.resolveMatching(/.*/),this._pendingRequests={}}}let O;const g=new L,d=new v,_=n=>n===O,U=n=>{O=n},z=n=>{if(!n)throw new Error("Invalid cache identifier");_(n)||(U(n),g.reset(),d.reset())},G=(n={})=>typeof n=="object"&&n!==null?new URLSearchParams(n).toString():"",M=({url:n="",params:t},e=G)=>{const s=e(t);return s?`${n}?${s}`:n},D=1e3*60*60,x=({useCache:n=!1,methods:t=["get"],maxAge:e=D,requestIdFunction:s=M,invalidateUrls:o,invalidateUrlsRegex:r,contentTypes:c,maxResponseSize:a,maxCacheSize:h})=>({useCache:n,methods:t,maxAge:e,requestIdFunction:s,invalidateUrls:o,invalidateUrlsRegex:r,contentTypes:c,maxResponseSize:a,maxCacheSize:h}),C=({useCache:n,methods:t,maxAge:e,requestIdFunction:s,invalidateUrls:o,invalidateUrlsRegex:r,contentTypes:c,maxResponseSize:a,maxCacheSize:h}={})=>{if(n!==void 0&&typeof n!="boolean")throw new Error("Property `useCache` must be a `boolean`");if(t!==void 0&&JSON.stringify(t)!==JSON.stringify(["get"]))throw new Error("Cache can only be utilized with `GET` method");if(e!==void 0&&!Number.isFinite(e))throw new Error("Property `maxAge` must be a finite `number`");if(o!==void 0&&!Array.isArray(o))throw new Error("Property `invalidateUrls` must be an `Array` or `undefined`");if(r!==void 0&&!(r instanceof RegExp))throw new Error("Property `invalidateUrlsRegex` must be a `RegExp` or `undefined`");if(s!==void 0&&typeof s!="function")throw new Error("Property `requestIdFunction` must be a `function`");if(c!==void 0&&!Array.isArray(c))throw new Error("Property `contentTypes` must be an `Array` or `undefined`");if(a!==void 0&&!Number.isFinite(a))throw new Error("Property `maxResponseSize` must be a finite `number`");if(h!==void 0&&!Number.isFinite(h))throw new Error("Property `maxCacheSize` must be a finite `number`")},B=(n,{invalidateUrls:t,invalidateUrlsRegex:e})=>{g.delete(n),d.resolve(n),Array.isArray(t)&&t.forEach(s=>{g.delete(s),d.resolve(s)}),e&&(g.deleteMatching(e),d.resolveMatching(e))},$=(n,t)=>n.includes(t.toLowerCase()),S=(n,t)=>Array.isArray(t)?!!t.find(e=>String(n.headers.get("Content-Type")).includes(e)):!0,X=async n=>Number(n.headers.get("Content-Length"))||(await n.clone().blob()).size||0,K=(n,t)=>!t||!n?!0:n<=t,V=(n,t)=>async e=>{C(e.cacheOptions);const s=n(),r=typeof s!="string"&&"then"in s?await s:s;z(r);const c=x({...t,...e.cacheOptions}),{useCache:a,requestIdFunction:h,methods:f,contentTypes:k,maxAge:q,maxResponseSize:T}=c;if(e.cacheOptions=c,e.cacheSessionId=r,!a)return e;const b=h(e);if(!$(f,e.method))return B(b,c),e;const R=d.get(b);if(R&&(await R,!_(e.cacheSessionId)))return e;const y=g.get(b,{maxAge:q,maxResponseSize:T});if(y&&S(y,k)){e.cacheOptions=e.cacheOptions??{useCache:!1};const m=y.clone();return m.request=e,m.fromCache=!0,m}return d.set(b),e},Q=n=>async t=>{const e=t;if(!e.request)throw new Error("Missing request in response");const{requestIdFunction:s,methods:o,contentTypes:r,maxResponseSize:c,maxCacheSize:a}=x({...n,...e.request.cacheOptions});if(!e.fromCache&&$(o,e.request.method)){const h=s(e.request),f=a||c?await X(e):0;_(e.request.cacheSessionId)&&S(e,r)&&K(f,c)&&(g.set(h,e.clone(),f),a&&g.truncateTo(a)),d.resolve(h)}return e},A=(n,t)=>{C(t);const e=V(n,t),s=Q(t);return{cacheRequestInterceptor:e,cacheResponseInterceptor:s}};class I extends Error{constructor(t,e,s){super(`Fetch request to ${t.url} failed with status ${e.status} ${e.statusText}`),this.name="AjaxFetchError",this.request=t,this.response=e,this.body=s}}function E(n){return n.status>=400&&n.status<600}class W{constructor(t={}){this.__config={addAcceptLanguage:!0,addCaching:!1,xsrfCookieName:"XSRF-TOKEN",xsrfHeaderName:"X-XSRF-TOKEN",xsrfTrustedOrigins:[],jsonPrefix:"",...t,cacheOptions:{getCacheIdentifier:()=>"_default",...t.cacheOptions}},this._requestInterceptors=[],this._responseInterceptors=[],this._responseJsonInterceptors=[],this.__config.addAcceptLanguage&&this.addRequestInterceptor(N);const{xsrfCookieName:e,xsrfHeaderName:s,xsrfTrustedOrigins:o}=this.__config;e&&s&&o&&this.addRequestInterceptor(H(e,s,o));const r=this.__config.cacheOptions;if((r&&r.useCache||this.__config.addCaching)&&r.getCacheIdentifier){const{cacheRequestInterceptor:c,cacheResponseInterceptor:a}=A(r.getCacheIdentifier,r);this.addRequestInterceptor(c),this.addResponseInterceptor(a)}}set options(t){this.__config=t}get options(){return this.__config}addRequestInterceptor(t){this._requestInterceptors.push(t)}removeRequestInterceptor(t){this._requestInterceptors=this._requestInterceptors.filter(e=>e!==t)}addResponseInterceptor(t){this._responseInterceptors.push(t)}removeResponseInterceptor(t){this._responseInterceptors=this._responseInterceptors.filter(e=>e!==t)}addResponseJsonInterceptor(t){this._responseJsonInterceptors.push(t)}async fetch(t,e,s=!1){const o=new Request(t,{...e});o.cacheOptions=e?.cacheOptions,o.params=e?.params;const r=await this.__interceptRequest(o);if(r instanceof Response){const h=r;if(h.request=o,E(r))throw new I(o,h,s?await this.__attemptParseFailedResponseBody(h):void 0);return h}const c=await fetch(r);c.request=r;const a=await this.__interceptResponse(c);if(E(a))throw new I(o,c,s?await this.__attemptParseFailedResponseBody(c):void 0);return a}async fetchJson(t,e){const s={...e,headers:{...e?.headers,accept:"application/json"}};s?.body&&(s.headers["content-type"]="application/json",s.body=JSON.stringify(s.body));const o=s,r=await this.fetch(t,o,!0);let c=await this.__parseBody(r);return typeof c=="object"&&(c=await this.__interceptResponseJson(c,r)),{response:r,body:c}}async __parseBody(t){let e=await t.clone().text();const{jsonPrefix:s}=this.__config;typeof s=="string"&&e.startsWith(s)&&(e=e.substring(s.length));let o=e;if(o.length&&(!t.headers.get("content-type")||t.headers.get("content-type")?.includes("json")))try{o=JSON.parse(e)}catch{throw new Error(`Failed to parse response from ${t.url} as JSON.`)}else o=e;return o}async __attemptParseFailedResponseBody(t){let e;try{e=await this.__parseBody(t)}catch{}return e}async __interceptRequest(t){let e=t;for(const s of this._requestInterceptors){const o=await s(e);if(o instanceof Request)e=o;else return this.__interceptResponse(o)}return e}async __interceptResponse(t){let e=t;for(const s of this._responseInterceptors)e=await s(e);return e}async __interceptResponseJson(t,e){let s=t;for(const o of this._responseJsonInterceptors)s=await o(s,e);return s}}const u=new W,Y=()=>{let n=localStorage.getItem("lion-ajax-cache-demo-user-id");return n||(localStorage.setItem("lion-ajax-cache-demo-user-id","1"),n="1"),n},Z=1e3*60*10,ee={useCache:!0,maxAge:Z},{cacheRequestInterceptor:te,cacheResponseInterceptor:ne}=A(Y,ee);u.addRequestInterceptor(te);u.addResponseInterceptor(ne);const se=()=>{const n=l(i`<sb-action-logger></sb-action-logger>`),t=e=>{u.fetch(`../assets/${e}.json`).then(s=>s.json()).then(s=>{n.log(JSON.stringify(s,null,2))})};return i`
    <style>
      sb-action-logger {
        --sb-action-logger-max-height: 300px;
      }
    </style>
    <button @click="${()=>t("pabu")}">Fetch Pabu</button>
    <button @click="${()=>t("naga")}">Fetch Naga</button>
    ${n}
  `},oe=()=>{const n=l(i`<sb-action-logger></sb-action-logger>`),t=e=>{u.fetchJson(`../assets/${e}.json`).then(s=>{console.log(s.response),n.log(JSON.stringify(s.body,null,2))})};return i`
    <style>
      sb-action-logger {
        --sb-action-logger-max-height: 300px;
      }
    </style>
    <button @click="${()=>t("pabu")}">Fetch Pabu</button>
    <button @click="${()=>t("naga")}">Fetch Naga</button>
    ${n}
  `},re=()=>{const n=l(i`<sb-action-logger></sb-action-logger>`);return i`
    <style>
      sb-action-logger {
        --sb-action-logger-max-height: 300px;
      }
    </style>
    <button @click="${async()=>{try{const e=await u.fetchJson("/api/users")}catch(e){e.response&&e.response.status===400||n.log(e)}}}">Fetch</button>
    ${n}
  `},ce=()=>{const n=l(i`<sb-action-logger></sb-action-logger>`),t=e=>{u.fetchJson(`../assets/${e}.json`).then(s=>{n.log(`From cache: ${s.response.fromCache||!1}`),n.log(JSON.stringify(s.body,null,2))})};return i`
    <style>
      sb-action-logger {
        --sb-action-logger-max-height: 300px;
      }
    </style>
    <button @click="${()=>t("pabu")}">Fetch Pabu</button>
    <button @click="${()=>t("naga")}">Fetch Naga</button>
    ${n}
  `},ie=()=>{const n=l(i`<sb-action-logger></sb-action-logger>`),t=e=>{let s;e==="naga"&&(s={useCache:!1}),u.fetchJson(`../assets/${e}.json`,{cacheOptions:s}).then(o=>{n.log(`From cache: ${o.response.fromCache||!1}`),n.log(JSON.stringify(o.body,null,2))})};return i`
    <style>
      sb-action-logger {
        --sb-action-logger-max-height: 300px;
      }
    </style>
    <button @click="${()=>t("pabu")}">Fetch Pabu</button>
    <button @click="${()=>t("naga")}">Fetch Naga</button>
    ${n}
  `},ae=()=>{const n=l(i`<sb-action-logger></sb-action-logger>`);return i`
    <style>
      sb-action-logger {
        --sb-action-logger-max-height: 300px;
      }
    </style>
    <button @click="${()=>{u.fetchJson("../assets/pabu.json",{cacheOptions:{maxAge:1e3*3}}).then(e=>{n.log(`From cache: ${e.response.fromCache||!1}`),n.log(JSON.stringify(e.body,null,2))})}}">Fetch Pabu</button>
    ${n}
  `},he=()=>{const n=l(i`<sb-action-logger></sb-action-logger>`);return i`
    <style>
      sb-action-logger {
        --sb-action-logger-max-height: 300px;
      }
    </style>
    <button @click="${()=>{u.fetchJson("../assets/pabu.json").then(s=>{n.log(`From cache: ${s.response.fromCache||!1}`),n.log(JSON.stringify(s.body,null,2))})}}">Fetch Pabu</button>
    <button @click="${()=>{const s=parseInt(localStorage.getItem("lion-ajax-cache-demo-user-id"),10);localStorage.setItem("lion-ajax-cache-demo-user-id",`${s+1}`)}}">Change user</button>
    ${n}
  `},ue=()=>{const n=l(i`<sb-action-logger></sb-action-logger>`),t=(e,s)=>{u.fetchJson(`../assets/${e}.json`,{method:s}).then(o=>{n.log(`From cache: ${o.response.fromCache||!1}`),n.log(JSON.stringify(o.body,null,2))})};return i`
    <style>
      sb-action-logger {
        --sb-action-logger-max-height: 300px;
      }
    </style>
    <button @click="${()=>t("pabu","GET")}">GET Pabu</button>
    <button @click="${()=>t("pabu","PATCH")}">PATCH Pabu</button>
    <button @click="${()=>t("naga","GET")}">GET Naga</button>
    <button @click="${()=>t("naga","PATCH")}">PATCH Naga</button>
    ${n}
  `},le=()=>{const n=l(i`<sb-action-logger></sb-action-logger>`),t=(e,s)=>{const o={};e==="pabu"&&(o.invalidateUrlsRegex=/\/docs\/tools\/ajax\/assets\/naga.json/),u.fetchJson(`../assets/${e}.json`,{method:s,cacheOptions:o}).then(r=>{n.log(`From cache: ${r.response.fromCache||!1}`),n.log(JSON.stringify(r.body,null,2))})};return i`
    <style>
      sb-action-logger {
        --sb-action-logger-max-height: 300px;
      }
    </style>
    <button @click="${()=>t("pabu","GET")}">GET Pabu</button>
    <button @click="${()=>t("pabu","PATCH")}">PATCH Pabu</button>
    <button @click="${()=>t("naga","GET")}">GET Naga</button>
    <button @click="${()=>t("naga","PATCH")}">PATCH Naga</button>
    ${n}
  `},ge=document,de=[{key:"getRequest",story:se},{key:"getJsonRequest",story:oe},{key:"errorHandling",story:re},{key:"cache",story:ce},{key:"cacheActionOptions",story:ie},{key:"cacheMaxAge",story:ae},{key:"changeCacheIdentifier",story:he},{key:"nonGETRequest",story:ue},{key:"invalidateRules",story:le}];let P=!1;for(const n of de){const t=ge.querySelector(`[mdjs-story-name="${n.key}"]`);t&&(t.story=n.story,t.key=n.key,P=!0,Object.assign(t,{simulatorUrl:"/next-preview/feat-lion-playground-rebased/simulator",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}P&&(customElements.get("mdjs-preview")||w(()=>import("./define.BWpRLYnc.js"),__vite__mapDeps([0,1,2,3,4,5,6,7])),customElements.get("mdjs-story")||w(()=>import("./define.BPRa0k46.js"),__vite__mapDeps([8,2,3])));export{ce as cache,ie as cacheActionOptions,ae as cacheMaxAge,he as changeCacheIdentifier,re as errorHandling,oe as getJsonRequest,se as getRequest,le as invalidateRules,ue as nonGETRequest};
