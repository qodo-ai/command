# Qodo Command

Qodo Command is a command-line interface for running and managing AI agents.
It allows you to automate complex workflows, interact with AI models and external tools using your own tools and schemas, and serve AI agents as HTTP services — all from your terminal.

![Qodo Command Demo](demo.gif)

## Why should I use it?
Qodo Command is designed for AI-powered developer productivity. It turns natural language into intelligent actions using your configured agents.
Whether you're building tools, debugging code, or reviewing PRs, Qodo Command can help you code faster and better.

Qodo Command supports:

- Custom agent configuration
- CI and automation integration
- Interactive web UI mode
- General code generation
- Intelligent PR code review

It's fast, extensible, and designed to work in real-world engineering environments.

## Core features
- **Interactive Chat Mode:** Talk to an agent in natural language directly in your terminal (`qodo chat`), exactly like with [Qodo Gen Chat](https://docs.qodo.ai/qodo-documentation/qodo-gen/qodo-gen-chat).
- **Custom Agent Commands:** Configure your own agent and define reusable workflows (`qodo <command>`).
- **Interactive Web UI mode:** Run Qodo Command with `--ui` to interact with it in an interactive web UI.
- **Serve Agents as HTTP APIs:** Turn any agent into a callable service (`--webhook` mode).
- **Model Control:** Choose which AI model to use (Claude, GPT-4, etc.) with `--model={model-name}`.
- **Agent to MCP:** Turn any agent into an MCP with `--mcp`.
- **Secure Integration:** Use tools without exposing your API keys.

## Installation

To use Qodo Command, you’ll need [Node.js](https://nodejs.org/en/download) and [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) installed.

Then run:

```bash
npm install -g @qodo/command
```

## Usage

Go to the [Qodo Command documentation site](https://docs.qodo.ai/qodo-documentation/qodo-command/getting-started/setup-and-quickstart) for full options and usage manuals.


## Qodo and Community Agent Examples

Check out [Qodo's agent repository in GitHub](https://github.com/qodo-ai/agents) to see examples of working agents.


## Resources

- [Documentation](https://docs.qodo.ai/qodo-documentation/qodo-command)
- [Release Notes](https://release-notes.cli.gen.qodo.ai/)
