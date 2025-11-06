import{i as t,a as e,x as s}from"./b4be29f1.js";class n extends t{static get styles(){return[e`
        :host {
          display: block;
        }

        :host([hidden]) {
          display: none;
        }
      `]}static get properties(){return{data:{type:Object},current:{type:Number}}}constructor(){super(),this.data={},this._internalCurrentSync=!0,this.current=0,this._max=0}firstUpdated(t){super.firstUpdated(t),this._max=this.steps.length-1;let e=!1;this.steps.forEach((t,s)=>{t.initialStep&&0!==s&&(this.current=s,e=!0)}),!e&&this.steps[0]&&this.steps[0].enter()}updated(t){super.updated(t),t.has("current")&&this._onCurrentChanged({current:this.current},{current:t.get("current")})}render(){return s`<slot></slot>`}next(){this._goTo(this.current+1,this.current)}previous(){this._goTo(this.current-1,this.current)}get steps(){const t=this.shadowRoot?.querySelector("slot:not([name])");return t.assignedNodes().filter(t=>t.nodeType===Node.ELEMENT_NODE)}static enabledWarnings=super.enabledWarnings?.filter(t=>"change-in-update"!==t)||[];_goTo(t,e){if(t<0||t>this._max)throw new Error(`There is no step at index ${t}.`);const s=this.steps[t],n=t<e;s.passesCondition(this.data)?n&&s.forwardOnly?this._goTo(t-1,e):this._changeStep(t,e):(s.skip(),n?this._goTo(t-1,e):this._goTo(t+1,e))}_changeStep(t,e){const s=this.steps[e],n=this.steps[t],i={number:e,element:s},r={number:t,element:n};s.leave(),this.current!==t&&(this._internalCurrentSync=!0,this.current=t),n.enter(),this._dispatchTransitionEvent(i,r)}_dispatchTransitionEvent(t,e){this.dispatchEvent(new CustomEvent("transition",{bubbles:!0,composed:!0,detail:{fromStep:t,toStep:e}}))}_onCurrentChanged(t,e){this._internalCurrentSync?this._internalCurrentSync=!1:this._goTo(t.current,e.current)}}class i extends t{static get properties(){return{status:{type:String,reflect:!0},condition:{attribute:!1},invertCondition:{type:Boolean,reflect:!0,attribute:"invert-condition"},forwardOnly:{type:Boolean,reflect:!0,attribute:"forward-only"},initialStep:{type:Boolean,reflect:!0,attribute:"initial-step"}}}constructor(){super(),this.status="untouched",this.condition=t=>!0,this.invertCondition=!1,this.forwardOnly=!1,this.initialStep=!1}static get styles(){return[e`
        :host {
          display: none;
        }

        :host([hidden]) {
          display: none;
        }

        :host([status='entered']) {
          display: block;
        }
      `]}render(){return s`<slot></slot>`}firstUpdated(t){super.firstUpdated(t),this.controller=this.parentNode}enter(){this.status="entered",this.dispatchEvent(new CustomEvent("enter",{bubbles:!0,composed:!0}))}leave(){this.status="left",this.dispatchEvent(new CustomEvent("leave",{bubbles:!0,composed:!0}))}skip(){this.status="skipped",this.dispatchEvent(new CustomEvent("skip",{bubbles:!0,composed:!0}))}passesCondition(t){const e=this.condition(t);return this.invertCondition?!e:e}static enabledWarnings=super.enabledWarnings?.filter(t=>"change-in-update"!==t)||[]}customElements.define("lion-steps",n),customElements.define("lion-step",i);
