/**
 * CLI Command Handlers
 */

import {Result} from "meow";
import {saveApiKey, validateKey} from "../auth/index.js";
import handleLogin from "../api/auth.js";
import {ServerData} from "../utils/serverData.js";
import {runMcpListCommand} from "../mcp/mcpListCommand.js";
import {runCreateAgentConfig} from "../commands/createAgentConfig.js";
import {keyManagementCommand} from "../auth/keyManagement.js";
import {ConfigManager} from "../utils/configManager.js";
import {generateHelpText} from "../utils/dynamicHelpText.js";
import {showInteractiveAgentSelector} from "../utils/interactiveAgentSelector.js";
import {getAppType} from "../utils/appType.js";
import {AppType} from "../types.js";
import {startApp} from "../apps/appsRouter.js";
import {initializeApplication} from "./initialization.js";
import meow from "meow";
import {createMeowOptions} from "./config.js";
import repoTourCommand from "../commands/initCommandToml.js";
import process from "node:process";
import gerritReviewCommand from "../commands/gerritReviewCommand.js";
import selfReviewCommand from "../commands/selfReviewCommand.js";
import {chalkTheme} from '../design/index.js';

/**
 * Handle help command - show help text and available agents
 */
export async function handleHelpCommand(cli: Result<any>): Promise<void> {
  const helpText = await generateHelpText(cli.flags.agentFile as string | undefined);
  console.log(helpText);
}

/**
 * Handle login/init command
 */
export async function handleLoginCommand(): Promise<void> {
  try {
    const apiKey = await handleLogin();
    await saveApiKey(apiKey);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Login failed: ${errorMessage}`);
    throw error;
  }
}

/**
 * Handle list-models command - list available models
 */
export async function handleListModelsCommand(): Promise<void> {
  try {
    validateKey();
    const serverData = await ServerData.init();
    const availableModels = serverData.getAvailableModels();
    if (availableModels.length === 0) {
      console.log("No available models found.");
    } else {
      console.log("Available models:");
      availableModels.forEach((model) => {
        console.log(`- ${model}`);
      });
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Failed to get available models: ${errorMessage}`);
    throw error;
  }
}

/**
 * Handle list-mcp command
 */
export async function handleListMcpCommand(flags: any): Promise<void> {
  await runMcpListCommand(flags.mcpFile as string | undefined, flags.builtin === false);
}

/**
 * Handle list-agents command
 */
export async function handleListAgentsCommand(flags: any): Promise<void> {
  try {
    // Initialize ConfigManager with the provided agent file path
    const configManager = await ConfigManager.init(flags.agentFile as string | undefined);

    if (!configManager.hasConfig()) {
      console.log(chalkTheme.warning("No agent configuration found."));
      console.log(chalkTheme.dim("To create an agent configuration, run: qodo create-agent"));
      return;
    }

    // Get available commands from the config
    const commands = configManager.listCommands();

    if (commands.length === 0) {
      console.log(chalkTheme.warning("No agents found in configuration."));
      return;
    }

    // Prepare agents for display
    const agents = commands.map(command => {
      const commandConfig = configManager.getCommandConfig(command);
      return {
        name: command,
        description: commandConfig.description
      };
    });

    const modes = configManager.listModes();

    // Check if we should show interactive selector
    const appType = getAppType(flags);

    // Force interactive mode if --interactive flag is set (for testing)
    const forceInteractive = flags.interactive;

    // In CI mode or other non-CLI modes, show non-interactive list
    if (appType !== AppType.CLI && !forceInteractive) {
      console.log(chalkTheme.infoBold("Available agents:"));
      agents.forEach(agent => {
        if (agent.description) {
          console.log(chalkTheme.success(`  • ${agent.name}`) + chalkTheme.dim(` (usage: qodo ${agent.name})`));
          console.log(chalkTheme.muted(`    ${agent.description}`));
        } else {
          console.log(chalkTheme.success(`  • ${agent.name}`) + chalkTheme.dim(` (usage: qodo ${agent.name})`));
        }
      });
      console.log('');
      if (modes.length > 0) {
        console.log(chalkTheme.infoBold("Available modes:"));
        modes.forEach(m => console.log(chalkTheme.success(`  • ${m}`) + chalkTheme.dim(` (usage: qodo --mode ${m})`)));
        console.log('');
      }
      console.log('To run an agent, use: qodo <agent-name>');
      console.log(`Example: qodo ${agents[0]?.name || 'agent-name'}`);
      return;
    }

    // In CLI mode, show interactive selector
    const selectedAgentName = await showInteractiveAgentSelector(agents);

    if (selectedAgentName === null) {
      // Fallback to non-interactive mode if raw mode is not supported
      console.log(chalkTheme.infoBold("Available agents:"));
      agents.forEach(agent => {
        if (agent.description) {
          console.log(chalkTheme.success(`  • ${agent.name}`) + chalkTheme.dim(` (usage: qodo ${agent.name})`));
          console.log(chalkTheme.muted(`    ${agent.description}`));
        } else {
          console.log(chalkTheme.success(`  • ${agent.name}`) + chalkTheme.dim(` (usage: qodo ${agent.name})`));
        }
      });
      console.log('');
      if (modes.length > 0) {
        console.log(chalkTheme.infoBold("Available modes:"));
        modes.forEach(m => console.log(chalkTheme.success(`  • ${m}`) + chalkTheme.dim(` (usage: qodo --mode ${m})`)));
        console.log('');
      }
      console.log('To run an agent, use: qodo <agent-name>');
      console.log(`Example: qodo ${agents[0]?.name || 'agent-name'}`);
      return;
    }

    // Execute the selected agent
    console.log(chalkTheme.successIcon(`Running agent: ${selectedAgentName}`));
    console.log(chalkTheme.dim('Initializing...\n'));

    // Create a mock CLI object for the selected agent
    const mockCli = meow('', createMeowOptions());
    mockCli.input = [selectedAgentName];
    mockCli.flags = {...flags}; // Preserve original flags

    // Initialize and run the selected agent
    const {prompt, extraInstructions, commandArgs} = await initializeApplication(mockCli);
    await startApp(prompt, extraInstructions, commandArgs);

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Failed to list agents: ${errorMessage}`);
    throw error;
  }
}


/**
 * Handle init command
 */
export async function handleInitCommand(flags: any): Promise<void> {
  const mockCli = meow('', createMeowOptions());
  const nextFlags = { ...(flags ?? {}) };
  nextFlags.yes = true;
  nextFlags.silentAutoApprove = true;
  mockCli.flags = nextFlags;

  // Initialize and run the selected agent
  const {prompt, extraInstructions, commandArgs} = await initializeApplication(mockCli, repoTourCommand);
  await startApp(prompt, extraInstructions, commandArgs);
}


/**
 * Handle merge command
 */
export async function handleMergeCommand(input: string[], flags: any): Promise<void> {
  const mockCli = meow('', createMeowOptions());
  const nextFlags = { ...(flags ?? {}) };
  nextFlags.merge = true;
  nextFlags.yes = true;
  nextFlags.silentAutoApprove = true;

  // Preserve user inputs (excluding the "merge" command token)
  const remainingInput = input.slice(1);

  // Extract PR number or URL safely
  const candidate = remainingInput[0];
  if (candidate) {
    if (/^\d+$/.test(candidate)) {
      // Candidate is already just a number
      nextFlags.pr = candidate;
    } else {
      const match = candidate.match(/^https?:\/\/[^\/]*github\.com\/.*\/pull\/(\d+)/);
      if (match) {
        // Extract only the PR number from the URL
        nextFlags.pr = match[1];
      }
    }
  }

  mockCli.flags = nextFlags;
  // Keep remaining inputs available to initialization (excluding PR token if consumed)
  mockCli.input = candidate === nextFlags.pr ? remainingInput.slice(1) : remainingInput;

  const {prompt, extraInstructions, commandArgs} = await initializeApplication(mockCli);
  await startApp(prompt, extraInstructions, commandArgs);
}

export async function handleGerritCommand(flags: any): Promise<void> {
  const mockCli = meow('', createMeowOptions());
  flags.yes = true; // Automatically approve initialization
  flags.silentAutoApprove = true; // Suppress Automatically approve initialization prompts
  mockCli.flags = {...flags}; // Preserve original flags
  // Validate required Gerrit environment variables
  const gerritUser = process.env.GERRIT_USER;
  const gerritPassword = process.env.GERRIT_PASSWORD;

  if (!gerritUser) {
    console.error(chalkTheme.errorIcon('GERRIT_USER environment variable is required when using --gerrit flag'));
    console.error(chalkTheme.muted('Set it with: export GERRIT_USER=your-username'));
    process.exit(1);
  }

  if (!gerritPassword) {
    console.error(chalkTheme.errorIcon('GERRIT_PASSWORD environment variable is required when using --gerrit flag'));
    console.error(chalkTheme.muted('Set it with: export GERRIT_PASSWORD=your-password'));
    process.exit(1);
  }

  console.log(chalkTheme.successIcon(`Gerrit credentials validated for user: ${gerritUser}`));

  const {prompt, extraInstructions, commandArgs} = await initializeApplication(mockCli, gerritReviewCommand);
  await startApp(prompt, extraInstructions, commandArgs);
}

export async function handleSelfReviewCommand(flags: any): Promise<void> {
  const mockCli = meow('', createMeowOptions());
  mockCli.flags = {...flags, yes: true, silentAutoApprove: true, ui: true}; // Preserve original flags

  console.log(chalkTheme.successIcon('Starting self review analysis in web interface...'));

  const {prompt, extraInstructions, commandArgs} = await initializeApplication(mockCli, selfReviewCommand);
  await startApp(prompt, extraInstructions, commandArgs);
}

/**
 * Handle create-agent command
 */
export async function handleCreateAgentCommand(flags: any): Promise<void> {
  await runCreateAgentConfig(flags);
}

/**
 * Handle key management commands
 */
export async function handleKeyCommand(input: string[]): Promise<void> {
  await keyManagementCommand(input);
}

/**
 * Handle list-modes command
 */
export async function handleListModesCommand(flags: any): Promise<void> {
  try {
    const configManager = await ConfigManager.init(flags.agentFile as string | undefined);
    if (!configManager.hasConfig()) {
      console.log(chalkTheme.warning("No agent configuration found."));
      return;
    }
    const modeNames = configManager.listModes();
    if (modeNames.length === 0) {
      console.log(chalkTheme.warning("No modes found in configuration."));
      return;
    }

    console.log(chalkTheme.infoBold("Available modes:"));
    modeNames.forEach((name) => {
      const mode = configManager.getModeConfig(name);
      const desc = mode?.description ? ` - ${mode.description}` : '';
      console.log(chalkTheme.success(`  • ${name}`) + chalkTheme.muted(desc));
    });
    console.log('');
    console.log('To use a mode, run: qodo --mode <mode-name>');
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Failed to list modes: ${errorMessage}`);
    throw error;
  }
}
