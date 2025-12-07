# oonkoo

CLI for installing [OonkooUI](https://ui.oonkoo.com) components into your React projects.

## Installation Methods

OonkooUI components can be installed using either the **shadcn CLI** or the **OonkooUI CLI**.

### Method 1: shadcn CLI (For users already using shadcn/ui)

If you're already using shadcn/ui, you can install OonkooUI components directly:

1. **First**, add the OonkooUI registry to your existing `components.json` file:

```json
{
  "registries": {
    "@oonkoo": "https://ui.oonkoo.com/r/{name}.json"
  }
}
```

2. **Then**, install components:

```bash
npx shadcn@latest add @oonkoo/pulse-button
npx shadcn@latest add @oonkoo/spark-cursor
```

**Note:** This method only works if you have `components.json` configured. If you get a registry error, use Method 2 instead.

### Method 2: OonkooUI CLI (Recommended - works standalone)

For a complete standalone solution with Pro component access:

```bash
npx oonkoo init
```

**No shadcn/ui setup required!** Works with any React + Tailwind project.

**Package Manager Support:**
- ✅ npm (default)
- ✅ yarn
- ✅ pnpm
- ✅ bun

The CLI auto-detects your package manager based on lock files.

## Usage

### Initialize your project

```bash
npx oonkoo init
```

This creates an `oonkoo.config.json` file with your project settings.

### Authenticate

```bash
# Browser-based login (recommended)
npx oonkoo auth

# Or use API key
npx oonkoo auth --api-key

# Logout
npx oonkoo auth --logout
```

Browser-based login opens your browser for secure authentication via OAuth. API key authentication requires creating a key at [ui.oonkoo.com/settings/api-keys](https://ui.oonkoo.com/settings/api-keys).

### Add components

```bash
# Add a single component
npx oonkoo add pulse-button

# Add multiple components
npx oonkoo add pulse-button spark-cursor

# Interactive component picker (shows all available components)
npx oonkoo add
```

**Available components:**
- `pulse-button` - Animated button with pulsating effect (Free)
- `spark-cursor` - Dazzling spark cursor effect on click (Free)
- More components available at [ui.oonkoo.com/components](https://ui.oonkoo.com/components)

**Works with all package managers:**
```bash
# npm
npx oonkoo add pulse-button

# yarn
yarn dlx oonkoo add pulse-button

# pnpm
pnpm dlx oonkoo add pulse-button

# bun
bunx oonkoo add pulse-button
```

### List available components

```bash
# List all components
npx oonkoo list

# Filter by category
npx oonkoo list --category buttons

# Filter by tier (free, pro, community)
npx oonkoo list --tier free
```

**Example output:**
```
buttons
  pulse-button              free [element]
  An animated button with a pulsating effect

other
  spark-cursor              free [element]
  A dazzling spark cursor effect on click
```

### Update components

```bash
# Check for updates and update interactively
npx oonkoo update

# Update all components
npx oonkoo update --all
```

## Comparison: shadcn CLI vs OonkooUI CLI

| Feature | shadcn CLI | OonkooUI CLI |
|---------|-----------|--------------|
| Free components | ✅ Yes (requires components.json) | ✅ Yes |
| Pro components | ❌ No | ✅ Yes (with auth) |
| Interactive picker | ❌ No | ✅ Yes |
| Component updates | ❌ No | ✅ Yes |
| Download tracking | ✅ Yes | ✅ Yes |
| Auto-create utils | ❌ No | ✅ Yes (lib/utils.ts) |
| Auto-install deps | ❌ No | ✅ Yes |
| Standalone setup | ❌ No | ✅ Yes |
| Setup required | `components.json` | `npx oonkoo init` |

**Recommendation:** Use the OonkooUI CLI for the best experience and full feature set.

## Configuration

The `oonkoo.config.json` file supports:

```json
{
  "style": "default",
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "app/globals.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "hooks": "@/hooks"
  }
}
```

## About

OonkooUI uses [shadcn/ui](https://ui.shadcn.com) as the foundation for base UI primitives (Button, Card, Dialog, etc.). The OonkooUI components are higher-level blocks built on top of these primitives, giving you production-ready sections like Hero, Pricing, Features, and more.

## Requirements

- **Node.js 18+** (LTS recommended)
- **React 18+** (React 19 supported)
- **Tailwind CSS 3+** (Tailwind CSS 4 supported)
- **TypeScript** (recommended, but JavaScript works too)

**Supported frameworks:**
- Next.js 14+ (App Router & Pages Router)
- Vite + React
- Create React App
- Remix
- Any React framework with Tailwind CSS

## Links

- [Documentation](https://ui.oonkoo.com/components/cli)
- [Components](https://ui.oonkoo.com/components)
- [GitHub](https://github.com/oonkoo/oonkoo-ui)

## License

MIT
