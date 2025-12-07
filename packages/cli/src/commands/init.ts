import fs from "fs-extra";
import path from "path";
import prompts from "prompts";
import ora from "ora";
import chalk from "chalk";
import {
  configExists,
  getDefaultConfig,
  writeConfig,
  ProjectConfig,
} from "../utils/config.js";
import { logger } from "../utils/logger.js";
import { detectPackageManager } from "../utils/fs.js";

interface InitOptions {
  yes?: boolean;
}

export async function initCommand(options: InitOptions) {
  logger.title("Initialize OonkooUI");

  // Check if already initialized
  if (configExists()) {
    const { overwrite } = await prompts({
      type: "confirm",
      name: "overwrite",
      message: "OonkooUI is already initialized. Overwrite config?",
      initial: false,
    });

    if (!overwrite) {
      logger.info("Initialization cancelled.");
      return;
    }
  }

  // Check if this is a valid project
  const packageJsonPath = path.resolve(process.cwd(), "package.json");
  if (!fs.existsSync(packageJsonPath)) {
    logger.error(
      "No package.json found. Please run this command in a project directory."
    );
    process.exit(1);
  }

  let config: ProjectConfig;

  if (options.yes) {
    // Use defaults
    config = getDefaultConfig();
  } else {
    // Interactive prompts
    const answers = await prompts([
      {
        type: "select",
        name: "style",
        message: "Which style would you like to use?",
        choices: [
          { title: "Default", value: "default" },
          { title: "New York", value: "new-york" },
        ],
        initial: 0,
      },
      {
        type: "text",
        name: "tailwindCss",
        message: "Where is your global CSS file?",
        initial: "app/globals.css",
      },
      {
        type: "text",
        name: "componentsAlias",
        message: "Configure the import alias for components:",
        initial: "@/components",
      },
      {
        type: "text",
        name: "uiAlias",
        message: "Configure the import alias for UI components:",
        initial: "@/components/ui",
      },
      {
        type: "text",
        name: "utilsAlias",
        message: "Configure the import alias for utils:",
        initial: "@/lib/utils",
      },
    ]);

    if (!answers.style) {
      logger.info("Initialization cancelled.");
      return;
    }

    config = {
      style: answers.style,
      tailwind: {
        config: "tailwind.config.js",
        css: answers.tailwindCss,
        baseColor: "slate",
        cssVariables: true,
      },
      aliases: {
        components: answers.componentsAlias,
        utils: answers.utilsAlias,
        ui: answers.uiAlias,
        hooks: "@/hooks",
      },
      registryUrl: "https://ui.oonkoo.com/api/registry",
    };
  }

  const spinner = ora("Writing configuration...").start();

  try {
    // Write config file
    await writeConfig(config);
    spinner.succeed("Configuration written to oonkoo.config.json");

    // Create directories if they don't exist
    const uiDir = config.aliases.ui.replace(/^@\//, "");
    const componentsDir = config.aliases.components.replace(/^@\//, "");
    const blocksDir = path.join(componentsDir, "blocks");

    await fs.ensureDir(path.resolve(process.cwd(), uiDir));
    await fs.ensureDir(path.resolve(process.cwd(), blocksDir));

    logger.success("Created component directories");

    // Detect package manager
    const pm = detectPackageManager();

    logger.break();
    logger.success("OonkooUI initialized successfully!");
    logger.break();
    console.log(chalk.dim("  You can now add components with:"));
    console.log();
    console.log(`  ${chalk.cyan(`${pm === "npm" ? "npx" : pm} oonkoo add hero-gradient`)}`);
    console.log();
    console.log(chalk.dim("  Or browse available components with:"));
    console.log();
    console.log(`  ${chalk.cyan(`${pm === "npm" ? "npx" : pm} oonkoo list`)}`);
    console.log();
  } catch (error) {
    spinner.fail("Failed to initialize OonkooUI");
    logger.error(
      error instanceof Error ? error.message : "Unknown error occurred"
    );
    process.exit(1);
  }
}
