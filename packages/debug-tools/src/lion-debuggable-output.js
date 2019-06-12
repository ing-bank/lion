import { LitElement, css, html  } from '@lion/core';

import { getPrototypeChain } from './Util.js';
import './ui-tools/lion-disclosure.js';

/* eslint-disable no-underscore-dangle, class-methods-use-this */

/**
 * Contextual info:
 *
 * - Debuggable : element that is patched, so it can be used to realtime read out a set of values
 *   (on hover)
 *   Please use LionDebugManager to create debuggables:
 *   DebugManager.makeDebuggable(elementToDebug,[props, to, show])
 */
class LionDebuggableOutput extends LitElement {
  static get properties() {
    return {
      active: {
        type: Boolean,
      },
      props: {
        type: Array,
      },
      element: {
        type: Object,
      },
      id: {
        type: String,
      },
      _protoChain: {
        type: Object,
      },
    };
  }

  updated(c) {
    if (c.has('active')) {
      this._onActiveChanged({ active: this.active });
    } else
    if (c.has('element')) {
      this._setProtoChain({ element: this.element });
    }
  }

  constructor() {
    super();
    this.props = [];
    this.active = false;
  }

  _setProtoChain({ element }) {
    this._protoChain = getPrototypeChain(element.constructor);
  }

  _onActiveChanged({ active }) {
    // since value changed, lit-html should automatically rerender
    this.style.display = active ? '' : 'none';
  }

  // Table content

  _printPropOrObject(propNameOrObj) {
    if (typeof propNameOrObj === 'object') {
      if (propNameOrObj.type === 'expression') {
        return propNameOrObj.expression(this.element); // print the output of expr
      }
    } else if (typeof propNameOrObj === 'string') {
      return this._printProp(this.element[propNameOrObj]);
    }
    return '';
  }

  _printProp(prop) {
    const isObj = Object.prototype.toString.call(prop) === '[object Object]';
    return isObj ? window.JSON.stringify(prop) : prop;
  }

  // Table headers

  _printPropNameOrObject(propNameOrObj) {
    if (typeof propNameOrObj === 'object') {
      if (propNameOrObj.type === 'expression') {
        return propNameOrObj.name; // print the output of expr
      } // else
      if (propNameOrObj.type === 'group') {
        return propNameOrObj.name; // print the output of expr
      }
    } else if (typeof propNameOrObj === 'string') {
      return propNameOrObj;
    }
    return '';
  }

  rerender() {
    // TODO: debounce/ throttle, except first
    setTimeout(() => {
      this.props = this.props.slice();
    }, 10); // perf + gives async handlers time to do their stuff
  }

  get _protoToggleElement() {
    return this.shadowRoot.querySelector('lion-disclosure');
  }

  static get styles() {
    return css`
      .debuggable-output__table th {
        font-weight: bold;
      }
      .debuggable-output__title small {
        font-size: 0.6rem;
      }
      .debuggable-output__title-id {
        color: gray;
      }
      .debuggable-output__title-proto {
        color: darkgray;
      }
    `;
  }

  render() {
    return html`
      <table class="debuggable-output__table">
        <legend class="debuggable-output__title">
          Debug info ${this.element ? this.element.localName : ''}
          <small class="debuggable-output__title-id">(${this.id})</small>
          <lion-disclosure>
            <button data-disclosure-invoker>
              ${this._protoToggleElement && this._protoToggleElement.opened ? 'hide' : 'show'}
              prototype chain
            </button>
            <div data-disclosure-content class="debuggable-output__title-proto">
              <small
                >${
                  this._protoChain
                    ? this._protoChain
                        .map(p => p.name)
                        .filter(p => p)
                        .join(' > ')
                    : ''
                }
              </small>
            </div>
          </lion-disclosure>
        </legend>
        <tr>
          ${
            this.props.map(
              propNameOrObject => html`
                <th>${this._printPropNameOrObject(propNameOrObject)}</th>
              `,
            )
          }
        </tr>
        <tr>
          ${
            this.props.map(
              propNameOrObject => html`
                <td>${this._printPropOrObject(propNameOrObject)}</td>
              `,
            )
          }
        </tr>
      </table>
    `;
  }
}

customElements.define('lion-debuggable-output', LionDebuggableOutput);
