"""Approved-base static policy; never execute files from a proposed checkout."""

import ast
import os
from pathlib import Path
import unittest

import yaml

ROOT = Path(os.environ.get("COMMAND_RETIREMENT_ROOT", Path(__file__).resolve().parents[2]))
CHECKOUT = "actions/checkout@9c091bb21b7c1c1d1991bb908d89e4e9dddfe3e0"
SETUP = "python3 -I -m venv /tmp/command-retirement-check\n/tmp/command-retirement-check/bin/python -I -m pip install PyYAML==6.0.3\n"
BOOTSTRAP_SETUP = "python3 -m venv /tmp/command-retirement-check\n/tmp/command-retirement-check/bin/pip install PyYAML==6.0.3\n"


def repo_path(relative):
    """Never follow proposed links into runner files, even for failure messages."""
    root = ROOT.resolve()
    path = ROOT / relative
    try:
        path.resolve().relative_to(root)
    except ValueError:
        raise AssertionError("Proposed file resolves outside the checkout") from None
    for part in (path, *path.parents):
        if part == ROOT.parent:
            break
        if part.is_symlink():
            raise AssertionError("Proposed symlinks are not accepted by retirement policy")
    return path


class RetirementPolicyTest(unittest.TestCase):
    def test_workflows_cannot_publish_or_deploy(self):
        workflows = list(repo_path(".github/workflows").glob("*.y*ml"))
        self.assertGreaterEqual(len(workflows), 3)
        for path in workflows:
            with self.subTest(workflow=path.name):
                data = yaml.load(repo_path(path.relative_to(ROOT)).read_text(), Loader=yaml.BaseLoader)
                if path.name in {"retirement.yml", "retirement-bootstrap.yml"}:
                    trusted = path.name == "retirement.yml"
                    self.assertEqual(set(data), {"name", "on", "permissions", "jobs"})
                    expected_on = {"pull_request_target": "", "push": {"branches": ["main"]}, "workflow_dispatch": ""} if trusted else {"pull_request": "", "workflow_dispatch": ""}
                    self.assertEqual(data["on"], expected_on)
                    self.assertEqual(data["permissions"], {"contents": "read"})
                    job_name = "verify-retirement" if trusted else "verify-retirement-bootstrap"
                    self.assertEqual(set(data["jobs"]), {job_name})
                    job = data["jobs"][job_name]
                    self.assertEqual(set(job), {"runs-on", "steps"})
                    self.assertEqual(job["runs-on"], "ubuntu-latest")
                    expected = [{"uses": CHECKOUT, "with": {"persist-credentials": "false"}}]
                    if trusted:
                        expected[0]["with"]["ref"] = "${{ github.event.pull_request.head.sha || github.sha }}"
                        expected[0]["with"]["allow-unsafe-pr-checkout"] = "true"
                        expected[0]["with"]["path"] = "proposed"
                        expected.append({"name": "Load approved base retirement policy", "uses": CHECKOUT, "with": {"ref": "${{ github.event.pull_request.base.sha || github.sha }}", "path": "approved", "persist-credentials": "false"}})
                        expected.append({"name": "Verify permanent retirement", "working-directory": "${{ runner.temp }}", "run": SETUP + 'COMMAND_RETIREMENT_ROOT="$GITHUB_WORKSPACE/proposed" /tmp/command-retirement-check/bin/python -I "$GITHUB_WORKSPACE/approved/tests/retirement/test_retirement.py" -v\n'})
                    else:
                        expected.append({"name": "Verify proposed retirement policy", "run": BOOTSTRAP_SETUP + "/tmp/command-retirement-check/bin/python -m unittest discover -s tests/retirement -v\n"})
                    self.assertEqual(job["steps"], expected)
                    continue
                self.assertEqual(data["permissions"], {})
                self.assertLessEqual(set(data["on"]), {"workflow_dispatch", "workflow_call"})
                self.assertEqual(set(data["jobs"]), {"retired"})
                job = data["jobs"]["retired"]
                self.assertEqual(set(job), {"runs-on", "steps"})
                self.assertEqual(len(job["steps"]), 1)
                step = job["steps"][0]
                self.assertEqual(set(step), {"name", "run"})
                lines = step["run"].strip().splitlines()
                self.assertEqual(len(lines), 2)
                self.assertRegex(lines[0], r'^echo "::error::Qodo Command backend [^"$`\\;]*retired[^"$`\\;]*"$')
                self.assertEqual(lines[1], "exit 1")

    def assert_retired_import(self, path, message):
        module = ast.parse(repo_path(path).read_text())
        expected = ast.parse('"""Retired entrypoint."""\nraise RuntimeError(' + repr(message) + ')')
        self.assertIsInstance(module.body[0], ast.Expr)
        self.assertIsInstance(module.body[0].value, ast.Constant)
        self.assertIsInstance(module.body[0].value.value, str)
        # Ignore only the docstring text, not executable statements/imports.
        self.assertEqual([ast.dump(n) for n in module.body[1:]], [ast.dump(n) for n in expected.body[1:]])

    def test_composite_action_cannot_install_or_run_the_legacy_product(self):
        action = yaml.safe_load(repo_path("action.yml").read_text())
        self.assertEqual(action["runs"], {'using': 'composite', 'steps': [{'name': 'Command permanently retired', 'shell': 'bash', 'run': 'echo "::error::The legacy Qodo Command Action is permanently retired. Use a supported integration with the current Qodo CLI."\nexit 1\n'}]})
        self.assertEqual(action["inputs"], {'prompt': {'description': 'The prompt or command to run with Qodo', 'required': True}, 'model': {'description': 'Specify a custom model to use', 'required': False}, 'agent-file': {'description': 'Path to custom agent.toml file (defaults to the example agent.toml included with this action)', 'required': False}, 'agentfile': {'description': 'DEPRECATED: Use agent-file instead. Path to custom agent.toml file', 'required': False, 'deprecationMessage': 'The agentfile input has been deprecated. Please use agent-file instead.'}, 'key-value-pairs': {'description': 'Additional key-value pairs as JSON object or multiline string (e.g., {"key1": "value1", "key2": "value2"} or key1=value1 key2=value2)', 'required': False}, 'qodo-version': {'description': 'Version of @qodo/command to install (defaults to latest)', 'required': False, 'default': 'latest'}})


if __name__ == "__main__":
    unittest.main()
