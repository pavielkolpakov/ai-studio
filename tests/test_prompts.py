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


    def test_does_not_instruct_the_model_to_choose_the_ideas_tool(self):
        """The middleware forces `generate_project_ideas` via tool_choice; the
        model deciding for itself would double-generate."""
        assert "call the `generate_project_ideas` tool" not in AGENT_SYSTEM_PROMPT

    def test_still_instructs_grounding_for_followups(self):
        assert "read_knowledge_base" in AGENT_SYSTEM_PROMPT


class TestGuardrailPrompt:
    def test_has_input_variable(self):
        assert "input" in GUARDRAIL_PROMPT.input_variables

    def test_asks_for_the_three_verdicts(self):
        txt = str(GUARDRAIL_PROMPT)
        assert "BUSINESS" in txt
        assert "ON_TOPIC" in txt
        assert "OFF_TOPIC" in txt

    def test_no_longer_asks_for_yes_no(self):
        assert "YES or NO" not in str(GUARDRAIL_PROMPT)
