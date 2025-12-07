# oonkoo

CLI for installing [OonkooUI](https://ui.oonkoo.com) components into your React projects.

## Installation Methods

OonkooUI components can be installed using either the **shadcn CLI** or the **OonkooUI CLI**.

### Method 1: shadcn CLI (Recommended for free components)

If you're already using shadcn/ui, you can install OonkooUI components directly:

1. Add the OonkooUI registry to your `components.json`:

```json
{
  "registries": {
    "@oonkoo": "https://ui.oonkoo.com/r/{name}.json"
  }
}
```

2. Install components:

```bash
npx shadcn@latest add @oonkoo/hero-gradient
```

### Method 2: OonkooUI CLI (Full access including Pro)

For Pro components and additional features, use our dedicated CLI:

```bash
npx oonkoo init
```

Or install globally:

```bash
npm install -g oonkoo
```

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
npx oonkoo add hero-gradient

# Add multiple components
npx oonkoo add hero-gradient features-grid pricing-cards

# Interactive component picker
npx oonkoo add
```

### List available components

```bash
# List all components
npx oonkoo list

# Filter by category
npx oonkoo list --category hero

# Filter by tier
npx oonkoo list --tier free
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
| Free components | Yes | Yes |
| Pro components | No | Yes (with auth) |
| Interactive picker | No | Yes |
| Component updates | No | Yes |
| Setup | Add registry to components.json | Run `npx oonkoo init` |

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

- Node.js 18+
- React project with Tailwind CSS

## Links

- [Documentation](https://ui.oonkoo.com/components/cli)
- [Components](https://ui.oonkoo.com/components)
- [GitHub](https://github.com/oonkoo/oonkoo-ui)

## License

MIT
