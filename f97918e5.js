import{i as o,x as e,a as i}from"./b4be29f1.js";import{O as t}from"./65cdf028.js";import{w as l}from"./c84885cc.js";class r extends(t(o)){static get properties(){return{isAlertDialog:{type:Boolean,attribute:"is-alert-dialog"}}}constructor(){super(),this.isAlertDialog=!1}_defineOverlayConfig(){return{...l(),isAlertDialog:this.isAlertDialog}}render(){return e`
      <slot name="invoker"></slot>
      <div id="overlay-content-node-wrapper">
        <slot name="content"></slot>
      </div>
    `}}customElements.define("lion-dialog",r);const n=i`
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
`;export{n as d};
