import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from app.rag.cta import maybe_cta


class TestMaybeCta:
    def test_services_topic_returns_cta(self):
        result = maybe_cta(["services"])
        assert result is not None
        assert "label" in result
        assert "url" in result

    def test_process_topic_returns_cta(self):
        result = maybe_cta(["process"])
        assert result is not None

    def test_use_cases_topic_returns_cta(self):
        result = maybe_cta(["use-cases"])
        assert result is not None

    def test_technical_topic_returns_none(self):
        assert maybe_cta(["technical"]) is None

    def test_faq_topic_returns_none(self):
        assert maybe_cta(["faq"]) is None

    def test_empty_topics_returns_none(self):
        assert maybe_cta([]) is None

    def test_mixed_topics_with_cta_trigger(self):
        result = maybe_cta(["technical", "services", "faq"])
        assert result is not None
