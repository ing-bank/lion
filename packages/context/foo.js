import { state } from 'ing-web-overlays-state';
return {
  // locale: 'en',
  overlays: [Dialog1, Popup2, ...],
  blockBody:
}

import { state } from 'ing-web-overlays-state';


// ing-web 1.x 2.x
//   - ing-web-overlays-state 1.x
//   - ing-web-localize-state 1.x (localize ) localize.fooMsg = '...';???
//   - ing-web-snackbar-state 1.x
//   - ing-web-icons-state 1.x (icons storage?) storage.fooIcon = '<svg...' ???

//   - ing-web-ajax 1.x
//



// node_modules/ing-web/ 1.x
// node_modules/ing-web-localize/ 1.x
// node_modules/feat-foo/node_modules/ing-web/ 2.x <<---
// node_modules/feat-bar/node_modules/ing-web/ 2.x

// => import maps / or webpack plugin / or rollup plugin

localize.msg('hey {startDate | date}')

const foo = html`
  <lion-form>
    <div>
      <lion-input></lion-input>
      <!-- comment -->
    </div>
  </lion-form>

  <body>
    1. 6.
    <div>2. 5. <ing-input></ing-input> 3. 4.</div>

    <fake-localize .data=${{ en: 'foo' }}>
      <ing-input></ing-input>
    </fake-localize>


    <fake-localize .data=${{ en: 'foo' }}>
      <ing-input></ing-input>
    </fake-localize>

  </body>
`;

const localize = {
  msg: () => {
    depManager.get('localize').msg();
  }
}

localize 1.x // dep intl message system (10k)
localize 2.x // (3k)

App1 => localize 2.x =>

App2 => new localize = Features localize 1.x + localize 2.x

localize = {
  window.locale: 'en',
  window.data = '',

  msg(text) {
    // load intlMsg
    return IntlMsg(text);

    return stringConcat; //2.x
  }
}

localize = {
  window.locale: 'nl',
  window.data = '',
}

localize.setupNamespaceLoader((locale) => {
  fetch('...').then(...);
})

import { localizeSymbol } from 'ing-localize';

class IngInput {
  static get getDependencies() {
    this.localize = depManager.get(localizeSymbol);
  }

  connectedCallback() {
    localize.msg();
    localize.msg2();
  }

  render() {
    console.log(this.localize);
  }
}
