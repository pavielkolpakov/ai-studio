"""Run with: python -m app.ingestion"""

import time
from collections import Counter
from pathlib import Path

from app.ingestion.splitter import load_and_split
from app.ingestion.vector_store import load_documents

DOCS_PATH = Path(__file__).resolve().parents[3] / "docs" / "RAG.md"


def main() -> None:
    print(f"Loading documents from {DOCS_PATH}")
    start = time.perf_counter()

    documents = load_and_split(DOCS_PATH)

    topic_counts = Counter(doc.metadata["topic"] for doc in documents)
    print(f"\nChunks by topic:")
    for topic, count in sorted(topic_counts.items()):
        print(f"  {topic}: {count}")
    print(f"  total: {len(documents)}")

    print("\nEmbedding and uploading to Qdrant...")
    load_documents(documents)

    elapsed = round(time.perf_counter() - start, 2)
    print(f"\nDone in {elapsed}s")


if __name__ == "__main__":
    main()
