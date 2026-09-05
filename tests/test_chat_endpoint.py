import json
import sys
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from httpx import ASGITransport, AsyncClient

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from langchain_core.messages import AIMessageChunk


def _make_mock_agent(answer: str = "Hello!"):
    async def astream(inputs, stream_mode=None):
        yield ("messages", (AIMessageChunk(content=answer), {}))

    agent = MagicMock()
    agent.astream = astream
    return agent


class TestChatEndpoint:
    @pytest.mark.asyncio
    async def test_sends_business_description_once_with_prior_history(self, monkeypatch):
        from app.api.dependencies import async_get_db
        from app.main import app

        history = [{"role": "assistant", "content": "Tell us about your business."}]
        conversation = SimpleNamespace(messages=list(history))
        db = AsyncMock()
        result = MagicMock()
        result.scalar_one_or_none.return_value = conversation
        db.execute.return_value = result

        async def fake_db():
            yield db

        received = []

        async def astream(inputs, stream_mode=None):
            received.extend(inputs["messages"])
            yield ("messages", (AIMessageChunk(content="Here are your ideas."), {}))

        monkeypatch.setattr("app.api.v1.chat.build_agent", lambda: SimpleNamespace(astream=astream))
        app.dependency_overrides[async_get_db] = fake_db
        try:
            async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
                response = await client.post("/api/v1/chat", json={
                    "session_id": "business-description-once",
                    "message": "i have a marketing lead generation company",
                })
        finally:
            app.dependency_overrides.pop(async_get_db, None)

        assert response.status_code == 200
        assert [message.content for message in received] == [
            "Tell us about your business.", "i have a marketing lead generation company",
        ]

    @pytest.mark.asyncio
    @patch("app.rag.chain.pick_followups", new=AsyncMock(return_value=[]))
    @patch("app.api.v1.chat.build_agent")
    @patch("app.api.v1.chat.get_or_create_conversation")
    @patch("app.api.v1.chat.append_message")
    @patch("app.api.v1.chat.async_get_db")
    async def test_returns_sse_stream(
        self, mock_db_dep, mock_append, mock_get_conv, mock_build_agent
    ):
        mock_conv = MagicMock()
        mock_conv.messages = []
        mock_get_conv.return_value = mock_conv
        mock_build_agent.return_value = _make_mock_agent()

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
        assert len(lines) >= 2

        first = json.loads(lines[0].removeprefix("data: "))
        assert first["type"] == "token"

        last = json.loads(lines[-1].removeprefix("data: "))
        assert last["type"] == "done"
        assert "sources" not in last

    @pytest.mark.asyncio
    @patch("app.rag.chain.pick_followups", new=AsyncMock(return_value=[]))
    @patch("app.api.v1.chat.build_agent")
    @patch("app.api.v1.chat.get_or_create_conversation")
    @patch("app.api.v1.chat.append_message")
    @patch("app.api.v1.chat.async_get_db")
    async def test_saves_assistant_response_to_db(
        self, mock_db_dep, mock_append, mock_get_conv, mock_build_agent
    ):
        mock_conv = MagicMock()
        mock_conv.messages = []
        mock_get_conv.return_value = mock_conv
        mock_build_agent.return_value = _make_mock_agent(answer="Test reply")

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

        assert mock_append.call_count == 2
        assistant_call = mock_append.call_args_list[1]
        assert assistant_call[0][2] == "assistant"
        assert "Test reply" in assistant_call[0][3]
