import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from app.rag.prompts import AGENT_SYSTEM_PROMPT, GUARDRAIL_PROMPT


class TestAgentSystemPrompt:
    def test_is_string(self):
        assert isinstance(AGENT_SYSTEM_PROMPT, str)

    def test_mentions_neuronetis_persona(self):
        txt = AGENT_SYSTEM_PROMPT.lower()
        assert "neuronetis" in txt
        assert "we" in txt or "our" in txt

    def test_instructs_tool_use(self):
        assert "read_knowledge_base" in AGENT_SYSTEM_PROMPT

    def test_has_index_placeholder(self):
        assert "{index}" in AGENT_SYSTEM_PROMPT


class TestGuardrailPrompt:
    def test_has_input_variable(self):
        assert "input" in GUARDRAIL_PROMPT.input_variables
