/**
 * Parse a markdown file with frontmatter
 * @param fileContent - The full markdown file content
 * @returns Object with parsed frontmatter and remaining markdown content
 */
export interface MarkdownFile {
  frontmatter: Record<string, string | string[]>;
  body: string;
}

/**
 * Parse frontmatter section from YAML
 * @param frontmatterText - The YAML frontmatter text (without --- delimiters)
 * @returns Parsed frontmatter as an object
 */
function parseFrontmatter(frontmatterText: string): Record<string, string | string[]> {
  const result: Record<string, string | string[]> = {};

  // Split by lines and process each key-value pair
  const lines = frontmatterText.split('\n');
  let currentKey: string | null = null;
  let currentValue: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) continue;

    // Check if this line contains a key-value pair
    const colonIndex = trimmed.indexOf(':');

    if (colonIndex !== -1 && !trimmed.startsWith('[')) {
      // Save previous key-value pair if exists
      if (currentKey) {
        result[currentKey] = currentValue.length === 1 ? currentValue[0] : currentValue;
      }

      currentKey = trimmed.substring(0, colonIndex).trim();
      let valueStr = trimmed.substring(colonIndex + 1).trim();

      // Handle array values
      if (valueStr.startsWith('[')) {
        // Parse array - extract items from square brackets
        const arrayMatch = valueStr.match(/\[(.*?)\]/s);
        if (arrayMatch) {
          const itemsStr = arrayMatch[1];
          currentValue = itemsStr
            .split(',')
            .map((item) => item.trim().replace(/^['"]|['"]$/g, ''))
            .filter((item) => item.length > 0);
        }
      } else {
        // Single value
        currentValue = [valueStr.replace(/^['"]|['"]$/g, '')];
      }
    }
  }

  // Save last key-value pair
  if (currentKey) {
    result[currentKey] = currentValue.length === 1 ? currentValue[0] : currentValue;
  }

  return result;
}

/**
 * Parse a complete markdown file with optional frontmatter
 * @param fileContent - The full markdown file content
 * @returns Object containing parsed frontmatter and markdown content
 */
export function parseMarkdownFile(fileContent: string): MarkdownFile {
  const trimmed = fileContent.trim();

  // Check if file starts with frontmatter delimiter
  if (!trimmed.startsWith('---')) {
    return {
      frontmatter: {},
      content: fileContent,
    };
  }

  // Find the second --- delimiter
  const secondDelimiterIndex = trimmed.indexOf('---', 3);

  if (secondDelimiterIndex === -1) {
    return {
      frontmatter: {},
      content: fileContent,
    };
  }

  // Extract frontmatter and content sections
  const frontmatterText = trimmed.substring(3, secondDelimiterIndex).trim();
  const content = trimmed.substring(secondDelimiterIndex + 3).trim();

  return {
    frontmatter: parseFrontmatter(frontmatterText),
    body: content,
  };
}

// // Example usage:
// const markdownContent = `---
// description: Implement ing-web features
// tools: ['execute/getTerminalOutput', 'execute/runInTerminal', 'read/readFile', 'read/terminalSelection', 'read/terminalLastCommand', 'edit/editFiles', 'search', 'web/fetch',]
// ---

// # My Markdown Content

// This is the body of the markdown file.

// - Item 1
// - Item 2
// `;

// const parsed = parseMarkdownFile(markdownContent);
// console.log('Frontmatter:', JSON.stringify(parsed.frontmatter, null, 2));
// console.log('Content:', parsed.content);
