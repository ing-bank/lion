/* eslint-disable lines-between-class-members */
/* eslint-disable max-classes-per-file */
import { LitElement, html, css } from 'lit';
// import { getCustomElements, getElementData, getPublicFields } from '@api-viewer/common';

const isCustomElementExport = y => y.kind === 'custom-element-definition';
const isCustomElementDeclaration = y => y.customElement;
const isPublic = x => !(x.privacy === 'private' || x.privacy === 'protected');

export function getCustomElements(manifest, only) {
  const exports = (manifest.modules ?? []).flatMap(
    x => x.exports?.filter(isCustomElementExport) ?? [],
  );
  return only ? exports.filter(e => only.includes(e.name)) : exports;
}

class DocElement {
  name = '';
  tagName = '';
  description = '';
  slots = [];
  attributes = [];
  members = [];
  methods = [];
  events = [];
  cssProperties = [];
  cssParts = [];
  properties = [];

  constructor(rawEl) {
    this.name = rawEl.name;
    this.tagName = rawEl.tagName;
    this.description = rawEl.description;
    this.slots = rawEl.slots;
    this.attributes = rawEl.attributes;
    this.methods = rawEl.methods;
    this.members = rawEl.members;
    this.events = rawEl.events;
    this.cssProperties = rawEl.cssProperties;
    this.cssParts = rawEl.cssParts;
    this.properties = rawEl.properties;
  }

  getPublicMethods() {
    return this.methods.filter(isPublic);
  }

  getPublicProperties() {
    return this.properties.filter(isPublic);
  }

  getPublicEvents() {
    return this.events.filter(isPublic);
  }
}

function manifestToDocElements(manifest) {
  const docEls = [];

  const customElements = getCustomElements(manifest);
  for (const customElement of customElements) {
    const { name, module } = customElement.declaration;
    const { name: tagName } = customElement;

    const decl = !module
      ? manifest.modules.flatMap(x => x.declarations).find(y => y?.name === name)
      : manifest.modules
          .find(m => m.path === module.replace(/^\//, ''))
          ?.declarations?.find(d => d.name === name);
    docEls.push(
      new DocElement({
        name,
        tagName,
        description: decl?.description,
        slots: decl.slots ?? [],
        attributes: decl.attributes ?? [],
        members: decl.members ?? [],
        properties: decl.members
          ? decl.members
              .filter(x => x.kind === 'field' && !x.static)
              .map(x => {
                const foundAttribute = decl.attributes.find(a => a.fieldName === x.name);
                if (decl.attributes && foundAttribute) {
                  return { ...x, attribute: foundAttribute.name };
                }
                return x;
              })
              .sort((a, b) => (a.inheritedFrom ? 1 : -1))
          : [],
        methods: decl.members
          ? decl.members
              .filter(x => x.kind === 'method' && !x.static)
              .sort((a, b) => (a.inheritedFrom ? 1 : -1))
          : [],
        events: decl.events ? decl.events.sort((a, b) => (a.inheritedFrom ? 1 : -1)) : [],
        cssParts: decl.cssParts ?? [],
        // TODO: analyzer should sort CSS custom properties
        cssProperties: [...(decl.cssProperties ?? [])].sort((a, b) => (a.name > b.name ? 1 : -1)),
      }),
    );
  }

  return docEls;
}

class ApiTable extends LitElement {
  static properties = {
    cem: { type: Object },
    manifest: { type: String },
    component: { type: String },
    docEls: { type: Object },
  };

  async updated(changedProperties) {
    if (changedProperties.has('manifest')) {
      this.cem = await fetch(this.manifest).then(res => res.json());
      // const el = getElementData(this.cem, this.component);
      // console.log(manifestToDocElements(this.cem));
      this.docEls = manifestToDocElements(this.cem);
    }
  }

  render() {
    return html`
      <h2>Api Table</h2>

      ${this.docEls?.map(
        docEl => html`
          <h3>${docEl.name}</h3>
          <p>${docEl.description}</p>
          <h2>Properties</h2>
          <table>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Type</th>
            </tr>
            ${docEl.getPublicProperties().map(
              prop => html`
                <tr>
                  <td>
                    <strong>${prop.name}</strong>
                    ${prop.attribute
                      ? html` <p class="attribute">
                          [Attr] ${prop.reflects ? html`<span class="reflects">🔁</span>` : ''}
                          ${prop.attribute}
                        </p>`
                      : ''}
                    ${prop.inheritedFrom
                      ? html`<p>(Inherited from ${prop.inheritedFrom.name})</p>`
                      : ''}
                  </td>
                  <td>${prop.description}</td>
                  <td>
                    ${prop.type?.text}
                    ${prop.default && prop.default !== 'undefined'
                      ? html`<p>(Defaults to ${prop.default})</p>`
                      : ''}
                  </td>
                </tr>
              `,
            )}
          </table>
          <h2>Methods</h2>
          <table>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Parameters</th>
              <th>Returns</th>
            </tr>
            ${docEl.getPublicMethods().map(
              prop => html`
                <tr>
                  <td>
                    <strong>${prop.name}</strong>
                    ${prop.inheritedFrom
                      ? html`<p>(Inherited from ${prop.inheritedFrom.name})</p>`
                      : ''}
                  </td>
                  <td>${prop.description}</td>
                  <td>
                    ${prop.parameters?.map(
                      x =>
                        html`<p class="${x.optional ? 'optional' : ''}">
                          ${x.name}: ${x.type?.text}
                        </p>`,
                    )}
                    ${prop.default && prop.default !== 'undefined'
                      ? html`<p>(Defaults to ${prop.default})</p>`
                      : ''}
                  </td>
                  <td>${prop.return?.type?.text}</td>
                </tr>
              `,
            )}
          </table>
          <h2>Events</h2>
          <table>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Type</th>
            </tr>
            ${docEl.getPublicEvents().map(
              prop => html`
                <tr>
                  <td>
                    <strong>${prop.name}</strong>
                    ${prop.inheritedFrom
                      ? html`<p>(Inherited from ${prop.inheritedFrom.name})</p>`
                      : ''}
                  </td>
                  <td>${prop.description}</td>
                  <td>${prop.type?.text}</td>
                </tr>
              `,
            )}
          </table>
        `,
      )}
    `;
  }

  static styles = [
    css`
      table {
        border-collapse: collapse;
      }
      td {
        border-bottom: 1px solid #ccc;
        padding: 10px 0;
      }
      p {
        margin: 0;
      }

      .optional::before {
        content: '[';
      }
      .optional::after {
        content: ']';
      }

      h2 {
        border-bottom: 5px solid rgba(255, 0, 0, 0.5);
      }
    `,
  ];
}

customElements.define('api-table', ApiTable);

// Name
// Inherited From (just a string)
// Description
// Type
// Attribute
// Default Value


// [Read Only]
// [Deprecated since]
// [Added in xxx]

// ## Stuff
// Properties
// Methods
// Events
// Slots
// CSS Properties
// CSS Parts

// NOTE: ignore protected, private and static members for now => later separate table
