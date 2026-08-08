import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from app.vault.loader import load_index, load_vault, project_notes, read_notes


class TestLoadVault:
    def test_loads_notes_excluding_index(self):
        vault = load_vault()
        assert "index" not in vault
        assert "services/pricing" in vault
        assert vault["services/pricing"].title
        assert vault["services/pricing"].read_when

    def test_project_notes_only_under_projects(self):
        notes = project_notes()
        assert notes
        assert all(n.name.startswith("projects/") for n in notes)


class TestLoadIndex:
    def test_returns_routing_sections_only(self):
        index = load_index()
        assert index.startswith("## ")
        assert "title: Knowledge Base Index" not in index
        assert "[[services/pricing]]" in index


class TestReadNotes:
    def test_returns_requested_bodies(self):
        text = read_notes(["services/pricing"])
        assert "_note: services/pricing_" in text

    def test_flags_missing_notes(self):
        text = read_notes(["does/not-exist"])
        assert "NOTE NOT FOUND: does/not-exist" in text

    def test_normalizes_wikilink_syntax(self):
        text = read_notes(["[[services/pricing]]"])
        assert "_note: services/pricing_" in text
        assert "NOT FOUND" not in text
