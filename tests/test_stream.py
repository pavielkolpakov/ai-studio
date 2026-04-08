import json
import sys
from pathlib import Path
from unittest.mock import AsyncMock, MagicMock

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from langchain_core.documents import Document

from app.rag.chain import stream_response


def make_mock_chain(answer_tokens: list[str], context_docs: list[Document] | None = None):
    """Create a mock chain that yields answer tokens and optionally context docs."""
    chunks = []
    if context_docs is not None:
        chunks.append({"context_docs": context_docs})
    for token in answer_tokens:
        chunks.append({"answer": token})

    async def astream(inputs):
        for chunk in chunks:
            yield chunk

    chain = MagicMock()
    chain.astream = astream
    return chain


class TestStreamResponse:
    @pytest.mark.asyncio
    async def test_yields_token_events(self):
        chain = make_mock_chain(["Hello", " world"])
        events = []
        async for event in stream_response(chain, "hi", []):
            events.append(event)

        # Should have 2 token events + 1 final event
        assert len(events) == 3
        first = json.loads(events[0].removeprefix("data: ").strip())
        assert first == {"token": "Hello", "done": False}

    @pytest.mark.asyncio
    async def test_final_event_has_done_true(self):
        chain = make_mock_chain(["ok"])
        events = []
        async for event in stream_response(chain, "hi", []):
            events.append(event)

        final = json.loads(events[-1].removeprefix("data: ").strip())
        assert final["done"] is True
        assert final["token"] == ""
        assert "sources" in final
        assert "cta" in final

    @pytest.mark.asyncio
    async def test_sources_from_context_docs(self):
        docs = [
            Document(
                page_content="text",
                metadata={"source": "RAG.md", "header": "Services", "topic": "services"},
            ),
            Document(
                page_content="more",
                metadata={"source": "RAG.md", "header": "About", "topic": "about"},
            ),
        ]
        chain = make_mock_chain(["answer"], context_docs=docs)
        events = []
        async for event in stream_response(chain, "hi", []):
            events.append(event)

        final = json.loads(events[-1].removeprefix("data: ").strip())
        assert len(final["sources"]) == 2
        assert {"source": "RAG.md", "header": "Services"} in final["sources"]

    @pytest.mark.asyncio
    async def test_cta_included_for_services_topic(self):
        docs = [
            Document(
                page_content="text",
                metadata={"source": "RAG.md", "header": "Services", "topic": "services"},
            ),
        ]
        chain = make_mock_chain(["answer"], context_docs=docs)
        events = []
        async for event in stream_response(chain, "hi", []):
            events.append(event)

        final = json.loads(events[-1].removeprefix("data: ").strip())
        assert final["cta"] is not None
        assert "label" in final["cta"]

    @pytest.mark.asyncio
    async def test_no_cta_for_technical_topic(self):
        docs = [
            Document(
                page_content="text",
                metadata={"source": "RAG.md", "header": "Tech", "topic": "technical"},
            ),
        ]
        chain = make_mock_chain(["answer"], context_docs=docs)
        events = []
        async for event in stream_response(chain, "hi", []):
            events.append(event)

        final = json.loads(events[-1].removeprefix("data: ").strip())
        assert final["cta"] is None

    @pytest.mark.asyncio
    async def test_sse_format(self):
        chain = make_mock_chain(["hi"])
        events = []
        async for event in stream_response(chain, "q", []):
            events.append(event)

        for event in events:
            assert event.startswith("data: ")
            assert event.endswith("\n\n")

    @pytest.mark.asyncio
    async def test_deduplicates_sources(self):
        docs = [
            Document(page_content="a", metadata={"source": "RAG.md", "header": "X", "topic": "about"}),
            Document(page_content="b", metadata={"source": "RAG.md", "header": "X", "topic": "about"}),
        ]
        chain = make_mock_chain(["answer"], context_docs=docs)
        events = []
        async for event in stream_response(chain, "hi", []):
            events.append(event)

        final = json.loads(events[-1].removeprefix("data: ").strip())
        assert len(final["sources"]) == 1
