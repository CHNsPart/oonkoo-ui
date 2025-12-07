// Helper function to extract props from component code (basic implementation)

export interface PropDefinition {
  name: string;
  type: string;
  default?: string;
  description: string;
  required?: boolean;
}

export function extractPropsFromCode(code: string, componentName: string): PropDefinition[] {
  // Look for interface or type definitions
  const interfaceMatch = code.match(
    new RegExp(`interface\\s+${componentName}Props\\s*\\{([^}]+)\\}`, "s")
  );

  if (!interfaceMatch) return [];

  const propsBlock = interfaceMatch[1];
  const props: PropDefinition[] = [];

  // Parse each prop line
  const propLines = propsBlock.split("\n").filter((line) => line.trim());

  for (const line of propLines) {
    // Match: propName?: type; // description OR propName: type; // description
    const match = line.match(/^\s*(\w+)(\?)?:\s*([^;/]+);?\s*(?:\/\/\s*(.*))?/);
    if (match) {
      const [, name, optional, type, description] = match;
      props.push({
        name,
        type: type.trim(),
        description: description?.trim() || "",
        required: !optional,
      });
    }
  }

  return props;
}
