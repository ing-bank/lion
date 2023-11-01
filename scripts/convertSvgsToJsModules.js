const fs = require('fs');
const path = require('path');

// Directory where original SVG files are stored
const svgDirectory = 'packages/ui/components/input-tel/flag-svgs';
// Directory where the SVG will be converted to JavaScript modules
const outputDirectory = 'packages/ui/components/input-tel/flag-svgs-js';

// Ensure the output directory exists; create it if it doesn't
if (!fs.existsSync(outputDirectory)) {
  fs.mkdirSync(outputDirectory, { recursive: true });
}

// Process each SVG file in the directory
fs.readdir(svgDirectory, (err, files) => {
  if (err) {
    console.error('Error reading the SVG directory:', err);
    // TODO: Implement more comprehensive error handling
    return;
  }

  // Iterate over SVG files only
  files
    .filter(file => path.extname(file) === '.svg')
    .forEach(file => {
      const svgFilePath = path.join(svgDirectory, file);
      const moduleName = path.basename(file, '.svg');
      const jsFilePath = path.join(outputDirectory, `${moduleName}.js`);

      // Read the content of the SVG file
      fs.readFile(svgFilePath, 'utf8', (error, data) => {
        if (error) {
          console.error(`Error reading the SVG file: ${svgFilePath}`, err);
          // TODO: Handle file read errors (e.g., skip to the next file)
          return;
        }

        // Convert the SVG content into a JavaScript module exporting a Lit `html` template
        const moduleContent = `import { html } from 'lit';\n\nexport default html\`${data}\`;\n`;

        // Write the converted content to a new JS module file
        fs.writeFile(jsFilePath, moduleContent, 'utf8', ERROR => {
          if (ERROR) {
            console.error(`Error writing the JS module file: ${jsFilePath}`, ERROR);
            // TODO: Handle file write errors (e.g., retry or log for manual intervention)
            return;
          }
          console.log(`Successfully created JS module for SVG: ${jsFilePath}`);
        });
      });
    });

  // TODO: Verify the integrity of generated JS modules
  // TODO: Add a cleanup step to remove any unused JS module files if their corresponding SVGs have been deleted
  // TODO: Integrate this script into your build or deployment pipeline as needed
});
