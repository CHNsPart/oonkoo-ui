export const siteConfig = {
  name: "OonkooUI",
  description:
    "A modern React UI component library and marketplace. Build beautiful interfaces with free and premium components compatible with shadcn/ui.",
  url: "https://oonkoo.com",
  ogImage: "https://oonkoo.com/og.png",
  links: {
    twitter: "https://twitter.com/oonkooui",
    github: "https://github.com/oonkoo/oonkoo-ui",
    discord: "https://discord.gg/oonkoo",
  },
  creator: "OonkooUI Team",
  keywords: [
    "React",
    "UI Components",
    "shadcn",
    "Tailwind CSS",
    "Component Library",
    "Next.js",
    "TypeScript",
    "Marketplace",
  ],
} as const;

export type SiteConfig = typeof siteConfig;
