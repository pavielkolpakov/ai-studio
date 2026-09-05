import os
import subprocess
import sys
from pathlib import Path

import pytest


@pytest.mark.parametrize("override", [False, True])
def test_dotenv_configures_langsmith_without_overriding_environment(tmp_path, override):
    config_path = tmp_path / "app" / "core" / "config.py"
    config_path.parent.mkdir(parents=True)
    source = Path(__file__).resolve().parents[1] / "src" / "app" / "core" / "config.py"
    config_path.write_text(source.read_text())
    (tmp_path / ".env").write_text(
        "LANGSMITH_TRACING=true\n"
        "LANGSMITH_API_KEY=test-key\n"
        "LANGSMITH_ENDPOINT=https://api.smith.langchain.com\n"
        "LANGSMITH_PROJECT=dotenv-project\n"
    )
    env = {
        key: value for key, value in os.environ.items()
        if not key.startswith(("LANGSMITH_", "LANGCHAIN_", "PYTHON_DOTENV_"))
    }
    if override:
        env.update(LANGSMITH_TRACING="false", LANGSMITH_PROJECT="environment-project")

    result = subprocess.run(
        [sys.executable, "-c", """
import os
import runpy
import sys

runpy.run_path(sys.argv[1])
from langsmith import utils

override = sys.argv[2] == "True"
assert utils.tracing_is_enabled() is (not override)
assert utils.get_tracer_project() == ("environment-project" if override else "dotenv-project")
assert os.environ["LANGSMITH_API_KEY"] == "test-key"
assert os.environ["LANGSMITH_ENDPOINT"] == "https://api.smith.langchain.com"
""", str(config_path), str(override)],
        cwd=tmp_path,
        env=env,
        capture_output=True,
        text=True,
        timeout=30,
    )
    assert result.returncode == 0, result.stderr
