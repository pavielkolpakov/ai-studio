import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from app.rag.prompts import QA_PROMPT, REPHRASE_PROMPT


class TestQAPrompt:
    def test_has_chat_history_variable(self):
        assert "chat_history" in QA_PROMPT.input_variables or any(
            m.variable_name == "chat_history"
            for m in QA_PROMPT.messages
            if hasattr(m, "variable_name")
        )

    def test_has_context_variable(self):
        assert "context" in QA_PROMPT.input_variables

    def test_has_input_variable(self):
        assert "input" in QA_PROMPT.input_variables

    def test_system_message_contains_persona(self):
        system_text = QA_PROMPT.messages[0].prompt.template
        assert "we" in system_text.lower() or "our" in system_text.lower()

    def test_system_message_instructs_context_only(self):
        system_text = QA_PROMPT.messages[0].prompt.template
        assert "context" in system_text.lower()


class TestRephrasePrompt:
    def test_has_chat_history_variable(self):
        assert "chat_history" in REPHRASE_PROMPT.input_variables or any(
            m.variable_name == "chat_history"
            for m in REPHRASE_PROMPT.messages
            if hasattr(m, "variable_name")
        )

    def test_has_input_variable(self):
        assert "input" in REPHRASE_PROMPT.input_variables
