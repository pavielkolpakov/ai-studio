import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from app.rag.prompts import AGENT_SYSTEM_PROMPT


class TestAgentSystemPrompt:
    def test_is_string(self):
        assert isinstance(AGENT_SYSTEM_PROMPT, str)

    def test_mentions_neuronetis_persona(self):
        txt = AGENT_SYSTEM_PROMPT.lower()
        assert "neuronetis" in txt
        assert "we" in txt or "our" in txt

    def test_has_index_placeholder(self):
        assert "{index}" in AGENT_SYSTEM_PROMPT


    def test_tool_schemas_supply_descriptions_and_arguments(self):
        from langchain_core.utils.function_calling import convert_to_openai_tool
        from app.rag.chain import get_agency_info, read_knowledge_base, generate_project_ideas

        for tool, arguments in [
            (get_agency_info, set()),
            (read_knowledge_base, {"names"}),
            (generate_project_ideas, {"description"}),
        ]:
            function = convert_to_openai_tool(tool)["function"]
            assert function["name"] == tool.name
            assert function["description"] == tool.description
            assert function["description"]
            assert set(function["parameters"]["properties"]) == arguments
