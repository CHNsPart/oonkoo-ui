import chalk from "chalk";

export const logger = {
  info: (message: string) => {
    console.log(chalk.blue("info"), message);
  },

  success: (message: string) => {
    console.log(chalk.green("✔"), message);
  },

  warn: (message: string) => {
    console.log(chalk.yellow("warn"), message);
  },

  error: (message: string) => {
    console.log(chalk.red("error"), message);
  },

  break: () => {
    console.log();
  },

  title: (message: string) => {
    console.log();
    console.log(chalk.bold(message));
    console.log();
  },

  component: (name: string, description: string) => {
    console.log(`  ${chalk.cyan(name)} - ${chalk.dim(description)}`);
  },

  file: (path: string) => {
    console.log(`  ${chalk.dim("→")} ${chalk.green(path)}`);
  },

  command: (cmd: string) => {
    console.log();
    console.log(chalk.dim("  Run the following command to install dependencies:"));
    console.log();
    console.log(`  ${chalk.cyan(cmd)}`);
    console.log();
  },
};

export function highlight(text: string): string {
  return chalk.cyan(text);
}

export function dim(text: string): string {
  return chalk.dim(text);
}

export function bold(text: string): string {
  return chalk.bold(text);
}
