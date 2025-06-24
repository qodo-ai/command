# Qodo Gen CLI

Qodo Gen CLI is a command-line interface for running and managing AI agents.
It allows you to automate complex workflows, interact with AI models and external tools using your own tools and schemas, and serve AI agents as HTTP services — all from your terminal.

## Why should I use it?
Qodo Gen CLI is designed for AI-powered developer productivity. It turns natural language into intelligent actions using your configured agents.
Whether you're building tools, debugging code, or reviewing PRs, Qodo Gen CLI can help you code faster and better.

Qodo Gen CLI supports:

- Custom agent configuration
- CI and automation integration
- Interactive web UI mode
- General code generation
- Intelligent PR code review

It's fast, extensible, and designed to work in real-world engineering environments.

## Core features
- **Interactive Chat Mode:** Talk to an agent in natural language directly in your terminal (`qodo chat`), exactly like with [Qodo Gen Chat](https://docs.qodo.ai/qodo-documentation/qodo-gen/qodo-gen-chat).
- **Custom Agent Commands:** Configure your own agent and define reusable workflows (`qodo <command>`).
- **Interactive Web UI mode:** Run Qodo Gen CLI with `--ui` to interact with Qodo Gen CLI's chat in an interactive web UI.
- **Serve Agents as HTTP APIs:** Turn any agent into a callable service (`--webhook` mode).
- **Model Control:** Choose which AI model to use (Claude, GPT-4, etc.) with `--model={model-name}`.
- **Agent to MCP:** Turn any agent into an MCP with `--mcp`.
- **Secure Integration:** Use tools without exposing your API keys.

## Installation

To use Qodo Gen CLI, you’ll need [Node.js](https://nodejs.org/en/download) and [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) installed.

Then run:

```bash
npm install -g @qodo/gen
```

## Usage

Go to the [Qodo Gen CLI documentation site](https://docs.qodo.ai/qodo-documentation/qodo-gen/qodo-gen-cli) for full options and usage manuals.
