# Legacy Qodo Command Action — retired

This Action and its `@qodo/command` installer are permanently retired as
of 2026-11-01. Every invocation returns an explicit retirement error before
installing dependencies, reading credentials or running a prompt.

Input names remain accepted for a clear diagnostic in existing workflows; none
is interpolated or executed. Release-notification automation is disabled and
retired in source. Approved-base retirement CI treats proposed files as data.
The current Qodo CLI is `@qodo/cli` in qodo-ai/qodo-in-cli and remains active.
Historical versions/tags/artifacts are retained; old pinned Action refs are
historical source and cannot be rewritten by this main-branch update.

Tracking: INF-4362; backend managed retirement: GitOps PR2401.


Fork PR source checkout explicitly opts into the pinned checkout action's fork
mode only for static inspection. The job has contents:read, no declared product
secrets, no persisted Git credentials, and never installs/runs proposed code.
Symlinks and paths outside the proposed checkout are rejected before file reads.
A live fork-triggered run has not been exercised before this first merge.

Trusted CI keeps approved policy and proposed data in sibling directories and
runs isolated Python from the runner temporary directory. Proposed startup
modules such as sitecustomize/venv cannot execute before static validation.
