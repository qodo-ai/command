export const HELP_TEXT = `
  Usage
    $ qodo [options] <prompt>
    $ qodo run <command> [extra instructions]

  Commands
    run <command>          Execute a specific agent command with optional extra instructions
    login                  Log in to Qodo
    list-models            Get available models
    chat                   Start an interactive chat session
    key list               List all API keys
    key create <name>      Create a new API key with the given name
    key revoke <name>      Revoke an API key by name
    create-agent           Create a new agent by translating user requirements into a valid configuration
    list-agents            List available agents from configuration (interactive in CLI mode)
    list-mcp               List available local and remote tools
    self-review            Analyze git changes and group them into logical change groups (opens web interface)
    update                 Manage auto-updates (--check, --install, --configure)
    config                 Open interactive settings (theme, diff display)
    -h, --help             Show help and exit
    chain "A > B > C"     Run multiple agents sequentially (quote the chain!)
    -v, --version          Show version and exit
    -l, --log=path         Redirect console output to a file | stdout | stderr
    -y, --yes              Confirm all prompts automatically (useful for CI)
    -q, --silent           Suppress all console output except the final result (logs go to /dev/null)
    -d, --debug            Enable debug mode with verbose logging and no data truncation
    --dir=path         Specify project root directories (can be used multiple times)
    --ci                   Run commands in CI mode
    --mcp                  Run commands as tools from agent config in MCP server-like mode
    --ui                   Open Qodo with web interface
    --webhook              Run commands as tools from agent config in webhook mode
    --slack                Run as Slack bot (HTTP webhook mode by default)
    -p, --port=number      Specify custom port for server modes (webhook, slack, mcp, ui)
    --plan                 Use planning execution strategy (agent plans before acting)
    --act                  Use direct execution strategy (agent acts immediately)
    -m, --model=model_name Specify a custom model to use
    --agent-file=path      Specify a custom path to agent configuration file
    --mcp-file=path        Specify a custom path to mcp.json
    -r, --resume=session_id Resume a task with the given session ID
    --set key=value        Set custom key-value pairs (can be used multiple times)
    --no-builtin           Disable built-in MCP servers (ripgrep, filesystem, git)
    -t, --tools=list       Specify authorized tools (comma-separated, e.g., shell,git,filesystem)
                           Note: Some tools have dependencies (e.g., qodo_merge requires git)
    --tool <name>          Specify authorized tool (can be used multiple times, e.g., --tool shell --tool git --tool filesystem)
    --permissions=level    Set permissions level (r=read, rw=read+write, rwx=full, -=none)
    --with=session_id       Preload context with a previous session summarization (used before task/hotstart)${process.platform === 'darwin' ? `
    --sandbox=mode         Run shell commands in sandbox (macOS only) [off|permissive|restrictive|path/to/profile.sb] (default: off)` : ''}

  Theme
    theme                  Show current theme and usage
    theme --set light      Set theme to light mode
    theme --set dark       Set theme to dark mode

  Examples
    $ qodo chain "improve > review > open-pr"
    $ qodo chain "improve > review > open-pr" --chain-step-timeout=600000
    $ qodo chain "improve > review > open-pr" --chain-continue-on-error
    $ qodo "Review my latest changes and suggest improvements"
    $ qodo run review
    $ qodo run review "focus on security issues"
    $ qodo review --set coverage_score_threshold=0.8
    $ qodo self-review
    $ qodo "Analyze code" --dir /path/to/project1 --dir /path/to/project2 --permissions=r
    $ qodo chat
    $ qodo key list
    $ qodo key create my-ci-key
    $ qodo key revoke my-old-key
    $ qodo create-agent --set goal="review code" --set description="analyze pull requests"
    $ qodo list-agents
    $ qodo list-mcp
    $ qodo --ui
    $ qodo --tools=shell,filesystem "analyze this codebase"${process.platform === 'darwin' ? `
    $ qodo --sandbox=./custom-profile.sb "run a shell command with custom sandbox"` : ''}
`;