import json
import sys
from pathlib import Path
from unittest.mock import MagicMock, patch

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from app.rag.chain import stream_response


REJECTION_MESSAGE = (
    "I'm sorry, but as Neuronetis AI assistant, I can only answer questions "
    "about Neuronetis — our services, process, projects, and how AI can help "
    "your business. Feel free to ask about any of these!"
)


class TestGuardrail:
    @pytest.mark.asyncio
    @patch("app.rag.chain.classify_query")
    async def test_offtopic_query_returns_rejection(self, mock_classify):
        mock_classify.return_value = False
        chain = MagicMock()

        events = []
        async for event in stream_response(chain, "What's the weather?", []):
            events.append(event)

        # Should yield exactly one SSE event with the rejection
        assert len(events) == 1
        parsed = json.loads(events[0].removeprefix("data: ").strip())
        assert parsed["done"] is True
        assert parsed["token"] == REJECTION_MESSAGE
        # Chain should never be called
        chain.astream.assert_not_called()

    @pytest.mark.asyncio
    @patch("app.rag.chain.classify_query")
    async def test_ontopic_query_runs_chain(self, mock_classify):
        mock_classify.return_value = True

        async def astream(inputs):
            yield {"context_docs": []}
            yield {"answer": "We offer AI consulting."}

        chain = MagicMock()
        chain.astream = astream

        events = []
        async for event in stream_response(chain, "What services do you offer?", []):
            events.append(event)

        # Should have token events + final event (not a rejection)
        assert len(events) >= 2
        final = json.loads(events[-1].removeprefix("data: ").strip())
        assert final["done"] is True
        first = json.loads(events[0].removeprefix("data: ").strip())
        assert first["token"] == "We offer AI consulting."
        assert first["done"] is False

    @pytest.mark.asyncio
    @patch("app.rag.chain.classify_query")
    async def test_rejection_has_no_sources_no_cta(self, mock_classify):
        mock_classify.return_value = False
        chain = MagicMock()

        events = []
        async for event in stream_response(chain, "Tell me a joke", []):
            events.append(event)

        parsed = json.loads(events[0].removeprefix("data: ").strip())
        assert parsed["sources"] == []
        assert parsed["cta"] is None
        assert parsed["token"] == REJECTION_MESSAGE
        # Valid SSE format
        assert events[0].startswith("data: ")
        assert events[0].endswith("\n\n")
