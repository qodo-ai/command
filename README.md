# Legacy Qodo Command Action — retired

This Action and its `@qodo/command` installer are permanently retired as
of2026-11-01. Every invocation returns an explicit retirement error before
installing dependencies, reading credentials or running a prompt.

Input names remain accepted for a clear diagnostic in existing workflows; none
is interpolated or executed. Release-notification automation is disabled and
retired in source. Approved-base retirement CI treats proposed files as data.
The current Qodo CLI is `@qodo/cli` in qodo-ai/qodo-in-cli and remains active.
Historical versions/tags/artifacts are retained; old pinned Action refs are
historical source and cannot be rewritten by this main-branch update.

Tracking: INF-4362; backend managed retirement: GitOps PR2401.
