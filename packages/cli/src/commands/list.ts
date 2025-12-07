import chalk from "chalk";
import ora from "ora";
import { getRegistryIndex, filterComponents } from "../utils/registry.js";
import { logger } from "../utils/logger.js";

interface ListOptions {
  category?: string;
  tier?: string;
}

export async function listCommand(options: ListOptions) {
  const spinner = ora("Fetching components...").start();

  const index = await getRegistryIndex();

  if (!index) {
    spinner.fail("Failed to fetch component registry");
    logger.error(
      "Could not connect to the registry. Check your internet connection."
    );
    process.exit(1);
  }

  spinner.stop();

  // Filter components if options provided
  let components = index.components;

  if (options.category || options.tier) {
    components = filterComponents(components, {
      category: options.category,
      tier: options.tier,
    });
  }

  if (components.length === 0) {
    logger.info("No components found matching your criteria.");
    return;
  }

  // Group by category
  const grouped = components.reduce(
    (acc, component) => {
      const category = component.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(component);
      return acc;
    },
    {} as Record<string, typeof components>
  );

  logger.title(`Available Components (${components.length})`);

  // Display grouped components
  for (const [category, categoryComponents] of Object.entries(grouped)) {
    console.log(chalk.bold.underline(category));
    console.log();

    for (const component of categoryComponents) {
      const tierBadge = getTierBadge(component.tier);
      const typeBadge = chalk.dim(`[${component.type.toLowerCase()}]`);

      console.log(
        `  ${chalk.cyan(component.slug.padEnd(25))} ${tierBadge} ${typeBadge}`
      );
      console.log(`  ${chalk.dim(component.description)}`);
      console.log();
    }
  }

  // Show usage hint
  console.log(chalk.dim("─".repeat(50)));
  console.log();
  console.log(chalk.dim("  Add a component with:"));
  console.log(`  ${chalk.cyan("oonkoo add <component-slug>")}`);
  console.log();

  // Show filter hints
  if (!options.category && !options.tier) {
    console.log(chalk.dim("  Filter by category:"));
    console.log(`  ${chalk.cyan("oonkoo list --category hero")}`);
    console.log();
    console.log(chalk.dim("  Filter by tier:"));
    console.log(`  ${chalk.cyan("oonkoo list --tier free")}`);
    console.log();
  }
}

function getTierBadge(tier: string): string {
  switch (tier) {
    case "FREE":
      return chalk.green("free");
    case "PRO":
      return chalk.yellow("pro");
    case "COMMUNITY_FREE":
      return chalk.blue("community");
    case "COMMUNITY_PAID":
      return chalk.magenta("paid");
    default:
      return chalk.dim(tier.toLowerCase());
  }
}
