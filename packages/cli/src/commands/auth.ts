import prompts from "prompts";
import ora from "ora";
import chalk from "chalk";
import open from "open";
import {
  getApiKey,
  setApiKey,
  clearApiKey,
  setUserId,
  getBaseUrl,
} from "../utils/config.js";
import { logger } from "../utils/logger.js";

interface AuthOptions {
  logout?: boolean;
  apiKey?: boolean;
}

export async function authCommand(options: AuthOptions) {
  // Handle logout
  if (options.logout) {
    clearApiKey();
    logger.success("Logged out successfully.");
    return;
  }

  // Check if already authenticated
  const existingKey = getApiKey();
  if (existingKey) {
    const { action } = await prompts({
      type: "select",
      name: "action",
      message: "You are already authenticated. What would you like to do?",
      choices: [
        { title: "Keep current session", value: "keep" },
        { title: "Sign in with browser (recommended)", value: "browser" },
        { title: "Sign in with API key", value: "apikey" },
        { title: "Log out", value: "logout" },
      ],
    });

    if (action === "keep") {
      logger.info("Keeping current session.");
      return;
    }

    if (action === "logout") {
      clearApiKey();
      logger.success("Logged out successfully.");
      return;
    }

    if (action === "apikey") {
      await authenticateWithApiKey();
      return;
    }

    if (action === "browser") {
      await authenticateWithBrowser();
      return;
    }

    return;
  }

  // First time authentication - ask which method
  if (options.apiKey) {
    await authenticateWithApiKey();
    return;
  }

  const { method } = await prompts({
    type: "select",
    name: "method",
    message: "How would you like to authenticate?",
    choices: [
      { title: "Sign in with browser (recommended)", value: "browser" },
      { title: "Sign in with API key", value: "apikey" },
    ],
  });

  if (method === "apikey") {
    await authenticateWithApiKey();
  } else if (method === "browser") {
    await authenticateWithBrowser();
  }
}

async function authenticateWithBrowser() {
  logger.title("Sign in with Browser");

  const baseUrl = getBaseUrl();
  const spinner = ora("Initiating authentication...").start();

  try {
    // Request a new auth session
    const response = await fetch(`${baseUrl}/api/auth/cli`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      spinner.fail("Failed to initiate authentication");
      logger.error("Could not connect to OonkooUI. Check your internet connection.");
      return;
    }

    const data = await response.json();

    if (!data.success || !data.data?.sessionId) {
      spinner.fail("Failed to initiate authentication");
      return;
    }

    const { sessionId, authUrl } = data.data;

    spinner.succeed("Authentication initiated");

    console.log();
    console.log(chalk.dim("  Opening browser for authentication..."));
    console.log();

    // Open browser
    await open(authUrl);

    console.log(chalk.dim("  If the browser didn't open, visit:"));
    console.log(`  ${chalk.cyan(authUrl)}`);
    console.log();

    // Poll for completion
    const pollSpinner = ora("Waiting for authentication...").start();

    const maxAttempts = 60; // 5 minutes with 5-second intervals
    let attempts = 0;

    while (attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 5000)); // 5 seconds

      const pollResponse = await fetch(`${baseUrl}/api/auth/cli?session=${sessionId}`);

      if (!pollResponse.ok) {
        attempts++;
        continue;
      }

      const pollData = await pollResponse.json();

      if (pollData.data?.status === "completed") {
        pollSpinner.succeed("Authenticated successfully!");

        // Save the token
        setApiKey(pollData.data.token);

        if (pollData.data.userId) {
          setUserId(pollData.data.userId);
        }

        logger.break();
        console.log(chalk.dim("  Signed in as:"));
        console.log(`  ${chalk.green(pollData.data.email || "User")}`);

        if (pollData.data.hasPro) {
          console.log(`  ${chalk.green("✔")} Pro access enabled`);
        }

        logger.break();
        logger.success("You're all set!");
        return;
      }

      if (pollData.data?.status !== "pending") {
        pollSpinner.fail("Authentication failed or expired");
        return;
      }

      attempts++;
    }

    pollSpinner.fail("Authentication timed out");
    logger.error("Please try again with 'npx oonkoo auth'");
  } catch (error) {
    spinner.fail("Authentication failed");
    logger.error("Could not connect to OonkooUI. Check your internet connection.");
  }
}

async function authenticateWithApiKey() {
  logger.title("Sign in with API Key");

  const baseUrl = getBaseUrl();

  console.log(chalk.dim("  To authenticate, you'll need an API key."));
  console.log(chalk.dim("  You can create one at:"));
  console.log();
  console.log(`  ${chalk.cyan(`${baseUrl}/settings/api-keys`)}`);
  console.log();

  const { apiKey } = await prompts({
    type: "password",
    name: "apiKey",
    message: "Enter your API key:",
    validate: (value) => {
      if (!value || value.length < 10) {
        return "Please enter a valid API key";
      }
      return true;
    },
  });

  if (!apiKey) {
    logger.info("Authentication cancelled.");
    return;
  }

  const spinner = ora("Verifying API key...").start();

  try {
    const response = await fetch(`${baseUrl}/api/auth/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      spinner.fail("Invalid API key");
      logger.error("The API key you entered is invalid or has expired.");
      return;
    }

    const data = await response.json();

    if (!data.success) {
      spinner.fail("Invalid API key");
      logger.error("The API key you entered is invalid or has expired.");
      return;
    }

    // Save the API key
    setApiKey(apiKey);

    if (data.data?.userId) {
      setUserId(data.data.userId);
    }

    spinner.succeed("Authenticated successfully!");

    logger.break();
    console.log(chalk.dim("  Signed in as:"));
    console.log(`  ${chalk.green(data.data?.email || "User")}`);

    if (data.data?.hasPro) {
      console.log(`  ${chalk.green("✔")} Pro access enabled`);
    }

    logger.break();
  } catch (error) {
    spinner.fail("Authentication failed");
    logger.error("Could not verify API key. Check your internet connection.");
  }
}
