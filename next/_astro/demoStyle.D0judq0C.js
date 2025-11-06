import{i as o,a as e}from"./lit-element.qDHKJJma.js";import{x as i}from"./lit-html.C7L4dwLU.js";import{O as t}from"./OverlayMixin.yM-HkbSu.js";import{w as l}from"./withModalDialogConfig.CPyLhuB7.js";class r extends t(o){static get properties(){return{isAlertDialog:{type:Boolean,attribute:"is-alert-dialog"}}}constructor(){super(),this.isAlertDialog=!1}_defineOverlayConfig(){return{...l(),isAlertDialog:this.isAlertDialog}}render(){return i`
      <slot name="invoker"></slot>
      <div id="overlay-content-node-wrapper">
        <slot name="content"></slot>
      </div>
    `}}customElements.define("lion-dialog",r);const c=e`
  .demo-box {
    width: 200px;
    background-color: white;
    border-radius: 2px;
    border: 1px solid grey;
    padding: 8px;
  }
  .demo-box_placements {
    display: flex;
    flex-direction: column;
    margin-top: 20px;
  }
  lion-dialog {
    display: block;
    padding: 10px;
    margin-bottom: 10px;
  }
  .close-button {
    color: black;
    font-size: 28px;
    line-height: 28px;
  }
  .demo-box__column {
    display: flex;
    flex-direction: column;
  }
  .demo-dialog--content {
    display: block;
    position: absolute;
    font-size: 16px;
    color: white;
    background-color: black;
    border-radius: 4px;
    padding: 8px;
  }

  .demo-dialog-content {
    display: block;
    position: absolute;
    font-size: 16px;
    color: white;
    background-color: black;
    border-radius: 4px;
    padding: 8px;
  }

  .demo-dialog-content__close-button {
    color: black;
    font-size: 28px;
    line-height: 28px;
    padding: 0;
    border-style: none;
  }
`;export{c as d};
