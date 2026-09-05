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


    def test_describes_the_three_tools(self):
        assert "get_agency_info" in AGENT_SYSTEM_PROMPT
        assert "read_knowledge_base" in AGENT_SYSTEM_PROMPT
        assert "generate_project_ideas" in AGENT_SYSTEM_PROMPT

    def test_lets_the_model_decide_when_to_generate_ideas(self):
        """Tool choice is the agent's job now, not forced by the guardrail, so
        the prompt must tell the model when to call the ideas tool."""
        assert "call it when" in AGENT_SYSTEM_PROMPT


class TestGuardrailPrompt:
    def test_has_input_variable(self):
        assert "input" in GUARDRAIL_PROMPT.input_variables

    def test_is_a_binary_on_off_topic_gate(self):
        txt = str(GUARDRAIL_PROMPT)
        assert "ON_TOPIC" in txt
        assert "OFF_TOPIC" in txt

    def test_no_longer_classifies_business_vs_agency_intent(self):
        """The gate only judges on/off topic; tool + context decisions moved to
        the agent, so the old intent labels must be gone."""
        txt = str(GUARDRAIL_PROMPT)
        assert "BUSINESS" not in txt
        assert "FOLLOWUP" not in txt
