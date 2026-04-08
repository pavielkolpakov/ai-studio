import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from app.crud.crud_conversations import get_recent_messages


class TestGetRecentMessages:
    def test_returns_last_n_messages(self):
        messages = [
            {"role": "user", "content": f"msg{i}"} for i in range(20)
        ]
        result = get_recent_messages(messages, limit=10)
        assert len(result) == 10
        assert result[0]["content"] == "msg10"
        assert result[-1]["content"] == "msg19"

    def test_returns_all_when_fewer_than_limit(self):
        messages = [{"role": "user", "content": "hi"}]
        result = get_recent_messages(messages, limit=10)
        assert len(result) == 1

    def test_empty_messages(self):
        result = get_recent_messages([], limit=10)
        assert result == []

    def test_default_limit_is_10(self):
        messages = [
            {"role": "user", "content": f"msg{i}"} for i in range(15)
        ]
        result = get_recent_messages(messages)
        assert len(result) == 10
