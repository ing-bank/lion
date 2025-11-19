/** script code **/
import { html } from '@mdjs/mdjs-preview';
import { renderLitAsNode } from '@lion/ui/helpers.js';
import { ajax, createCacheInterceptors } from '@lion/ajax';
import '@lion/ui/define-helpers/sb-action-logger.js';

const getCacheIdentifier = () => {
  let userId = localStorage.getItem('lion-ajax-cache-demo-user-id');
  if (!userId) {
    localStorage.setItem('lion-ajax-cache-demo-user-id', '1');
    userId = '1';
  }
  return userId;
};

const TEN_MINUTES = 1000 * 60 * 10; // in milliseconds

const cacheOptions = {
  useCache: true,
  maxAge: TEN_MINUTES,
};

const { cacheRequestInterceptor, cacheResponseInterceptor } = createCacheInterceptors(
  getCacheIdentifier,
  cacheOptions,
);

ajax.addRequestInterceptor(cacheRequestInterceptor);
ajax.addResponseInterceptor(cacheResponseInterceptor);
/** stories code **/
export const getRequest = () => {
  const actionLogger = renderLitAsNode(html`<sb-action-logger></sb-action-logger>`);

  const fetchHandler = name => {
    ajax
      .fetch(`../assets/${name}.json`)
      .then(response => response.json())
      .then(result => {
        actionLogger.log(JSON.stringify(result, null, 2));
      });
  };

  return html`
    <style>
      sb-action-logger {
        --sb-action-logger-max-height: 300px;
      }
    </style>
    <button @click="${() => fetchHandler('pabu')}">Fetch Pabu</button>
    <button @click="${() => fetchHandler('naga')}">Fetch Naga</button>
    ${actionLogger}
  `;
};
export const getJsonRequest = () => {
  const actionLogger = renderLitAsNode(html`<sb-action-logger></sb-action-logger>`);

  const fetchHandler = name => {
    ajax.fetchJson(`../assets/${name}.json`).then(result => {
      console.log(result.response);
      actionLogger.log(JSON.stringify(result.body, null, 2));
    });
  };

  return html`
    <style>
      sb-action-logger {
        --sb-action-logger-max-height: 300px;
      }
    </style>
    <button @click="${() => fetchHandler('pabu')}">Fetch Pabu</button>
    <button @click="${() => fetchHandler('naga')}">Fetch Naga</button>
    ${actionLogger}
  `;
};
export const errorHandling = () => {
  const actionLogger = renderLitAsNode(html`<sb-action-logger></sb-action-logger>`);

  const fetchHandler = async () => {
    try {
      const users = await ajax.fetchJson('/api/users');
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          // handle a specific status code, for example 400 bad request
        } else {
          actionLogger.log(error);
        }
      } else {
        // an error happened before receiving a response,
        // Example: an incorrect request or network error
        actionLogger.log(error);
      }
    }
  };

  return html`
    <style>
      sb-action-logger {
        --sb-action-logger-max-height: 300px;
      }
    </style>
    <button @click="${fetchHandler}">Fetch</button>
    ${actionLogger}
  `;
};
export const cache = () => {
  const actionLogger = renderLitAsNode(html`<sb-action-logger></sb-action-logger>`);

  const fetchHandler = name => {
    ajax.fetchJson(`../assets/${name}.json`).then(result => {
      actionLogger.log(`From cache: ${result.response.fromCache || false}`);
      actionLogger.log(JSON.stringify(result.body, null, 2));
    });
  };

  return html`
    <style>
      sb-action-logger {
        --sb-action-logger-max-height: 300px;
      }
    </style>
    <button @click="${() => fetchHandler('pabu')}">Fetch Pabu</button>
    <button @click="${() => fetchHandler('naga')}">Fetch Naga</button>
    ${actionLogger}
  `;
};
export const cacheActionOptions = () => {
  const actionLogger = renderLitAsNode(html`<sb-action-logger></sb-action-logger>`);

  const fetchHandler = name => {
    let actionCacheOptions;
    if (name === 'naga') {
      actionCacheOptions = {
        useCache: false,
      };
    }

    ajax.fetchJson(`../assets/${name}.json`, { cacheOptions: actionCacheOptions }).then(result => {
      actionLogger.log(`From cache: ${result.response.fromCache || false}`);
      actionLogger.log(JSON.stringify(result.body, null, 2));
    });
  };

  return html`
    <style>
      sb-action-logger {
        --sb-action-logger-max-height: 300px;
      }
    </style>
    <button @click="${() => fetchHandler('pabu')}">Fetch Pabu</button>
    <button @click="${() => fetchHandler('naga')}">Fetch Naga</button>
    ${actionLogger}
  `;
};
export const cacheMaxAge = () => {
  const actionLogger = renderLitAsNode(html`<sb-action-logger></sb-action-logger>`);

  const fetchHandler = () => {
    ajax
      .fetchJson(`../assets/pabu.json`, {
        cacheOptions: {
          maxAge: 1000 * 3, // 3 seconds
        },
      })
      .then(result => {
        actionLogger.log(`From cache: ${result.response.fromCache || false}`);
        actionLogger.log(JSON.stringify(result.body, null, 2));
      });
  };

  return html`
    <style>
      sb-action-logger {
        --sb-action-logger-max-height: 300px;
      }
    </style>
    <button @click="${fetchHandler}">Fetch Pabu</button>
    ${actionLogger}
  `;
};
export const changeCacheIdentifier = () => {
  const actionLogger = renderLitAsNode(html`<sb-action-logger></sb-action-logger>`);

  const fetchHandler = () => {
    ajax.fetchJson(`../assets/pabu.json`).then(result => {
      actionLogger.log(`From cache: ${result.response.fromCache || false}`);
      actionLogger.log(JSON.stringify(result.body, null, 2));
    });
  };

  const changeUserHandler = () => {
    const currentUser = parseInt(localStorage.getItem('lion-ajax-cache-demo-user-id'), 10);
    localStorage.setItem('lion-ajax-cache-demo-user-id', `${currentUser + 1}`);
  };

  return html`
    <style>
      sb-action-logger {
        --sb-action-logger-max-height: 300px;
      }
    </style>
    <button @click="${fetchHandler}">Fetch Pabu</button>
    <button @click="${changeUserHandler}">Change user</button>
    ${actionLogger}
  `;
};
export const nonGETRequest = () => {
  const actionLogger = renderLitAsNode(html`<sb-action-logger></sb-action-logger>`);

  const fetchHandler = (name, method) => {
    ajax.fetchJson(`../assets/${name}.json`, { method }).then(result => {
      actionLogger.log(`From cache: ${result.response.fromCache || false}`);
      actionLogger.log(JSON.stringify(result.body, null, 2));
    });
  };

  return html`
    <style>
      sb-action-logger {
        --sb-action-logger-max-height: 300px;
      }
    </style>
    <button @click="${() => fetchHandler('pabu', 'GET')}">GET Pabu</button>
    <button @click="${() => fetchHandler('pabu', 'PATCH')}">PATCH Pabu</button>
    <button @click="${() => fetchHandler('naga', 'GET')}">GET Naga</button>
    <button @click="${() => fetchHandler('naga', 'PATCH')}">PATCH Naga</button>
    ${actionLogger}
  `;
};
export const invalidateRules = () => {
  const actionLogger = renderLitAsNode(html`<sb-action-logger></sb-action-logger>`);

  const fetchHandler = (name, method) => {
    const actionCacheOptions = {};
    if (name === 'pabu') {
      actionCacheOptions.invalidateUrlsRegex = /\/docs\/tools\/ajax\/assets\/naga.json/;
    }

    ajax
      .fetchJson(`../assets/${name}.json`, {
        method,
        cacheOptions: actionCacheOptions,
      })
      .then(result => {
        actionLogger.log(`From cache: ${result.response.fromCache || false}`);
        actionLogger.log(JSON.stringify(result.body, null, 2));
      });
  };

  return html`
    <style>
      sb-action-logger {
        --sb-action-logger-max-height: 300px;
      }
    </style>
    <button @click="${() => fetchHandler('pabu', 'GET')}">GET Pabu</button>
    <button @click="${() => fetchHandler('pabu', 'PATCH')}">PATCH Pabu</button>
    <button @click="${() => fetchHandler('naga', 'GET')}">GET Naga</button>
    <button @click="${() => fetchHandler('naga', 'PATCH')}">PATCH Naga</button>
    ${actionLogger}
  `;
};
/** stories setup code **/
const rootNode = document;
const stories = [{ key: 'getRequest', story: getRequest }, { key: 'getJsonRequest', story: getJsonRequest }, { key: 'errorHandling', story: errorHandling }, { key: 'cache', story: cache }, { key: 'cacheActionOptions', story: cacheActionOptions }, { key: 'cacheMaxAge', story: cacheMaxAge }, { key: 'changeCacheIdentifier', story: changeCacheIdentifier }, { key: 'nonGETRequest', story: nonGETRequest }, { key: 'invalidateRules', story: invalidateRules }];
let needsMdjsElements = false;
for (const story of stories) {
  const storyEl = rootNode.querySelector(`[mdjs-story-name="${story.key}"]`);
  if (storyEl) {
    storyEl.story = story.story;
    storyEl.key = story.key;
    needsMdjsElements = true;
    Object.assign(storyEl, {"simulatorUrl":"/next/simulator/","languages":[{"key":"de-DE","name":"German"},{"key":"en-GB","name":"English (United Kingdom)"},{"key":"en-US","name":"English (United States)"},{"key":"nl-NL","name":"Dutch"}]});
  }
};
if (needsMdjsElements) {
  if (!customElements.get('mdjs-preview')) { import('/node_modules/@mdjs/mdjs-preview/src/define/define.js'); }
  if (!customElements.get('mdjs-story')) { import('/node_modules/@mdjs/mdjs-story/src/define.js'); }
}