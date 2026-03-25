import{S as e}from"./f1151d68.js";import{i as t,x as o}from"./b8bc2eda.js";import"./6638bb86.js";import{L as n}from"./34d91c54.js";import"./6722e641.js";class s extends(e(t)){static get scopedElements(){return{"lion-accordion":n}}render(){return o`
      <lion-accordion>
        <h3 slot="invoker">
          <button>Sensory Factors</button>
        </h3>
        <div slot="content">
          <p>
            The taste of oranges is determined mainly by the relative ratios of sugars and acids,
            whereas orange aroma derives from volatile organic compounds, including alcohols,
            aldehydes, ketones, terpenes, and esters. Bitter limonoid compounds, such as limonin,
            decrease gradually during development, whereas volatile aroma compounds tend to peak in
            mid– to late–season development. Taste quality tends to improve later in harvests when
            there is a higher sugar/acid ratio with less bitterness. As a citrus fruit, the orange
            is acidic, with pH levels ranging from 2.9 to 4.0. <a href="#">Link</a>
          </p>
          <p>
            Sensory qualities vary according to genetic background, environmental conditions during
            development, ripeness at harvest, postharvest conditions, and storage duration.
          </p>
        </div>
        <h3 slot="invoker">
          <button>Nutritional value</button>
        </h3>
        <div slot="content">
          Orange flesh is 87% water, 12% carbohydrates, 1% protein, and contains negligible fat
          (table). In a 100 gram reference amount, orange flesh provides 47 calories, and is a rich
          source of vitamin C, providing 64% of the Daily Value. No other micronutrients are present
          in significant amounts (table).
        </div>
      </lion-accordion>
    `}}customElements.define("my-component",s);const i=()=>o`<my-component></my-component>`,r=document,a=[{key:"overview",story:i}];let d=!1;for(const e of a){const t=r.querySelector(`[mdjs-story-name="${e.key}"]`);t&&(t.story=e.story,t.key=e.key,d=!0,Object.assign(t,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}d&&(customElements.get("mdjs-preview")||import("./e90784d0.js"),customElements.get("mdjs-story")||import("./0defd61d.js"));export{i as overview};
