import asyncio
import sys
from pathlib import Path
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from app.rag.followups import _Picks, pick_followups


def _mock_llm(picks_or_exc):
    """Patch ChatOpenAI so .with_structured_output(...).ainvoke returns picks_or_exc."""
    structured = MagicMock()
    if isinstance(picks_or_exc, Exception):
        structured.ainvoke = AsyncMock(side_effect=picks_or_exc)
    else:
        structured.ainvoke = AsyncMock(return_value=picks_or_exc)
    llm = MagicMock()
    llm.with_structured_output.return_value = structured
    return llm


class TestPickFollowups:
    @pytest.mark.asyncio
    async def test_happy_path_returns_resolved_picks(self):
        picks = _Picks(ids=["services_pricing", "tech_stack", "ip_ownership"])
        with patch("app.rag.followups.ChatOpenAI", return_value=_mock_llm(picks)):
            result = await pick_followups("hi", "hello there")
        assert [p["id"] for p in result] == ["services_pricing", "tech_stack", "ip_ownership"]
        assert all("text" in p for p in result)

    @pytest.mark.asyncio
    async def test_empty_user_message_returns_empty(self):
        result = await pick_followups("", "answer")
        assert result == []

    @pytest.mark.asyncio
    async def test_empty_assistant_message_returns_empty(self):
        result = await pick_followups("q", "")
        assert result == []

    @pytest.mark.asyncio
    async def test_timeout_returns_empty(self):
        with patch(
            "app.rag.followups.ChatOpenAI",
            return_value=_mock_llm(asyncio.TimeoutError()),
        ):
            result = await pick_followups("q", "a")
        assert result == []

    @pytest.mark.asyncio
    async def test_exception_returns_empty(self):
        with patch(
            "app.rag.followups.ChatOpenAI",
            return_value=_mock_llm(RuntimeError("boom")),
        ):
            result = await pick_followups("q", "a")
        assert result == []

    @pytest.mark.asyncio
    async def test_invalid_id_returns_empty(self):
        picks = _Picks(ids=["services_pricing", "not_a_real_id", "tech_stack"])
        with patch("app.rag.followups.ChatOpenAI", return_value=_mock_llm(picks)):
            result = await pick_followups("q", "a")
        assert result == []

    @pytest.mark.asyncio
    async def test_book_call_id_rejected(self):
        # book_call is in FOLLOWUP_POOL but excluded from PICKABLE_IDS
        picks = _Picks(ids=["book_call", "tech_stack", "ip_ownership"])
        with patch("app.rag.followups.ChatOpenAI", return_value=_mock_llm(picks)):
            result = await pick_followups("q", "a")
        assert result == []
