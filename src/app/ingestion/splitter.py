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
    "Example Projects and Typical Engagements": "projects",
    "How to Think About AI Opportunities for Your Company": "use-cases",
}

CHUNK_SIZE = 800
CHUNK_OVERLAP = 100

TEMPLATES_CHUNK_SIZE = 6000
TEMPLATES_CHUNK_OVERLAP = 200

SERVICE_TYPE_MAP: dict[str, str] = {
    "AI Audits": "audit",
    "AI Integration": "integration",
    "Custom AI Apps": "custom_app",
}

INDUSTRY_MAP: dict[str, str] = {
    "Finance / Fintech": "fintech",
    "Software Development / DevTools": "devtools",
    "Marketing / Sales": "marketing_sales",
    "Data / Analytics SaaS": "data_analytics",
}


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


def _split_by_h3(body: str) -> list[tuple[str, str]]:
    """Split a section body into (sub_header, content) pairs by `### ` headers."""
    pattern = re.compile(r"^### (.+)$", re.MULTILINE)
    matches = list(pattern.finditer(body))
    chunks: list[tuple[str, str]] = []
    for i, match in enumerate(matches):
        sub_header = match.group(1).strip()
        start = match.end()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(body)
        content = body[start:end].strip()
        if content:
            chunks.append((sub_header, content))
    return chunks


def load_and_split_templates(file_path: Path) -> list[Document]:
    """Load project_templates.md and emit one Document per case study.

    Structure:
      H1 (`# AI Audits` / `# AI Integration` / `# Custom AI Apps`) → service_type
      H2 industry (Integration only, e.g. `## Finance / Fintech`) → industry
        H3 case study (`### Example I1: ...`) → header
      H2 example (Audits/Custom, e.g. `## Example A1: ...`) → header, no industry

    Each `### Example X` (or `## Example X` for audits/custom) becomes one chunk.
    Long content (>TEMPLATES_CHUNK_SIZE) is recursively split.
    """
    markdown = file_path.read_text(encoding="utf-8")

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=TEMPLATES_CHUNK_SIZE,
        chunk_overlap=TEMPLATES_CHUNK_OVERLAP,
        length_function=len,
        separators=["\n\n", "\n", ". ", " ", ""],
    )

    documents: list[Document] = []

    for h1_header, h1_body in _split_by_h1(markdown):
        service_type = SERVICE_TYPE_MAP.get(h1_header)
        if service_type is None:
            continue

        for h2_header, h2_body in _split_by_h2(h1_body, h1_header):
            if h2_header.startswith("Example "):
                # H2 is itself a case study (Audits, Custom AI Apps)
                cases = [(h2_header, h2_body)]
                industry: str | None = None
            else:
                # H2 is an industry; case studies live one level deeper as H3
                industry = INDUSTRY_MAP.get(h2_header)
                if industry is None:
                    continue
                cases = _split_by_h3(h2_body)

            for case_header, case_content in cases:
                metadata = {
                    "topic": "templates",
                    "source": file_path.name,
                    "header": case_header,
                    "service_type": service_type,
                    "industry": industry,
                }

                if len(case_content) > TEMPLATES_CHUNK_SIZE:
                    sub_docs = splitter.create_documents(
                        texts=[case_content],
                        metadatas=[metadata],
                    )
                    documents.extend(sub_docs)
                else:
                    documents.append(Document(page_content=case_content, metadata=metadata))

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
