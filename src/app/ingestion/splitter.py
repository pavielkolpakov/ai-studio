import re
from pathlib import Path

from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter

TOPIC_MAP: dict[str, str] = {
    "What We Do and Who We Are": "about",
    "Our Services": "services",
    "How RAG Works — A Technical Explanation": "technical",
    "Fine-Tuning vs. RAG vs. Prompting — How to Choose": "technical",
    "AI Use Cases for SaaS and IT Companies": "use-cases",
    "How We Work — Our Engagement Process": "process",
    "Our Technology Stack": "technical",
    "Frequently Asked Questions": "faq",
    "How to Think About AI Opportunities for Your Company": "use-cases",
}

CHUNK_SIZE = 800
CHUNK_OVERLAP = 100

CATALOG_PROJECT_PATTERN = re.compile(r"^## \d+\.\s+(.+)$", re.MULTILINE)


def _split_by_h1(markdown: str) -> list[tuple[str, str]]:
    """Split markdown into (header, body) pairs by top-level `#` headers."""
    sections: list[tuple[str, str]] = []
    pattern = re.compile(r"^# (.+)$", re.MULTILINE)
    matches = list(pattern.finditer(markdown))

    for i, match in enumerate(matches):
        header = match.group(1).strip()
        start = match.end()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(markdown)
        body = markdown[start:end].strip()
        sections.append((header, body))

    return sections


def _split_by_h2(body: str, parent_header: str) -> list[tuple[str, str]]:
    """Split a section body into (sub_header, content) pairs by `##` headers.

    Preamble text before the first `##` gets the parent header as its sub_header.
    """
    pattern = re.compile(r"^## (.+)$", re.MULTILINE)
    matches = list(pattern.finditer(body))

    chunks: list[tuple[str, str]] = []

    if matches:
        preamble = body[: matches[0].start()].strip()
        if preamble:
            chunks.append((parent_header, preamble))
    else:
        return [(parent_header, body)]

    for i, match in enumerate(matches):
        sub_header = match.group(1).strip()
        start = match.end()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(body)
        content = body[start:end].strip()
        if content:
            chunks.append((sub_header, content))

    return chunks


def load_and_split_catalog(file_path: Path) -> list[Document]:
    """Load neuronetis-project-catalog.md and emit one Document per numbered project.

    Splits on `## N. Title` headers. Each section becomes a single Document whose
    `page_content` is the full project body (pitch + How it's built + Who buys this
    + Numbers) and whose header metadata is the title with the leading numbering
    stripped (e.g. "1. RAG / Internal Knowledge Assistant" -> "RAG / Internal
    Knowledge Assistant").
    """
    markdown = file_path.read_text(encoding="utf-8")
    matches = list(CATALOG_PROJECT_PATTERN.finditer(markdown))

    documents: list[Document] = []
    for i, match in enumerate(matches):
        header = match.group(1).strip()
        start = match.end()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(markdown)
        body = markdown[start:end].strip().rstrip("-").rstrip()
        if not body:
            continue
        documents.append(
            Document(
                page_content=body,
                metadata={
                    "topic": "projects_catalog",
                    "source": file_path.name,
                    "header": header,
                },
            )
        )
    return documents


def load_and_split(file_path: Path) -> list[Document]:
    """Load a markdown file and split into LangChain Documents with metadata."""
    markdown = file_path.read_text(encoding="utf-8")

    recursive_splitter = RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP,
        length_function=len,
        separators=["\n\n", "\n", ". ", " ", ""],
    )

    documents: list[Document] = []

    for h1_header, h1_body in _split_by_h1(markdown):
        topic = TOPIC_MAP.get(h1_header)
        if topic is None:
            continue

        for sub_header, content in _split_by_h2(h1_body, h1_header):
            metadata = {
                "topic": topic,
                "source": file_path.name,
                "header": sub_header,
            }

            if len(content) > CHUNK_SIZE:
                sub_docs = recursive_splitter.create_documents(
                    texts=[content],
                    metadatas=[metadata],
                )
                documents.extend(sub_docs)
            else:
                documents.append(Document(page_content=content, metadata=metadata))

    return documents
