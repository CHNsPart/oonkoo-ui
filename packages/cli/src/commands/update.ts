import fs from "fs-extra";
import path from "path";
import prompts from "prompts";
import ora from "ora";
import chalk from "chalk";
import crypto from "crypto";
import { getConfig, configExists } from "../utils/config.js";
import {
  getRegistryIndex,
  getComponent,
  RegistryComponent,
} from "../utils/registry.js";
import { writeComponentFile, writeBlockFile } from "../utils/fs.js";
import { logger } from "../utils/logger.js";

interface UpdateOptions {
  all?: boolean;
  yes?: boolean;
}

interface InstalledComponent {
  slug: string;
  path: string;
  hash: string;
}

async function getFileHash(filePath: string): Promise<string> {
  const content = await fs.readFile(filePath, "utf-8");
  return crypto.createHash("md5").update(content).digest("hex");
}

async function getInstalledComponents(
  config: NonNullable<Awaited<ReturnType<typeof getConfig>>>
): Promise<InstalledComponent[]> {
  const installed: InstalledComponent[] = [];

  // Check UI components directory
  const uiDir = path.resolve(
    process.cwd(),
    config.aliases.ui.replace(/^@\//, "")
  );

  if (await fs.pathExists(uiDir)) {
    const files = await fs.readdir(uiDir);
    for (const file of files) {
      if (file.endsWith(".tsx")) {
        const slug = file.replace(".tsx", "");
        const filePath = path.join(uiDir, file);
        const hash = await getFileHash(filePath);
        installed.push({ slug, path: filePath, hash });
      }
    }
  }

  // Check blocks directory
  const blocksDir = path.resolve(
    process.cwd(),
    config.aliases.components.replace(/^@\//, ""),
    "blocks"
  );

  if (await fs.pathExists(blocksDir)) {
    const files = await fs.readdir(blocksDir);
    for (const file of files) {
      if (file.endsWith(".tsx")) {
        const slug = file.replace(".tsx", "");
        const filePath = path.join(blocksDir, file);
        const hash = await getFileHash(filePath);
        installed.push({ slug, path: filePath, hash });
      }
    }
  }

  return installed;
}

export async function updateCommand(options: UpdateOptions) {
  // Check if initialized
  if (!configExists()) {
    logger.error("OonkooUI is not initialized. Run `oonkoo init` first.");
    process.exit(1);
  }

  const config = await getConfig();
  if (!config) {
    logger.error("Failed to read configuration.");
    process.exit(1);
  }

  logger.title("Update Components");

  const spinner = ora("Scanning installed components...").start();

  // Get installed components
  const installed = await getInstalledComponents(config);

  if (installed.length === 0) {
    spinner.info("No components installed.");
    logger.info("Add components with `oonkoo add <component>`");
    return;
  }

  spinner.text = "Fetching registry...";

  // Get registry index to check which installed components exist in registry
  const index = await getRegistryIndex();
  if (!index) {
    spinner.fail("Failed to fetch component registry.");
    process.exit(1);
  }

  // Find components that exist in both installed and registry
  const registryMap = new Map(index.components.map((c) => [c.slug, c]));
  const updatable = installed.filter((i) => registryMap.has(i.slug));

  if (updatable.length === 0) {
    spinner.info("No updatable components found.");
    return;
  }

  spinner.text = "Checking for updates...";

  // Fetch latest versions and compare
  const updates: Array<{
    slug: string;
    localPath: string;
    localHash: string;
    remoteHash: string;
    component: RegistryComponent;
  }> = [];

  for (const item of updatable) {
    try {
      const component = await getComponent(item.slug);
      if (component) {
        const remoteHash = crypto
          .createHash("md5")
          .update(component.code)
          .digest("hex");

        if (remoteHash !== item.hash) {
          updates.push({
            slug: item.slug,
            localPath: item.path,
            localHash: item.hash,
            remoteHash,
            component,
          });
        }
      }
    } catch {
      // Skip components that fail to fetch
    }
  }

  spinner.stop();

  if (updates.length === 0) {
    logger.success("All components are up to date!");
    return;
  }

  console.log(
    chalk.dim(`  Found ${updates.length} component(s) with updates available:`)
  );
  console.log();

  for (const update of updates) {
    console.log(`  ${chalk.cyan(update.slug)}`);
    console.log(
      `    ${chalk.dim("Local:")} ${update.localHash.substring(0, 8)}...`
    );
    console.log(
      `    ${chalk.dim("Remote:")} ${update.remoteHash.substring(0, 8)}...`
    );
    console.log();
  }

  // Select components to update
  let toUpdate = updates;

  if (!options.all && !options.yes) {
    const { selected } = await prompts({
      type: "multiselect",
      name: "selected",
      message: "Select components to update:",
      choices: updates.map((u) => ({
        title: u.slug,
        value: u.slug,
        selected: true,
      })),
      hint: "- Space to select. Return to submit",
    });

    if (!selected || selected.length === 0) {
      logger.info("No components selected.");
      return;
    }

    toUpdate = updates.filter((u) => selected.includes(u.slug));
  }

  // Confirm update
  if (!options.yes) {
    const { confirm } = await prompts({
      type: "confirm",
      name: "confirm",
      message: `Update ${toUpdate.length} component(s)? This will overwrite local changes.`,
      initial: true,
    });

    if (!confirm) {
      logger.info("Update cancelled.");
      return;
    }
  }

  // Perform updates
  const updateSpinner = ora("Updating components...").start();
  const updated: string[] = [];
  const failed: string[] = [];

  for (const item of toUpdate) {
    updateSpinner.text = `Updating ${item.slug}...`;

    try {
      if (item.component.type === "ELEMENT") {
        await writeComponentFile(item.slug, item.component.code, config);
      } else {
        await writeBlockFile(item.slug, item.component.code, config);
      }
      updated.push(item.slug);
    } catch {
      failed.push(item.slug);
    }
  }

  updateSpinner.succeed(`Updated ${updated.length} component(s)`);

  if (updated.length > 0) {
    logger.break();
    console.log(chalk.dim("  Updated:"));
    updated.forEach((slug) => {
      console.log(`  ${chalk.green("✔")} ${slug}`);
    });
  }

  if (failed.length > 0) {
    logger.break();
    console.log(chalk.dim("  Failed:"));
    failed.forEach((slug) => {
      console.log(`  ${chalk.red("✖")} ${slug}`);
    });
  }

  logger.break();
  logger.success("Done!");
}
