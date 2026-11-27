/* eslint-disable no-template-curly-in-string -- the `before`/`after` strings below are minified
   bundle code, and the bundle carries template literals of its own. */

/**
 * The two places the flow has to touch the virtual screen reader, until upstream carries them.
 *
 * `@guidepup/virtual-screen-reader` builds its accessibility tree by walking `parentElement`, and
 * it observes the container it was started on with a MutationObserver. Lion renders validation
 * feedback in a shadow root, so that message never reaches the reader, for three coupled reasons:
 *
 *   1. the ancestor walk stops at a shadow root (a shadow tree has no `parentElement`), so a node
 *      inside one has no place in the tree;
 *   2. the same walk is used to find the live region's target, with the same result;
 *   3. the mutation observer is rooted at the container, so a shadow root attached later - or
 *      attached after the reader started - is never observed.
 *
 * Upstream tracks the same three; until that lands, this used to be
 * `patches/@guidepup+virtual-screen-reader+0.33.0.patch`, a diff against the minified browser
 * bundle that `postinstall` applied to `node_modules`. The flow serves that bundle itself now
 * (`screenreaderPlugin`), so the fix lives in the package that needs it: no patch file, no
 * postinstall step, and a loud failure instead of a silently stale patch when the bundle changes
 * shape.
 *
 * The strings below are minified code and not meant to be read; each `before`/`after` pair is the
 * whole change, and `patchVirtualReaderBundle` refuses to run unless every `before` appears
 * exactly once. Revisit on every upgrade of `@guidepup/virtual-screen-reader`.
 *
 * @typedef {{ why: string, before: string, after: string }} VirtualReaderFix
 */

/** @type {VirtualReaderFix[]} */
export const VIRTUAL_READER_FIXES = [
  {
    why:
      'Let the tree walk leave a shadow root: the ancestor becomes the shadow host, and the walk ' +
      "to a live region target falls back to the root node's host.",
    before:
      'e.parentElement;function $e(e){let{node:r}=e;return Yt(r)}function ze({attributeName:e,index:r=0,container:t,currentIndex:a,tree:i}){if(!I(t))return;let n=i.at(a),o=$e(n),s=$r({attributeName:e,node:o})[r],u=je({container:t,idRef:s});if(!u)return;let d=i.findIndex(({node:g})=>g===u);if(d!==-1)return d;let f=i.findIndex(({parent:g})=>g===u);if(f!==-1)return f}function xu({index:e=0,container:r,currentIndex:t,tree:a}){return ze({attributeName:"aria-controls",index:e,container:r,currentIndex:t,tree:a})}function Tu({container:e,currentIndex:r,tree:t}){return ze({attributeName:"aria-details",index:0,container:e,currentIndex:r,tree:t})}function _u({index:e=0,container:r,currentIndex:t,tree:a}){return ze({attributeName:"aria-errormessage",index:e,container:r,currentIndex:t,tree:a})}function Ou({index:e,container:r,currentIndex:t,tree:a}){return ze({attributeName:"aria-flowto",index:e,container:r,currentIndex:t,tree:a})}function Su({index:e=0,container:r,currentIndex:t,tree:a}){if(!I(r))return;let{alternateReadingOrderParents:i}=a.at(t),n=i[e];if(n)return a.findIndex(({node:o})=>o===n)}var il=["banner","complementary","contentinfo","figure","form","main","navigation","region","search"],Iy=[...il,"heading","link"],My=Iy.reduce((e,r)=>{let t=`moveToNext${r.at(0).toUpperCase()}${r.slice(1)}`,a=`moveToPrevious${r.at(0).toUpperCase()}${r.slice(1)}`;return{...e,[t]:Kt({roles:[r]}),[a]:Xt({roles:[r]})}},{}),Ly=["1","2","3","4","5","6"],Fy=Ly.reduce((e,r)=>{let t=`moveToNextHeadingLevel${r}`,a=`moveToPreviousHeadingLevel${r}`;return{...e,[t]:Kt({ariaAttributes:{"aria-level":r}}),[a]:Xt({ariaAttributes:{"aria-level":r}})}},{}),nl={jumpToControlledElement:xu,jumpToDetailsElement:Tu,jumpToErrorMessageElement:_u,moveToNextAlternateReadingOrderElement:Ou,moveToPreviousAlternateReadingOrderElement:Su,...My,moveToNextLandmark:Kt({roles:il}),moveToPreviousLandmark:Xt({roles:il}),...Fy};var Nu="A container was not provided",ku="Virtual Screen Reader was not started";var we={ASSERTIVE:"assertive",OFF:"off",POLITE:"polite"},Ne={ADDITIONS:"additions",ALL:"all",REMOVALS:"removals",TEXT:"text"},Vy=new Set(Object.values(Ne)),Dy=!1,By=we.OFF,jy=[Ne.ADDITIONS,Ne.TEXT];function Qr(e){return cr(e)||qr(e)||Ft(e.textContent)}function Uy({addedNodes:e,removedNodes:r,target:t,type:a}){return[...Iu({addedNodes:e}),...Mu({removedNodes:r}),...Lu({addedNodes:e,target:t,type:a})]}function Iu({addedNodes:e}){return Array.from(e).filter(I).map(Qr)}function Mu({removedNodes:e}){return Array.from(e).map(r=>`removal: ${Qr(r)}`)}var Hy=3;function Lu({addedNodes:e,target:r,type:t}){switch(t){case"childList":{if(!e.length)break;return Array.from(e).filter(a=>a.nodeType===Hy).map(Qr)}case"characterData":return[Qr(r)]}return[]}var $y={[Ne.ADDITIONS]:Iu,[Ne.ALL]:Uy,[Ne.REMOVALS]:Mu,[Ne.TEXT]:Lu},zy={alert:{atomic:!0,live:we.ASSERTIVE},log:{live:we.POLITE},marquee:{live:we.OFF},status:{atomic:!0,live:we.POLITE},timer:{live:we.OFF},alertdialog:{atomic:!0,live:we.ASSERTIVE}};function Fu({container:e,target:r},{atomic:t,live:a,liveTarget:i,relevant:n}={}){let o=cr(r),{role:l}=It({accessibleName:o,allowedAccessibilityRoles:[],inheritedImplicitPresentational:!1,node:r}),s=zy[l];if(typeof t>"u"&&r.hasAttribute("aria-atomic")&&(t=r.getAttribute("aria-atomic")==="true"),typeof a>"u"&&r.hasAttribute("aria-live")&&(a=r.getAttribute("aria-live"),i=r),typeof a>"u"&&s&&(a=s.live,i=r,typeof t>"u"&&(t=s.atomic)),typeof n>"u"&&r.hasAttribute("aria-relevant")&&(n=r.getAttribute("aria-relevant").split(" ").filter(d=>!!Vy.has(d)),n.includes(Ne.ALL)&&(n=[Ne.ALL])),typeof t<"u"&&typeof a<"u"&&typeof n<"u")return{atomic:t,live:a,liveTarget:i,relevant:n};let u=r.parentElement',
    after:
      '(e.host||e.parentElement);function $e(e){let{node:r}=e;return Yt(r)}function ze({attributeName:e,index:r=0,container:t,currentIndex:a,tree:i}){if(!I(t))return;let n=i.at(a),o=$e(n),s=$r({attributeName:e,node:o})[r],u=je({container:t,idRef:s});if(!u)return;let d=i.findIndex(({node:g})=>g===u);if(d!==-1)return d;let f=i.findIndex(({parent:g})=>g===u);if(f!==-1)return f}function xu({index:e=0,container:r,currentIndex:t,tree:a}){return ze({attributeName:"aria-controls",index:e,container:r,currentIndex:t,tree:a})}function Tu({container:e,currentIndex:r,tree:t}){return ze({attributeName:"aria-details",index:0,container:e,currentIndex:r,tree:t})}function _u({index:e=0,container:r,currentIndex:t,tree:a}){return ze({attributeName:"aria-errormessage",index:e,container:r,currentIndex:t,tree:a})}function Ou({index:e,container:r,currentIndex:t,tree:a}){return ze({attributeName:"aria-flowto",index:e,container:r,currentIndex:t,tree:a})}function Su({index:e=0,container:r,currentIndex:t,tree:a}){if(!I(r))return;let{alternateReadingOrderParents:i}=a.at(t),n=i[e];if(n)return a.findIndex(({node:o})=>o===n)}var il=["banner","complementary","contentinfo","figure","form","main","navigation","region","search"],Iy=[...il,"heading","link"],My=Iy.reduce((e,r)=>{let t=`moveToNext${r.at(0).toUpperCase()}${r.slice(1)}`,a=`moveToPrevious${r.at(0).toUpperCase()}${r.slice(1)}`;return{...e,[t]:Kt({roles:[r]}),[a]:Xt({roles:[r]})}},{}),Ly=["1","2","3","4","5","6"],Fy=Ly.reduce((e,r)=>{let t=`moveToNextHeadingLevel${r}`,a=`moveToPreviousHeadingLevel${r}`;return{...e,[t]:Kt({ariaAttributes:{"aria-level":r}}),[a]:Xt({ariaAttributes:{"aria-level":r}})}},{}),nl={jumpToControlledElement:xu,jumpToDetailsElement:Tu,jumpToErrorMessageElement:_u,moveToNextAlternateReadingOrderElement:Ou,moveToPreviousAlternateReadingOrderElement:Su,...My,moveToNextLandmark:Kt({roles:il}),moveToPreviousLandmark:Xt({roles:il}),...Fy};var Nu="A container was not provided",ku="Virtual Screen Reader was not started";var we={ASSERTIVE:"assertive",OFF:"off",POLITE:"polite"},Ne={ADDITIONS:"additions",ALL:"all",REMOVALS:"removals",TEXT:"text"},Vy=new Set(Object.values(Ne)),Dy=!1,By=we.OFF,jy=[Ne.ADDITIONS,Ne.TEXT];function Qr(e){return cr(e)||qr(e)||Ft(e.textContent)}function Uy({addedNodes:e,removedNodes:r,target:t,type:a}){return[...Iu({addedNodes:e}),...Mu({removedNodes:r}),...Lu({addedNodes:e,target:t,type:a})]}function Iu({addedNodes:e}){return Array.from(e).filter(I).map(Qr)}function Mu({removedNodes:e}){return Array.from(e).map(r=>`removal: ${Qr(r)}`)}var Hy=3;function Lu({addedNodes:e,target:r,type:t}){switch(t){case"childList":{if(!e.length)break;return Array.from(e).filter(a=>a.nodeType===Hy).map(Qr)}case"characterData":return[Qr(r)]}return[]}var $y={[Ne.ADDITIONS]:Iu,[Ne.ALL]:Uy,[Ne.REMOVALS]:Mu,[Ne.TEXT]:Lu},zy={alert:{atomic:!0,live:we.ASSERTIVE},log:{live:we.POLITE},marquee:{live:we.OFF},status:{atomic:!0,live:we.POLITE},timer:{live:we.OFF},alertdialog:{atomic:!0,live:we.ASSERTIVE}};function Fu({container:e,target:r},{atomic:t,live:a,liveTarget:i,relevant:n}={}){let o=cr(r),{role:l}=It({accessibleName:o,allowedAccessibilityRoles:[],inheritedImplicitPresentational:!1,node:r}),s=zy[l];if(typeof t>"u"&&r.hasAttribute("aria-atomic")&&(t=r.getAttribute("aria-atomic")==="true"),typeof a>"u"&&r.hasAttribute("aria-live")&&(a=r.getAttribute("aria-live"),i=r),typeof a>"u"&&s&&(a=s.live,i=r,typeof t>"u"&&(t=s.atomic)),typeof n>"u"&&r.hasAttribute("aria-relevant")&&(n=r.getAttribute("aria-relevant").split(" ").filter(d=>!!Vy.has(d)),n.includes(Ne.ALL)&&(n=[Ne.ALL])),typeof t<"u"&&typeof a<"u"&&typeof n<"u")return{atomic:t,live:a,liveTarget:i,relevant:n};let u=r.assignedSlot||r.parentElement||(r.getRootNode&&r.getRootNode().host)||null',
  },
  {
    why:
      'Observe shadow roots as well: scan the container for shadow roots (and watch the ones that ' +
      'appear later by wrapping Element.prototype.attachShadow), so a mutation inside one is ' +
      'reported to the reader.',
    before:
      'a){let i=new a(t);return i.observe(r,{attributes:!0,characterData:!0,childList:!0,subtree:!0}),()=>{i.disconnect()}}return()=>{',
    after:
      '!a)return()=>{};let i=null,seen=new Set(),opts={attributes:!0,characterData:!0,childList:!0,subtree:!0},watch=root=>{seen.has(root)||(seen.add(root),i.observe(root,opts))},scan=()=>{let queue=[r];while(queue.length){let root=queue.pop();watch(root),root.querySelectorAll&&root.querySelectorAll("*").forEach(el=>{el.shadowRoot&&queue.push(el.shadowRoot)})}},proto=e&&e.Element&&e.Element.prototype,attach=proto&&proto.attachShadow;i=new a((mutations,observer)=>{scan(),t(mutations,observer)});scan(),proto&&attach&&(proto.attachShadow=function(...args){let root=attach.apply(this,args);return watch(root),root});return()=>{proto&&attach&&(proto.attachShadow=attach),i.disconnect(),seen.clear()',
  },
];

/**
 * Apply the fixes above to the virtual screen reader browser bundle, and fail loudly when the
 * bundle no longer looks like the version they were written against.
 *
 * @param {string} source
 * @returns {string}
 */
export function patchVirtualReaderBundle(source) {
  return VIRTUAL_READER_FIXES.reduce((patched, fix) => {
    // Already fixed: the bundle was patched earlier in this process.
    if (patched.includes(fix.after)) {
      return patched;
    }
    const occurrences = patched.split(fix.before).length - 1;
    if (occurrences !== 1) {
      throw new Error(
        'The virtual screen reader browser bundle does not match the version this fix was ' +
          `written against: the anchor for "${fix.why}" appears ${occurrences} times instead ` +
          'of once. Check the installed @guidepup/virtual-screen-reader version and update ' +
          'VIRTUAL_READER_FIXES in src/virtualReaderBundle.js.',
      );
    }
    return patched.replace(fix.before, fix.after);
  }, source);
}
