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
    load_and_split_templates,
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


SAMPLE_TEMPLATES_MD = """\
# Neuronetis — Past Project Templates

Intro text that should be ignored.

---

# AI Audits

Intro about audits.

## Example A1: AI Opportunity Audit for a 90-person construction-tech SaaS

**Client profile:** B2B SaaS, 90 employees.

**The problem:** Leadership wanted an outside read.

**Outcome:** Roadmap delivered.

**Timeline and Total cost:** 3 weeks. Total: **$8,500**.

## Example A2: Implementation review for a fintech

**Client profile:** Series B fintech.

**Outcome:** Rebuild approved.

**Timeline and Total cost:** 2 weeks. Total: **$5,500**.

# AI Integration

Intro about integration.

## Finance / Fintech

### Example I1: AI-powered transaction coding for a corporate spend platform

**Client profile:** Mid-market spend SaaS.

**Outcome:** 87% accuracy.

**Timeline and Total cost:** 8 weeks. Total: **$31,000**.

### Example I2: AI research assistant over SEC filings

**Client profile:** Investment research SaaS.

**Outcome:** 96.8% citation correctness.

**Timeline and Total cost:** 10 weeks. Total: **$38,000**.

## Software Development / DevTools

### Example I6: AI code review

**Client profile:** B2B SaaS, 220 engineers.

**Outcome:** 4.5h time-to-first-review.

**Timeline and Total cost:** 9 weeks. Total: **$34,000**.

# Custom AI Apps

Intro about custom apps.

## Example C1: Incident-response copilot for an observability SaaS

**Client profile:** Observability SaaS.

**Outcome:** 17 min MTTD.

**Timeline and Total cost:** 11 weeks. Total: **$46,000**.

# Closing notes

These should be skipped.
"""


class TestLoadAndSplitTemplates:
    @pytest.fixture
    def md_file(self, tmp_path: Path) -> Path:
        p = tmp_path / "project_templates.md"
        p.write_text(SAMPLE_TEMPLATES_MD, encoding="utf-8")
        return p

    def test_returns_one_doc_per_case_study(self, md_file: Path):
        docs = load_and_split_templates(md_file)
        # 6 case studies in sample: A1, A2, I1, I2, I6, C1
        headers = {doc.metadata["header"] for doc in docs}
        assert any(h.startswith("Example A1") for h in headers)
        assert any(h.startswith("Example A2") for h in headers)
        assert any(h.startswith("Example I1") for h in headers)
        assert any(h.startswith("Example I2") for h in headers)
        assert any(h.startswith("Example I6") for h in headers)
        assert any(h.startswith("Example C1") for h in headers)

    def test_all_docs_have_topic_templates(self, md_file: Path):
        docs = load_and_split_templates(md_file)
        for doc in docs:
            assert doc.metadata["topic"] == "templates"
            assert doc.metadata["source"] == "project_templates.md"

    def test_service_type_inferred_from_h1(self, md_file: Path):
        docs = load_and_split_templates(md_file)
        by_header = {d.metadata["header"]: d.metadata for d in docs}
        a1 = next(m for h, m in by_header.items() if h.startswith("Example A1"))
        i1 = next(m for h, m in by_header.items() if h.startswith("Example I1"))
        c1 = next(m for h, m in by_header.items() if h.startswith("Example C1"))
        assert a1["service_type"] == "audit"
        assert i1["service_type"] == "integration"
        assert c1["service_type"] == "custom_app"

    def test_industry_inferred_from_h2_for_integration(self, md_file: Path):
        docs = load_and_split_templates(md_file)
        by_header = {d.metadata["header"]: d.metadata for d in docs}
        i1 = next(m for h, m in by_header.items() if h.startswith("Example I1"))
        i2 = next(m for h, m in by_header.items() if h.startswith("Example I2"))
        i6 = next(m for h, m in by_header.items() if h.startswith("Example I6"))
        assert i1["industry"] == "fintech"
        assert i2["industry"] == "fintech"
        assert i6["industry"] == "devtools"

    def test_audits_and_custom_have_no_industry(self, md_file: Path):
        docs = load_and_split_templates(md_file)
        for doc in docs:
            if doc.metadata["service_type"] in ("audit", "custom_app"):
                assert doc.metadata.get("industry") is None

    def test_skips_intro_and_closing_sections(self, md_file: Path):
        docs = load_and_split_templates(md_file)
        for doc in docs:
            assert "Closing notes" not in doc.metadata["header"]
            assert "Past Project Templates" not in doc.metadata["header"]

    def test_case_study_content_intact(self, md_file: Path):
        docs = load_and_split_templates(md_file)
        a1 = next(d for d in docs if d.metadata["header"].startswith("Example A1"))
        # The full case content should be preserved as one chunk
        assert "Leadership wanted an outside read" in a1.page_content
        assert "$8,500" in a1.page_content

    def test_real_templates_file(self):
        real_path = Path(__file__).resolve().parents[1] / "docs" / "project_templates.md"
        if not real_path.exists():
            pytest.skip("docs/project_templates.md not found")
        docs = load_and_split_templates(real_path)
        # 22 case studies in the real file (A1-A2, I1-I17, C1-C3)
        headers = [d.metadata["header"] for d in docs]
        assert sum(1 for h in headers if h.startswith("Example ")) >= 22
        service_types = {d.metadata["service_type"] for d in docs}
        assert service_types == {"audit", "integration", "custom_app"}
        industries = {d.metadata.get("industry") for d in docs if d.metadata.get("industry")}
        assert {"fintech", "devtools", "marketing_sales", "data_analytics"} <= industries
