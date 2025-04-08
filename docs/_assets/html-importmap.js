// Create the import map script element

// @ts-ignore
window.__importMap = {
  lit: 'https://esm.sh/lit@2.6.1',
  'lit-html': 'https://esm.sh/lit-html@2.6.1',
  'lit-html/is-server.js': 'https://esm.sh/lit-html@2.6.1/is-server.js',
  'lit-element': 'https://esm.sh/lit-element@2.7.0',
  'lit-element/lit-element.js': 'https://esm.sh/lit-element@2.7.0',
  '@lit/reactive-element': 'https://esm.sh/@lit/reactive-element@1.6.1',
  '@open-wc/dedupe-mixin': 'https://unpkg.com/@open-wc/dedupe-mixin@1.4.0/index.js',
  '@open-wc/scoped-elements/lit-element.js':
    'https://esm.sh/@open-wc/scoped-elements@3.0.5/lit-element.js',
  '@lion/ui/dialog': 'https://esm.sh/@lion/ui@0.11.2/dialog.js',
  '@lion/ui/overlays': 'https://esm.sh/@lion/ui@0.11.2/overlays.js',
  '@lion/ui/button.js': 'https://esm.sh/@lion/ui@0.11.2/button.js',
  '@lion/ui/accordion.js': 'https://esm.sh/@lion/ui@0.11.2/accordion.js',
  '@lion/ui/calendar.js': 'https://esm.sh/@lion/ui@0.11.2/calendar.js',
  '@lion/ui/checkbox-group.js': 'https://esm.sh/@lion/ui@0.11.2/checkbox-group.js',
  '@lion/ui/collapsible.js': 'https://esm.sh/@lion/ui@0.11.2/collapsible.js',
  '@lion/ui/combobox.js': 'https://esm.sh/@lion/ui@0.11.2/combobox.js',
  '@lion/ui/option.js': 'https://esm.sh/@lion/ui@0.11.2/option.js',
  '@lion/ui/drawer.js': 'https://esm.sh/@lion/ui@0.11.2/drawer.js',
  '@lion/ui/fieldset.js': 'https://esm.sh/@lion/ui@0.11.2/fieldset.js',
  '@lion/ui/input.js': 'https://esm.sh/@lion/ui@0.11.2/input.js',
  '@lion/ui/form.js': 'https://esm.sh/@lion/ui@0.11.2/form.js',
  '@lion/ui/icon.js': 'https://esm.sh/@lion/ui@0.11.2/icon.js',
  '@lion/ui/input-amount.js': 'https://esm.sh/@lion/ui@0.11.2/input-amount.js',
};

const importMap = document.createElement('script');
importMap.type = 'importmap';
importMap.textContent = JSON.stringify({
  // @ts-ignore
  imports: window.__importMap,
});

// Append the import map to the document head
document.head.appendChild(importMap);
