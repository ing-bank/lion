import"./playground-preview.BbLR9snP.js";import"./DemoTree.Bym4JiGz.js";import"./lion-progress-indicator.CfmcHFLR.js";import{L as me}from"./LionAccordion.CCw3hAmZ.js";const X="ui-portal-section-accordion";class fe extends me{static get properties(){return{sections:{type:Boolean,reflect:!0},sectionsFrom:{type:String,attribute:"sections-from"}}}constructor(){super(),this.sections=!1,this.sectionsFrom="(min-width: 48.01rem)",this.__query=null,this.__onQueryChange=()=>{this.sections=!!this.__query?.matches},this.__swallowSectionClicks=e=>{if(!this.sections)return;const n=e.target;n.closest?.(".invoker")&&this.contains(n)&&e.stopPropagation()}}connectedCallback(){super.connectedCallback(),this.addEventListener("click",this.__swallowSectionClicks,!0),this.__watch()}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("click",this.__swallowSectionClicks,!0),this.__query?.removeEventListener("change",this.__onQueryChange)}updated(e){super.updated(e),e.has("sectionsFrom")&&this.isConnected&&this.__watch(),e.has("sections")&&(this.expanded=[...this.expanded])}__watch(){this.__query?.removeEventListener("change",this.__onQueryChange),this.__query=window.matchMedia(this.sectionsFrom),this.__query.addEventListener("change",this.__onQueryChange),this.__onQueryChange()}_setupInvoker(e){super._setupInvoker(e);const n=e.invoker.firstElementChild;n&&(n.__sectionKeydown||(n.__sectionKeydown=r=>{this.sections||r.key!=="Enter"&&r.key!==" "||(r.preventDefault(),n.click())},n.addEventListener("keydown",n.__sectionKeydown)),this.__applyControlSemantics(e))}_expand(e){super._expand(e),this.__applyControlSemantics(e)}_collapse(e){if(this.sections){this._expand(e);return}super._collapse(e),this.__applyControlSemantics(e)}__applyControlSemantics(e){const n=e.invoker.firstElementChild;n&&(this.sections?(n.removeAttribute("role"),n.removeAttribute("tabindex"),n.removeAttribute("aria-expanded"),n.removeAttribute("aria-controls")):(n.setAttribute("role","button"),n.setAttribute("tabindex","0"),n.setAttribute("aria-controls",e.content.id),n.setAttribute("aria-expanded",String(e.content.hasAttribute("expanded")))))}}customElements.get(X)||customElements.define(X,fe);const R="/next-preview/feat-lion-playground-rebased",ge=R.endsWith("/")?R:`${R}/`,$=`${ge}lion-playground-node-demo/`,P=new URL(`${$}engine.js`,location.href).href,be=!1,L=document.querySelector("#project"),N=document.querySelector("#editor"),z=document.querySelector("#preview");N.project=L;z.project=L;z.htmlFile="index.html";const se=document.querySelector("#modes"),h=document.querySelector("#status"),ye=document.querySelector("#content-check"),G=document.querySelector("#findings"),K=document.querySelector("#output"),oe=document.querySelector("#node-panes"),I=document.querySelector("#files"),Z=document.querySelector("#packages"),we=document.querySelector("#mode-note"),ee=document.querySelector("#governance"),D=document.querySelector("#busy");let U=document.querySelector("#file-tree");const ie=t=>t.endsWith(".html")?"html":t.endsWith(".js")||t.endsWith(".mjs")?"javascript":t.endsWith(".json")?"data_object":t.endsWith(".css")?"css":t.endsWith(".md")?"description":"draft",J=(t,e)=>{const n=document.createElement("span");n.className="material-symbols-outlined",n.setAttribute("aria-hidden","true"),n.textContent=e,t.prepend(n)},ve={client:["web","in the browser"],server:["dns","on the server"]},xe=(t,e)=>{const n={children:new Map};for(const o of Object.keys(e)){const l=o.split("/");let s=n;l.forEach((i,u)=>{s.children.has(i)||s.children.set(i,{children:new Map}),s=s.children.get(i),u===l.length-1&&(s.file=o)})}const r=document.createElement("demo-tree");r.id=t.id;const c=(o,l,s)=>{const i=document.createElement("div");i.setAttribute("role","treeitem");const u=document.createElement("span");return u.textContent=l,i.append(u),J(i,s),o.appendChild(i),i},a=(o,l,s,i)=>{const u=i===0?ve[l]:void 0,m=c(o,l,u?u[0]:"folder_open");if(m.dataset.folder="",m.setAttribute("aria-expanded","true"),u){m.dataset.side=l;const y=document.createElement("span");y.className="tree-hint",y.textContent=u[1],m.append(y)}const S=document.createElement("demo-tree");g(S,s,i+1),o.appendChild(S),m.addEventListener("click",()=>{const y=m.getAttribute("aria-expanded")!=="true";m.setAttribute("aria-expanded",String(y)),u||(m.querySelector(".material-symbols-outlined").textContent=y?"folder_open":"folder"),S.hidden=!y})};function g(o,l,s){for(const[i,u]of l.children)if(u.file){const m=c(o,i,ie(i));m.dataset.file=u.file,m.addEventListener("click",()=>{ae(u.file)})}else u.children.size&&a(o,i,u,s)}return g(r,n,0),t.replaceWith(r),r},w=document.querySelector("#open-files"),v=w.parentElement,Q=()=>{const t=v.scrollWidth>v.clientWidth+1;v.classList.toggle("is-overflowing",t),v.classList.toggle("is-at-end",v.scrollLeft+v.clientWidth>=v.scrollWidth-1)};v.addEventListener("scroll",Q,{passive:!0});new ResizeObserver(Q).observe(v);let d=[],f=null,E=null;const A=()=>{w.textContent="",d.forEach(t=>{const e=document.createElement("div");e.slot="tab",e.draggable=!0,e.dataset.file=t;const n=document.createElement("span"),r=t.split("/").pop(),c=d.some(o=>o!==t&&o.split("/").pop()===r);n.textContent=c?t:r,e.title=t;const a=document.createElement("button");a.type="button",a.className="close",a.setAttribute("aria-label",`Close ${t}`),J(a,"close"),a.addEventListener("click",o=>{o.stopPropagation(),ke(t)}),e.append(n,a),J(e,ie(t)),e.addEventListener("dragstart",o=>{E=t,e.classList.add("dragging"),o.dataTransfer?.setData("text/plain",t)}),e.addEventListener("dragend",()=>{e.classList.remove("dragging"),E=null,te()}),e.addEventListener("dragover",o=>{if(!E||E===t)return;o.preventDefault();const l=w.querySelector(`[slot="tab"][data-file="${CSS.escape(E)}"]`);if(!l||l===e)return;const s=e.getBoundingClientRect(),i=o.clientX>s.left+s.width/2;w.insertBefore(l,i?e.nextSibling:e),l.__panel&&w.insertBefore(l.__panel,l.nextSibling)}),e.addEventListener("drop",o=>{o.preventDefault(),te()}),w.appendChild(e),e.getAttribute("role")||e.setAttribute("role","tab"),e.setAttribute("aria-selected",String(t===f)),e.tabIndex=t===f?0:-1,e.hasAttribute("aria-controls")||e.setAttribute("aria-controls","editor");const g=document.createElement("div");g.slot="panel",g.hidden=!0,g.setAttribute("aria-hidden","true"),e.__panel=g,w.appendChild(g)}),w.selectedIndex=Math.max(0,d.indexOf(f)),requestAnimationFrame(Q);for(const t of U.querySelectorAll('[role="treeitem"][data-file]'))t.dataset.file===f?t.setAttribute("aria-current","true"):t.removeAttribute("aria-current")},ae=t=>{d.includes(t)||(d=[...d,t]),f=t,N.filename=t,A()},ke=t=>{const e=d.indexOf(t);d=d.filter(n=>n!==t),f===t&&(f=d[Math.min(e,d.length-1)]??null,f&&(N.filename=f)),A()},te=()=>{const t=[...w.querySelectorAll('[slot="tab"]')].map(e=>e.dataset.file);t.length===d.length&&(d=t),E=null,A()},je=(t,e)=>{const n=d.indexOf(t),r=n+e;r<0||r>=d.length||(d=d.map((c,a)=>a===n?d[r]:a===r?d[n]:c),A())};w.addEventListener("click",t=>{const e=t.target.closest('[slot="tab"]');e?.dataset.file&&ae(e.dataset.file)});document.addEventListener("keydown",t=>{!t.altKey||t.key!=="ArrowLeft"&&t.key!=="ArrowRight"||t.target instanceof Element&&t.target.closest("#editor")||f&&(t.preventDefault(),je(f,t.key==="ArrowLeft"?-1:1))});function V(t,e){const n=new Set("assert async_hooks buffer child_process cluster console crypto dgram diagnostics_channel dns events fs http http2 https inspector module net os path perf_hooks process querystring readline repl stream string_decoder timers tls tty url util v8 vm worker_threads zlib".split(" ")),r=[];for(const[c,a]of Object.entries(t))!c.startsWith("client/")||typeof a!="string"||a.split(`
`).forEach((g,o)=>{for(const l of g.matchAll(/(?:\bfrom\s*|\bimport\s*\(?\s*)(['"])([^'"\n]+)\1/g)){let s=l[2];e&&s.startsWith(e)&&(s=s.slice(e.length).replace(/^\/+/,"").replace(/\.js$/,"").replace("fs-promises","fs/promises").replace(/-/g,"_"));const i=`${c}:${o+1}`;s.startsWith("node:")||n.has(s.split("/")[0])?r.push({file:c,line:o+1,specifier:s,message:`${i} imports "${s}", a Node builtin — client/ runs in the browser, where there is no "${s}". Move this code to server/, or have the server send its result to the client.`}):/^\.\.?\//.test(s)&&new URL(s,`file:///${c}`).pathname.startsWith("/server/")&&r.push({file:c,line:o+1,specifier:s,message:`${i} imports "${s}", which is server code — client/ runs in the browser, and server/ is never sent to it. Have the server send its result to the client instead.`})}});return r}const Ce=({names:t,entry:e,hydrate:n})=>`const checkBoundary = ${V.toString()};
const names = ${JSON.stringify(t)};
const files = {};
let styles = '';
for (const name of names) {
  const content = await (await fetch(name)).text();
  files['/' + name] = { content };
  if (name.startsWith('client/') && name.endsWith('.css')) styles += content;
}
const report = (log, exitCode, written) =>
  window.parent.postMessage({ source: 'lion-node-demo-runner', log, exitCode, files: written || {} }, '*');

// What this document can actually do, measured *here* rather than assumed by the page. The worker's policy is
// what stands in for a boundary in the same-origin posture, so its presence is checked instead of trusted.
const policy = await fetch(location.href).then(
  response => response.headers.get('content-security-policy'),
  () => null,
);
let evalOutcome = 'allowed';
try {
  (0, eval)('1 + 1');
} catch (error) {
  evalOutcome = 'blocked: ' + error.name;
}
let crossOriginOutcome = 'reached';
try {
  await fetch('https://example.com/', { mode: 'no-cors' });
} catch (error) {
  crossOriginOutcome = 'blocked';
}
window.parent.postMessage(
  {
    source: 'lion-node-demo-runner-governance',
    origin: location.origin,
    controlled: Boolean(navigator.serviceWorker.controller),
    policy,
    eval: evalOutcome,
    crossOrigin: crossOriginOutcome,
  },
  '*',
);

// 1. The build.
const violations = checkBoundary(
  Object.fromEntries(names.map(name => [name, files['/' + name].content])),
  ${JSON.stringify(new URL("./shims/",P).href)},
);
if (violations.length) {
  report(violations.map(violation => ({ stream: 'stderr', text: 'build failed: ' + violation.message + '\\n' })), 1);
} else {
  // 2. The server. The engine is imported without a payload on the window, so it does not start itself; the
  // harness runs it and keeps the report, because for ssr the run is not over when the server is.
  const { runDemo } = await import(${JSON.stringify(P)});
  const server = await runDemo({ payload: { entry: new URL(${JSON.stringify(e)}, location.href).href, files } });
  const log = server.log;
  let exitCode = server.exitCode;

  // 3. The client takes over what the server sent.
  const hydrate = ${JSON.stringify(n||null)};
  if (hydrate && exitCode === 0) {
    if (styles) {
      const style = document.createElement('style');
      style.textContent = styles;
      document.head.appendChild(style);
    }
    // The response is parsed the way a browser parses a page from a server: with its declarative shadow roots
    // attached (\`setHTMLUnsafe\`), which \`innerHTML\` would leave as inert templates for hydration to trip over.
    const response = server.files['/response.html'] || '';
    if (document.body.setHTMLUnsafe) document.body.setHTMLUnsafe(response);
    else document.body.innerHTML = response;
    const browserConsole = (...args) => log.push({ stream: 'browser', text: args.map(String).join(' ') + '\\n' });
    globalThis.console = { log: browserConsole, info: browserConsole, debug: browserConsole, warn: browserConsole, error: browserConsole };
    try {
      await import(new URL(hydrate, location.href).href);
    } catch (error) {
      log.push({ stream: 'stderr', text: hydrate + ': ' + (error && error.message ? error.message : error) + '\\n' });
      exitCode = 1;
    }
  }

  // Only what the run wrote or changed: the project's own files are the input, not the result.
  const written = Object.fromEntries(
    Object.entries(server.files).filter(([pathname, content]) => !files[pathname] || files[pathname].content !== content),
  );
  report(log, exitCode, written);
}
`,ne=`:root {
  color-scheme: light;
}
body {
  font-family: system-ui, sans-serif;
  background: #f3f3f4;
  color: #1c1c20;
  line-height: 1.5;
  padding: 28px 32px;
  margin: 0;
}
h1 {
  font-size: 1.125rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  margin: 0 0 1rem;
}
lion-input, lion-button {
  display: block;
  max-width: 24rem;
  margin-bottom: 0.75rem;
}
`,C={client:{label:"client",hint:"browser",note:"client/ is what a browser runs: index.html is the document and main.js its module. There is no filesystem and no Node builtins on this side — a client file that imports fs, path or process fails the build check, the way a bundler fails it, and the document has no import for them either.",open:["client/index.html","client/main.js"],active:"client/index.html",files:{"client/index.html":['<link rel="stylesheet" href="./styles.css">',"<h1>A Lion component, running in the browser</h1>",'<lion-input label="Your name"></lion-input>',"<lion-button>Save</lion-button>",'<script type="module" src="./main.js"><\/script>',""].join(`
`),"client/main.js":`import '@lion/ui/define/lion-input.js';
import '@lion/ui/define/lion-button.js';

const button = document.querySelector('lion-button');
button.addEventListener('click', () => {
  button.textContent = 'Saved';
});
`,"client/styles.css":ne}},server:{label:"server",hint:"node",note:"server/ is what a server runs: main.js reads server/data.json, writes out.txt, prints to stdout and starts a worker thread that answers with a message. There is no real server — this runs in your browser, against an in-memory filesystem and a dependency-free layer that answers Node’s API (fs, path, process, os, util, events, url, worker_threads); the worker is a real Web Worker. A server has no page, so its result is the console.",open:["server/main.js","server/worker.js"],active:"server/main.js",run:{entry:"server/main.js",status:"Running server/main.js…"},files:{"server/main.js":`import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { Worker } from 'worker_threads';

// Relative paths resolve against the working directory: the project root, under real Node as here.
const data = JSON.parse(readFileSync(join('server', 'data.json'), 'utf8'));
console.log('read server/data.json:', data.message);

writeFileSync('out.txt', data.message.toUpperCase());
console.log('wrote out.txt:', readFileSync('out.txt', 'utf8'));
console.log('in the project root:', readdirSync('.').join(', '));

// A real thread: server/worker.js runs beside this one and answers with a message.
const worker = new Worker(new URL('./worker.js', import.meta.url), { workerData: { value: data.value } });
worker.on('message', message => console.log('worker said', JSON.stringify(message)));
worker.on('error', error => console.error('worker failed:', error.message));
`,"server/worker.js":`import { parentPort, workerData, isMainThread } from 'worker_threads';

parentPort.postMessage({ doubled: workerData.value * 2, inWorker: !isMainThread });
`,"server/data.json":`{
  "message": "hello from the server",
  "value": 21
}
`}},ssr:{label:"ssr",hint:"render + hydrate",note:"One app, two halves. server/render.js renders client/app.js to a string with @lit-labs/ssr and writes it out as the response, with the data it rendered from; the client puts that markup in the page and client/hydrate.js takes over the same components in place, without rendering them again. The server may import client code to render it; the client may not import server code. The server’s stdout and the browser’s console are printed as two sections of the console.",open:["server/render.js","client/app.js","client/hydrate.js"],active:"server/render.js",run:{entry:"server/render.js",hydrate:"client/hydrate.js",status:"Rendering on the server…"},files:{"server/render.js":`import { readFileSync, writeFileSync } from 'fs';
import { render } from '@lit-labs/ssr';
// \`index.js\` re-exports \`render\` and the element renderers, not the collectors: those live in
// \`lib/render-result.js\`, and since this package has no exports map that subpath is a plain specifier the
// import map already carries.
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
// The server renders the client's own components: server code may import client code, never the reverse.
import { app } from '../client/app.js';

const data = JSON.parse(readFileSync('server/data.json', 'utf8'));

// What a server does: no document, no mount — a string.
const markup = await collectResult(render(app(data)));
console.log('rendered', markup.length, 'characters of markup:');
console.log(markup);

// The response: the markup, and the data it was rendered from, so the client can take over without a refetch.
writeFileSync(
  'response.html',
  '<div id="app">' + markup + '</div>' +
    '<script type="application/json" id="app-data">' + JSON.stringify(data).replace(/</g, '\\\\u003c') + '<\/script>',
);
`,"server/data.json":`{
  "title": "Rendered on the server, hydrated here",
  "field": "Your name",
  "action": "Save"
}
`,"client/app.js":`// One component tree, used by both halves: the server renders it to a string, the client hydrates it.
// The hydrate support has to load before any component is defined, so it comes first.
import '@lit-labs/ssr-client/lit-element-hydrate-support.js';
import { html } from 'lit';
import '@lion/ui/define/lion-button.js';
import '@lion/ui/define/lion-input.js';

export const app = data => html\`<h1>\${data.title}</h1>
<lion-input label="\${data.field}"></lion-input>
<lion-button>\${data.action}</lion-button>\`;
`,"client/hydrate.js":`import { hydrate } from '@lit-labs/ssr-client';
import { app } from './app.js';

// The server's markup is already in the page. Hydrating attaches the components to it instead of rendering again.
const data = JSON.parse(document.querySelector('#app-data').textContent);
hydrate(app(data), document.querySelector('#app'));

await customElements.whenDefined('lion-button');
console.log('hydrated: the button in the page is a', document.querySelector('lion-button').constructor.name);
`,"client/styles.css":ne}}},Se=t=>t.endsWith(".html")?"text/html":t.endsWith(".css")?"text/css":t.endsWith(".json")?"application/json":"sample/js";let O="client",_=null;const F=t=>import(t),_e=async()=>{if(!_){const[t,e,n]=await Promise.all([F(`${$}importMapPerPackage.js`).then(r=>r.default),F(`${$}packageMains.js`).then(r=>r.default),F(`${$}host.js`),F(`${$}checkDemoContent.js`).then(r=>_={..._,...r}).catch(()=>{})]);_={..._,importMapPerPackage:t,packageMains:e,host:n}}return _},b={log:[],exitCode:null,files:{}},Ee=()=>{let e=b.log.some(r=>r.stream==="browser")?`── server · stdout
`:"",n=!1;for(const r of b.log)r.stream==="browser"&&!n&&(n=!0,e+=`
── client · browser console
`),e+=r.stream==="stderr"?`! ${r.text}`:r.text;K.textContent=e,I.textContent="";for(const[r,c]of Object.entries(b.files||{})){const a=document.createElement("li");a.textContent=`${r} (${c.length} chars)`,I.appendChild(a)}};window.addEventListener("message",t=>{const e=t.data;if(!e)return;if((e.source==="lion-node-demo-runner"||e.source==="lion-node-demo-runner-governance")&&(D.hidden=!0),e.source==="lion-node-demo-runner-governance"){const r=!!e.policy,c=!0;ee.textContent=[`served by the worker: ${e.controlled?"yes":"no"}`,`policy: ${r?"set by the worker":"none"}`,`eval: ${e.eval}`,`cross-origin fetch: ${e.crossOrigin}`,"own-origin posture: no policy expected, the browser is the boundary"].join(" · "),ee.dataset.consistent=String(c);return}if(e.source!=="lion-node-demo-runner")return;b.log=e.log||[],b.exitCode=e.exitCode,b.files=e.files||{},Ee();const n=b.log.find(r=>r.text.startsWith("build failed: "));h.textContent=n?`Build failed (exit code ${b.exitCode}): ${n.text.slice(14).trim()}`:`Finished with exit code ${b.exitCode}.`,h.dataset.state=b.exitCode===0?"ok":"error"});const re=document.querySelector("#boundary");let M=[];const le=t=>{const e=M.filter(n=>n.startsWith("client/")).length;re.dataset.consistent=String(t.length===0),re.textContent=t.length?`client/server boundary: ${t.length} violation(s) — ${t.map(n=>n.message).join(" · ")}`:e?`client/server boundary: ${e} client file(s) checked the way a bundler checks them — no Node builtins, no imports from server/`:"client/server boundary: no client/ files here — server/ may import anything, Node builtins included",C[O].run?t.length&&(h.textContent=`Build failed: ${t[0].message}`,h.dataset.state="error"):(oe.hidden=t.length===0,K.textContent=t.map(n=>`! build failed: ${n.message}
`).join(""),t.length?(h.textContent=`Build failed: ${t[0].message}`,h.dataset.state="error"):h.dataset.state==="error"&&(h.textContent=C[O].status,h.dataset.state="ok"))},Le=t=>{const e=new Set(Object.keys(t.imports).filter(n=>n.startsWith("node:")).flatMap(n=>[n,n.slice(5)]));return{imports:Object.fromEntries(Object.entries(t.imports).filter(([n])=>!e.has(n)))}};C.client.status="Served by the worker; the preview renders client/index.html.";const ce=async t=>{O=t;const e=C[t];document.body.dataset.mode=t;for(const p of se.querySelectorAll('[role="tab"]'))p.setAttribute("aria-selected",String(p.dataset.mode===t));we.textContent=e.note,oe.hidden=!e.run,h.textContent="Not run yet.",h.dataset.state="running",D.hidden=!1,b.log=[],b.files={},K.textContent="",I.textContent="";const{importMapPerPackage:n,packageMains:r,host:c,checkDemoContent:a,describeContentReport:g,decideRun:o}=await _e();if(!Z.childElementCount)for(const p of Object.keys(n)){const j=document.createElement("li");j.textContent=p,Z.appendChild(j)}const l=a(e.files),s=o({report:l,sameOriginSandbox:be});ye.textContent=`${g(l)} — ${s.reason}`,G.textContent="";for(const p of l.findings){const j=document.createElement("li");j.textContent=`${p.file}:${p.line} ${p.rule} (${p.severity})`,G.appendChild(j)}if(!s.allow){L.config={importMap:{imports:{}},files:{}},h.textContent=s.reason,h.dataset.state="error";return}const i=c.buildFenceImportMap({importMapPerPackage:n,packageMains:r},location.origin,new URL("./shims",P).href),u=e.run?i:Le(i),m=`<script type="importmap">${JSON.stringify(u).replace(/</g,"\\u003c")}<\/script>`;M=Object.keys(e.files);const S={...e.files},y=new Set;e.run&&(S["index.html"]=`<script type="module" src="./boot.js"><\/script>
`,S["boot.js"]=Ce({names:M,entry:e.run.entry,hydrate:e.run.hydrate}),y.add("index.html"),y.add("boot.js")),z.htmlFile=e.run?"index.html":"client/index.html",U=xe(U,e.files),L.config={importMap:u,files:Object.fromEntries(Object.entries(S).map(([p,j])=>[p,{filename:p,contentType:Se(p),content:p.endsWith(".html")?`${m}
${j}`:j,...y.has(p)?{hidden:!0}:{}}]))},d=[...e.open],f=e.active,N.filename=f,A(),h.textContent=e.run?e.run.status:e.status,h.dataset.state=e.run?"running":"ok",D.hidden=!0,le(V(e.files))};L.addEventListener("compileDone",()=>{const t=Object.fromEntries((L.files||[]).filter(n=>M.includes(n.name)).map(n=>[n.name,n.content])),e=V(t);C[O].run&&!e.length&&h.dataset.state!=="running"&&(h.textContent=C[O].run.status,h.dataset.state="running"),le(e)});for(const t of Object.keys(C)){const e=document.createElement("button");e.type="button",e.setAttribute("role","tab"),e.dataset.mode=t;const{label:n,hint:r}=C[t],c=document.createElement("span");c.className="mode-name",c.textContent=n;const a=document.createElement("span");a.className="mode-hint",a.textContent=r,e.append(c," ",a),e.addEventListener("click",()=>ce(t)),se.appendChild(e)}const $e=[...document.querySelectorAll(".view-rail button")],de=t=>{document.body.dataset.view=t;for(const e of $e)e.classList.toggle("is-active",e.dataset.view===t)};document.querySelector(".view-rail").addEventListener("click",t=>{const e=t.target.closest("button[data-view]");e&&de(e.dataset.view)});de("files");const x=document.querySelector("#parts"),k=[...x.querySelectorAll(":scope > .part-head[data-part]")],Oe=[...document.querySelectorAll(".mobile-tabs button")],q=window.matchMedia("(max-width: 48rem)"),Ae=window.matchMedia("(prefers-reduced-motion: reduce)"),qe=()=>Ae.matches?"instant":"smooth";let W=null;const H=()=>{for(const t of Oe){const e=t.dataset.view===W;t.classList.toggle("is-active",e),e?t.setAttribute("aria-current","true"):t.removeAttribute("aria-current")}},ue=t=>{requestAnimationFrame(()=>t.scrollIntoView({behavior:qe(),block:"start"}))},Fe=t=>{const e=k.findIndex(n=>n.dataset.part===t);e!==-1&&(x.expanded.includes(e)||(x.expanded=[...x.expanded,e]),H(),ue(k[e]))};let T=[];x.addEventListener("expanded-changed",()=>{const t=x.expanded.filter(e=>!T.includes(e));if(T=[...x.expanded],!!q.matches)for(const e of t){const n=k[e].getBoundingClientRect().top;(n<48||n>window.innerHeight-57)&&ue(k[e])}});let he=0;const Y=()=>{if(!q.matches){W=null,H();return}let t=null;for(const e of k)e.getBoundingClientRect().top<=he+1&&(t=e.dataset.part??null);t===null&&(t=k[0]?.dataset.part??null),t!==W&&(W=t,H())};let B=!1;window.addEventListener("scroll",()=>{B||(B=!0,requestAnimationFrame(()=>{B=!1,Y()}))},{passive:!0});document.querySelector(".mobile-tabs").addEventListener("click",t=>{const e=t.target.closest("button[data-view]");e&&q.matches&&Fe(e.dataset.view)});const pe=()=>{q.matches&&(T=[k.findIndex(t=>t.dataset.part==="code")],x.expanded=[...T]),he=k.length&&parseFloat(getComputedStyle(k[0]).scrollMarginTop)||0,Y()};q.addEventListener("change",pe);pe();new ResizeObserver(()=>Y()).observe(x);ce("client");
