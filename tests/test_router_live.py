"""Opt-in routing checks against the real Jev API, using synthetic messages.

These cases calibrate ROUTE_THRESHOLD. Run with RUN_LIVE_LLM_TESTS=1 and a
configured TYPESAFE_API_KEY.
"""

import os
import sys
from pathlib import Path

import pytest
from langchain_core.messages import AIMessage, HumanMessage

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from app.rag.guardrail import classify_turn

IDEAS_SHOWN = AIMessage(
    content="Here are ideas: an LLM gateway for multi-provider routing and spend control."
)


@pytest.mark.skipif(os.environ.get("RUN_LIVE_LLM_TESTS") != "1", reason="Requires live Jev calls")
@pytest.mark.parametrize("messages, expected", [
    pytest.param([HumanMessage(content="What are your payment terms?")],
                 {"get_agency_info"}, id="agency-terms"),
    pytest.param([HumanMessage(content="what does neuronets do?")],
                 {"get_agency_info"}, id="agency-typo"),
    pytest.param([HumanMessage(content="How does your discovery process work?")],
                 {"get_agency_info"}, id="agency-process"),
    pytest.param([HumanMessage(content="I have a marketing lead generation company")],
                 {"generate_project_ideas"}, id="ideas-marketing"),
    pytest.param([HumanMessage(content="I run a bakery")],
                 {"generate_project_ideas"}, id="ideas-bakery"),
    pytest.param([HumanMessage(content="I run a bakery. What are your rates?")],
                 {"generate_project_ideas", "get_agency_info"}, id="mixed"),
    pytest.param([HumanMessage(content="i run a bakery"), IDEAS_SHOWN,
                  HumanMessage(content="got any other ideas?")],
                 {"generate_project_ideas"}, id="explicit-new-ideas"),
    pytest.param([HumanMessage(content="we need model spend control"), IDEAS_SHOWN,
                  HumanMessage(content="how would the gateway handle failover?")],
                 {"read_knowledge_base"}, id="detail-followup"),
    # Adding business detail after ideas exist must NOT regenerate. This case
    # set the threshold ceiling: it scored 0.62 before `wants_ideas` was reworded.
    pytest.param([HumanMessage(content="I run a 40-person logistics company."), IDEAS_SHOWN,
                  HumanMessage(content="we also do last-mile delivery in Poland")],
                 set(), id="elaboration-not-regeneration"),
])
def test_routes_to_the_right_tools(messages, expected):
    classification = classify_turn(messages)
    tools = {tc["name"] for tc in classification.tool_calls(str(messages[-1].content))}

    assert tools == expected, f"routing signals: {classification.routing}"
