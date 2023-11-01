import fs from 'fs/promises';
import path from 'path';

const sourceDocsPath = 'docs';
const contentDocsPath = 'contentDocs';
const publicDocsPath = 'publicDocs';

const createMdFrontmatter = (componentName) => {    
    return `---
component: ${componentName}
---\n`;
}

async function copyDocs(currentPath = '') {    
    const files = await fs.readdir(path.join(sourceDocsPath, currentPath));

    for (const file of files) {
        const sourceDocsFilePath = path.join(sourceDocsPath, currentPath, file);
        const contentDocsFilePath = path.join(contentDocsPath, currentPath, file);
        const publicDocsFilePath = path.join(publicDocsPath, currentPath, file);
        const stats = await fs.lstat(sourceDocsFilePath);

        if (stats.isDirectory()) {
            await copyDocs(path.join(currentPath, file));
        } else {
            await fs.mkdir(path.join(contentDocsPath, currentPath), { recursive: true });
            await fs.copyFile(sourceDocsFilePath, contentDocsFilePath);

            if (path.extname(file) === '.md') {
                const parentComponent = path.basename(currentPath);
                console.log(`currentPath: ${currentPath}, parentComponent: ${parentComponent}`);
                const fileContent = await fs.readFile(contentDocsFilePath, 'utf8');
                const updatedFileContent = `${createMdFrontmatter(parentComponent)}${fileContent}`;
                await fs.writeFile(contentDocsFilePath, updatedFileContent);
            }
            if (path.extname(file) !== '.md') {
                await fs.mkdir(path.join(publicDocsPath, currentPath), { recursive: true });
                await fs.copyFile(sourceDocsFilePath, publicDocsFilePath);
            }
        }
    }
}

await copyDocs();