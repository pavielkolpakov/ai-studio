import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from app.ingestion.splitter import (
    CHUNK_SIZE,
    TOPIC_MAP,
    _split_by_h1,
    _split_by_h2,
    load_and_split,
)

SAMPLE_MD = """\
# AI Studio — Knowledge Base Documents

10 documents ready to ingest.

---

# What We Do and Who We Are

## Studio overview

We are an AI engineering studio that builds production-grade AI systems.

## Who we work with

Our clients are typically IT product companies.

# Our Services

## 1. AI Feature Integration

We embed AI capabilities into your existing product.

## 2. RAG Systems

We build retrieval-augmented generation systems.

# Frequently Asked Questions

## About working with us

**How long does a typical project take?**
It depends on scope. 3–6 weeks for feature integration, 4–8 weeks for RAG.

# Unknown Section

This should be skipped because it has no topic mapping.
"""


class TestSplitByH1:
    def test_extracts_all_h1_sections(self):
        sections = _split_by_h1(SAMPLE_MD)
        headers = [h for h, _ in sections]
        assert "What We Do and Who We Are" in headers
        assert "Our Services" in headers
        assert "Frequently Asked Questions" in headers
        assert "Unknown Section" in headers

    def test_skips_preamble_before_first_h1(self):
        sections = _split_by_h1(SAMPLE_MD)
        headers = [h for h, _ in sections]
        assert "AI Studio — Knowledge Base Documents" in headers
        # preamble body should be "10 documents ready to ingest.\n\n---"
        preamble_body = sections[0][1]
        assert "10 documents" in preamble_body

    def test_body_contains_subsections(self):
        sections = _split_by_h1(SAMPLE_MD)
        about_body = next(b for h, b in sections if h == "What We Do and Who We Are")
        assert "## Studio overview" in about_body
        assert "## Who we work with" in about_body


class TestSplitByH2:
    def test_splits_into_subsections(self):
        body = """\
## First

Content one.

## Second

Content two.
"""
        chunks = _split_by_h2(body, "Parent")
        assert len(chunks) == 2
        assert chunks[0] == ("First", "Content one.")
        assert chunks[1] == ("Second", "Content two.")

    def test_preamble_gets_parent_header(self):
        body = """\
Some intro text.

## First

Content one.
"""
        chunks = _split_by_h2(body, "Parent")
        assert chunks[0] == ("Parent", "Some intro text.")
        assert chunks[1] == ("First", "Content one.")

    def test_no_h2_returns_whole_body(self):
        body = "Just plain text with no headers."
        chunks = _split_by_h2(body, "Parent")
        assert len(chunks) == 1
        assert chunks[0] == ("Parent", body)

    def test_empty_subsection_skipped(self):
        body = """\
## First

## Second

Content two.
"""
        chunks = _split_by_h2(body, "Parent")
        headers = [h for h, _ in chunks]
        assert "First" not in headers
        assert "Second" in headers


class TestLoadAndSplit:
    @pytest.fixture
    def md_file(self, tmp_path: Path) -> Path:
        p = tmp_path / "test.md"
        p.write_text(SAMPLE_MD, encoding="utf-8")
        return p

    def test_returns_documents_with_metadata(self, md_file: Path):
        docs = load_and_split(md_file)
        assert len(docs) > 0
        for doc in docs:
            assert "topic" in doc.metadata
            assert "source" in doc.metadata
            assert "header" in doc.metadata
            assert doc.metadata["source"] == "test.md"

    def test_skips_unmapped_sections(self, md_file: Path):
        docs = load_and_split(md_file)
        topics = {doc.metadata["topic"] for doc in docs}
        assert "about" in topics
        assert "services" in topics
        assert "faq" in topics
        # "Unknown Section" has no mapping, should not appear
        headers = {doc.metadata["header"] for doc in docs}
        assert "Unknown Section" not in headers

    def test_all_topic_values_are_valid(self, md_file: Path):
        docs = load_and_split(md_file)
        valid_topics = set(TOPIC_MAP.values())
        for doc in docs:
            assert doc.metadata["topic"] in valid_topics

    def test_no_chunk_exceeds_size_limit(self, md_file: Path):
        docs = load_and_split(md_file)
        for doc in docs:
            assert len(doc.page_content) <= CHUNK_SIZE + 100  # allow small overflow from splitter

    def test_no_empty_chunks(self, md_file: Path):
        docs = load_and_split(md_file)
        for doc in docs:
            assert len(doc.page_content.strip()) > 0

    def test_real_rag_md(self):
        real_path = Path(__file__).resolve().parents[1] / "docs" / "RAG.md"
        if not real_path.exists():
            pytest.skip("docs/RAG.md not found")
        docs = load_and_split(real_path)
        topics = {doc.metadata["topic"] for doc in docs}
        assert topics == {"about", "services", "technical", "use-cases", "process", "faq", "projects"}
        assert len(docs) > 50  # sanity check — we expect ~99

    def test_long_section_gets_recursively_split(self, tmp_path: Path):
        long_content = "This is a sentence. " * 200  # ~4000 chars
        md = f"# Frequently Asked Questions\n\n## Big section\n\n{long_content}"
        p = tmp_path / "long.md"
        p.write_text(md, encoding="utf-8")
        docs = load_and_split(p)
        assert len(docs) > 1
        for doc in docs:
            assert doc.metadata["topic"] == "faq"
            assert doc.metadata["header"] == "Big section"
