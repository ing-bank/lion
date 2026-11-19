const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.BWpRLYnc.js","_astro/MdJsPreview.CainKAmn.js","_astro/lit-element.B1EQMsFJ.js","_astro/lit-html.BX7rm8u-.js","_astro/dedupeMixin.6XPTJgK8.js","_astro/LionAccordion.CCw3hAmZ.js","_astro/lit-element.BOikny4r.js","_astro/uuid.DjYKNjre.js","_astro/define.BPRa0k46.js"])))=>i.map(i=>d[i]);
import{_ as l}from"./preload-helper.DOA02mLT.js";import"./lit-element.B1EQMsFJ.js";import{b as a}from"./lit-html.BX7rm8u-.js";import{a as h}from"./applyMenuDemoStyles.DZO5n0Tm.js";import{a as f,s as m,t as p}from"./MultiLevelListMixin.CPYb0VY8.js";import"./DemoTree.Bym4JiGz.js";import{L as b}from"./LionMenu.Ce9zt_XE.js";import{a as k,i as y,b as n}from"./lit-element.BOikny4r.js";customElements.define("lion-menuitem",f);class _ extends b{constructor(){super(),this._listRole="toolbar",this.bar=!0}setCheckedIndex(e){const i=this.listItems[e];if(i){const t=i.getAttribute("role");let s=this.listItems,{multiple:d}=this;if(t==="radio"||t==="checkbox"){let o;t==="radio"?o=i.closest('[role="radiogroup"]'):t==="checkbox"&&(o=i.closest('[role="checkboxgroup"]'));const v=o&&this.contains(o)?o:this;s=this.listItems.filter(c=>v.contains(c)),d=t==="checkbox"}d?p(this.listItems[e]):(s.forEach(o=>{m(o,!0)}),m(this.listItems[e]))}}_initListItems(e){super._initListItems(e),e.forEach(i=>{if(i.getAttribute("role")==="button"||i.tagName==="BUTTON"&&!i.hasAttribute("role")){const t=i.getAttribute("aria-pressed");i.setAttribute("aria-pressed",t||"false"),i.addEventListener("click",()=>{const s=i.getAttribute("aria-pressed")==="true";i.setAttribute("aria-pressed",`${!s}`)})}})}}customElements.define("demo-toolbar",_);class g extends k{static get properties(){return{now:{type:Number},min:{type:Number},max:{type:Number},unit:{type:String},step:{type:Number}}}get _decreaseNode(){return this.shadowRoot?.querySelector("[data-ref=decrease]")}get _increaseNode(){return this.shadowRoot?.querySelector("[data-ref=increase]")}static get styles(){return y`
      :host {
        display: flex;
        align-items: center;
        cursor: default;
      }
    `}render(){return this._mainTemplate({ariaText:this._getAriaText()})}_mainTemplate({ariaText:e}){return n`${e}${this._decreaseBtnTemplate()}${this._increaseBtnTemplate()}`}_decreaseBtnTemplate(){return n`<span data-ref="decrease">▼</span>`}_increaseBtnTemplate(){return n`<span data-ref="increase">▲</span>`}constructor(){super(),this.unit="",this.step=1,this.__decrease=this.__decrease.bind(this),this.__increase=this.__increase.bind(this)}connectedCallback(){super.connectedCallback(),!this.__isSetup&&(this.setAttribute("tabindex","0"),this.__isSetup=!0)}firstUpdated(e){super.firstUpdated(e),this._decreaseNode?.addEventListener("mousedown",this.__decrease),this._increaseNode?.addEventListener("mousedown",this.__increase),this.addEventListener("keydown",this._onKeydown),this.addEventListener("mousedown",()=>{this.__isMousedown=!0}),this.addEventListener("mouseup",()=>{this.__isMousedown=!1})}updated(e){super.updated(e),e.has("now")&&this.setAttribute("aria-valuenow",`${this.now}`),(e.has("now")||e.has("unit"))&&this.setAttribute("aria-valuetext",this._getAriaText()),e.has("min")&&this.setAttribute("aria-valuemin",`${this.min}`),e.has("max")&&this.setAttribute("aria-valuemax",`${this.max}`)}_getAriaText(){return`${this.now}${this.unit?this.unit:""}`}__decrease(e,i=this.step,t=100){this.min!==void 0&&this.now-1>=this.min&&(this.now-=1),e.type==="mousedown"&&setTimeout(()=>{this.__isMousedown&&this.__decrease(e,i,t/1.3)},t)}__increase(e,i=this.step,t=100){this.max!==void 0&&this.now+1<=this.max&&(this.now+=1),e.type==="mousedown"&&setTimeout(()=>{this.__isMousedown&&this.__increase(e,i,t/1.3)},t)}_onKeydown(e){const{key:i}=e;switch(i){case"ArrowDown":e.stopPropagation(),e.preventDefault(),this.__decrease();break;case"ArrowUp":e.stopPropagation(),e.preventDefault(),this.__increase();break;case"Home":e.stopPropagation(),e.preventDefault(),this.min!==void 0&&(this.now=this.min);break;case"End":e.stopPropagation(),e.preventDefault(),this.max!==void 0&&(this.now=this.max);break;case"PageDown":this.__decrease(null,this.step*2);break;case"PageUp":this.__increase(null,this.step*2);break}}}customElements.define("demo-spin-button",g);h();const x=()=>a`
  <nav>
    <button data-invoker>Open menu</button>
    <lion-menu>
      <div role="menuitem">Go to Definition</div>
      <div role="menuitem">Go to Type Definition</div>
      <div>
        <button role="menuitem" data-invoker>Peek</button>
        <lion-menu>
          <div role="menuitem">Peek Call Hierarchy</div>
          <div role="separator"></div>
          <div role="menuitem">Peek Definition</div>
        </lion-menu>
      </div>
      <div role="separator"></div>
      <div role="menuitem">Find all References</div>
    </lion-menu>
  </nav>
`,A=()=>a`
  <nav>
    <button data-invoker for="menu">Open menu</button>
    <lion-menu id="menu">
      <lion-menuitem> Go to Definition </lion-menuitem>
      <lion-menuitem> Go to Type Definition </lion-menuitem>
      <lion-menuitem>
        <button slot="invoker">Peek</button>
        <lion-menu>
          <lion-menuitem type="radio"> Peek Call Hierarchy </lion-menuitem>
          <div role="separator"></div>
          <lion-menuitem type="radio"> Peek Definition </lion-menuitem>
        </lion-menu>
      </lion-menuitem>
      <div role="separator"></div>
      <lion-menuitem type="checkbox"> Find all References </lion-menuitem>
    </lion-menu>
  </nav>
`,w=()=>a`
  <lion-menu bar invoker-interaction="hover">
    <div>
      <div role="menuitem">Font</div>
      <lion-menu aria-label="Font">
        <div role="menuitemradio">Sans-serif</div>
        <div role="menuitemradio">Serif</div>
        <div role="menuitemradio">Monospace</div>
        <div role="menuitemradio">Fantasy</div>
      </lion-menu>
    </div>
    <div>
      <div role="menuitem">Style/Color</div>
      <lion-menu aria-label="Style/Color">
        <div role="menuitemcheckbox" aria-checked="true">Bold</div>
        <div role="menuitemcheckbox" aria-checked="true">Italic</div>
        <div role="separator"></div>
        <div role="group" aria-label="Text Color">
          <div role="menuitemradio" aria-checked="false">Black</div>
          <div role="menuitemradio" aria-checked="false">Blue</div>
          <div role="menuitemradio" aria-checked="true">Red</div>
          <div role="menuitemradio" aria-checked="false">Green</div>
        </div>
        <div role="separator"></div>
        <div role="group" aria-label="Text Decoration">
          <div role="menuitemradio" aria-checked="true">None</div>
          <div role="menuitemradio" aria-checked="false">Overline</div>
          <div role="menuitemradio" aria-checked="false">Line-through</div>
          <div role="menuitemradio" aria-checked="false">Underline</div>
        </div>
      </lion-menu>
    </div>
  </lion-menu>
`,P=()=>a`
  <demo-tree>
    <div role="treeitem">Fruits</div>
    <demo-tree>
      <div role="treeitem">Peek Call Hierarchy</div>
      <div role="treeitem">Peek Definition</div>
    </demo-tree>
    <div role="treeitem">Vegetables</div>
    <demo-tree>
      <div role="treeitem">Peek Call Hierarchy</div>
      <div>
        <div role="treeitem">Peek</div>
        <demo-tree>
          <div role="treeitem">Peek Call Hierarchy</div>
          <div role="treeitem">Peek Definition</div>
        </demo-tree>
      </div>
    </demo-tree>
    <div role="treeitem">Grains</div>
    <demo-tree>
      <div role="treeitem">Peek Call Hierarchy</div>
      <div role="treeitem">Peek Definition</div>
    </demo-tree>
  </demo-tree>
`,C=()=>a`
  <nav aria-label="Mythical University">
    <lion-menu bar ._activeMode="${"tabbable-disclosure"}">
      <div role="listitem">
        <button data-invoker>About</button>
        <lion-menu>
          <div role="listitem">
            <a href="/about/overview">Overview</a>
          </div>
          <div role="listitem">
            <a href="/about/administration">Administration</a>
          </div>
          <div role="listitem">
            <a href="/about/facts">Facts</a>
          </div>
          <div role="listitem">
            <a href="/about/campus-tours">Campus Tours</a>
          </div>
        </lion-menu>
      </div>
      <div role="listitem">
        <button data-invoker>Admissions</button>
        <lion-menu id="id_admissions_menu">
          <div role="listitem">
            <a href="/admissions/apply">Apply</a>
          </div>
          <div role="listitem">
            <a href="/admissions/tuition">Tuition</a>
          </div>
          <div role="listitem">
            <a href="/admissions/sign-up">Sign Up</a>
          </div>
          <div role="listitem">
            <a href="/admissions/visit">Visit</a>
          </div>
          <div role="listitem">
            <a href="/admissions/photo-tour">Photo Tour</a>
          </div>
          <div role="listitem">
            <a href="/admissions/connect">Connect</a>
          </div>
        </lion-menu>
      </div>
      <div role="listitem">
        <button data-invoker>Academics</button>
        <lion-menu>
          <div role="listitem">
            <a href="/academics/colleges-and-schools">Colleges & Schools</a>
          </div>
          <div role="listitem">
            <a href="/academics/programs-of-study">Programs of Study</a>
          </div>
          <div role="listitem">
            <a href="/academics/honors-programs">Honors Programs</a>
          </div>
          <div role="listitem">
            <a href="/academics/online-courses">Online Courses</a>
          </div>
          <div role="listitem">
            <a href="/academics/course-explorer">Course Explorer</a>
          </div>
          <div role="listitem">
            <a href="/academics/register-for-class">Register for Class</a>
          </div>
          <div role="listitem">
            <a href="/academics/academic-calendar">Academic Calendar</a>
          </div>
          <div role="listitem">
            <a href="/academics/transcripts">Transcripts</a>
          </div>
        </lion-menu>
      </div>
    </lion-menu>
  </nav>
`,T=()=>a`
 <nav aria-label="Mythical University">
   <lion-menu bar ._activeMode="${"tabbable-disclosure"}">
    <div role="listitem">
      <a href="/about">About</a>
      <button data-invoker aria-label="More About Pages">▼</button>
      <lion-menu>
        <div role="listitem">
          <a href="/about/overview">Overview</a>
        </div>
        <div role="listitem">
          <a href="/about/administration">Administration</a>
        </div>
        <div role="listitem">
          <a href="/about/facts">Facts</a>
        </div>
        <div role="listitem">
          <a href="/about/campus-tours">Campus Tours</a>
        </div>
      </lion-menu>
    </div>
    <div role="listitem">
      <a href="/admissions">Admissions</a>
      <button data-invoker aria-label="More Admissions Pages">
        ▼
      </button>
      <lion-menu id="id_admissions_menu">
        <div role="listitem">
          <a href="/admissions/apply">Apply</a>
        </div>
        <div role="listitem">
          <a href="/admissions/tuition">Tuition</a>
        </div>
        <div role="listitem">
          <a href="/admissions/sign-up">Sign Up</a>
        </div>
        <div role="listitem">
          <a href="/admissions/visit">Visit</a>
        </div>
        <div role="listitem">
          <a href="/admissions/photo-tour">Photo Tour</a>
        </div>
        <div role="listitem">
          <a href="/admissions/connect">Connect</a>
        </div>
      </lion-menu>
    </div>
    <div role="listitem">
      <a href="/academics">Academics</a>
      <button data-invoker aria-label="More Academics Pages">▼</button>
      <lion-menu>
        <div role="listitem">
          <a href="/academics/colleges-and-schools">Colleges & Schools</a>
        </div>
        <div role="listitem">
          <a href="/academics/programs-of-study">Programs of Study</a>
        </div>
        <div role="listitem">
          <a href="/academics/honors-programs">Honors Programs</a>
        </div>
        <div role="listitem">
          <a href="/academics/online-courses">Online Courses</a>
        </div>
        <div role="listitem">
          <a href="/academics/course-explorer">Course Explorer</a>
        </div>
        <div role="listitem">
          <a href="/academics/register-for-class">Register for Class</a>
        </div>
        <div role="listitem">
          <a href="/academics/academic-calendar">Academic Calendar</a>
        </div>
        <div role="listitem">
          <a href="/academics/transcripts">Transcripts</a>
        </div>
      </lion-menu>
    </div>
  </ul>
</nav>
`,D=()=>a`
  <demo-toolbar>
    <div>
      <button data-item title="bold" aria-label="Bold">
        <span class="fas fa-bold" aria-hidden="true"></span>
      </button>
      <button data-item title="italic" aria-label="Italic">
        <span class="fas fa-italic" aria-hidden="true"></span>
      </button>
      <button data-item title="underline" aria-label="Underline">
        <span class="fas fa-underline" aria-hidden="true"></span>
      </button>
    </div>
    <div role="separator"></div>
    <div role="radiogroup" aria-label="Text Alignment">
      <button data-item role="radio" aria-label="Text Align Left">
        <span class="fas fa-align-left" aria-hidden="true"></span>
      </button>
      <button data-item role="radio" aria-label="Text Align Center">
        <span class="fas fa-align-center" aria-hidden="true"></span>
      </button>
      <button data-item role="radio" aria-label="Text Align Right">
        <span class="fas fa-align-right" aria-hidden="true"></span>
      </button>
    </div>
    <div role="separator"></div>

    <demo-spin-button data-item now="20" min="12" max="40" unit="px"></demo-spin-button>
    <div role="separator"></div>

    <div>
      <div role="menuitem">Font</div>
      <lion-menu aria-label="Font">
        <div role="menuitemradio">Sans-serif</div>
        <div role="menuitemradio">Serif</div>
        <div role="menuitemradio">Monospace</div>
        <div role="menuitemradio">Fantasy</div>
      </lion-menu>
    </div>
    <div>
      <div role="menuitem">Style/Color</div>
      <lion-menu aria-label="Style/Color">
        <div role="menuitemcheckbox" aria-checked="true">Bold</div>
        <div role="menuitemcheckbox" aria-checked="true">Italic</div>
        <div role="separator"></div>
        <div role="group" aria-label="Text Color">
          <div role="menuitemradio" aria-checked="false">Black</div>
          <div role="menuitemradio" aria-checked="false">Blue</div>
          <div role="menuitemradio" aria-checked="true">Red</div>
          <div role="menuitemradio" aria-checked="false">Green</div>
        </div>
        <div role="separator"></div>
        <div role="group" aria-label="Text Decoration">
          <div role="menuitemradio" aria-checked="true">None</div>
          <div role="menuitemradio" aria-checked="false">Overline</div>
          <div role="menuitemradio" aria-checked="false">Line-through</div>
          <div role="menuitemradio" aria-checked="false">Underline</div>
        </div>
      </lion-menu>
    </div>
  </demo-toolbar>
`,E=()=>a`
  <demo-tree>
    <lion-item>
      <div>Fruits</div>
      <demo-tree>
        <lion-item>Peek Call Hierarchy</lion-item>
        <lion-item>Peek Definition</lion-item>
      </demo-tree>
    </lion-item>
    <lion-item>
      <div>Vegetables</div>
      <demo-tree>
        <lion-item>Peek Call Hierarchy</lion-item>
        <lion-item>
          <div>Peek</div>
          <demo-tree>
            <lion-item>Peek Call Hierarchy</lion-item>
            <lion-item>Peek Definition</lion-item>
          </demo-tree>
        </lion-item>
      </demo-tree>
    </lion-item>
    <lion-item>
      <div>Grains</div>
      <demo-tree>
        <lion-item>Peek Call Hierarchy</lion-item>
        <lion-item>Peek Definition</lion-item>
      </demo-tree>
    </lion-item>
  </demo-tree>
`,S=document,M=[{key:"menuButton",story:x},{key:"menuButtonZ",story:A},{key:"groups",story:w},{key:"tree",story:P},{key:"disclosureMenu",story:C},{key:"disclosureMenuWithAnchorsOnL1",story:T},{key:"toolbar",story:D},{key:"treeItem",story:E}];let u=!1;for(const r of M){const e=S.querySelector(`[mdjs-story-name="${r.key}"]`);e&&(e.story=r.story,e.key=r.key,u=!0,Object.assign(e,{simulatorUrl:"/next-preview/feat-lion-playground-rebased/simulator",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}u&&(customElements.get("mdjs-preview")||l(()=>import("./define.BWpRLYnc.js"),__vite__mapDeps([0,1,2,3,4,5,6,7])),customElements.get("mdjs-story")||l(()=>import("./define.BPRa0k46.js"),__vite__mapDeps([8,2,3])));export{C as disclosureMenu,T as disclosureMenuWithAnchorsOnL1,w as groups,x as menuButton,A as menuButtonZ,D as toolbar,P as tree,E as treeItem};
