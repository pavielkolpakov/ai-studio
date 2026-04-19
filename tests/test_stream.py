import json
import sys
from pathlib import Path
from unittest.mock import MagicMock

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from langchain_core.messages import AIMessage, AIMessageChunk, ToolMessage

from app.rag.chain import stream_response


def parse(event: str) -> dict:
    return json.loads(event.removeprefix("data: ").strip())


def fake_agent(stream_items):
    """Build an agent-like mock whose astream yields the given (mode, data) tuples."""
    async def astream(inputs, stream_mode=None):
        for item in stream_items:
            yield item

    agent = MagicMock()
    agent.astream = astream
    return agent


class TestStreamResponse:
    @pytest.mark.asyncio
    async def test_yields_token_events_from_ai_chunks(self):
        items = [
            ("messages", (AIMessageChunk(content="Hello"), {})),
            ("messages", (AIMessageChunk(content=" world"), {})),
        ]
        agent = fake_agent(items)

        events = [e async for e in stream_response(agent, "hi", [])]

        tokens = [parse(e) for e in events if '"type": "token"' in e]
        assert tokens[0] == {"type": "token", "token": "Hello", "done": False}
        assert tokens[1] == {"type": "token", "token": " world", "done": False}

    @pytest.mark.asyncio
    async def test_emits_tool_call_event_on_tool_invocation(self):
        ai_with_tool = AIMessage(
            content="",
            tool_calls=[
                {"id": "t1", "name": "search_knowledge_base",
                 "args": {"query": "pricing"}, "type": "tool_call"}
            ],
        )
        items = [
            ("updates", {"model": {"messages": [ai_with_tool]}}),
        ]
        agent = fake_agent(items)

        events = [e async for e in stream_response(agent, "q", [])]

        tool_events = [parse(e) for e in events if '"tool_call"' in e]
        assert len(tool_events) == 1
        assert tool_events[0] == {
            "type": "tool_call",
            "tool": "search_knowledge_base",
            "query": "pricing",
        }

    @pytest.mark.asyncio
    async def test_done_event_includes_cta_for_services_topic(self):
        tool_msg = ToolMessage(
            content="body",
            tool_call_id="t1",
            artifact={"topics": ["services"]},
        )
        items = [
            ("updates", {"tools": {"messages": [tool_msg]}}),
        ]
        agent = fake_agent(items)

        events = [e async for e in stream_response(agent, "q", [])]

        final = parse(events[-1])
        assert final["type"] == "done"
        assert final["cta"] is not None
        assert "label" in final["cta"]

    @pytest.mark.asyncio
    async def test_done_event_has_no_cta_for_technical_topic(self):
        tool_msg = ToolMessage(
            content="body", tool_call_id="t1", artifact={"topics": ["technical"]},
        )
        items = [("updates", {"tools": {"messages": [tool_msg]}})]
        agent = fake_agent(items)

        events = [e async for e in stream_response(agent, "q", [])]

        final = parse(events[-1])
        assert final == {"type": "done", "cta": None}

    @pytest.mark.asyncio
    async def test_no_sources_field_in_any_event(self):
        tool_msg = ToolMessage(
            content="body", tool_call_id="t1", artifact={"topics": ["services"]},
        )
        items = [
            ("messages", (AIMessageChunk(content="answer"), {})),
            ("updates", {"tools": {"messages": [tool_msg]}}),
        ]
        agent = fake_agent(items)

        events = [e async for e in stream_response(agent, "q", [])]

        for e in events:
            assert "sources" not in parse(e)

    @pytest.mark.asyncio
    async def test_sse_format(self):
        agent = fake_agent([("messages", (AIMessageChunk(content="hi"), {}))])
        events = [e async for e in stream_response(agent, "q", [])]
        for e in events:
            assert e.startswith("data: ")
            assert e.endswith("\n\n")

    @pytest.mark.asyncio
    async def test_emits_ideas_event_when_tool_artifact_carries_ideas(self):
        ideas = [
            {
                "title": "Doc Search",
                "description": "Semantic search.",
                "deliverables": ["A", "B"],
                "tech": ["Qdrant"],
                "price_range": "$5k–$10k",
                "time_estimate": "2–4 weeks",
            }
        ]
        tool_msg = ToolMessage(
            content="Generated 1 idea.",
            tool_call_id="i1",
            artifact={"ideas": ideas},
        )
        items = [("updates", {"tools": {"messages": [tool_msg]}})]
        agent = fake_agent(items)

        events = [e async for e in stream_response(agent, "q", [])]
        parsed = [parse(e) for e in events]
        ideas_events = [p for p in parsed if p.get("type") == "ideas"]
        assert len(ideas_events) == 1
        assert ideas_events[0]["ideas"] == ideas
        # done event still emitted after
        assert parsed[-1]["type"] == "done"

    @pytest.mark.asyncio
    async def test_deduplicates_tool_call_events(self):
        ai_with_tool = AIMessage(
            content="",
            tool_calls=[{"id": "t1", "name": "search_knowledge_base",
                         "args": {"query": "x"}, "type": "tool_call"}],
        )
        items = [
            ("updates", {"model": {"messages": [ai_with_tool]}}),
            ("updates", {"model": {"messages": [ai_with_tool]}}),
        ]
        agent = fake_agent(items)

        events = [e async for e in stream_response(agent, "q", [])]
        tool_events = [e for e in events if '"tool_call"' in e]
        assert len(tool_events) == 1
