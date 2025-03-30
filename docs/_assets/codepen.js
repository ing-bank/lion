/**
 * @param {string | null | undefined} codeContent
 * @param {string | undefined} demoElName
 */
export async function editOnCodepen(codeContent, demoElName) {
  // @ts-ignore
  const imports = window.__importMap;

  const data = {
    head: `
          <title>Lion ${demoElName}</title>
          <script type="importmap">${JSON.stringify({ imports })}</script>
          <script src="https://unpkg.com/@webcomponents/scoped-custom-element-registry@0.0.10/scoped-custom-element-registry.min.js"></script>
      `,
    title: `${demoElName} example`,
    description: 'This CodePen was generated on the fly via JavaScript.',
    tags: ['codepen', 'javascript', 'html', 'css'],
    html: `<${demoElName}></${demoElName}>`,
    js: codeContent,
    editors: '101', // Which editors to open by default. 1 = HTML, 0 = CSS, 1 = JS,
  };

  // Convert the data object to a JSON string
  const jsonData = JSON.stringify(data);

  // Create a form element
  const form = document.createElement('form');
  form.action = 'https://codepen.io/pen/define';
  form.method = 'POST';
  form.target = '_blank';

  // Create a hidden input field to hold the JSON data
  const input = document.createElement('input');
  input.type = 'hidden';
  input.name = 'data';
  input.value = jsonData;

  // Append the input to the form and submit it
  form.appendChild(input);
  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
}
