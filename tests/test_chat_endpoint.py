import json
import sys
from pathlib import Path
from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from httpx import ASGITransport, AsyncClient

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from langchain_core.documents import Document


def _make_mock_chain(answer: str = "Hello!", topic: str = "about"):
    """Create a mock chain that streams a single answer token with context."""
    docs = [
        Document(
            page_content="content",
            metadata={"source": "RAG.md", "header": "Test", "topic": topic},
        )
    ]

    async def astream(inputs):
        yield {"context_docs": docs}
        yield {"answer": answer}

    chain = MagicMock()
    chain.astream = astream
    return chain


@pytest.fixture
def mock_chain():
    return _make_mock_chain()


@pytest.fixture
def mock_db_session():
    """Mock async DB session that tracks calls."""
    session = AsyncMock()
    return session


@pytest.fixture
def mock_conversation():
    from app.models.conversation import Conversation

    conv = MagicMock(spec=Conversation)
    conv.messages = []
    conv.id = "test-conv-id"
    conv.session_id = "test-session"
    return conv


class TestChatEndpoint:
    @pytest.mark.asyncio
    @patch("app.rag.chain.classify_query", return_value=True)
    @patch("app.api.v1.chat.build_chain")
    @patch("app.api.v1.chat.get_or_create_conversation")
    @patch("app.api.v1.chat.append_message")
    @patch("app.api.v1.chat.async_get_db")
    async def test_returns_sse_stream(
        self, mock_db_dep, mock_append, mock_get_conv, mock_build_chain, _mock_classify
    ):
        mock_conv = MagicMock()
        mock_conv.messages = []
        mock_get_conv.return_value = mock_conv

        mock_build_chain.return_value = _make_mock_chain()

        mock_session = AsyncMock()

        async def fake_db():
            yield mock_session

        mock_db_dep.return_value = fake_db()

        from app.main import app

        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.post(
                "/api/v1/chat",
                json={"session_id": "s1", "message": "hi"},
            )

        assert response.status_code == 200
        assert "text/event-stream" in response.headers["content-type"]

        lines = [l for l in response.text.strip().split("\n\n") if l.startswith("data:")]
        assert len(lines) >= 2  # at least 1 token + 1 final

        # First event should be a token
        first = json.loads(lines[0].removeprefix("data: "))
        assert first["done"] is False

        # Last event should be final
        last = json.loads(lines[-1].removeprefix("data: "))
        assert last["done"] is True
        assert "sources" in last

    @pytest.mark.asyncio
    @patch("app.rag.chain.classify_query", return_value=True)
    @patch("app.api.v1.chat.build_chain")
    @patch("app.api.v1.chat.get_or_create_conversation")
    @patch("app.api.v1.chat.append_message")
    @patch("app.api.v1.chat.async_get_db")
    async def test_saves_assistant_response_to_db(
        self, mock_db_dep, mock_append, mock_get_conv, mock_build_chain, _mock_classify
    ):
        mock_conv = MagicMock()
        mock_conv.messages = []
        mock_get_conv.return_value = mock_conv

        mock_build_chain.return_value = _make_mock_chain(answer="Test reply")

        mock_session = AsyncMock()

        async def fake_db():
            yield mock_session

        mock_db_dep.return_value = fake_db()

        from app.main import app

        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            await client.post(
                "/api/v1/chat",
                json={"session_id": "s1", "message": "hi"},
            )

        # Should have been called twice: once for user msg, once for assistant
        assert mock_append.call_count == 2
        # Second call should be the assistant response
        assistant_call = mock_append.call_args_list[1]
        assert assistant_call[0][2] == "assistant"
        assert "Test reply" in assistant_call[0][3]
