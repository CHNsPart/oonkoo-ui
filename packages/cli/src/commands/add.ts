import prompts from "prompts";
import ora from "ora";
import chalk from "chalk";
import { execa } from "execa";
import {
  getConfig,
  configExists,
  getApiKey,
} from "../utils/config.js";
import {
  getRegistryIndex,
  getComponent,
  RegistryComponent,
} from "../utils/registry.js";
import {
  writeComponentFile,
  writeBlockFile,
  getExistingFiles,
  detectPackageManager,
  getInstallCommand,
} from "../utils/fs.js";
import { logger } from "../utils/logger.js";

interface AddOptions {
  all?: boolean;
  yes?: boolean;
  overwrite?: boolean;
}

export async function addCommand(
  components: string[],
  options: AddOptions
) {
  // Check if initialized
  if (!configExists()) {
    logger.error(
      "OonkooUI is not initialized. Run `oonkoo init` first."
    );
    process.exit(1);
  }

  const config = await getConfig();
  if (!config) {
    logger.error("Failed to read configuration.");
    process.exit(1);
  }

  // If no components specified, show interactive picker
  if (components.length === 0 && !options.all) {
    const index = await getRegistryIndex();
    if (!index) {
      logger.error("Failed to fetch component registry.");
      process.exit(1);
    }

    const { selected } = await prompts({
      type: "multiselect",
      name: "selected",
      message: "Select components to add:",
      choices: index.components.map((c) => ({
        title: `${c.name} ${chalk.dim(`(${c.tier.toLowerCase()})`)}`,
        value: c.slug,
        description: c.description,
      })),
      hint: "- Space to select. Return to submit",
    });

    if (!selected || selected.length === 0) {
      logger.info("No components selected.");
      return;
    }

    components = selected;
  }

  // If --all flag, get all components
  if (options.all) {
    const index = await getRegistryIndex();
    if (!index) {
      logger.error("Failed to fetch component registry.");
      process.exit(1);
    }
    components = index.components.map((c) => c.slug);
  }

  // Check for existing files
  const existing = await getExistingFiles(components, config);
  if (existing.length > 0 && !options.overwrite) {
    logger.warn(`The following components already exist:`);
    existing.forEach((slug) => console.log(`  - ${slug}`));

    if (!options.yes) {
      const { proceed } = await prompts({
        type: "confirm",
        name: "proceed",
        message: "Overwrite existing components?",
        initial: false,
      });

      if (!proceed) {
        logger.info("Cancelled.");
        return;
      }
    }
  }

  logger.title(`Adding ${components.length} component(s)`);

  const spinner = ora("Fetching components...").start();

  const allDependencies: Set<string> = new Set();
  const allDevDependencies: Set<string> = new Set();
  const registryDeps: Set<string> = new Set();
  const addedComponents: string[] = [];
  const failedComponents: string[] = [];

  for (const slug of components) {
    spinner.text = `Fetching ${slug}...`;

    try {
      const component = await getComponent(slug);

      if (!component) {
        failedComponents.push(slug);
        continue;
      }

      // Track dependencies
      component.dependencies.forEach((dep) => allDependencies.add(dep));
      component.devDependencies.forEach((dep) => allDevDependencies.add(dep));
      component.registryDeps.forEach((dep) => registryDeps.add(dep));

      // Write the component file
      spinner.text = `Writing ${slug}...`;

      let filePath: string;
      if (component.type === "ELEMENT") {
        filePath = await writeComponentFile(slug, component.code, config);
      } else {
        filePath = await writeBlockFile(slug, component.code, config);
      }

      addedComponents.push(slug);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "UNAUTHORIZED") {
          spinner.fail();
          logger.error(
            "Authentication required. Run `oonkoo auth` to log in."
          );
          process.exit(1);
        }
        if (error.message === "PRO_REQUIRED") {
          spinner.warn();
          logger.warn(
            `${slug} is a Pro component. Upgrade at https://oonkoo.dev/pricing`
          );
          failedComponents.push(slug);
          continue;
        }
      }
      failedComponents.push(slug);
    }
  }

  // Also add registry dependencies (other oonkoo components)
  if (registryDeps.size > 0) {
    const depsArray = Array.from(registryDeps).filter(
      (dep) => !components.includes(dep) && !addedComponents.includes(dep)
    );

    if (depsArray.length > 0) {
      spinner.text = `Adding ${depsArray.length} required dependencies...`;

      for (const dep of depsArray) {
        try {
          const component = await getComponent(dep);
          if (component) {
            component.dependencies.forEach((d) => allDependencies.add(d));
            component.devDependencies.forEach((d) => allDevDependencies.add(d));

            if (component.type === "ELEMENT") {
              await writeComponentFile(dep, component.code, config);
            } else {
              await writeBlockFile(dep, component.code, config);
            }
            addedComponents.push(dep);
          }
        } catch {
          // Silently skip failed deps
        }
      }
    }
  }

  spinner.succeed(`Added ${addedComponents.length} component(s)`);

  // Show added components
  if (addedComponents.length > 0) {
    logger.break();
    console.log(chalk.dim("  Components added:"));
    addedComponents.forEach((slug) => {
      console.log(`  ${chalk.green("✔")} ${slug}`);
    });
  }

  // Show failed components
  if (failedComponents.length > 0) {
    logger.break();
    console.log(chalk.dim("  Failed to add:"));
    failedComponents.forEach((slug) => {
      console.log(`  ${chalk.red("✖")} ${slug}`);
    });
  }

  // Show dependencies to install
  const depsToInstall = Array.from(allDependencies);
  const devDepsToInstall = Array.from(allDevDependencies);

  if (depsToInstall.length > 0 || devDepsToInstall.length > 0) {
    const pm = detectPackageManager();
    logger.break();
    console.log(chalk.dim("  Install dependencies:"));
    logger.break();

    if (depsToInstall.length > 0) {
      const cmd = getInstallCommand(pm, depsToInstall);
      console.log(`  ${chalk.cyan(cmd)}`);
    }

    if (devDepsToInstall.length > 0) {
      const cmd = getInstallCommand(pm, devDepsToInstall, true);
      console.log(`  ${chalk.cyan(cmd)}`);
    }

    logger.break();

    // Offer to install automatically
    if (!options.yes) {
      const { install } = await prompts({
        type: "confirm",
        name: "install",
        message: "Install dependencies now?",
        initial: true,
      });

      if (install) {
        const installSpinner = ora("Installing dependencies...").start();

        try {
          if (depsToInstall.length > 0) {
            await execa(pm, ["add", ...depsToInstall], {
              cwd: process.cwd(),
            });
          }

          if (devDepsToInstall.length > 0) {
            await execa(pm, ["add", "-D", ...devDepsToInstall], {
              cwd: process.cwd(),
            });
          }

          installSpinner.succeed("Dependencies installed");
        } catch {
          installSpinner.fail("Failed to install dependencies");
        }
      }
    }
  }

  logger.break();
  logger.success("Done!");
}
