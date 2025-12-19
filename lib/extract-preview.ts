/**
 * Extract the Preview component code from a component file
 * Returns the default export function/component code with normalized indentation
 */
export function extractPreviewCode(code: string): string {
  // Try to find "export default function Preview" or similar patterns
  const patterns = [
    // export default function Preview() { ... }
    /export\s+default\s+function\s+Preview\s*\([^)]*\)\s*\{([\s\S]*)\n\}/,
    // export default function ComponentName() { ... }
    /export\s+default\s+function\s+\w+\s*\([^)]*\)\s*\{([\s\S]*)\n\}/,
  ];

  for (const pattern of patterns) {
    const match = code.match(pattern);
    if (match) {
      // Extract the function body
      const functionBody = match[0];

      // Get the return statement content
      const returnMatch = functionBody.match(/return\s*\(([\s\S]*)\);?\s*\}/);
      if (returnMatch) {
        // Extract just the JSX
        let jsx = returnMatch[1];

        // Normalize indentation
        jsx = normalizeIndentation(jsx);

        return jsx;
      }
    }
  }

  return '';
}

/**
 * Normalize indentation to use consistent 2-space indents
 */
function normalizeIndentation(code: string): string {
  const lines = code.split('\n');

  // Remove leading and trailing empty lines
  while (lines.length > 0 && lines[0].trim() === '') {
    lines.shift();
  }
  while (lines.length > 0 && lines[lines.length - 1].trim() === '') {
    lines.pop();
  }

  if (lines.length === 0) return '';

  // Find the minimum indentation (excluding empty lines)
  const minIndent = lines
    .filter(line => line.trim().length > 0)
    .reduce((min, line) => {
      const leadingSpaces = line.match(/^\s*/)?.[0] || '';
      const indent = leadingSpaces.length;
      return Math.min(min, indent);
    }, Infinity);

  // Remove the minimum indentation from all lines
  const dedentedLines = lines.map(line => {
    if (line.trim().length === 0) return '';
    return line.substring(minIndent);
  });

  // Now normalize to 2-space indents
  const normalizedLines = dedentedLines.map(line => {
    if (line.trim().length === 0) return '';

    // Count leading spaces
    const leadingSpaces = line.match(/^\s*/)?.[0] || '';
    const currentIndent = leadingSpaces.length;

    // Convert to 2-space indents (assume original was using some consistent spacing)
    // Detect if using tabs and convert
    if (leadingSpaces.includes('\t')) {
      const tabCount = leadingSpaces.split('\t').length - 1;
      const newIndent = '  '.repeat(tabCount);
      return newIndent + line.trimStart();
    }

    // If using spaces, normalize to 2-space increments
    const indentLevel = Math.round(currentIndent / 2);
    const newIndent = '  '.repeat(indentLevel);
    return newIndent + line.trimStart();
  });

  return normalizedLines.join('\n');
}
