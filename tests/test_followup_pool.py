import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from app.data.followup_pool import (
    FOLLOWUP_POOL,
    PICKABLE_IDS,
    pickable_pool_text,
    resolve_picks,
)


class TestPickableIds:
    def test_book_call_excluded(self):
        assert "book_call" in FOLLOWUP_POOL
        assert "book_call" not in PICKABLE_IDS

    def test_all_other_ids_pickable(self):
        assert PICKABLE_IDS == frozenset(k for k in FOLLOWUP_POOL if k != "book_call")


class TestResolvePicks:
    def test_returns_full_objects_with_id(self):
        out = resolve_picks(["services_pricing", "tech_stack"])
        assert out == [
            {"id": "services_pricing", "text": "Services & pricing", "cacheKey": "services_and_pricing"},
            {"id": "tech_stack", "text": "What's your tech stack?"},
        ]

    def test_drops_unknown_ids(self):
        out = resolve_picks(["bogus", "tech_stack", "also_bogus"])
        assert out == [{"id": "tech_stack", "text": "What's your tech stack?"}]

    def test_empty_input(self):
        assert resolve_picks([]) == []

    def test_preserves_order(self):
        ids = ["tech_stack", "services_pricing"]
        assert [p["id"] for p in resolve_picks(ids)] == ids


class TestPickablePoolText:
    def test_excludes_book_call(self):
        text = pickable_pool_text()
        assert "book_call" not in text

    def test_format_is_id_colon_text(self):
        text = pickable_pool_text()
        lines = text.split("\n")
        assert all(": " in line for line in lines)
        assert len(lines) == len(PICKABLE_IDS)
