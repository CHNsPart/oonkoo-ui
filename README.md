# OonkooUI

A React component library and marketplace built on top of [shadcn/ui](https://ui.shadcn.com). OonkooUI provides production-ready, higher-level components like Hero sections, Pricing cards, Feature grids, and more.

## Features

- **shadcn/ui Foundation** - Built on top of shadcn/ui primitives (Button, Card, Dialog, etc.)
- **Production-Ready Blocks** - Higher-level components for common UI patterns
- **Two Installation Methods** - Use shadcn CLI or our dedicated OonkooUI CLI
- **Free & Pro Tiers** - Free components available to everyone, Pro components for subscribers
- **Copy & Paste** - Components are added directly to your codebase, fully customizable

## Quick Start

### Using shadcn CLI (Recommended)

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

### Using OonkooUI CLI

```bash
# Initialize OonkooUI in your project
npx oonkoo init

# Add a component
npx oonkoo add hero-gradient

# Add multiple components
npx oonkoo add hero-gradient pricing-cards features-grid

# Authenticate for Pro components
npx oonkoo auth
```

## Installation Methods Comparison

| Feature | shadcn CLI | OonkooUI CLI |
|---------|-----------|--------------|
| Free components | Yes | Yes |
| Pro components | No | Yes (with auth) |
| Interactive picker | No | Yes |
| Component updates | No | Yes |
| Setup required | Add registry to components.json | Run `npx oonkoo init` |

## Available Components

Visit [ui.oonkoo.com/components](https://ui.oonkoo.com/components) to browse all available components.

### Categories

- **Hero** - Hero sections with various layouts and animations
- **Pricing** - Pricing tables and comparison cards
- **Features** - Feature grids, lists, and showcases
- **CTA** - Call-to-action sections
- **Testimonials** - Customer testimonial displays
- **Navigation** - Headers, sidebars, and navigation components

## Requirements

- Node.js 18+
- React project with Tailwind CSS
- shadcn/ui initialized (for shadcn CLI method)

## Documentation

- [Components](https://ui.oonkoo.com/components)
- [Installation Guide](https://ui.oonkoo.com/components/installation)
- [CLI Documentation](https://ui.oonkoo.com/components/cli)

## CLI Package

The OonkooUI CLI is available as a separate npm package. See [packages/cli](./packages/cli) for more details.

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Tech Stack

- [Next.js 15](https://nextjs.org) - React framework
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [shadcn/ui](https://ui.shadcn.com) - UI primitives
- [Prisma](https://prisma.io) - Database ORM
- [Kinde](https://kinde.com) - Authentication
- [Stripe](https://stripe.com) - Payments

## License

MIT
