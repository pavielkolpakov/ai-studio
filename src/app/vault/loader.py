"""Load the Neuronetis knowledge vault from disk.

Each note is a markdown file under `docs/vault/` with YAML frontmatter (`title`,
`read_when`, `links`). `index.md` is a routing index injected into the agent's
system prompt; the agent then reads individual notes on demand by their name -
the path relative to the vault without the `.md` extension, e.g. `services/pricing`.
"""

import re
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path

import yaml

VAULT_DIR = Path(__file__).resolve().parents[3] / "docs" / "vault"
INDEX_NAME = "index"
FRONTMATTER_RE = re.compile(r"\A---\n(.*?)\n---\n(.*)\Z", re.DOTALL)


class VaultError(RuntimeError):
    """The vault is missing, empty, or a note is structurally invalid."""


@dataclass(frozen=True)
class Note:
    name: str
    title: str
    read_when: str
    body: str


def _parse_note(path: Path) -> Note:
    name = path.relative_to(VAULT_DIR).with_suffix("").as_posix()
    match = FRONTMATTER_RE.match(path.read_text(encoding="utf-8"))
    if not match:
        raise VaultError(f"Note {name} has no YAML frontmatter block")
    try:
        meta = yaml.safe_load(match.group(1))
    except yaml.YAMLError as exc:
        raise VaultError(f"Note {name} has invalid YAML frontmatter: {exc}") from exc
    if not isinstance(meta, dict):
        raise VaultError(f"Note {name} frontmatter must be a mapping")
    return Note(
        name=name,
        title=str(meta.get("title", name)),
        read_when=str(meta.get("read_when", "")).strip(),
        body=match.group(2).strip(),
    )


@lru_cache(maxsize=1)
def load_vault() -> dict[str, Note]:
    """Parse every content note (the generated `index.md` excluded). Cached."""
    if not VAULT_DIR.is_dir():
        raise VaultError(f"Vault directory not found: {VAULT_DIR}")
    notes = {
        note.name: note
        for path in sorted(VAULT_DIR.rglob("*.md"))
        if (note := _parse_note(path)).name != INDEX_NAME
    }
    if not notes:
        raise VaultError(f"Vault at {VAULT_DIR} contains no notes")
    return notes


@lru_cache(maxsize=1)
def load_index() -> str:
    """The committed routing index, from its first `## ` section onward.

    The frontmatter, H1, and preamble exist for humans reading the vault in
    Obsidian; the system prompt supplies its own framing, so they are dropped.
    """
    path = VAULT_DIR / f"{INDEX_NAME}.md"
    if not path.is_file():
        raise VaultError(f"Index not found: {path}")
    text = path.read_text(encoding="utf-8")
    marker = text.find("## ")
    return text[marker:].strip() if marker != -1 else text.strip()


def _normalize(name: str) -> str:
    name = name.strip().strip("[]").strip()
    return name[:-3] if name.endswith(".md") else name


def read_notes(names: list[str]) -> str:
    """Return the full text of the requested notes, flagging any that don't exist."""
    vault = load_vault()
    parts: list[str] = []
    for raw in names:
        name = _normalize(raw)
        note = vault.get(name)
        if note is None:
            parts.append(
                f"NOTE NOT FOUND: {name}. Valid note names are listed in the "
                "knowledge base index in your system prompt."
            )
        else:
            parts.append(f"# {note.title}\n_note: {note.name}_\n\n{note.body}")
    return "\n\n---\n\n".join(parts)


def project_notes() -> list[Note]:
    """All notes under `projects/`, sorted by name."""
    return [note for name, note in sorted(load_vault().items()) if name.startswith("projects/")]
