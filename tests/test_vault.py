import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from app.vault.loader import VAULT_DIR, load_index, load_vault, project_notes, read_notes


class TestLoadVault:
    def test_vault_contains_only_index_and_projects_with_valid_links(self):
        paths = {path.relative_to(VAULT_DIR).as_posix() for path in VAULT_DIR.rglob("*.md")}
        assert paths == {"index.md"} | {f"{note.name}.md" for note in project_notes()}
        for path in VAULT_DIR.rglob("*.md"):
            for name in re.findall(r"\[\[([^\]]+)\]\]", path.read_text()):
                assert f"{name}.md" in paths, (path.name, name)

    def test_loads_notes_excluding_index(self):
        vault = load_vault()
        assert "index" not in vault
        assert all(name.startswith("projects/") for name in vault)
        assert vault["projects/17-llm-gateway"].title
        assert vault["projects/17-llm-gateway"].read_when

    def test_project_notes_only_under_projects(self):
        notes = project_notes()
        assert notes
        assert all(n.name.startswith("projects/") for n in notes)


class TestLoadIndex:
    def test_returns_routing_sections_only(self):
        index = load_index()
        assert index.startswith("## ")
        assert "title: Knowledge Base Index" not in index
        assert "[[projects/17-llm-gateway]]" in index

    def test_index_routes_to_every_project_and_nothing_else(self):
        names = re.findall(r"\[\[([^\]]+)\]\]", load_index())
        assert len(names) == len(set(names))
        assert set(names) == {note.name for note in project_notes()}


class TestReadNotes:
    def test_returns_requested_bodies(self):
        text = read_notes(["projects/17-llm-gateway"])
        assert "_note: projects/17-llm-gateway_" in text

    def test_flags_missing_notes(self):
        text = read_notes(["does/not-exist"])
        assert "NOTE NOT FOUND: does/not-exist" in text

    def test_normalizes_wikilink_syntax(self):
        text = read_notes(["[[projects/17-llm-gateway]]"])
        assert "_note: projects/17-llm-gateway_" in text
        assert "NOT FOUND" not in text
