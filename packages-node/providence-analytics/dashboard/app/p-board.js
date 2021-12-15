/* eslint-disable lit-a11y/no-invalid-change-handler */
/* eslint-disable max-classes-per-file */
import { LitElement, html, css } from 'lit-element';
import { tooltip as tooltipStyles } from './styles/tooltip.css.js';
import { global as globalStyles } from './styles/global.css.js';
import { utils as utilsStyles } from './styles/utils.css.js';
import { tableDecoration } from './styles/tableDecoration.css.js';
import { GlobalDecorator } from './utils/GlobalDecorator.js';
import { DecorateMixin } from './utils/DecorateMixin.js';
import { downloadFile } from './utils/downloadFile.js';
import { PTable } from './components/p-table/PTable.js';

// Decorate third party component styles
GlobalDecorator.decorateStyles(globalStyles, { prepend: true });
PTable.decorateStyles(tableDecoration);

customElements.define('p-table', PTable);

/**
 *
 * @param {{ project:string, filePath:string, name:string }} specifierRes
 * @param {{ categoryConfig:object }} metaConfig
 * @returns {string[]}
 */
function getCategoriesForMatchedSpecifier(specifierRes, { metaConfig }) {
  const resultCats = [];

  if (metaConfig && metaConfig.categoryConfig) {
    const { project, filePath, name } = specifierRes.exportSpecifier;
    // First of all, do we have a matching project?
    // TODO: we should allow different configs for different (major) versions
    const match = metaConfig.categoryConfig.find(cat => cat.project === project);
    if (match) {
      Object.entries(match.categories).forEach(([categoryName, matchFn]) => {
        if (matchFn(filePath, name)) {
          resultCats.push(categoryName);
        }
      });
    }
  }
  return resultCats;
}

function checkedValues(checkboxOrNodeList) {
  if (!checkboxOrNodeList.length) {
    return checkboxOrNodeList.checked && checkboxOrNodeList.value;
  }
  return Array.from(checkboxOrNodeList)
    .filter(r => r.checked)
    .map(r => r.value);
}
class PBoard extends DecorateMixin(LitElement) {
  static get properties() {
    return {
      // Transformed data from fetch
      tableData: Object,
      __resultFiles: Array,
      __menuData: Object,
    };
  }

  static get styles() {
    return [
      ...super.styles,
      utilsStyles,
      tooltipStyles,
      css`
        p-table {
          border: 1px solid gray;
          display: block;
          margin: 2px;
        }

        .heading {
          font-size: 1.5em;
          letter-spacing: 0.1em;
        }

        .heading__part {
          color: var(--primary-color);
        }

        .menu-group {
          display: flex;
          flex-wrap: wrap;
          flex-direction: column;
        }
      `,
    ];
  }

  /**
   * @param {object} referenceCollections references defined in providence.conf.js Includes reference projects
   * @param {object} searchTargetCollections programs defined in providence.conf.js. Includes search-target projects
   * @param {object[]} projDeps deps retrieved by running providence, read from search-target-deps-file.json
   */
  _selectionMenuTemplate(result) {
    if (!result) {
      return html``;
    }
    const { referenceCollections, searchTargetDeps } = result;
    return html`
      <test-table></test-table>

      <form class="u-c-mv2" id="selection-menu-form" action="" @change="${this._aggregateResults}">
        <fieldset>
          <legend>References (grouped by collection)</legend>
          ${Object.keys(referenceCollections).map(
            colName => html`
              <div role="separator">${colName}</div>
              ${referenceCollections[colName].map(
                refName => html`
                  <label
                    ><input
                      type="checkbox"
                      name="references"
                      .checked=${colName === 'lion-based-ui'}
                      .value="${refName}"
                    />${refName}</label
                  >
                `,
              )}
            `,
          )}
        </fieldset>

        <fieldset>
          <legend>Repositories (grouped by search target)</legend>
          ${Object.keys(searchTargetDeps).map(
            rootProjName => html`
              <details>
                <summary>
                  <span class="u-bold">${rootProjName}</span>
                  <input
                    aria-label="check all"
                    type="checkbox"
                    checked
                    @change="${({ target }) => {
                      // TODO: of course, logic depending on dom is never a good idea
                      const groupBoxes =
                        target.parentElement.nextElementSibling.querySelectorAll(
                          'input[type=checkbox]',
                        );
                      const { checked } = target;
                      Array.from(groupBoxes).forEach(box => {
                        // eslint-disable-next-line no-param-reassign
                        box.checked = checked;
                      });
                    }}"
                  />
                </summary>
                <div class="menu-group">
                  ${searchTargetDeps[rootProjName].map(
                    dep => html`
                      <label
                        ><input
                          type="checkbox"
                          name="repos"
                          .checked="${dep}"
                          .value="${dep}"
                        />${dep}</label
                      >
                    `,
                  )}
                </div>
                <hr />
              </details>
            `,
          )}
        </fieldset>
      </form>
    `;
  }

  _activeAnalyzerSelectTemplate() {
    return html`
      <select id="active-analyzer" @change="${this._onActiveAnalyzerChanged}">
        ${Object.keys(this.__resultFiles).map(
          analyzerName => html` <option value="${analyzerName}">${analyzerName}</option> `,
        )}
      </select>
    `;
  }

  _onActiveAnalyzerChanged() {
    this._aggregateResults();
  }

  get _selectionMenuFormNode() {
    return this.shadowRoot.getElementById('selection-menu-form');
  }

  get _activeAnalyzerNode() {
    return this.shadowRoot.getElementById('active-analyzer');
  }

  get _tableNode() {
    return this.shadowRoot.querySelector('p-table');
  }

  _createCsv(headers = this._tableNode._viewDataHeaders, data = this._tableNode._viewData) {
    let result = 'sep=;\n';
    result += `${headers.join(';')}\n`;
    data.forEach(row => {
      result += `${Object.values(row)
        .map(v => {
          if (Array.isArray(v)) {
            const res = [];
            v.forEach(vv => {
              // TODO: make recursive
              if (typeof vv === 'string') {
                res.push(vv);
              } else {
                // typeof v === 'object'
                res.push(JSON.stringify(vv));
              }
            });
            return res.join(', ');
          }
          if (typeof v === 'object') {
            // This has knowledge about specifier.
            // TODO make more generic and add toString() to this obj in generation pahse
            return v.name;
          }
          return v;
        })
        .join(';')}\n`;
    });
    return result;
  }

  render() {
    return html`
      <div style="display:flex; align-items: baseline;">
        <h1 class="heading">providence <span class="heading__part">dashboard</span> (alpha)</h1>
        <div class="u-ml2">
          ${this._activeAnalyzerSelectTemplate()}
          <button @click="${() => downloadFile('data.csv', this._createCsv())}">get csv</button>
        </div>
      </div>
      ${this._selectionMenuTemplate(this.__menuData)}
      <p-table .data="${this.tableData}" class="u-mt3"></p-table>
    `;
  }

  constructor() {
    super();
    this.__resultFiles = [];
    this.__menuData = null;
  }

  firstUpdated(...args) {
    super.firstUpdated(...args);
    this._tableNode.renderCellContent = this._renderCellContent.bind(this);
    this.__init();
  }

  async __init() {
    await this.__fetchMenuData();
    await this.__fetchResults();
    await this.__fetchProvidenceConf();
    this._enrichMenuData();
  }

  updated(changedProperties) {
    super.updated(changedProperties);

    if (changedProperties.has('__menuData')) {
      this._aggregateResults();
    }
  }

  /**
   * Gets all selection menu data and creates an aggregated
   * '_viewData' result.
   */
  async _aggregateResults() {
    if (!this.__menuData) {
      return;
    }
    // await this.__fetchResults();

    const elements = Array.from(this._selectionMenuFormNode.elements);
    const repos = elements.filter(n => n.name === 'repos');
    const references = elements.filter(n => n.name === 'references');

    const activeRefs = [...new Set(checkedValues(references))];
    const activeRepos = [...new Set(checkedValues(repos))];
    const activeAnalyzer = this._activeAnalyzerNode.value;
    const totalQueryOutput = this.__aggregateResultData(activeRefs, activeRepos, activeAnalyzer);

    // Prepare viewData
    const dataResult = [];
    // When we support more analyzers than match-imports and match-subclasses, make a switch
    // here

    totalQueryOutput.forEach((specifierRes, i) => {
      dataResult[i] = {};
      dataResult[i].specifier = specifierRes.exportSpecifier;
      dataResult[i].sourceProject = specifierRes.exportSpecifier.project;
      dataResult[i].categories = getCategoriesForMatchedSpecifier(
        specifierRes,
        this.__providenceConf,
      );
      dataResult[i].type = specifierRes.exportSpecifier.name === '[file]' ? 'file' : 'specifier';
      // dedupe, because outputs genarted with older versions might have dedupe problems
      dataResult[i].count = Array.from(new Set(specifierRes.matchesPerProject))
        .map(mpp => mpp.files)
        .flat(Infinity).length;
      dataResult[i].matchedProjects = specifierRes.matchesPerProject;
    });
    this.tableData = dataResult;
  }

  __aggregateResultData(activeRefs, activeRepos, activeAnalyzer) {
    const jsonResultsActiveFilter = [];

    activeRefs.forEach(ref => {
      const refSearch = `_${ref.replace('#', '_')}_`;
      activeRepos.forEach(dep => {
        const depSearch = `_${dep.replace('#', '_')}_`;
        const found = this.__resultFiles[activeAnalyzer].find(
          ({ fileName }) =>
            fileName.includes(encodeURIComponent(refSearch)) &&
            fileName.includes(encodeURIComponent(depSearch)),
        );
        if (found) {
          jsonResultsActiveFilter.push(found.content);
        } else {
          // eslint-disable-next-line no-console
          console.info(`No result output json for ${refSearch} and ${depSearch}`);
        }
      });
    });

    let totalQueryOutput = [];
    jsonResultsActiveFilter.forEach(json => {
      if (!Array.isArray(json.queryOutput)) {
        // can be a string like [no-mactched-dependency]
        return;
      }

      // Start by adding the first entry of totalQueryOutput
      if (!totalQueryOutput) {
        totalQueryOutput = json.queryOutput;
        return;
      }

      json.queryOutput.forEach(currentRec => {
        // Json queryOutput

        // Now, look if we already have an "exportSpecifier".
        const totalRecFound = totalQueryOutput.find(
          totalRec => currentRec.exportSpecifier.id === totalRec.exportSpecifier.id,
        );
        // If so, concatenate the "matchesPerProject" array to the existing one
        if (totalRecFound) {
          // TODO: merge smth?
          totalRecFound.matchesPerProject = totalRecFound.matchesPerProject.concat(
            currentRec.matchesPerProject,
          );
        }
        // If not, just add a new one to the array.
        else {
          totalQueryOutput.push(currentRec);
        }
      });
    });
    return totalQueryOutput;
  }

  _enrichMenuData() {
    const menuData = this.__initialMenuData;
    // Object.keys(menuData.searchTargetDeps).forEach((groupName) => {
    //   menuData.searchTargetDeps[groupName] = menuData.searchTargetDeps[groupName].map(project => (
    //      { project, checked: true } // check whether we have results, also for active references
    //   ));
    // });
    this.__menuData = menuData;
  }

  /**
   * @override
   * @param {*} content
   */
  // eslint-disable-next-line class-methods-use-this
  _renderSpecifier(content) {
    let display;
    if (content.name === '[file]') {
      display = content.filePath;
    } else {
      display = content.name;
    }
    const tooltip = content.filePath;
    return html`
      <div>
        <span class="c-tooltip c-tooltip--right" data-tooltip="${tooltip}"> ${display} </span>
      </div>
    `;
  }

  /**
   * @override
   * @param {*} content
   * @param {*} header
   */
  // eslint-disable-next-line class-methods-use-this
  _renderCellContent(content, header) {
    if (header === 'specifier') {
      return this._renderSpecifier(content);
    }
    if (header === 'matchedProjects') {
      return html`${content
        .sort((a, b) => b.files.length - a.files.length)
        .map(
          mpp => html`
            <details>
              <summary>
                <span style="font-weight:bold;">${mpp.project}</span>
                (${mpp.files.length})
              </summary>
              <ul>
                ${mpp.files.map(
                  f => html`<li>${typeof f === 'object' ? JSON.stringify(f) : f}</li>`,
                )}
              </ul>
            </details>
          `,
        )}`;
    }
    if (content instanceof Array) {
      return content.join(', ');
    }
    return content;
  }

  async __fetchMenuData() {
    // Derived from providence.conf.js, generated in server.mjs
    this.__initialMenuData = await fetch('/menu-data.json').then(response => response.json());
  }

  async __fetchProvidenceConf() {
    // Gets the providence conf as defined by the end user in providence-conf.(m)js
    // @ts-ignore
    // eslint-disable-next-line import/no-absolute-path
    this.__providenceConf = (await import('/providence-conf.js')).default;
  }

  async __fetchResults() {
    this.__resultFiles = await fetch('/results.json').then(response => response.json());
  }
}
customElements.define('p-board', PBoard);
