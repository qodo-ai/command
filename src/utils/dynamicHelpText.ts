import { ConfigManager } from "./configManager.js";

const BASE_HELP_TEXT = `
  Usage
    $ qodo [options] <prompt>

  Options
    login                       Login to Qodo
    list-models                 Get available models
    chat                        Start an interactive chat session
    key list                    List all API keys
    key create <name>           Create a new API key with the given name
    key revoke <name>           Revoke an API key by name
    create-agent                Create a new agent by translating user requirements into a valid configuration
    list-agents                 List available agents from configuration (interactive in CLI mode)
    list-mcp                    List available local and remote tools
    self-review                 Analyze git changes and group them into logical change groups (opens web interface)
    update-check                Check for available updates
    config                      Open interactive settings (theme, diff display)
    -h, --help                  Show help and exit
    -v, --version               Show version and exit
    -l, --log=path              Redirect console output to a file | stdout | stderr
    -y, --yes                   Confirm all prompts automatically (useful for CI)
    -q, --silent                Suppress all console output except the final result (logs go to /dev/null)
    --ci                        Run commands in CI mode
    --mcp                       Run commands as tools from agent config in MCP server-like mode
    --ui                        Open Qodo with web interface
    --webhook                   Run commands as tools from agent config in webhook mode
    --slack                     Run as Slack bot (HTTP webhook mode by default)
    -p, --port=number           Specify custom port for server modes (webhook, slack, mcp, ui)
    --plan                      Use planning execution strategy (agent plans before acting)
    --act                       Use direct execution strategy (agent acts immediately)
    -m, --model=model_name      Specify a custom model to use
    --agent-file=path           Specify a custom path to agent configuration file
    --mcp-file=path             Specify a custom path to mcp.json
    -r, --resume=session_id      Resume a task with the given session ID
    chain "A > B > C"           Run multiple agents sequentially (quote the chain!)
    --set key=value             Set custom key-value pairs (can be used multiple times)
    --no-builtin                Disable built-in MCP servers (ripgrep, filesystem, git)

  Theme
    theme                        Show current theme and usage
    theme --set light            Set theme to light mode
    theme --set dark             Set theme to dark mode

  Examples
    $ qodo chain "improve > review > open-pr"
    $ qodo "Review my latest changes and suggest improvements"
    $ qodo review --set coverage_score_threshold=0.8
    $ qodo self-review
    $ qodo chat
    $ qodo key list
    $ qodo key create my-ci-key
    $ qodo key revoke my-old-key
    $ qodo create-agent --goal="review code" --description="analyze pull requests"
    $ qodo list-agents
    $ qodo list-mcp
    $ qodo --ui
`;

/**
 * Generate help text with agent descriptions
 */
export async function generateHelpText(agentFilePath?: string): Promise<string> {
  try {
    const configManager = await ConfigManager.init(agentFilePath);
    if (!configManager.hasConfig()) {
      return BASE_HELP_TEXT;
    }
    
    const commands = configManager.listCommands();
    
    if (commands.length === 0) {
      return BASE_HELP_TEXT;
    }
    
    let agentSection = "\n  Available agents (from agent config):\n";
    
    commands.forEach(command => {
      const commandConfig = configManager.getCommandConfig(command);
      const description = commandConfig.description;
      
      if (description) {
        agentSection += `    ${command}   (usage: qodo ${command})\n`;
        agentSection += `      ${description}\n`;
      } else {
        agentSection += `    ${command}   (usage: qodo ${command})\n`;
      }
    });
    
    return BASE_HELP_TEXT + agentSection;
    
  } catch (error) {
    // If there's any error, just return the base help text
    return BASE_HELP_TEXT;
  }
}