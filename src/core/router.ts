/**
 * CLI Command Router
 * Routes commands to appropriate handlers
 */

import { Result } from "meow";
import { handleVersionCommand } from "./version.js";
import {
  handleHelpCommand,
  handleLoginCommand,
  handleListModelsCommand,
  handleListMcpCommand,
  handleListAgentsCommand,
  handleCreateAgentCommand,
  handleKeyCommand,
  handleInitCommand,
  handleGerritCommand,
  handleSelfReviewCommand,
  handleMergeCommand,
  handleListModesCommand
} from "./commands.js";
import { handleUpdateCommand } from "../commands/updateCommand.js";
import { handleChainCommand } from "./chain.js";
import { handleThemeCommand } from "../commands/themeCommand.js";
import { handleConfigCommand } from "../commands/configCommand.js";

export type CommandResult = {
  shouldExit: boolean;
  shouldWait: boolean;
  exitCode?: number;
};

/**
 * Route CLI commands to appropriate handlers
 * Returns true if command was handled and CLI should exit
 */
export async function routeCommand(cli: Result<any>): Promise<CommandResult> {
  // Show help if requested
  if (cli.flags.help) {
    await handleHelpCommand(cli);
    return { shouldExit: true, shouldWait: false, exitCode: 0 };
  }

  // Show version if requested
  if (cli.flags.version) {
    await handleVersionCommand(cli);
    return { shouldExit: true, shouldWait: false, exitCode: 0 };
  }

  // Show version if requested
  if (cli.flags.gerrit || process.env.QODO_MODE?.toLowerCase() === 'gerrit') {
    // set environment variable to indicate gerrit mode
    process.env.QODO_MODE = 'gerrit';
    await handleGerritCommand(cli.flags);
    return { shouldExit: false, shouldWait:true, exitCode: 0 };
  }

  const command = cli.input[0];

  // Chain mode: 'qodo chain "a > b > c"'
  if (command === 'chain') {
    const exitCode = await handleChainCommand(cli);
    return { shouldExit: true, shouldWait: false, exitCode };
  }

  // Detect quoted chain spec via 'run' form: qodo run "a > b > c"
  if (command === 'run' && cli.input.length === 2) {
    const maybeSpec = cli.input[1];
    if (maybeSpec.includes('>')) {
      const exitCode = await handleChainCommand(cli);
      return { shouldExit: true, shouldWait: false, exitCode };
    }
  }

  try {
    switch (command) {
      case "help":
        await handleHelpCommand(cli);
        return { shouldExit: true, shouldWait: false, exitCode: 0 };

      case "init":
        // Handle repo tour command
        await handleInitCommand(cli.flags);
        return { shouldExit: !cli.flags.ui, shouldWait:!!cli.flags.ui, exitCode: 0 };

      case "login":
        await handleLoginCommand();
        return { shouldExit: true, shouldWait: false, exitCode: 0 };

      case "list-models":
        await handleListModelsCommand();
        return { shouldExit: true, shouldWait: false, exitCode: 0 };

      case "list-mcp":
        await handleListMcpCommand(cli.flags);
        return { shouldExit: true, shouldWait: false, exitCode: 0 };

      case "list-agents":
        await handleListAgentsCommand(cli.flags);
        return { shouldExit: true, shouldWait: false, exitCode: 0 };

      case "list-modes":
        await handleListModesCommand(cli.flags);
        return { shouldExit: true, shouldWait: false, exitCode: 0 };

      case "create-agent":
        await handleCreateAgentCommand(cli.flags);
        return { shouldExit: true, shouldWait: false, exitCode: 0 };

      case "update":
        await handleUpdateCommand(cli.flags);
        return { shouldExit: true, shouldWait: false, exitCode: 0 };

      case "theme":
        await handleThemeCommand(cli.flags);
        return { shouldExit: true, shouldWait: false, exitCode: 0 };

      case "config":
        await handleConfigCommand();
        return { shouldExit: true, shouldWait: false, exitCode: 0 };

      case "key":
        await handleKeyCommand(cli.input);
        return { shouldExit: true, shouldWait: false, exitCode: 0 };

      case "merge":
        await handleMergeCommand(cli.input, cli.flags);
        return { shouldExit: false, shouldWait: true };

      case "self-review":
        await handleSelfReviewCommand(cli.flags);
        return { shouldExit: false, shouldWait: true, exitCode: 0 };

      case "run":
        // Handle 'run <command>' syntax - let initialization handle the command parsing
        return { shouldExit: false, shouldWait: false };

      default:
        // Command not handled, continue with main application flow
        return { shouldExit: false, shouldWait: false };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Command failed: ${errorMessage}`);
    return { shouldExit: true, shouldWait: false, exitCode: 1 };
  }
}