import sys
from pathlib import Path
from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from httpx import ASGITransport, AsyncClient
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from langchain_core.messages import AIMessageChunk


def _make_mock_agent(answer="Hello!"):
    async def astream(inputs, stream_mode=None):
        yield ("messages", (AIMessageChunk(content=answer), {}))

    agent = MagicMock()
    agent.astream = astream
    return agent


@pytest.fixture(autouse=True)
def reset_rate_limiters():
    from app.core.rate_limiter import _session_limiter, _chat_limiter
    _session_limiter._store.clear()
    _chat_limiter._store.clear()


class TestSessionRateLimit:
    @pytest.mark.asyncio
    async def test_blocks_after_10_sessions_per_ip(self):
        from app.main import app

        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            for _ in range(10):
                resp = await client.post("/api/v1/chat/session")
                assert resp.status_code == 200

            # 11th request should be blocked
            resp = await client.post("/api/v1/chat/session")
            assert resp.status_code == 429

    @pytest.mark.asyncio
    async def test_429_includes_retry_after(self):
        from app.main import app

        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            for _ in range(10):
                await client.post("/api/v1/chat/session")

            resp = await client.post("/api/v1/chat/session")
            assert resp.status_code == 429
            body = resp.json()
            assert body["detail"] == "Rate limit exceeded"
            assert "retry_after" in body
            assert int(body["retry_after"]) > 0
            assert "retry-after" in resp.headers
            assert int(resp.headers["retry-after"]) > 0


class TestWindowReset:
    @pytest.mark.asyncio
    async def test_session_limit_resets_after_window(self):
        from app.core.rate_limiter import _session_limiter
        from app.main import app

        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            for _ in range(10):
                await client.post("/api/v1/chat/session")

            resp = await client.post("/api/v1/chat/session")
            assert resp.status_code == 429

            # Simulate window expiry by backdating the stored timestamp
            for key in _session_limiter._store:
                count, _ = _session_limiter._store[key]
                _session_limiter._store[key] = (count, 0.0)  # epoch = expired

            resp = await client.post("/api/v1/chat/session")
            assert resp.status_code == 200


class TestIndependentCounters:
    @pytest.mark.asyncio
    @patch("app.rag.chain.pick_followups", new=AsyncMock(return_value=[]))
    @patch("app.api.v1.chat.build_agent")
    @patch("app.api.v1.chat.get_or_create_conversation")
    @patch("app.api.v1.chat.append_message")
    @patch("app.api.v1.chat.async_get_db")
    async def test_different_sessions_have_separate_limits(
        self, mock_db_dep, mock_append, mock_get_conv, mock_build_agent
    ):
        mock_conv = MagicMock()
        mock_conv.messages = []
        mock_get_conv.return_value = mock_conv
        mock_build_agent.return_value = _make_mock_agent()

        mock_session = AsyncMock()

        async def fake_db():
            yield mock_session

        from app.main import app

        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            # Exhaust limit for session A
            for i in range(30):
                mock_db_dep.return_value = fake_db()
                resp = await client.post(
                    "/api/v1/chat",
                    json={"session_id": "sess-A", "message": f"msg {i}"},
                )
                assert resp.status_code == 200

            # Session A should be blocked
            mock_db_dep.return_value = fake_db()
            resp = await client.post(
                "/api/v1/chat",
                json={"session_id": "sess-A", "message": "blocked"},
            )
            assert resp.status_code == 429

            # Session B should still work
            mock_db_dep.return_value = fake_db()
            resp = await client.post(
                "/api/v1/chat",
                json={"session_id": "sess-B", "message": "hello"},
            )
            assert resp.status_code == 200


class TestChatRateLimit:
    @pytest.mark.asyncio
    @patch("app.rag.chain.pick_followups", new=AsyncMock(return_value=[]))
    @patch("app.api.v1.chat.build_agent")
    @patch("app.api.v1.chat.get_or_create_conversation")
    @patch("app.api.v1.chat.append_message")
    @patch("app.api.v1.chat.async_get_db")
    async def test_blocks_after_30_messages_per_session(
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
            for i in range(30):
                mock_db_dep.return_value = fake_db()
                resp = await client.post(
                    "/api/v1/chat",
                    json={"session_id": "sess-1", "message": f"msg {i}"},
                )
                assert resp.status_code == 200

            mock_db_dep.return_value = fake_db()
            resp = await client.post(
                "/api/v1/chat",
                json={"session_id": "sess-1", "message": "one too many"},
            )
            assert resp.status_code == 429
