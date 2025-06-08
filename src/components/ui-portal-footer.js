import { LitElement, html, nothing, css } from 'lit';

const tagName = 'ui-portal-footer';

export class UIPortalFooter extends LitElement {
  static styles = [
    css`
      /** FOOTER ****************************************************************************************/
      #main-footer {
        margin-top: 50px;
        border-top: 1px solid #eaeaea;
        background-color: var(--footer-background, rgba(0, 0, 0, 0.1));
        color: var(--text-color);
        padding: 40px 50px;
        flex-grow: 1;
        display: flex;
        flex-flow: column;
        justify-content: center;
      }

      #footer-menu .content-area {
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        text-align: center;
      }

      @media screen and (min-width: 1024px) {
        #footer-menu .content-area {
          flex-direction: row;
          text-align: left;
        }
      }

      #footer-menu ul {
        list-style-type: none;
        padding: 0;
      }

      #footer-menu a {
        text-decoration: none;
        color: var(--primary-text-color);
        padding: 5px 0;
        display: block;
      }
    `,
  ];

  render() {
    return html`
      <footer id="main-footer">
        <div id="footer-menu">
          <div class="content-area">
            <nav>
              <h3>Discover</h3>
              <ul>
                <li>
                  <a href="/blog">Blog</a>
                </li>
                <li>
                  <a href="https://github.com/ing-bank/lion/issues" rel="noopener noreferrer"
                    >Help and Feedback</a
                  >
                </li>
              </ul>
            </nav>
            <nav>
              <h3>Follow</h3>
              <ul>
                <li>
                  <a href="https://github.com/ing-bank/lion" rel="noopener noreferrer">GitHub</a>
                </li>
                <li>
                  <a href="/about/slack/">Slack</a>
                </li>
              </ul>
            </nav>
            <nav>
              <h3>Support</h3>
              <ul>
                <li>
                  <a
                    href="https://github.com/ing-bank/lion/blob/master/CONTRIBUTING.md"
                    rel="noopener noreferrer"
                    >Contribute</a
                  >
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </footer>
    `;
  }
}

customElements.define(tagName, UIPortalFooter);
