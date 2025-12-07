#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import { initCommand } from "./commands/init.js";
import { addCommand } from "./commands/add.js";
import { listCommand } from "./commands/list.js";
import { authCommand } from "./commands/auth.js";
import { updateCommand } from "./commands/update.js";

const program = new Command();

program
  .name("oonkoo")
  .description("CLI for installing OonkooUI components")
  .version("0.1.0");

program
  .command("init")
  .description("Initialize OonkooUI in your project")
  .option("-y, --yes", "Skip prompts and use defaults")
  .action(initCommand);

program
  .command("add")
  .description("Add a component to your project")
  .argument("[components...]", "Components to add")
  .option("-a, --all", "Add all available components")
  .option("-y, --yes", "Skip confirmation prompt")
  .option("-o, --overwrite", "Overwrite existing files")
  .action(addCommand);

program
  .command("list")
  .description("List available components")
  .option("-c, --category <category>", "Filter by category")
  .option("-t, --tier <tier>", "Filter by tier (free, pro)")
  .action(listCommand);

program
  .command("auth")
  .alias("login")
  .description("Authenticate with OonkooUI")
  .option("--logout", "Log out from OonkooUI")
  .option("--api-key", "Use API key instead of browser authentication")
  .action(authCommand);

program
  .command("update")
  .description("Update installed components to latest versions")
  .option("-a, --all", "Update all components without prompting")
  .option("-y, --yes", "Skip confirmation prompts")
  .action(updateCommand);

// Show help if no command provided
if (process.argv.length === 2) {
  console.log();
  console.log(chalk.green.bold("  oonkoo") + chalk.dim(" - OonkooUI CLI"));
  console.log();
  program.outputHelp();
}

program.parse();
