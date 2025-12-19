// Helper function to extract props from component code
import type { PropDefinition } from "@/types/registry";

export type { PropDefinition };

/**
 * Extract prop definitions from TypeScript component code
 * Supports:
 * - Interface/type definitions
 * - JSDoc comments
 * - Default values from destructuring
 */
export function extractPropsFromCode(code: string, componentName: string): PropDefinition[] {
  // First, try to find interface with exact component name
  let interfaceMatch = code.match(
    new RegExp(`interface\\s+${componentName}Props\\s*(?:extends[^{]*)?\\{([^}]+)\\}`, "s")
  );

  // If not found, look for ANY interface ending with "Props"
  if (!interfaceMatch) {
    interfaceMatch = code.match(
      /interface\s+(\w+Props)\s*(?:extends[^{]*)?\{([^}]+)\}/s
    );

    // If found, use the second capture group (the props block)
    if (interfaceMatch) {
      interfaceMatch[1] = interfaceMatch[2]; // Move props block to index 1
    }
  }

  if (!interfaceMatch) return [];

  const propsBlock = interfaceMatch[1];
  const props: PropDefinition[] = [];

  // Extract JSDoc comments for the interface
  const jsdocMap = extractJSDocComments(code);

  // Parse each prop line
  const propLines = propsBlock.split("\n").filter((line) => line.trim());

  for (const line of propLines) {
    // Match: propName?: type; // description OR propName: type; // description
    const match = line.match(/^\s*(\w+)(\?)?:\s*([^;/]+);?\s*(?:\/\/\s*(.*))?/);
    if (match) {
      const [, name, optional, type, inlineDescription] = match;

      // Get description from JSDoc or inline comment
      const description = jsdocMap.get(name) || inlineDescription?.trim() || "";

      props.push({
        name,
        type: type.trim(),
        description,
        required: !optional,
      });
    }
  }

  // Extract default values from component destructuring
  const defaults = extractDefaultValues(code, componentName);

  // Merge defaults into props
  props.forEach(prop => {
    if (defaults.has(prop.name)) {
      prop.default = defaults.get(prop.name);
    }
  });

  return props;
}

/**
 * Extract JSDoc @param comments
 */
function extractJSDocComments(code: string): Map<string, string> {
  const jsdocMap = new Map<string, string>();

  // Match JSDoc blocks with @param tags
  const jsdocRegex = /\/\*\*\s*([\s\S]*?)\*\//g;
  let match;

  while ((match = jsdocRegex.exec(code)) !== null) {
    const jsdocContent = match[1];

    // Extract @param tags
    const paramRegex = /@param\s+(?:\{[^}]+\}\s+)?(\w+)\s+(.+?)(?=@|\*\/|$)/gs;
    let paramMatch;

    while ((paramMatch = paramRegex.exec(jsdocContent)) !== null) {
      const [, paramName, description] = paramMatch;
      jsdocMap.set(paramName, description.trim().replace(/\s+/g, ' '));
    }
  }

  return jsdocMap;
}

/**
 * Extract default values from component destructuring
 * Handles patterns like: { prop = "default", prop2 = 123 }
 */
function extractDefaultValues(code: string, componentName: string): Map<string, string> {
  const defaults = new Map<string, string>();

  // Look for functional component with destructuring
  // Patterns: ({ prop = default, ... }) => or function Component({ prop = default })
  const patterns = [
    // Arrow function with destructuring (specific component name)
    new RegExp(`${componentName}[^=]*=\\s*(?:React\\.forwardRef\\s*<[^>]*>\\s*)?\\([^{]*\\{([^}]+)\\}`, 's'),
    // Regular function (specific component name)
    new RegExp(`function\\s+${componentName}[^{]*\\{([^}]+)\\}`, 's'),
    // Any React.forwardRef with destructuring
    /React\.forwardRef\s*<[^>]*>\s*\([^{]*\{([^}]+)\}/s,
    // Any arrow function component with destructuring
    /(?:export\s+)?(?:const|let)\s+\w+[^=]*=\s*\([^{]*\{([^}]+)\}/s,
  ];

  for (const pattern of patterns) {
    const match = code.match(pattern);
    if (match) {
      const destructureBlock = match[1];

      // Match: propName = defaultValue
      const defaultRegex = /(\w+)\s*=\s*([^,\n]+)/g;
      let defaultMatch;

      while ((defaultMatch = defaultRegex.exec(destructureBlock)) !== null) {
        const [, propName, defaultValue] = defaultMatch;
        // Clean up the default value
        const cleanDefault = defaultValue.trim().replace(/,$/, '');
        defaults.set(propName, cleanDefault);
      }

      break;
    }
  }

  return defaults;
}
