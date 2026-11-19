const e=`/** script code **/
import { html } from 'lit';
import '@lion/ui/define/lion-item.js';
import '@lion/ui/define/lion-menu.js';
import '@lion/ui/define/lion-menuitem.js';
import '/node_modules/_lion_docs/components/menu/src/DemoTree.js';
import '/node_modules/_lion_docs/components/menu/src/DemoToolbar.js';
import '/node_modules/_lion_docs/components/menu/src/DemoSpinButton.js';
import { applyMenuDemoStyles } from '/node_modules/_lion_docs/components/menu/applyMenuDemoStyles.js';

applyMenuDemoStyles();
/** stories code **/
export const menuButton = () => html\`
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
\`;
export const menuButtonZ = () => html\`
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
\`;
export const groups = () => html\`
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
\`;
export const tree = () => html\`
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
\`;
export const disclosureMenu = () => html\`
  <nav aria-label="Mythical University">
    <lion-menu bar ._activeMode="\${'tabbable-disclosure'}">
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
\`;
export const disclosureMenuWithAnchorsOnL1 = () => html\`
 <nav aria-label="Mythical University">
   <lion-menu bar ._activeMode="\${'tabbable-disclosure'}">
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
\`;
export const toolbar = () => html\`
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
\`;
export const treeItem = () => html\`
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
\`;
/** stories setup code **/
const rootNode = document;
const stories = [{ key: 'menuButton', story: menuButton }, { key: 'menuButtonZ', story: menuButtonZ }, { key: 'groups', story: groups }, { key: 'tree', story: tree }, { key: 'disclosureMenu', story: disclosureMenu }, { key: 'disclosureMenuWithAnchorsOnL1', story: disclosureMenuWithAnchorsOnL1 }, { key: 'toolbar', story: toolbar }, { key: 'treeItem', story: treeItem }];
let needsMdjsElements = false;
for (const story of stories) {
  const storyEl = rootNode.querySelector(\`[mdjs-story-name="\${story.key}"]\`);
  if (storyEl) {
    storyEl.story = story.story;
    storyEl.key = story.key;
    needsMdjsElements = true;
    Object.assign(storyEl, {"simulatorUrl":"/next-preview/feat-lion-playground-rebased/simulator","languages":[{"key":"de-DE","name":"German"},{"key":"en-GB","name":"English (United Kingdom)"},{"key":"en-US","name":"English (United States)"},{"key":"nl-NL","name":"Dutch"}]});
  }
};
if (needsMdjsElements) {
  if (!customElements.get('mdjs-preview')) { import('/node_modules/@mdjs/mdjs-preview/src/define/define.js'); }
  if (!customElements.get('mdjs-story')) { import('/node_modules/@mdjs/mdjs-story/src/define.js'); }
}`;export{e as default};
