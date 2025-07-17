/**
 * @param {any} codeContent
 * @param {string | undefined} demoElName
 */
export async function editOnStackblitz(codeContent, demoElName) {
  /**
   * @param {string} text
   */
  function startCase(text) {
    return text
      .split(/-/)
      .map(t => t.charAt(0).toUpperCase() + t.slice(1))
      .join(' ');
  }

  // @ts-ignore
  const title = startCase(demoElName);

  const indexHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Lion ${title}</title>
          <script src="https://unpkg.com/@webcomponents/scoped-custom-element-registry@0.0.10/scoped-custom-element-registry.min.js"></script>
      </head>
      <body>
          <${demoElName}></${demoElName}>
          <script type="module" src="./index.js"></script>
      </body>
      </html>
  `;

  const packageJson = JSON.stringify(
    {
      name: demoElName,
      type: 'module',
      scripts: {
        dev: 'vite',
      },
      devDependencies: {
        vite: '^5.2.13',
      },
      dependencies: {
        '@lion/ui': '^0.11.2',
        '@open-wc/scoped-elements': '^3.0.5',
        '@webcomponents/scoped-custom-element-registry': '^0.0.9',
        lit: '^3.2.1',
      },
    },
    null,
    2,
  );

  // @ts-ignore
  const { openProject } = window.StackBlitzSDK;

  const project = {
    title,
    description: `Stackblitz example of ${demoElName}`,
    template: 'node',
    files: {
      // @ts-ignore
      'index.html': indexHtml,
      'index.js': codeContent,
      'package.json': packageJson,
    },
  };

  openProject(project);
}
