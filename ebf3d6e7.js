import{i as e,a as t,x as r}from"./b4be29f1.js";import{L as i}from"./298b3bc0.js";import{L as s}from"./9e1b447d.js";class n extends e{static properties={field:Object,show:Array,title:String,readyPromise:Object};static styles=[t`
      :host {
        display: block;
        margin-top: 8px;
      }

      code {
        font-size: 8px;
        background-color: #eee;
      }

      caption {
        position: absolute;
        top: 0;
        width: 1px;
        height: 1px;
        overflow: hidden;
        clip-path: inset(100%);
        clip: rect(1px, 1px, 1px, 1px);
        white-space: nowrap;
        border: 0;
        margin: 0;
        padding: 0;
      }

      table,
      th,
      td {
        border-bottom: 1px solid rgb(204, 204, 204);
        border-image: initial;
        padding: 4px;
        font-size: 12px;
        border-left: none;
        border-right: none;
        text-align: left;
      }

      td {
        max-width: 200px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      table {
        border-collapse: collapse;
      }

      caption {
        text-align: left;
      }
    `];firstUpdated(e){if(super.firstUpdated(e),!this.field){const e=this.previousElementSibling;(e instanceof i||e instanceof s)&&(this.field=e)}this.__rerender=this.__rerender.bind(this);const t=this.closest("[mdjs-story-name]")||this.parentElement;t.addEventListener("model-value-changed",this.__rerender),t.addEventListener("mousemove",this.__rerender),t.addEventListener("focusin",this.__rerender),t.addEventListener("focusout",this.__rerender),t.addEventListener("change",this.__rerender),this.field._inputNode.form&&this.field._inputNode.form.addEventListener("submit",this.__rerender),this.readyPromise&&this.readyPromise.then(()=>{this.__rerender()})}__rerender(){setTimeout(()=>{const e=this.field;this.field=null,this.field=e})}__renderProp(e){const t=this.field||{};let i="";if("string"==typeof e){const s=t[e];if("boolean"==typeof s)return!0===s?"✓":"";if(void 0===s)return r`<code>undefined</code>`;if("object"==typeof s&&null!==s)return JSON.stringify(s);i=s}else i=e.processor(t);return r`<span title="${i}">${i}</span>`}constructor(){super(),this.title="States"}render(){return r`
      <table>
        <caption>
          ${this.title}
        </caption>
        <tr>
          ${this.show.map(e=>r`<th>${(e=>"string"==typeof e?e:e.name)(e)}</th>`)}
        </tr>
        <tr></tr>
        <tr>
          ${this.show.map(e=>r`<td>${this.__renderProp(e)}</td>`)}
        </tr>
      </table>
    `}}customElements.define("h-output",n);
